# Mastery gate (S16) — quick UX pass

**Date:** 2026-03-29  
**Scope:** Topic detail when gate panel is visible (`Berlangsung`, downstream unlocks, mastery &lt; threshold).

## Checks

- **Rationale first:** “Kenapa ada mastery gate?” appears above the status card (wireframe v2).
- **Concrete gap:** Current %, threshold %, and progress bar toward the gate (no dead-end copy).
- **Actions:** Primary continues review; secondary drills weakest subtopic when tag data exists.
- **Deep link:** `/topics/:subject/:topicId?gate=1` scrolls/focuses the panel.
- **Settings:** Threshold note references future Settings (no broken route).

## Follow-ups (non-blocking)

- Full **ux-audit** / **dogfood** run on a topic with real prerequisites and subtopic tags when testing locally (`npm run dev` → `http://localhost:5173`).

## Test URL

Local dev: `http://localhost:5173/topics/<subject-slug>/<topicId>?gate=1`  
(Replace with a topic that has `prerequisites` satisfied for the learner, lists “Membuka topik baru”, and mastery below 70% after at least one completed session.)
