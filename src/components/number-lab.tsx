import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Check,
  Lightbulb,
  Maximize2,
  Minimize2,
  RefreshCw,
  Scale,
  Volume2,
  VolumeX,
} from "lucide-react";
import { playError, playSuccess, vibrateError } from "@/lib/audio";
import {
  fullscreenSupported,
  isFullscreen,
  toggleFullscreen,
} from "@/lib/fullscreen";
import {
  clampDigits,
  compareSymbol,
  generateComparePair,
  generateSortValues,
  isSorted,
  sortNumbers,
  spokenNumber,
  swapAt,
  type CompareSymbol,
  type SortDir,
} from "@/lib/numbers";
import { cn } from "@/lib/utils";
import { ColoredNumber } from "@/components/colored-number";
import { Button } from "@/components/ui/button";

type Mode = "compare" | "sort";
type Status = "idle" | "correct" | "wrong" | "revealed";

type Settings = {
  mode: Mode;
  maxDigits: number;
  sortCount: number;
  sortDir: SortDir;
  sound: boolean;
};

const SETTINGS_KEY = "cifras.settings.v1";
const DEFAULTS: Settings = {
  mode: "compare",
  maxDigits: 3,
  sortCount: 4,
  sortDir: "asc",
  sound: true,
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      mode: parsed.mode === "sort" ? "sort" : "compare",
      maxDigits: clampDigits(parsed.maxDigits ?? DEFAULTS.maxDigits),
      sortCount: Math.min(6, Math.max(3, parsed.sortCount ?? DEFAULTS.sortCount)),
      sortDir: parsed.sortDir === "desc" ? "desc" : "asc",
      sound: parsed.sound !== false,
    };
  } catch {
    return DEFAULTS;
  }
}

