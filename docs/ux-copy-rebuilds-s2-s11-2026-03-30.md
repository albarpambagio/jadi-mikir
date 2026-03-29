# UX Copy: Rebuilt screens S2, S3, S6, S11

**Date**: 2026-03-30  
**Context**: Wireframe v2 alignment; learner locale Indonesian; shell/navigation may stay English until full i18n.

## Language strategy

- **Learner-facing flows** (session answering, feedback, session complete, progress body): **Indonesian** — matches wireframes and overdue/schedule copy already shipped.
- **App chrome** (layout nav): unchanged in this pass; progress page title/back aligned to Indonesian for consistency with this screen.

---

## UX Copy: Session (S2–S3)

### Recommended Copy

| Element | Copy |
|---------|------|
| Stem section label | Soal |
| Difficulty | Mudah / Sedang / Sulit · N/5 |
| Confirm CTA | Konfirmasi jawaban |
| Quit button | Keluar sesi |
| Topic fallback | Sesi tinjauan |
| Loading | Memuat soal… |
| Error | Gagal memuat soal. |
| Error CTA | Kembali |
| Empty | Tidak ada soal untuk sesi ini. |
| Session mix footer | Topik dalam sesi ini |
| Skeleton | Memuat ringkasan sesi… (aria-label) |

### Alternatives

| Option | Copy | Tone | Best For |
|--------|------|------|----------|
| A | Konfirmasi | Shorter | Tight mobile |
| B | Lanjutkan setelah pilih jawaban | Descriptive | First-time users |

### Rationale

Verbs first (*Konfirmasi*), outcome clear (*Keluar sesi*), errors state fact + exit (*Kembali*).

### Localization Notes

Keep `XP` as-is; `Q` counter already universal.

---

## UX Copy: Progress (S6)

### Recommended Copy

| Element | Copy |
|---------|------|
| Page title | Dashboard progres |
| Back | Kembali |
| Summary (section) | Ringkasan |
| Empty summary | Selesaikan sesi pertama untuk melihat statistik di sini. |
| Empty CTA | Mulai sesi |
| Stat labels | Pertanyaan, Akurasi, XP diperoleh, Streak |
| Streak unit | hari |
| Mastery section | Penguasaan per topik |
| Loading | Memuat topik… |
| Empty topics | Belum ada topik yang dimulai. |
| Retention | Kesehatan retensi |
| Retained label | Kartu yang diingat setelah 30 hari |
| Overdue (retention line) | Kartu terlambat saat ini |
| Topic line due | jatuh tempo (replace "due") |
| Export | Ekspor data saya |

### Rationale

Matches wireframe S6 section names; single language on page reduces confusion with *Kartu perlu ditinjau*.

### Localization Notes

"Dashboard progres" — acceptable loanword; alternative *Ringkasan progres* for title if preferred later.

---

## UX Copy: Session complete (S11)

### Recommended Copy

| Element | Copy |
|---------|------|
| Eyebrow | Sesi selesai |
| Multi-topic h1 | Hasilmu |
| Stats | Pertanyaan, Akurasi, XP, Waktu |
| XP unit | xp (lowercase per TECH_STACK) |
| Streak sublabel | Tujuan: {after}/{goal} hari |
| Topic section | Progres topik sesi ini |
| Row meta | benar di sesi ini · Keseluruhan N% |
| Weak headline (body) | Kamu melewatkan {missed}/{total} soal pada: |
| Weak primary CTA | Latihan area ini sekarang |
| Weak secondary | Ingatkan di sesi berikutnya |
| Footer primary | Kembali ke beranda |
| Footer secondary | (keep) Tinjau lebih lanjut |
| Band messages | Indonesian equivalents of PERFORMANCE_BANDS |
| Time | `< 1 mnt` / `N mnt` |

### Alternatives

| Option | Copy | Best For |
|--------|------|----------|
| A | Hasil sesi | More formal h1 multi-topic |
| B | Ringkasan sesi | Neutral |

### Rationale

Wireframe S11 uses *Sesi selesai!*, *Area lemah*, *Jadwal berikutnya* — completed bands and weak area in Indonesian complete the story.

### Localization Notes

Performance band strings are short; avoid literal translation that sounds stiff — friendly, second person *kamu* where wireframe uses it.
