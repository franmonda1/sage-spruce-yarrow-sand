import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RefreshCw, c as Lightbulb, d as ArrowDownWideNarrow, i as Scale, l as Check, n as Volume2, o as Minimize2, s as Maximize2, t as VolumeX, u as ArrowUpNarrowWide } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CalmdHtH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
function getCtx() {
	if (typeof window === "undefined") return null;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	if (!ctx) ctx = new AC();
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function tone(c, freq, start, dur, type, gain) {
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, start);
	g.gain.setValueAtTime(1e-4, start);
	g.gain.exponentialRampToValueAtTime(gain, start + .018);
	g.gain.exponentialRampToValueAtTime(1e-4, start + dur);
	osc.connect(g);
	g.connect(c.destination);
	osc.start(start);
	osc.stop(start + dur + .02);
}
function playSuccess() {
	const c = getCtx();
	if (!c) return;
	const now = c.currentTime;
	[
		523.25,
		659.25,
		783.99,
		1046.5
	].forEach((freq, i) => {
		tone(c, freq, now + i * .07, .28, "sine", .09);
	});
}
function playError() {
	const c = getCtx();
	if (!c) return;
	const now = c.currentTime;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(196, now);
	osc.frequency.exponentialRampToValueAtTime(90, now + .2);
	g.gain.setValueAtTime(1e-4, now);
	g.gain.exponentialRampToValueAtTime(.07, now + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, now + .22);
	osc.connect(g);
	g.connect(c.destination);
	osc.start(now);
	osc.stop(now + .24);
}
function vibrateError() {
	try {
		navigator.vibrate?.([
			42,
			36,
			70
		]);
	} catch {}
}
function isFullscreen() {
	const doc = document;
	return Boolean(document.fullscreenElement || doc.webkitFullscreenElement);
}
function fullscreenSupported() {
	if (typeof document === "undefined") return false;
	const el = document.documentElement;
	return Boolean(el.requestFullscreen || el.webkitRequestFullscreen);
}
async function toggleFullscreen() {
	const el = document.documentElement;
	const doc = document;
	if (isFullscreen()) {
		if (document.exitFullscreen) await document.exitFullscreen();
		else doc.webkitExitFullscreen?.();
		return;
	}
	if (el.requestFullscreen) await el.requestFullscreen();
	else el.webkitRequestFullscreen?.();
}
function randomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}
function randomDigitCount(maxDigits) {
	if (maxDigits <= 1) return 1;
	if (Math.random() < .55) return maxDigits;
	return randomInt(1, maxDigits);
}
function randomNumber(maxDigits) {
	const digits = randomDigitCount(clampDigits(maxDigits));
	if (digits === 1) return randomInt(0, 9);
	return randomInt(10 ** (digits - 1), 10 ** digits - 1);
}
function clampDigits(n) {
	return Math.min(9, Math.max(1, Math.round(n)));
}
function formatGrouped(n) {
	const sign = n < 0 ? "-" : "";
	const s = Math.abs(n).toString();
	const parts = [];
	for (let i = s.length; i > 0; i -= 3) parts.unshift(s.slice(Math.max(0, i - 3), i));
	return sign + parts.join(".");
}
function numberGlyphs(n) {
	const formatted = formatGrouped(n);
	const glyphs = [];
	let digitFromRight = 0;
	for (let i = formatted.length - 1; i >= 0; i--) {
		const ch = formatted[i];
		if (ch === "." || ch === "-") glyphs.push({
			ch,
			place: "sep"
		});
		else {
			const p = digitFromRight % 3;
			glyphs.push({
				ch,
				place: p === 0 ? "units" : p === 1 ? "tens" : "hundreds"
			});
			digitFromRight += 1;
		}
	}
	return glyphs.reverse();
}
function spokenNumber(n) {
	return formatGrouped(n).replaceAll(".", " ");
}
function compareSymbol(a, b) {
	if (a < b) return "<";
	if (a > b) return ">";
	return "=";
}
function generateComparePair(maxDigits) {
	const a = randomNumber(maxDigits);
	if (Math.random() < .12) return [a, a];
	let b = randomNumber(maxDigits);
	let guard = 0;
	while (b === a && guard++ < 24) b = randomNumber(maxDigits);
	return [a, b];
}
function shuffleInPlace(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
	return arr;
}
function isSorted(arr, dir) {
	for (let i = 1; i < arr.length; i++) {
		const prev = arr[i - 1];
		const cur = arr[i];
		if (dir === "asc" && cur < prev) return false;
		if (dir === "desc" && cur > prev) return false;
	}
	return true;
}
function sortNumbers(arr, dir) {
	return [...arr].sort((a, b) => dir === "asc" ? a - b : b - a);
}
function swapAt(arr, i, j) {
	const next = [...arr];
	const a = next[i];
	const b = next[j];
	if (a === void 0 || b === void 0) return next;
	next[i] = b;
	next[j] = a;
	return next;
}
function generateSortValues(count, maxDigits) {
	const size = Math.min(8, Math.max(3, Math.round(count)));
	const digits = clampDigits(maxDigits);
	const pool = /* @__PURE__ */ new Set();
	let guard = 0;
	while (pool.size < size && guard++ < 8e3) pool.add(randomNumber(digits));
	let n = 0;
	while (pool.size < size) {
		pool.add(n);
		n += 1;
	}
	const values = shuffleInPlace([...pool]);
	if (isSorted(values, "asc") || isSorted(values, "desc")) {
		const first = values.shift();
		if (first !== void 0) values.push(first);
	}
	return values;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var placeClass = {
	units: "num-units",
	tens: "num-tens",
	hundreds: "num-hundreds",
	sep: "num-sep"
};
function ColoredNumber({ value, className }) {
	const glyphs = numberGlyphs(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("num-face", className),
		"aria-label": spokenNumber(value),
		children: glyphs.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: placeClass[g.place],
			"aria-hidden": "true",
			children: g.ch
		}, `${g.ch}-${i}`))
	});
}
var tapScale = "active:not-disabled:scale-[0.96]";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-lg font-medium select-none touch-manipulation transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg shadow-press hover:brightness-105",
			secondary: "bg-paper text-ink shadow-tile hover:shadow-tile-hover",
			outline: "bg-transparent text-ink shadow-press hover:bg-paper",
			ghost: "bg-transparent text-ink hover:bg-paper/70",
			success: "bg-ok text-ok-fg shadow-press"
		},
		size: {
			default: "h-12 px-4 text-sm",
			sm: "h-10 px-3 text-sm",
			lg: "h-14 px-5 text-base",
			xl: "min-h-16 px-5 py-3 text-base",
			icon: "size-12",
			chip: "size-12 text-base font-semibold"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, static: isStatic, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), !isStatic && tapScale, className),
		...props
	});
}
var SETTINGS_KEY = "cifras.settings.v1";
var DEFAULTS = {
	mode: "compare",
	maxDigits: 3,
	sortCount: 4,
	sortDir: "asc",
	sound: true
};
function loadSettings() {
	if (typeof window === "undefined") return DEFAULTS;
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return DEFAULTS;
		const parsed = JSON.parse(raw);
		return {
			mode: parsed.mode === "sort" ? "sort" : "compare",
			maxDigits: clampDigits(parsed.maxDigits ?? DEFAULTS.maxDigits),
			sortCount: Math.min(6, Math.max(3, parsed.sortCount ?? DEFAULTS.sortCount)),
			sortDir: parsed.sortDir === "desc" ? "desc" : "asc",
			sound: parsed.sound !== false
		};
	} catch {
		return DEFAULTS;
	}
}
function persistSettings(s) {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
	} catch {}
}
var SYMBOLS = [
	{
		value: "<",
		label: "<",
		name: "menor que"
	},
	{
		value: "=",
		label: "=",
		name: "igual a"
	},
	{
		value: ">",
		label: ">",
		name: "mayor que"
	}
];
function NumberLab() {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULTS);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [pair, setPair] = (0, import_react.useState)([12, 8]);
	const [values, setValues] = (0, import_react.useState)([
		3,
		9,
		1,
		6
	]);
	const [choice, setChoice] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [round, setRound] = (0, import_react.useState)(0);
	const [fs, setFs] = (0, import_react.useState)(false);
	const [fsOk, setFsOk] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)("");
	const [shakeKey, setShakeKey] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const reduced = usePrefersReducedMotion();
	const stageRef = (0, import_react.useRef)(null);
	const applySettings = (0, import_react.useCallback)((patch) => {
		setSettings((prev) => {
			const next = {
				...prev,
				...patch
			};
			persistSettings(next);
			return next;
		});
	}, []);
	const generate = (0, import_react.useCallback)((s) => {
		setChoice(null);
		setPicked(null);
		setStatus("idle");
		setLive("");
		if (s.mode === "compare") setPair(generateComparePair(s.maxDigits));
		else setValues(generateSortValues(s.sortCount, s.maxDigits));
		setRound((r) => r + 1);
	}, []);
	(0, import_react.useEffect)(() => {
		const loaded = loadSettings();
		setSettings(loaded);
		if (loaded.mode === "compare") setPair(generateComparePair(loaded.maxDigits));
		else setValues(generateSortValues(loaded.sortCount, loaded.maxDigits));
		setHydrated(true);
		setFsOk(fullscreenSupported());
		setFs(isFullscreen());
		const onFs = () => setFs(isFullscreen());
		document.addEventListener("fullscreenchange", onFs);
		document.addEventListener("webkitfullscreenchange", onFs);
		return () => {
			document.removeEventListener("fullscreenchange", onFs);
			document.removeEventListener("webkitfullscreenchange", onFs);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (status !== "wrong") return;
		const el = stageRef.current;
		if (!el) return;
		el.classList.remove("shake");
		el.offsetWidth;
		el.classList.add("shake");
	}, [shakeKey, status]);
	const answer = (0, import_react.useMemo)(() => compareSymbol(pair[0], pair[1]), [pair]);
	const sortedOk = (0, import_react.useMemo)(() => isSorted(values, settings.sortDir), [values, settings.sortDir]);
	const celebrate = (0, import_react.useCallback)(() => {
		setStatus("correct");
		setLive("¡Correcto!");
		if (settings.sound) playSuccess();
	}, [settings.sound]);
	const fail = (0, import_react.useCallback)(() => {
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
		if (settings.mode === "compare") setChoice(answer);
		else {
			setValues(sortNumbers(values, settings.sortDir));
			setPicked(null);
		}
		setStatus("revealed");
		setLive("Respuesta mostrada.");
	};
	const instruction = settings.mode === "compare" ? "Elige el símbolo que falta" : settings.sortDir === "asc" ? "Ordena de menor a mayor" : "Ordena de mayor a menor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				mode: settings.mode,
				sound: settings.sound,
				fs,
				fsOk,
				onMode: (mode) => {
					applySettings({ mode });
					generate({
						...settings,
						mode
					});
				},
				onSound: () => applySettings({ sound: !settings.sound }),
				onFullscreen: () => {
					toggleFullscreen();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				settings,
				onDigits: (maxDigits) => {
					applySettings({ maxDigits });
					generate({
						...settings,
						maxDigits
					});
				},
				onCount: (sortCount) => {
					applySettings({ sortCount });
					generate({
						...settings,
						sortCount
					});
				},
				onDir: (sortDir) => {
					applySettings({ sortDir });
					generate({
						...settings,
						sortDir
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative mx-auto flex w-full max-w-screen-2xl min-h-0 flex-col items-center justify-center px-3 py-2 sm:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-center text-sm font-medium tracking-wide text-quiet sm:mb-3 sm:text-base",
						children: instruction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: stageRef,
						className: "relative flex w-full min-h-0 flex-1 items-center justify-center",
						children: [!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid w-full max-w-4xl grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "num-card h-28 sm:h-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "num-card h-28 sm:h-40" })]
						}) : settings.mode === "compare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareStage, {
							a: pair[0],
							b: pair[1],
							choice,
							status,
							onChoose: (s) => {
								if (status === "correct" || status === "revealed") return;
								setChoice(s);
								setStatus("idle");
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortStage, {
							values,
							dir: settings.sortDir,
							status,
							picked,
							reduced,
							onPick: setPicked,
							onSwap: (i, j) => {
								if (status === "correct" || status === "revealed") return;
								setValues((prev) => swapAt(prev, i, j));
								setPicked(null);
								setStatus("idle");
							}
						}), status === "correct" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessBurst, {}) : null]
					}, `${settings.mode}-${round}`),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sr-only",
						"aria-live": "polite",
						children: live
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto w-full max-w-screen-2xl px-3 pb-2 sm:px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "action-bar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "xl",
							variant: status === "correct" ? "success" : "default",
							className: "rounded-xl font-semibold",
							onClick: onCheck,
							disabled: status === "correct" || status === "revealed" || settings.mode === "compare" && !choice,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-5",
								strokeWidth: 2.4
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-sm:text-xs",
								children: "Comprobar"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "xl",
							variant: "secondary",
							className: "rounded-xl font-semibold",
							onClick: onReveal,
							disabled: status === "correct" || status === "revealed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
								className: "size-5",
								strokeWidth: 2.2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-sm:text-xs",
								children: "Corregir"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "xl",
							variant: "secondary",
							className: "rounded-xl font-semibold",
							onClick: () => generate(settings),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
								className: "size-5",
								strokeWidth: 2.2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-sm:text-xs",
								children: "Nuevos"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceLegend, {})
		]
	});
}
function Header({ mode, sound, fs, fsOk, onMode, onSound, onFullscreen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mx-auto flex w-full min-w-0 max-w-screen-2xl items-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-title font-semibold tracking-display text-ink",
					children: "Cifras"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-kicker text-quiet sm:block",
					children: "Compara y ordena números"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex rounded-xl bg-paper p-1 shadow-tile",
				role: "tablist",
				"aria-label": "Tipo de actividad",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeTab, {
					active: mode === "compare",
					onClick: () => onMode("compare"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }),
					label: "Comparar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeTab, {
					active: mode === "sort",
					onClick: () => onMode("sort"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpNarrowWide, { className: "size-4" }),
					label: "Ordenar"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "icon",
				className: "rounded-xl",
				"aria-label": sound ? "Silenciar sonidos" : "Activar sonidos",
				"aria-pressed": sound,
				onClick: onSound,
				children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" })
			}),
			fsOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "icon",
				className: "rounded-xl",
				"aria-label": fs ? "Salir de pantalla completa" : "Pantalla completa",
				"aria-pressed": fs,
				onClick: onFullscreen,
				children: fs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-5" })
			}) : null
		]
	});
}
function ModeTab({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "tab",
		"aria-label": label,
		"aria-selected": active,
		onClick,
		className: cn("flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] sm:h-11 sm:px-3.5", active ? "bg-accent text-accent-fg" : "bg-transparent text-quiet hover:text-ink"),
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: label
		})]
	});
}
function Toolbar({ settings, onDigits, onCount, onDir }) {
	const digitsId = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-screen-2xl flex-wrap items-center gap-2 px-3 pb-1 sm:gap-3 sm:px-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: digitsId,
				className: "mb-1 text-kicker font-medium uppercase tracking-kicker text-quiet",
				children: "Cifras máximas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chip-row",
				role: "radiogroup",
				"aria-labelledby": digitsId,
				children: Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
					const on = settings.maxDigits === n;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "radio",
						"aria-checked": on,
						onClick: () => onDigits(n),
						className: cn("size-9 shrink-0 rounded-md text-sm font-semibold tabular-nums transition-[background-color,color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] sm:size-11 sm:text-base md:size-12", on ? "bg-accent text-accent-fg shadow-press" : "bg-paper text-ink shadow-tile"),
						children: n
					}, n);
				})
			})]
		}), settings.mode === "sort" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-kicker font-medium uppercase tracking-kicker text-quiet",
				children: "Cantidad"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1",
				role: "radiogroup",
				"aria-label": "Cantidad de números",
				children: [
					3,
					4,
					5,
					6
				].map((n) => {
					const on = settings.sortCount === n;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "radio",
						"aria-checked": on,
						onClick: () => onCount(n),
						className: cn("size-11 rounded-md text-base font-semibold tabular-nums transition-[background-color,color,transform] duration-150 ease-out active:not-disabled:scale-[0.96] sm:size-12", on ? "bg-accent text-accent-fg shadow-press" : "bg-paper text-ink shadow-tile"),
						children: n
					}, n);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-kicker font-medium uppercase tracking-kicker text-quiet",
				children: "Orden"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex rounded-xl bg-paper p-1 shadow-tile",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": settings.sortDir === "asc",
					onClick: () => onDir("asc"),
					className: cn("flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold transition-[background-color,color] duration-150 sm:h-11", settings.sortDir === "asc" ? "bg-accent text-accent-fg" : "text-quiet hover:text-ink"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpNarrowWide, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden md:inline",
						children: "Menor a mayor"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": settings.sortDir === "desc",
					onClick: () => onDir("desc"),
					className: cn("flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold transition-[background-color,color] duration-150 sm:h-11", settings.sortDir === "desc" ? "bg-accent text-accent-fg" : "text-quiet hover:text-ink"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownWideNarrow, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden md:inline",
						children: "Mayor a menor"
					})]
				})]
			})] })]
		}) : null]
	});
}
function CompareStage({ a, b, choice, status, onChoose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full flex-col items-center gap-4 sm:gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "compare-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberTile, {
					value: a,
					className: "rise-in compare-tile"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-dashed bg-paper/70 text-3xl font-bold tabular-nums sm:size-20 sm:text-4xl", status === "correct" ? "border-ok bg-mist text-ok" : status === "revealed" ? "border-accent bg-mist text-accent" : status === "wrong" ? "border-bad text-bad" : "border-line text-quiet"),
					"aria-label": choice ? `Símbolo elegido: ${choice}` : "Símbolo sin elegir",
					children: choice ?? "?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberTile, {
					value: b,
					className: "rise-in compare-tile delay-75"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "symbol-row",
			role: "group",
			"aria-label": "Símbolos de comparación",
			children: SYMBOLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "symbol-btn flex flex-col items-center justify-center px-2 py-2 sm:px-5",
				"data-active": choice === s.value,
				"aria-pressed": choice === s.value,
				"aria-label": s.name,
				onClick: () => onChoose(s.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-3xl leading-none sm:text-4xl",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-kicker font-semibold uppercase tracking-kicker opacity-80",
					children: s.name
				})]
			}, s.value))
		})]
	});
}
function SortStage({ values, dir, status, picked, reduced, onPick, onSwap }) {
	const [drag, setDrag] = (0, import_react.useState)(null);
	const dragRef = (0, import_react.useRef)(null);
	const startRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const overRef = (0, import_react.useRef)(null);
	const [over, setOver] = (0, import_react.useState)(null);
	const locked = status === "correct" || status === "revealed";
	const endDrag = (e) => {
		const current = dragRef.current;
		if (!current) return;
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {}
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
	const moveDrag = (e) => {
		const current = dragRef.current;
		if (!current) return;
		const dx = e.clientX - startRef.current.x;
		const dy = e.clientY - startRef.current.y;
		const moved = current.moved || Math.hypot(dx, dy) > 8;
		const tile = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-sort-index]");
		const hit = tile ? Number(tile.dataset.sortIndex) : NaN;
		const nextOver = Number.isFinite(hit) && hit !== current.index ? hit : null;
		overRef.current = nextOver;
		const next = {
			...current,
			x: e.clientX,
			y: e.clientY,
			moved
		};
		dragRef.current = next;
		setOver(nextOver);
		setDrag(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full flex-col items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "flex items-center gap-2 text-sm font-medium text-quiet",
				children: dir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Menor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "h-px w-10 bg-line sm:w-16"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mayor" })
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mayor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "h-px w-10 bg-line sm:w-16"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Menor" })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-quiet sm:text-sm",
				children: "Toca dos números para intercambiarlos, o arrastra uno sobre otro."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-full flex-wrap items-stretch justify-center gap-2.5 sm:gap-3",
				children: values.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberTile, {
					value: v,
					interactive: true,
					sortIndex: i,
					selected: picked === i || over === i,
					dim: drag?.index === i,
					className: cn("rise-in sort-tile touch-none", status === "correct" && "ok-flash"),
					onPointerDown: (e) => {
						if (e.button !== 0) return;
						if (locked) return;
						const rect = e.currentTarget.getBoundingClientRect();
						e.currentTarget.setPointerCapture(e.pointerId);
						startRef.current = {
							x: e.clientX,
							y: e.clientY
						};
						const next = {
							index: i,
							x: e.clientX,
							y: e.clientY,
							ox: e.clientX - rect.left,
							oy: e.clientY - rect.top,
							w: rect.width,
							h: rect.height,
							moved: false
						};
						dragRef.current = next;
						setDrag(next);
					},
					onPointerMove: moveDrag,
					onPointerUp: endDrag
				}, `${v}-${i}`))
			}),
			drag?.moved && !reduced ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ghost-card num-card flex items-center justify-center px-4 py-4",
				style: {
					left: drag.x - drag.ox,
					top: drag.y - drag.oy,
					width: drag.w,
					height: drag.h
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColoredNumber, { value: values[drag.index] })
			}) : null
		]
	});
}
function NumberTile({ value, className, selected, dim, interactive, sortIndex, onPointerDown, onPointerMove, onPointerUp }) {
	const glyphsLen = groupedLength(value);
	const tileClass = cn("num-card flex min-h-24 items-center justify-center px-4 py-4 sm:min-h-32 sm:px-6 sm:py-6", selected && "ring-2 ring-accent", dim && "opacity-40", className);
	if (interactive) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-len": glyphsLen,
		"data-sort-index": sortIndex,
		"aria-label": spokenNumber(value),
		"aria-pressed": selected,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel: onPointerUp,
		className: tileClass,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColoredNumber, { value })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-len": glyphsLen,
		className: tileClass,
		"aria-label": spokenNumber(value),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColoredNumber, { value })
	});
}
function groupedLength(n) {
	const digits = Math.abs(n).toString().length;
	return digits + Math.floor((digits - 1) / 3);
}
function PlaceLegend() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-2 sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendSwatch, {
				className: "bg-units",
				label: "Unidades"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendSwatch, {
				className: "bg-tens",
				label: "Decenas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendSwatch, {
				className: "bg-hundreds",
				label: "Centenas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-xs font-medium text-quiet sm:text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-extrabold leading-none text-sep",
					"aria-hidden": "true",
					children: "."
				}), "Miles y millones"]
			})
		]
	});
}
function LegendSwatch({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5 text-xs font-medium text-quiet sm:text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("size-2.5 rounded-full", className),
			"aria-hidden": "true"
		}), label]
	});
}
function SuccessBurst() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "burst",
		"aria-hidden": "true",
		children: [Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "burst-dot" }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "feedback-mark grid size-20 place-items-center rounded-full bg-ok text-ok-fg shadow-tile sm:size-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-10 sm:size-12",
					strokeWidth: 2.6
				})
			})
		})]
	});
}
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const on = () => setReduced(mq.matches);
		on();
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	return reduced;
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberLab, {});
}
//#endregion
export { Home as component };