function persistSettings(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const SYMBOLS: { value: CompareSymbol; label: string; name: string }[] = [
  { value: "<", label: "<", name: "menor que" },
  { value: "=", label: "=", name: "igual a" },
  { value: ">", label: ">", name: "mayor que" },
];

export function NumberLab() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [pair, setPair] = useState<[number, number]>([12, 8]);
  const [values, setValues] = useState<number[]>([3, 9, 1, 6]);
  const [choice, setChoice] = useState<CompareSymbol | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [round, setRound] = useState(0);
  const [fs, setFs] = useState(false);
  const [fsOk, setFsOk] = useState(false);
  const [live, setLive] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const applySettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSettings(next);
      return next;
    });
  }, []);

  const generate = useCallback((s: Settings) => {
    setChoice(null);
    setPicked(null);
    setStatus("idle");
    setLive("");
    if (s.mode === "compare") {
      setPair(generateComparePair(s.maxDigits));
    } else {
      setValues(generateSortValues(s.sortCount, s.maxDigits));
    }
    setRound((r) => r + 1);
  }, []);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    if (loaded.mode === "compare") setPair(generateComparePair(loaded.maxDigits));
    else setValues(generateSortValues(loaded.sortCount, loaded.maxDigits));
    setHydrated(true);
    setFsOk(fullscreenSupported());
    setFs(isFullscreen());
    const onFs = () => setFs(isFullscreen());
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs as EventListener);
    };
  }, []);

  useEffect(() => {
    if (status !== "wrong") return;
    const el = stageRef.current;
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }, [shakeKey, status]);

  const answer = useMemo(() => compareSymbol(pair[0], pair[1]), [pair]);
  const sortedOk = useMemo(
    () => isSorted(values, settings.sortDir),
    [values, settings.sortDir],
  );

  const celebrate = useCallback(() => {
    setStatus("correct");
    setLive("¡Correcto!");
    if (settings.sound) playSuccess();
  }, [settings.sound]);

  const fail = useCallback(() => {
    setStatus("wrong");
    setShakeKey((k) => k + 1);
    setLive("No es correcto. Prueba otra vez.");
    if (settings.sound) playError();
    vibrateError();
  }, [settings.sound]);

  const onCheck = () => {
    if (status === "correct" || status === "revealed") return;
    if (settings.mode === "compare") {
      if (!choice) {
        setLive("Elige un símbolo antes de comprobar.");
        return;
      }
      if (choice === answer) celebrate();
      else fail();
      return;
    }
    if (sortedOk) celebrate();
    else fail();
  };

  const onReveal = () => {
    if (settings.mode === "compare") {
      setChoice(answer);
    } else {
      setValues(sortNumbers(values, settings.sortDir));
      setPicked(null);
    }
    setStatus("revealed");
    setLive("Respuesta mostrada.");
  };

  const instruction =
    settings.mode === "compare"
      ? "Elige el símbolo que falta"
      : settings.sortDir === "asc"
        ? "Ordena de menor a mayor"
        : "Ordena de mayor a menor";

  return (
    <div className="app-shell">
      <Header
        mode={settings.mode}
        sound={settings.sound}
        fs={fs}
        fsOk={fsOk}
        onMode={(mode) => {
          applySettings({ mode });
          generate({ ...settings, mode });
        }}
        onSound={() => applySettings({ sound: !settings.sound })}
        onFullscreen={() => {
          void toggleFullscreen();
        }}
      />

      <Toolbar
        settings={settings}
        onDigits={(maxDigits) => {
          applySettings({ maxDigits });
          generate({ ...settings, maxDigits });
        }}
        onCount={(sortCount) => {
          applySettings({ sortCount });
          generate({ ...settings, sortCount });
        }}
        onDir={(sortDir) => {
          applySettings({ sortDir });
          generate({ ...settings, sortDir });
        }}
      />

      <main className="relative mx-auto flex w-full max-w-screen-2xl min-h-0 flex-col items-center justify-center px-3 py-2 sm:px-5">
        <p className="mb-2 text-center text-sm font-medium tracking-wide text-quiet sm:mb-3 sm:text-base">
          {instruction}
        </p>
        <div
          ref={stageRef}
          key={`${settings.mode}-${round}`}
          className="relative flex w-full min-h-0 flex-1 items-center justify-center"
        >
          {!hydrated ? (
            <div className="grid w-full max-w-4xl grid-cols-2 gap-4">
              <div className="num-card h-28 sm:h-40" />
              <div className="num-card h-28 sm:h-40" />
            </div>
          ) : settings.mode === "compare" ? (
            <CompareStage
              a={pair[0]}
              b={pair[1]}
              choice={choice}
              status={status}
              onChoose={(s) => {
                if (status === "correct" || status === "revealed") return;
                setChoice(s);
                setStatus("idle");
              }}
            />
          ) : (
            <SortStage
              values={values}
              dir={settings.sortDir}
              status={status}
              picked={picked}
              reduced={reduced}
              onPick={setPicked}
              onSwap={(i, j) => {
                if (status === "correct" || status === "revealed") return;
                setValues((prev) => swapAt(prev, i, j));
                setPicked(null);
                setStatus("idle");
              }}
            />
          )}
          {status === "correct" ? <SuccessBurst /> : null}
        </div>
        <div className="sr-only" aria-live="polite">
          {live}
        </div>
      </main>

      <section className="mx-auto w-full max-w-screen-2xl px-3 pb-2 sm:px-5">
        <div className="action-bar">
          <Button
            size="xl"
            variant={status === "correct" ? "success" : "default"}
            className="rounded-xl font-semibold"
            onClick={onCheck}
            disabled={
              status === "correct" ||
              status === "revealed" ||
              (settings.mode === "compare" && !choice)
            }
          >
            <Check className="size-5" strokeWidth={2.4} />
            <span className="max-sm:text-xs">Comprobar</span>
          </Button>
          <Button
            size="xl"
            variant="secondary"
            className="rounded-xl font-semibold"
            onClick={onReveal}
            disabled={status === "correct" || status === "revealed"}
          >
            <Lightbulb className="size-5" strokeWidth={2.2} />
            <span className="max-sm:text-xs">Corregir</span>
          </Button>
          <Button
            size="xl"
            variant="secondary"
            className="rounded-xl font-semibold"
            onClick={() => generate(settings)}
          >
            <RefreshCw className="size-5" strokeWidth={2.2} />
            <span className="max-sm:text-xs">Nuevos</span>
          </Button>
        </div>
      </section>

      <PlaceLegend />
    </div>
  );
}

