let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  gain: number,
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.018);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export function playSuccess() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    tone(c, freq, now + i * 0.07, 0.28, "sine", 0.09);
  });
}

export function playError() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(196, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.07, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.24);
}

export function vibrateError() {
  try {
    navigator.vibrate?.([42, 36, 70]);
  } catch {
    /* ignore */
  }
}
