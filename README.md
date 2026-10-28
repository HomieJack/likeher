# likeher

A set-it-and-forget-it workout tracker, designed for women. It's plain HTML/CSS/JS with no build step. It works offline and you can install it to your phone's home screen.

## Run it

```
python -m http.server 8000
```
Then open http://localhost:8000. Double-clicking `index.html` also works, but offline mode and installing need http.

## Put it on your phone (GitHub Pages)

1. Push this folder to a GitHub repo (e.g. `likeher`).
2. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
3. After a minute it's live at `https://<your-username>.github.io/likeher/`.
4. Open that link on your phone (Safari on iPhone, Chrome on Android), then **Share → Add to Home Screen** (iPhone) or **⋮ → Install app** (Android).
5. Always open it from the home-screen icon. Your progress lives in that app's storage on the phone.

To update: edit, bump `VERSION` in `sw.js`, commit and push. The phone picks it up the next time it opens online. Your progress isn't touched.

**Keeping progress safe:** data never leaves the phone and is tied to that exact URL, so keep the same address. Back up from **Stats → ⚙ → Export backup**, which opens the share sheet so you can save to Files, iCloud or Drive. **Import backup** restores it on a new phone.

## Where things live

| File | What's in it |
|---|---|
| `js/exercises.js` | Exercise library (187), body regions, equipment (`EQUIPMENT`) and muscle groups (`GROUPS`). Add exercises here. Each exercise has `gear` (needed) and optional `opt` equipment; "Works" tags are derived from `regions` |
| `js/figure.js` | Animated figure engine (pose keyframes → SVG) |
| `js/body.js` | Female body heat map. `BODY_MODELS` is keyed by body type, so you can add more here later |
| `js/app.js` | State, the Workout / Exercises / Stats screens, settings |
| `css/app.css` | All styling. Colors are tokens at the top (light + dark) |
| `sw.js` | Offline cache. Bump `VERSION` after editing files |

Data is stored in `localStorage` on the device, under the key `likeher.v1`. Back it up from **Stats → ⚙ → Export backup**.

For testing, **Stats → ⚙ → Add sample history** fills in about 6 months of fake workouts. You can remove it the same way.
