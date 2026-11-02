// @ts-check
/* oxlint-disable unicorn/consistent-function-scoping -- helpers run once inside the block that keeps a classic script off the page globals */
// Page-side screenshot annotations: boxes, arrows, and numbered badges with short notes.
// Load this file into the page with the driver's evaluate-script call (docs/screenshots.md),
// then call window.__annotate.draw(marks, options). draw() returns the crop rectangle
// { x, y, width, height } in document coordinates that holds every mark plus padding,
// and adds an empty element over it with id "__annotate-crop" for element-only screenshots.
// Some drivers capture an element only inside the viewport at scroll position 0, so size the
// viewport to at least y + height of the returned crop first.
//
// The file is a classic script, so everything lives inside one block: block-scoped
// declarations stay off the page's globals and a second load is a no-op.

/** @typedef {{ x: number, y: number, width: number, height: number }} Rect */

/**
 * @typedef {object} Mark
 * @property {string} [target] CSS selector of the element to point at.
 * @property {Rect} [rect] Document coordinates, used instead of `target`.
 * @property {'box' | 'arrow' | 'both'} [shape] Defaults to 'box'.
 * @property {string} [label] The badge text ('1', 'A'); the PR caption explains each label.
 * @property {string} [note] Optional short text beside the badge (about six words).
 * @property {'top' | 'right' | 'bottom' | 'left'} [from] Where an arrow starts. Defaults to 'left'.
 */

/** @typedef {{ color?: string, padding?: number }} Options */