function Header({
  mode,
  sound,
  fs,
  fsOk,
  onMode,
  onSound,
  onFullscreen,
}: {
  mode: Mode;
  sound: boolean;
  fs: boolean;
  fsOk: boolean;
  onMode: (m: Mode) => void;
  onSound: () => void;
  onFullscreen: () => void;
}) {
  return (
    <header className="mx-auto flex w-full min-w-0 max-w-screen-2xl items-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-title font-semibold tracking-display text-ink">
          Cifras
        </h1>
        <p className="hidden text-kicker text-quiet sm:block">Compara y ordena números</p>
      </div>

      <div
        className="flex rounded-xl bg-paper p-1 shadow-tile"
        role="tablist"
        aria-label="Tipo de actividad"
      >
        <ModeTab
          active={mode === "compare"}
          onClick={() => onMode("compare")}
          icon={<Scale className="size-4" />}
          label="Comparar"
        />
        <ModeTab
          active={mode === "sort"}
          onClick={() => onMode("sort")}
          icon={<ArrowUpNarrowWide className="size-4" />}
          label="Ordenar"
        />
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="rounded-xl"
        aria-label={sound ? "Silenciar sonidos" : "Activar sonidos"}
        aria-pressed={sound}
        onClick={onSound}
      >
        {sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
      </Button>
      {fsOk ? (
        <Button
          variant="secondary"
          size="icon"
          className="rounded-xl"
          aria-label={fs ? "Salir de pantalla completa" : "Pantalla completa"}
          aria-pressed={fs}
          onClick={onFullscreen}
        >
          {fs ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
        </Button>
      ) : null}
    </header>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-label={label}
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] sm:h-11 sm:px-3.5",
        active ? "bg-accent text-accent-fg" : "bg-transparent text-quiet hover:text-ink",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Toolbar({
  settings,
  onDigits,
  onCount,
  onDir,
}: {
  settings: Settings;
  onDigits: (n: number) => void;
  onCount: (n: number) => void;
  onDir: (d: SortDir) => void;
}) {
  const digitsId = useId();
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-screen-2xl flex-wrap items-center gap-2 px-3 pb-1 sm:gap-3 sm:px-5">
      <div className="min-w-0 flex-1">
        <p
          id={digitsId}
          className="mb-1 text-kicker font-medium uppercase tracking-kicker text-quiet"
        >
          Cifras máximas
        </p>
        <div
          className="chip-row"
          role="radiogroup"
          aria-labelledby={digitsId}
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
            const on = settings.maxDigits === n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onDigits(n)}
                className={cn(
                  "size-9 shrink-0 rounded-md text-sm font-semibold tabular-nums transition-[background-color,color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] sm:size-11 sm:text-base md:size-12",
                  on ? "bg-accent text-accent-fg shadow-press" : "bg-paper text-ink shadow-tile",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {settings.mode === "sort" ? (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <p className="mb-1 text-kicker font-medium uppercase tracking-kicker text-quiet">
              Cantidad
            </p>
            <div className="flex gap-1" role="radiogroup" aria-label="Cantidad de números">
              {[3, 4, 5, 6].map((n) => {
                const on = settings.sortCount === n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onCount(n)}
                    className={cn(
                      "size-11 rounded-md text-base font-semibold tabular-nums transition-[background-color,color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] sm:size-12",
                      on ? "bg-accent text-accent-fg shadow-press" : "bg-paper text-ink shadow-tile",
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-1 text-kicker font-medium uppercase tracking-kicker text-quiet">
              Orden
            </p>
            <div className="flex rounded-xl bg-paper p-1 shadow-tile">
              <button
                type="button"
                aria-pressed={settings.sortDir === "asc"}
                onClick={() => onDir("asc")}
                className={cn(
                  "flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold transition-[background-color,color] duration-150 sm:h-11",
                  settings.sortDir === "asc"
                    ? "bg-accent text-accent-fg"
                    : "text-quiet hover:text-ink",
                )}
              >
                <ArrowUpNarrowWide className="size-4" />
                <span className="hidden md:inline">Menor a mayor</span>
              </button>
              <button
                type="button"
                aria-pressed={settings.sortDir === "desc"}
                onClick={() => onDir("desc")}
                className={cn(
                  "flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold transition-[background-color,color] duration-150 sm:h-11",
                  settings.sortDir === "desc"
                    ? "bg-accent text-accent-fg"
                    : "text-quiet hover:text-ink",
                )}
              >
                <ArrowDownWideNarrow className="size-4" />
                <span className="hidden md:inline">Mayor a menor</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CompareStage({
  a,
  b,
  choice,
  status,
  onChoose,
}: {
  a: number;
  b: number;
  choice: CompareSymbol | null;
  status: Status;
  onChoose: (s: CompareSymbol) => void;
}) {
  const slotClass =
    status === "correct"
      ? "border-ok bg-mist text-ok"
      : status === "revealed"
        ? "border-accent bg-mist text-accent"
        : status === "wrong"
          ? "border-bad text-bad"
          : "border-line text-quiet";

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
      <div className="compare-row">
        <NumberTile value={a} className="rise-in compare-tile" />
        <div
          className={cn(
            "grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-dashed bg-paper/70 text-3xl font-bold tabular-nums sm:size-20 sm:text-4xl",
            slotClass,
          )}
          aria-label={choice ? `Símbolo elegido: ${choice}` : "Símbolo sin elegir"}
        >
          {choice ?? "?"}
        </div>
        <NumberTile value={b} className="rise-in compare-tile delay-75" />
      </div>

      <div
        className="symbol-row"
        role="group"
        aria-label="Símbolos de comparación"
      >
        {SYMBOLS.map((s) => (
          <button
            key={s.value}
            type="button"
            className="symbol-btn flex flex-col items-center justify-center px-2 py-2 sm:px-5"
            data-active={choice === s.value}
            aria-pressed={choice === s.value}
            aria-label={s.name}
            onClick={() => onChoose(s.value)}
          >
            <span className="text-3xl leading-none sm:text-4xl">{s.label}</span>
            <span className="mt-1 text-kicker font-semibold uppercase tracking-kicker opacity-80">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

type DragState = {
  index: number;
  x: number;
  y: number;
  ox: number;
  oy: number;
  w: number;
  h: number;
  moved: boolean;
};

function SortStage({
  values,
  dir,
  status,
  picked,
  reduced,
  onPick,
  onSwap,
}: {
  values: number[];
  dir: SortDir;
  status: Status;
  picked: number | null;
  reduced: boolean;
  onPick: (i: number | null) => void;
  onSwap: (i: number, j: number) => void;
}) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const overRef = useRef<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const locked = status === "correct" || status === "revealed";

  const endDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const targetIndex = overRef.current;
    const wasTap = !current.moved;
    const from = current.index;
    dragRef.current = null;
    setDrag(null);
    setOver(null);
    overRef.current = null;
    if (locked) return;
    if (wasTap) {
      if (picked === null) onPick(from);
      else if (picked === from) onPick(null);
      else onSwap(picked, from);
      return;
    }
    if (targetIndex !== null && targetIndex !== from) onSwap(from, targetIndex);
  };

  const moveDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const moved = current.moved || Math.hypot(dx, dy) > 8;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const tile = el?.closest("[data-sort-index]") as HTMLElement | null;
    const hit = tile ? Number(tile.dataset.sortIndex) : Number.NaN;
    const nextOver = Number.isFinite(hit) && hit !== current.index ? hit : null;
    overRef.current = nextOver;
    const next: DragState = {
      ...current,
      x: e.clientX,
      y: e.clientY,
      moved,
    };
    dragRef.current = next;
    setOver(nextOver);
    setDrag(next);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="flex items-center gap-2 text-sm font-medium text-quiet">
        {dir === "asc" ? (
          <>
            <span>Menor</span>
            <span aria-hidden="true" className="h-px w-10 bg-line sm:w-16" />
            <span>Mayor</span>
          </>
        ) : (
          <>
            <span>Mayor</span>
            <span aria-hidden="true" className="h-px w-10 bg-line sm:w-16" />
            <span>Menor</span>
          </>
        )}
      </p>
      <p className="text-center text-xs text-quiet sm:text-sm">
        Toca dos números para intercambiarlos, o arrastra uno sobre otro.
      </p>
      <div className="flex w-full flex-wrap items-stretch justify-center gap-2.5 sm:gap-3">
        {values.map((v, i) => (
          <NumberTile
            key={`${v}-${i}`}
            value={v}
            interactive
            sortIndex={i}
            selected={picked === i || over === i}
            dim={drag?.index === i}
            className={cn("rise-in sort-tile touch-none", status === "correct" && "ok-flash")}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              if (locked) return;
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.setPointerCapture(e.pointerId);
              startRef.current = { x: e.clientX, y: e.clientY };
              const next: DragState = {
                index: i,
                x: e.clientX,
                y: e.clientY,
                ox: e.clientX - rect.left,
                oy: e.clientY - rect.top,
                w: rect.width,
                h: rect.height,
                moved: false,
              };
              dragRef.current = next;
              setDrag(next);
            }}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
          />
        ))}
      </div>
      {drag?.moved && !reduced ? (
        <div
          className="ghost-card num-card flex items-center justify-center px-4 py-4"
          style={{
            left: drag.x - drag.ox,
            top: drag.y - drag.oy,
            width: drag.w,
            height: drag.h,
          }}
        >
          <ColoredNumber value={values[drag.index]!} />
        </div>
      ) : null}
    </div>
  );
}

function NumberTile({
  value,
  className,
  selected,
  dim,
  interactive,
  sortIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  value: number;
  className?: string;
  selected?: boolean;
  dim?: boolean;
  interactive?: boolean;
  sortIndex?: number;
  onPointerDown?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  const glyphsLen = groupedLength(value);
  const tileClass = cn(
    "num-card flex min-h-24 items-center justify-center px-4 py-4 sm:min-h-32 sm:px-6 sm:py-6",
    selected && "ring-2 ring-accent",
    dim && "opacity-40",
    className,
  );

  if (interactive) {
    return (
      <button
        type="button"
        data-len={glyphsLen}
        data-sort-index={sortIndex}
        aria-label={spokenNumber(value)}
        aria-pressed={selected}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={tileClass}
      >
        <ColoredNumber value={value} />
      </button>
    );
  }

  return (
    <div data-len={glyphsLen} className={tileClass} aria-label={spokenNumber(value)}>
      <ColoredNumber value={value} />
    </div>
  );
}

function groupedLength(n: number): number {
  const digits = Math.abs(n).toString().length;
  return digits + Math.floor((digits - 1) / 3);
}

function PlaceLegend() {
  return (
    <footer className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-2 sm:px-5">
      <LegendSwatch className="bg-units" label="Unidades" />
      <LegendSwatch className="bg-tens" label="Decenas" />
      <LegendSwatch className="bg-hundreds" label="Centenas" />
      <span className="flex items-center gap-1.5 text-xs font-medium text-quiet sm:text-sm">
        <span className="text-base font-extrabold leading-none text-sep" aria-hidden="true">
          .
        </span>
        Miles y millones
      </span>
    </footer>
  );
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-quiet sm:text-sm">
      <span className={cn("size-2.5 rounded-full", className)} aria-hidden="true" />
      {label}
    </span>
  );
}

function SuccessBurst() {
  return (
    <div className="burst" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} className="burst-dot" />
      ))}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="feedback-mark grid size-20 place-items-center rounded-full bg-ok text-ok-fg shadow-tile sm:size-24">
          <Check className="size-10 sm:size-12" strokeWidth={2.6} />
        </div>
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
