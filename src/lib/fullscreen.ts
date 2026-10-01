type FsEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

export function isFullscreen(): boolean {
  const doc = document as FsDoc;
  return Boolean(document.fullscreenElement || doc.webkitFullscreenElement);
}

export function fullscreenSupported(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.documentElement as FsEl;
  return Boolean(el.requestFullscreen || el.webkitRequestFullscreen);
}

export async function toggleFullscreen(): Promise<void> {
  const el = document.documentElement as FsEl;
  const doc = document as FsDoc;
  if (isFullscreen()) {
    if (document.exitFullscreen) await document.exitFullscreen();
    else doc.webkitExitFullscreen?.();
    return;
  }
  if (el.requestFullscreen) await el.requestFullscreen();
  else el.webkitRequestFullscreen?.();
}
