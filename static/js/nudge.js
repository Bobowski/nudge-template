window.app ??= {};
// Nudge frames this app. A phone cannot capture the screen, so when Nudge asks
// for a snap, this page draws what it shows and posts the picture back. When a
// change goes live, Nudge asks the page to reload, so it stays where it is.
app.nudge = {
  // Only nudgethis may ask: its address, and its address in development. The
  // app's site lets only nudgethis frame it too; this holds even if it did not.
  origins: ["https://wrati.dev", "http://127.0.0.1:8000", "http://localhost:8000"],

  hear(e) {
    const ask = e.data;
    if (window.parent === window || e.source !== window.parent || !ask) return;
    if (!this.origins.includes(e.origin)) return;
    if (ask.type === "nudge:snap") this.snap(e);
    if (ask.type === "nudge:reload") {
      e.source.postMessage({ type: "nudge:reloading" }, e.origin);
      location.reload();
    }
  },

  // A live page morphs the whole document; a new script there would not run,
  // so a change to the page's scripts reloads it.
  watch() {
    const scripts = () =>
      [...document.querySelectorAll("script[src]")]
        .map((s) => s.src)
        .sort()
        .join(" ");
    const first = scripts();
    new MutationObserver(() => {
      if (scripts() !== first) location.reload();
    }).observe(document.head, { childList: true, subtree: true, attributes: true });
  },

  async snap(e) {
    const ask = e.data;
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
        // The picture is an SVG, and XML takes no ":" in an attribute name.
        // Datastar's attributes (data-on:click) have one; drop them from the copy.
        onCloneEachNode: (node) => {
          if (node.nodeType !== 1) return;
          for (const { name } of [...node.attributes]) {
            if (name.includes(":")) node.removeAttribute(name);
          }
        },
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
window.addEventListener("message", (e) => app.nudge.hear(e));
app.nudge.watch();
