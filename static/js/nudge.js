window.app ??= {};
// Nudge frames this app. A phone cannot capture the screen, so when Nudge asks
// for a snap, this page draws what it shows and posts the picture back.
app.nudge = {
  async snap(e) {
    const ask = e.data;
    if (window.parent === window || e.source !== window.parent) return;
    if (!ask || ask.type !== "nudge:snap") return;
    let url = null;
    try {
      const body = getComputedStyle(document.body).backgroundColor;
      const html = getComputedStyle(document.documentElement).backgroundColor;
      const clear = (c) => !c || c === "transparent" || c === "rgba(0, 0, 0, 0)";
      const bg = clear(body) ? (clear(html) ? "#fff" : html) : body;
      url = await modernScreenshot.domToPng(document.documentElement, {
        width: window.innerWidth,
        height: window.innerHeight,
        scale: Math.min(2, window.devicePixelRatio || 1),
        backgroundColor: bg,
        // The picture shows the part of the page on screen, on the page colour.
        style: {
          backgroundColor: bg,
          transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)`,
        },
      });
    } catch {
      url = null;
    }
    e.source.postMessage({ type: "nudge:snap", id: ask.id, url }, e.origin);
  },
};
window.addEventListener("message", (e) => app.nudge.snap(e));
