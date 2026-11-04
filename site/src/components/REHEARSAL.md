# Rehearsal: the hero run demo

Gold: `ruled-bento` for the terminal, `hero-demo` for a window beside copy with a satellite. Kept the terminal bled off the corner, a satellite card, and marks as glyphs in the grid. Changed the content to a run of this skill on a fictional `acme-web`.

Beats: the audit prints 12 rows and its tally, the fill turns each row green and adds its files, the second audit re-ticks every row, and the payoff is 12 of 12 with 17 files written and 0 on the second audit. A loop takes about 15s, and the old run scrolls up as the new one arrives.

Built: an Astro component and a small script, with no framework. It was first built on the Stageshow kit in React, then rewritten. The first frame, and the same frame after a full loop, match the React version pixel for pixel at 1280 and 390, apart from the caret's blink.

Captured: 1280 and 390, the visible changes through a loop, and reduced motion at 1280, all on the production build. `test:layout` covers text fit at 13 widths from 320 to 1440.

## How to change it

1. Change the run's words and numbers in `site/src/data/content.ts` and its timing in `site/src/data/run.ts`. Change framing in `RunDemo.css.ts`, markup in `RunDemo.astro` and `RunSession.astro`, and playback in `run-demo.ts`. Keep the names the film script reads: `ss-stage`, `ss-count` and `data-crop`.
2. Run `vp run test:components` and `vp run test:layout`. A longer string on a phone fails `test:layout` at 320.
3. Film it. `docs/stack.md` keeps one browser tool in this project, so the film script stays in the skill. Copy the skill somewhere writable, install its dependencies, then build and serve this site with `vp run build` and `vp run preview`, and run this from the skill's copy at both widths:

   ```sh
   node scripts/film.mjs <preview-url> --select '[data-run-demo]' --states --states-for 19000 --gate --width 1280 --out states.png
   ```

4. Film the production build, since the dev server loads its CSS late.

## Film

- `near-empty frames` at 1280: stands. A new run starts from its command alone, and its rows print as the audit reads them.
- `manual: same-box content change` on the tab counters: stands. They tick the way a terminal prints a number.
- `film: inconclusive`, exit 2: open. The last film at each width had 2 sampling gaps over 27ms on a busy machine (load about 8), so motion inside those gaps was not judged. Both films still ended `rehearsal passed`.

## Review

Two independent reviews ran. The second saw the rebuilt scene.

| Finding | Response |
| --- | --- |
| The rest frame could be any product | Tabs carry the run's counts, and rows carry evidence and files written |
| The heaviest mark said 0, and the count ran backward at the payoff | The card lands on 17 and never counts down; `0 on the second audit` is its payoff line |
| Reads as a to-do app | Marks are glyphs in the grid, tabs are inverse text, and the page's mono is used |
| Phone dropped every finding and had a grey plate | One column with findings; the stage reaches the screen edge, so the shadow stays whole |
| Second audit swept rows that were already green | Marks drop to pending at the tab switch and re-tick as the sweep passes |
| Count rose with no cause | The status names the row, and the row shows its `+N` |
| False values crossing ten and a lost digit | Always two digits, with a faint leading zero |
| Right half empty during the audit | The last column prints the audit's word; phones have no room, so they show only the mark |
| Void under the status line | The finished run ends on the next prompt |
| New run arrived already printed | Rows print as the audit reads them |
| Text onion-skinned at swaps | The old text is gone before the new arrives |
| Two pills fading between tabs | **Partly taken.** The inverse flips at once, as a terminal does, rather than sliding one pill |
| Type the command for each new run | **Declined.** It adds about 2s to a loop that already runs 15s, and the frame gains nothing |
| Stage empty until JavaScript ran | The layout is CSS, so the server's poster is right at every width |

Assumptions:

- `acme-web`, its findings and the 17 files are illustrative, not measured.
- The picture stays decorative (`aria-hidden`); the same content sits in visually hidden lists beside it.

Unresolved:

- Below about 388 wide, the part of the window on screen is narrower than tall (304 by 372 at 320). The gate films 390 and 1280, where it is not.
- The status glyphs come from the visitor's system font, so `◐` and `○` may look different on Linux and Android. They were only viewed on macOS.

Not checked:

- Real-time feel. Motion was judged from filmed frames, with the gaps above.
- Real phones, Safari and Firefox. Filming ran in Chromium only.
- Dark mode. The page has none today.
