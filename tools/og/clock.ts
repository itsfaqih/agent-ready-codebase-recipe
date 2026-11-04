// Page time for filming: timers and CSS animations stand still until window.filmClock.to(ms) moves them, so every
// frame lands on its exact moment however slowly the machine takes the screenshots. The capture script strips the
// types and registers this as a page init script.
(() => {
  let now = 0;
  let nextId = 0;
  const timers = new Map<number, { readonly at: number; readonly id: number; readonly run: () => void }>();
  const startedAt = new WeakMap<Animation, number>();

  // An animation's clock starts at the page moment it first exists, so one started by a timer starts at that timer.
  const holdAnimations = () => {
    for (const animation of document.getAnimations()) {
      if (!startedAt.has(animation)) {
        startedAt.set(animation, now);
        animation.pause();
      }

      animation.currentTime = now - (startedAt.get(animation) ?? now);
    }
  };

  const due = (until: number) =>
    [...timers.values()].filter((timer) => timer.at <= until).toSorted((a, b) => a.at - b.at || a.id - b.id)[0];

  Object.assign(window, {
    setTimeout: (callback: (...args: unknown[]) => void, delay = 0, ...args: unknown[]) => {
      nextId += 1;
      timers.set(nextId, { at: now + Math.max(0, delay), id: nextId, run: () => callback(...args) });

      return nextId;
    },
    clearTimeout: (id: number) => timers.delete(id),
    filmClock: {
      pending: () => timers.size,
      to(until: number) {
        for (let timer = due(until); timer; timer = due(until)) {
          timers.delete(timer.id);
          now = timer.at;
          holdAnimations();
          timer.run();
          holdAnimations();
        }

        now = until;
        holdAnimations();

        return now;
      },
    },
  });
})();
