# Topic detail (S12) — UX pass (2026-03-29)

Post-implementation review against [wireframe Screen 12](../archives/wireframes_1.md) and learner flows.

## Implemented

- Route `/topics/:subject/:topicId` with slug correction when the subject segment is wrong.
- Back link to `/topics/:subject` (dynamic).
- Summary: mastery bar, status (ID), FSRS card line, prereq / Butuh lines aligned with list screen.
- Subtopic table from question tags; accuracy from `reviewLogs` (good/easy vs attempts).
- Unlocks: topics that list this topic as prerequisite; Lihat + Mulai.
- Primary CTAs: Mulai sesi, Latih subtopik lemah (disabled when no weak subtopic).
- Reset topic + confirmation copy (ID) wired to `learnerActions.resetTopic`.
- Session supports `?tag=` to filter questions (fallback to full set if filter empty).

## Notes / follow-ups (non-blocking)

- **Subtopic accuracy**: Depends on review logs; the Vite session UI may not persist FSRS cards on every path, so accuracy can stay “—” until logs exist.
- **Home topic card**: Two actions (*Detail topik* + session) add density; acceptable for discoverability; revisit if home feels busy.
- **Figma**: No linked file in CONTEXT — visuals follow existing tokens + wireframe ASCII.

## Severity

No Critical issues identified in static review; validate in browser after `npm run dev`.