if (!("__annotate" in window)) {
  const ID = "__annotate-root";
  const SVG = "http://www.w3.org/2000/svg";

  /** @returns {void} */
  const clear = () => document.getElementById(ID)?.remove();

  /**
   * @param {Mark} mark
   * @returns {Rect}
   */
  const rectOf = (mark) => {
    if (mark.rect) return mark.rect;

    const el = mark.target === undefined ? null : document.querySelector(mark.target);

    if (!el) throw new Error(`annotate: no element matches "${mark.target}"`);

    const r = el.getBoundingClientRect();

    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  };

  /**
   * @param {HTMLElement} el
   * @param {Rect} r
   * @returns {HTMLElement}
   */
  const place = (el, r) => {
    Object.assign(el.style, {
      position: "absolute",
      left: `${r.x}px`,
      top: `${r.y}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });

    return el;
  };

  /**
   * @param {HTMLElement} el
   * @param {number} x
   * @param {number} y
   * @returns {HTMLElement}
   */
  const pin = (el, x, y) => {
    Object.assign(el.style, { position: "absolute", left: `${x}px`, top: `${y}px` });

    return el;
  };

  /**
   * @param {Rect} r
   * @param {NonNullable<Mark['from']>} from
   * @param {number} gap
   * @param {number} length
   * @returns {{ head: [number, number], start: [number, number] }}
   */
  const tail = (r, from, gap, length) => {
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;

    if (from === "top") return { head: [cx, r.y - gap], start: [cx, r.y - gap - length] };

    if (from === "bottom") return { head: [cx, r.y + r.height + gap], start: [cx, r.y + r.height + gap + length] };

    if (from === "right") return { head: [r.x + r.width + gap, cy], start: [r.x + r.width + gap + length, cy] };

    return { head: [r.x - gap, cy], start: [r.x - gap - length, cy] };
  };

  /**
   * @param {readonly Mark[]} marks
   * @param {Options} [options]
   * @returns {Rect}
   */
  const draw = (marks, options = {}) => {
    clear();

    const color = options.color ?? "#e5173f";
    const padding = options.padding ?? 24;
    const doc = document.documentElement;
    const root = document.createElement("div");

    root.id = ID;
    Object.assign(root.style, {
      position: "absolute",
      left: "0",
      top: "0",
      pointerEvents: "none",
      zIndex: "2147483647",
      width: `${doc.scrollWidth}px`,
      height: `${doc.scrollHeight}px`,
    });

    const svg = document.createElementNS(SVG, "svg");

    svg.setAttribute("width", String(doc.scrollWidth));
    svg.setAttribute("height", String(doc.scrollHeight));
    svg.style.position = "absolute";
    svg.innerHTML = `<defs><marker id="${ID}-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker></defs>`;
    root.append(svg);

    for (const mark of marks) {
      const r = rectOf(mark);
      const kind = mark.shape ?? "box";
      let badgeAt = [r.x - 17, r.y - 17];
      let noteAt = [r.x + 17, r.y - 34];

      if (kind === "box" || kind === "both") {
        const box = place(document.createElement("div"), {
          x: r.x - 4,
          y: r.y - 4,
          width: r.width + 8,
          height: r.height + 8,
        });

        Object.assign(box.style, {
          boxSizing: "border-box",
          border: `3px solid ${color}`,
          borderRadius: "6px",
          background: `${color}14`,
        });
        box.dataset["annot"] = "";
        root.append(box);
      }

      if (kind === "arrow" || kind === "both") {
        const { head, start } = tail(r, mark.from ?? "left", kind === "both" ? 10 : 6, 72);
        const line = document.createElementNS(SVG, "line");

        line.setAttribute("x1", String(start[0]));
        line.setAttribute("y1", String(start[1]));
        line.setAttribute("x2", String(head[0]));
        line.setAttribute("y2", String(head[1]));
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "4");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("marker-end", `url(#${ID}-head)`);
        svg.append(line);
        badgeAt = [start[0] - 13, start[1] - 13];
        noteAt = [start[0] + 21, start[1] - 13];
      }

      if (mark.label !== undefined) {
        const badge = pin(document.createElement("div"), badgeAt[0] ?? 0, badgeAt[1] ?? 0);

        badge.textContent = mark.label;
        badge.dataset["annot"] = "";
        Object.assign(badge.style, {
          minWidth: "26px",
          height: "26px",
          padding: "0 4px",
          boxSizing: "border-box",
          borderRadius: "13px",
          background: color,
          color: "#fff",
          font: "700 15px/26px system-ui, sans-serif",
          textAlign: "center",
          boxShadow: "0 0 0 2px #fff",
        });
        root.append(badge);

        if (mark.note !== undefined) {
          const note = pin(document.createElement("div"), noteAt[0] ?? 0, noteAt[1] ?? 0);

          note.textContent = mark.note;
          note.dataset["annot"] = "";
          Object.assign(note.style, {
            maxWidth: "260px",
            padding: "3px 9px",
            borderRadius: "6px",
            background: "#fff",
            color: "#111",
            border: `2px solid ${color}`,
            font: "600 13px/18px system-ui, sans-serif",
          });
          root.append(note);
        }
      }
    }

    doc.append(root);

    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;

    /** @param {Rect} r */
    const grow = (r) => {
      x0 = Math.min(x0, r.x);
      y0 = Math.min(y0, r.y);
      x1 = Math.max(x1, r.x + r.width);
      y1 = Math.max(y1, r.y + r.height);
    };

    for (const mark of marks) grow(rectOf(mark));

    for (const el of root.querySelectorAll("[data-annot]")) {
      const r = el.getBoundingClientRect();

      grow({ x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height });
    }

    for (const line of svg.querySelectorAll("line")) {
      for (const n of ["1", "2"]) {
        grow({
          x: Number(line.getAttribute(`x${n}`)) - 8,
          y: Number(line.getAttribute(`y${n}`)) - 8,
          width: 16,
          height: 16,
        });
      }
    }

    const x = Math.max(0, Math.floor(x0 - padding));
    const y = Math.max(0, Math.floor(y0 - padding));

    const crop = {
      x,
      y,
      width: Math.min(doc.scrollWidth, Math.ceil(x1 + padding)) - x,
      height: Math.min(doc.scrollHeight, Math.ceil(y1 + padding)) - y,
    };

    // An element over the crop rectangle, so a tool that only crops to an element can screenshot "#__annotate-crop".
    const frame = place(document.createElement("div"), crop);

    frame.id = "__annotate-crop";
    root.append(frame);

    return crop;
  };

  Object.defineProperty(window, "__annotate", { value: { draw, clear }, configurable: true });
}
