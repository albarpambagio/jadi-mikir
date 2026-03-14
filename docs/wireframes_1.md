# JadiMikir — Desktop Wireframes

ASCII wireframes for all 16 screens. Desktop only.

---

## Screen 1 — Home / Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                                          [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Selamat datang kembali!                                                         │
│  ─────────────────────────────────────────────────────────────                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  🔥 Streak   │  │  ⭐ XP Total │  │  Topics Done │  │ Due Today    │        │
│  │   12 days    │  │   4,820 xp   │  │   18 / 42    │  │  14 cards    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                                  │
│  ── Today's Session ───────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  [▶  Start Review Session]   14 due cards across 5 topics               │    │
│  │  ────────────────────────────────────────────────────────────────────   │    │
│  │  [+  Start New Topic]        Browse all topics in skill tree            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Continue Learning ─────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Sistem Persamaan Linear               │  │  Trigonometri Dasar            │ │
│  │  ████████████░░░░░░  62%               │  │  ██░░░░░░░░░░░░░░░░  12%       │ │
│  │  Mastery: In Progress  · 8 due         │  │  Mastery: Just started         │ │
│  │  [Continue →]                          │  │  [Start →]                     │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Bilangan Bulat ✓                      │  │  Faktorisasi Prima              │ │
│  │  ████████████████████  100%            │  │  ████████████░░░░░░  58%        │ │
│  │  Mastery: Completed  · Review in 4d    │  │  Mastery: In Progress  · 3 due  │ │
│  │  [Review →]                            │  │  [Continue →]                   │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│  [View Skill Tree →]                               [View All Topics →]          │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Stat cards: streak, XP, mastery count, due today
- **B** Primary CTA always visible above fold
- **C** Topic cards show progress bar + mastery state + due count
- **D** No account / login UI — fully local

---

## Screen 2 — Active Question Session

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Sistem Persamaan Linear                     Question 7 of ~20        │
│  Progress: ████████████████░░░░░░░░░░░░░░  7 / 20          [Quit session]       │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Topic tag: [Substitution Method]   Difficulty: ●●○○○                           │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │  Diberikan sistem persamaan berikut:                                    │    │
│  │                                                                         │    │
│  │       2x + y = 7                                                        │    │
│  │       x − y  = 2                                                        │    │
│  │                                                                         │    │
│  │  Berapakah nilai x?                                                     │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  A  x = 1                                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  B  x = 2                                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  C  x = 3  ◀ selected                                                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  D  x = 4                                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│                                               [Confirm Answer →]                │
│                                                                                  │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │
│  Session mix:  [Substitution] [Elimination] [Word Problems]  ← interleaved      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Progress bar = session progress, not global mastery
- **B** Topic tag shows which subtopic this card belongs to
- **C** Choices randomized on each render (SKILL 6)
- **D** Session mix footer shows interleaving is active

---

## Screen 3 — Answer Feedback

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Sistem Persamaan Linear                     Question 7 of ~20        │
│  Progress: ████████████████░░░░░░░░░░░░░░  7 / 20                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ✓  Correct!   +50 XP                                        Time: 12s          │
│  ══════════════════════════════════════════════════════════════════════════       │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  2x + y = 7  ,  x − y = 2                                              │    │
│  │  Berapakah nilai x?                                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  A  x = 1    Why wrong: Hanya menyelesaikan persamaan pertama saja      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  B  x = 2    Why wrong: Menukar nilai x dan y                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────── ✓ correct ────┐      │
│  │  C  x = 3   ← Your answer                                              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  D  x = 4    Why wrong: Salah dalam langkah eliminasi                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Penjelasan:  Tambahkan kedua persamaan: (2x+y) + (x-y) = 7+2          │    │
│  │  → 3x = 9 → x = 3. Substitusi kembali untuk memeriksa.                │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│                                                   [Next Question →]             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Distractor-specific explanations per wrong choice (content validation)
- **B** Response time tracked for automaticity signals (FSRS)
- **C** XP awarded immediately with feedback

---

## Screen 4 — Knowledge Graph / Skill Tree

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Skill Tree: Matematika SMP                   [Zoom: −  ○  +]         │
│  Legend:  ◆ Mastered  ● In Progress  ○ Available  ○̶ Locked                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│    ┌────────────────────────────────────────────────────────────────────┐        │
│    │                         ◆ Bilangan Bulat                           │        │
│    │                           (Mastered)                               │        │
│    └────────────────┬───────────────────────┬───────────────────────────┘        │
│                     │                       │                                    │
│         ┌───────────▼──────────┐   ┌────────▼─────────────┐                    │
│         │  ◆ Faktorisasi Prima │   │  ● Pecahan & Desimal │                    │
│         │     (Mastered)       │   │    (In Progress 58%) │                    │
│         └───────────┬──────────┘   └────────┬─────────────┘                    │
│                     │                       │                                    │
│         ┌───────────▼──────────┐   ┌────────▼─────────────┐                    │
│         │  ● Pangkat & Akar    │   │  ○ Perbandingan       │                   │
│         │    (Available)       │   │    (Available)        │                   │
│         └───────────┬──────────┘   └────────┬─────────────┘                    │
│                     │                       │                                    │
│                     └──────────┬────────────┘                                   │
│                                │                                                 │
│                     ┌──────────▼───────────┐                                    │
│                     │  ● Sistem Persamaan  │                                    │
│                     │    Linear            │                                    │
│                     │    (In Progress 62%) │                                    │
│                     └──────────┬───────────┘                                    │
│                                │                                                 │
│                     ┌──────────▼───────────┐                                    │
│                     │  ○̶  Trigonometri      │                                   │
│                     │    Locked: needs      │                                   │
│                     │    Pangkat & Akar ✗  │                                   │
│                     └──────────────────────┘                                    │
│                                                                                  │
│  Selected: Sistem Persamaan Linear                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Progress: 62%  ·  8 cards due  ·  Prereqs: ✓ Faktorisasi, ✓ Pangkat  │    │
│  │  [Continue Session →]              [View Details]                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Node states encoded visually: ◆ mastered, ● active, ○ unlocked, ○̶ locked
- **B** Locked nodes show which prerequisite is blocking
- **C** Selected node expands a detail panel inline at bottom
- **D** Zoom controls for large topic graphs

---

## Screen 5 — Remediation Drill

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Session                                                               │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  ⚠  Prerequisite gap detected                                          │    │
│  │                                                                         │    │
│  │  You missed 3 questions that rely on  Faktorisasi Prima.                │    │
│  │  A short drill will help close this gap before continuing.             │    │
│  │                                                                         │    │
│  │  Estimated: ~5 minutes  ·  8 targeted questions                        │    │
│  │                                                                         │    │
│  │  [Start Remediation Drill]           [Skip for now]                    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Drill in progress ─────────────────────────────────────────────────────     │
│                                                                                  │
│  Faktorisasi Prima · Question 3 of 8         ████████░░░░░░░░  3/8             │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Faktorisasi prima dari 60 adalah ...                                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │  A  2² × 3 × 5      │  │  B  2 × 3 × 5       │  │  C  2³ × 3          │     │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘     │
│  ┌─────────────────────┐                                                        │
│  │  D  2² × 15         │                                                        │
│  └─────────────────────┘                                                        │
│                                                                                  │
│  After drill: you'll return to Sistem Persamaan Linear, question 7.             │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** FIRe (SKILL 10) triggers this mid-session, non-interruptive framing
- **B** User sees why the drill is happening — not punitive, explanatory
- **C** Skip option preserves autonomy
- **D** Return breadcrumb keeps context

---

## Screen 6 — Progress Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back       Progress Dashboard                                                 │
│  Filter: [This Week ▾]   [All Topics ▾]                                         │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ── Summary ───────────────────────────────────────────────────────────────────  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Questions   │  │  Accuracy    │  │  XP Earned   │  │  Streak      │        │
│  │    247       │  │    78%       │  │   +1,240     │  │   12 days    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                                  │
│  ── Daily Activity ────────────────────────────────────────────────────────────  │
│                                                                                  │
│   Mon  ████████████████  42q                                                    │
│   Tue  ████████████████████████  61q                                            │
│   Wed  ████████  22q                                                            │
│   Thu  ████████████  33q                                                        │
│   Fri  ████████████████████  51q                                                │
│   Sat  ████████████  38q  ← today                                               │
│   Sun  ─                                                                        │
│                                                                                  │
│  ── Mastery by Topic ──────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Bilangan Bulat          ████████████████████  100%  ✓ Mastered        │    │
│  │  Faktorisasi Prima       ████████████████████  100%  ✓ Mastered        │    │
│  │  Sistem Persamaan Linear ████████████░░░░░░░░   62%  ● In Progress     │    │
│  │  Pecahan & Desimal       ██████████░░░░░░░░░░░  58%  ● In Progress     │    │
│  │  Pangkat & Akar          ████░░░░░░░░░░░░░░░░░  12%  ● Started         │    │
│  │  Perbandingan            ░░░░░░░░░░░░░░░░░░░░░   0%  ○ Available       │    │
│  │  Trigonometri            ░░░░░░░░░░░░░░░░░░░░░   0%  ○̶ Locked          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Retention Health ──────────────────────────────────────────────────────────  │
│  Cards mastered & retained at 30 days:  84%   ████████████████░░░░              │
│  Cards currently overdue:               2      [Review Now →]                   │
│                                                                                  │
│                        [Export My Data ↓]                                       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** ASCII bar chart — no charting library needed at MVP
- **B** Retention health row shows FSRS working, surfaces overdue cards
- **C** Export CTA placed prominently to reinforce data ownership message
- **D** Filter by period / topic for Phase 2

---

## Screen 7 — First Launch / Onboarding (Step 1 of 3)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                              JadiMikir                                          │
│                                                                                  │
│          Belajar lebih cerdas. Tanpa akun. Tanpa server.                        │
│          ──────────────────────────────────────────────                          │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                         │   │
│   │   🔒  Semua data tersimpan di perangkat kamu sendiri                   │   │
│   │       Tidak ada akun. Tidak ada data yang dikirim ke server.            │   │
│   │                                                                         │   │
│   │   🧠  Belajar seperti punya tutor pribadi                              │   │
│   │       Algoritma FSRS menyesuaikan jadwal belajar dengan pemahamanmu.   │   │
│   │                                                                         │   │
│   │   📈  Lihat kemajuan nyata                                             │   │
│   │       Mastery gates, XP, dan streak membuat progres terasa nyata.      │   │
│   │                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Step  ● ○ ○                                                                   │
│                                                                                  │
│                                           [Mulai →]                             │
│                                                                                  │
│   ─────────────────────────────────────────────────────────────────────────     │
│   Sudah punya data?  [Import backup file]                                       │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Privacy message on very first screen — sets expectation before any interaction
- **B** Import option for returning users who cleared storage or switched devices
- **C** No email, no password, no "agree to terms" — intentionally absent

---

## Screen 8 — Onboarding Step 2: Choose Subject Track

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Pilih topik yang ingin kamu pelajari                      Step  ○ ● ○         │
│   ─────────────────────────────────────────────────────────────────────────      │
│   Kamu bisa ganti ini kapan saja.                                                │
│                                                                                  │
│   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐    │
│   │  📐  Matematika SMP             │   │  🔬  IPA SMP                    │    │
│   │      Aljabar, geometri,         │   │      Fisika, kimia, biologi      │    │
│   │      trigonometri               │   │      dasar                       │    │
│   │                                 │   │                                  │    │
│   │      42 topics · 860 cards      │   │      38 topics · 720 cards       │    │
│   └─────────────────────────────────┘   └─────────────────────────────────┘    │
│                                                                                  │
│   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐    │
│   │  📝  Bahasa Indonesia           │   │  🌐  Bahasa Inggris             │    │
│   │      Tata bahasa, ejaan,        │   │      Grammar, vocabulary,        │    │
│   │      menulis efektif            │   │      reading comprehension       │    │
│   │                                 │   │                                  │    │
│   │      29 topics · 510 cards      │   │      35 topics · 680 cards       │    │
│   └─────────────────────────────────┘   └─────────────────────────────────┘    │
│                                                                                  │
│   ← Back                                          [Lanjut →]                   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Phase 3 feature surfaced here — multiple subject tracks
- **B** Card count gives learner a sense of scope before committing
- **C** Single select, tappable card — no dropdowns

---

## Screen 9 — Onboarding Step 3: Diagnostic Placement (SKILL 7)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Tes Penempatan Singkat                                    Step  ○ ○ ●         │
│   ─────────────────────────────────────────────────────────────────────────      │
│   Jawab beberapa soal supaya kami bisa melewati topik yang sudah kamu kuasai.   │
│   Hanya ~5 menit. Tidak ada nilai jelek — ini hanya untuk menghemat waktumu.   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Progress: ████████░░░░░░░░░░░░░░░░  4 / 15 diagnostic questions       │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Hasil dari  3² + 4²  adalah ...                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  A  14                                                                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  B  25  ◀ selected                                                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  C  49                                                                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  D  7                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ← Back                [Skip placement test]          [Confirm →]               │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Framing is time-saving, not evaluative — reduces test anxiety
- **B** Skip option available — no gate forcing the diagnostic
- **C** Adaptive: questions branch based on answers, stops early when level is clear

---

## Screen 10 — Diagnostic Results & Starting Point

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Tes selesai!  Ini titik mulaimu:                                               │
│   ─────────────────────────────────────────────────────────────────────────      │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Sudah dikuasai (dilewati)        Akan dipelajari                       │   │
│   │  ───────────────────────────      ──────────────────────────────────    │   │
│   │  ✓ Bilangan Bulat                 → Faktorisasi Prima       (start)     │   │
│   │  ✓ Operasi Dasar                  → Pangkat & Akar                      │   │
│   │  ✓ FPB & KPK                      → Pecahan & Desimal                   │   │
│   │                                   → Sistem Persamaan Linear             │   │
│   │  3 topics skipped · ~60 cards     → … 38 more topics                   │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Estimasi untuk mencapai mastery seluruh track:  ~6–8 minggu (20 min/hari)    │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Preferensi sesi harian                                                 │   │
│   │  Berapa menit per sesi?                                                 │   │
│   │  [10 min]  [20 min ✓]  [30 min]  [Custom]                              │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│                              [Mulai Belajar →]                                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Shows exactly what was skipped and why — transparency builds trust
- **B** Rough time estimate sets expectations without false precision
- **C** Session length preference stored locally, affects scheduler

---

## Screen 11 — Session Complete

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Sesi selesai! 🎉                                                               │
│   ─────────────────────────────────────────────────────────────────────────      │
│                                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │  Questions   │  │  Accuracy    │  │  XP Earned   │  │  Time Spent  │       │
│   │    22        │  │    86%       │  │   +310 xp    │  │   18 min     │       │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                                  │
│   🔥 Streak: 12 days → 13 days!   [██████████████████████░░  13/30 streak]     │
│                                                                                  │
│   ── Topic Progress This Session ─────────────────────────────────────────────  │
│   Sistem Persamaan Linear    62% → 74%   ████████████████░░░░  +12%            │
│   Faktorisasi Prima         100%         ████████████████████  ✓ still sharp   │
│   Pecahan & Desimal          44% → 58%   ███████████░░░░░░░░░  +14%            │
│                                                                                  │
│   ── Next Due ─────────────────────────────────────────────────────────────────  │
│   Next review available:  Tomorrow, 09.00                                       │
│   Topics:  Sistem Persamaan Linear (6 cards) · Pecahan & Desimal (3 cards)     │
│                                                                                  │
│   ── Weak Areas ───────────────────────────────────────────────────────────────  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  You missed 3/4 questions on:  Substitution Method                     │   │
│   │  [Practice this subtopic now]              [Remind me next session]    │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   [Back to Home]                               [Another Session →]              │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Progress delta (62% → 74%) makes single-session gains feel tangible
- **B** Streak milestone celebrated inline without a modal interrupt
- **C** Weak areas surface a targeted practice CTA — voluntary, not forced
- **D** Next due time manages expectations, reinforces FSRS scheduling

---

## Screen 12 — Topic Detail View

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Skill Tree     Sistem Persamaan Linear                                        │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  Mastery   ████████████████░░░░░░  74%    Status: In Progress             │  │
│  │  Cards     48 total · 8 due now · 12 upcoming · 28 mastered               │  │
│  │  Prereqs   ✓ Faktorisasi Prima     ✓ Pangkat & Akar                       │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ── Subtopics ─────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Subtopic                    Cards   Accuracy   Status                  │    │
│  │  ─────────────────────────────────────────────────────────────────────  │    │
│  │  Metode Substitusi            12      91%        ✓ Strong               │    │
│  │  Metode Eliminasi             12      63%        ⚠ Needs work           │    │
│  │  Metode Grafik                 8      78%        ● OK                   │    │
│  │  Soal Cerita (Word Problems)  16      55%        ⚠ Needs work           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Cards Breakdown ───────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  New (unseen)       ░░░░░░░░░░  0                                       │    │
│  │  Learning           ████░░░░░░  8   [Review now →]                      │    │
│  │  Mastered           ████████░░  28                                       │    │
│  │  Due for review     ████░░░░░░  8   ← includes 5 from Eliminasi         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Unlocks ───────────────────────────────────────────────────────────────────  │
│  Mastering this topic unlocks:  Trigonometri Dasar  ·  Persamaan Kuadrat        │
│                                                                                  │
│  [Start Session →]          [Drill weak subtopics →]          [Reset topic]     │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Subtopic accuracy table shows where the weakness actually lives
- **B** "Unlocks" row makes the skill tree dependency tangible at topic level
- **C** Reset topic available — gives learner full control over local data
- **D** Drill weak subtopics CTA connects directly to remediation flow

---

## Screen 13 — Settings

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Settings                                                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ── Study Preferences ─────────────────────────────────────────────────────────  │
│                                                                                  │
│  Target session length        [10 min]  [20 min ✓]  [30 min]  [Custom: ___]    │
│  Daily reminder               [Off ✓]  [On → set time: 19:00 ]                 │
│  New cards per session        [5]  [10 ✓]  [15]  [No limit]                    │
│  Show difficulty label        [● On ✓]        [○ Off]                           │
│  Show response timer          [● On ✓]        [○ Off]                           │
│                                                                                  │
│  ── Mastery Settings ──────────────────────────────────────────────────────────  │
│                                                                                  │
│  Mastery gate threshold       [60%]  [70% ✓]  [80%]  [90%]                     │
│  Remediation trigger          [● Auto — trigger on 2 consecutive misses ✓]      │
│                               [○ Manual — I'll choose when to drill]            │
│  Interleaving                 [● On ✓ — mix topics each session]                │
│                               [○ Off — focus one topic at a time]               │
│                                                                                  │
│  ── Data & Privacy ────────────────────────────────────────────────────────────  │
│                                                                                  │
│  All data stored in           Browser localStorage / IndexedDB (this device)    │
│  Storage used                 1.2 MB of ~10 MB available                        │
│                                                                                  │
│  [Export all data as JSON ↓]                                                    │
│  [Import backup file ↑]                                                         │
│  [Clear all data ⚠]          ← requires confirmation                           │
│                                                                                  │
│  ── About ─────────────────────────────────────────────────────────────────────  │
│  JadiMikir v0.1.0   ·   Local-only   ·   No account required                   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Mastery gate threshold is tunable — not punitive by default
- **B** Storage usage shown in plain terms — manages localStorage anxiety
- **C** Interleaving toggle respects learner agency even if suboptimal
- **D** Clear all data requires confirmation — destructive action, local only

---

## Screen 14 — Export & Data Portability

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Settings    Data Export                                                       │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  Data kamu tersimpan 100% di perangkat ini. Ekspor untuk backup atau pindah     │
│  ke perangkat lain.                                                              │
│                                                                                  │
│  ── What's included ───────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  ✓  All FSRS card states & review history                               │    │
│  │  ✓  XP, streak, and mastery scores                                      │    │
│  │  ✓  Topic progress & diagnostic results                                 │    │
│  │  ✓  All settings & preferences                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Export ────────────────────────────────────────────────────────────────────  │
│  Format:   [● JSON (full backup) ✓]    [○ CSV (progress summary only)]          │
│                                                                                  │
│  File name:  jadimikir-backup-2025-01-18.json                                   │
│                                                                                  │
│  [Download Backup ↓]                                                            │
│                                                                                  │
│  ── Import ────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │   [  Drop backup file here, or click to browse  ]                       │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ⚠  Importing will overwrite your current data. This cannot be undone.          │
│  [ ] I understand — replace current data with backup                            │
│                                                                                  │
│  [Import]  (disabled until checkbox checked)                                    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Explicit inventory of what's exported — builds trust in the data model
- **B** CSV option for learners who want to inspect progress in a spreadsheet
- **C** Destructive import gated behind explicit checkbox — not just a confirm modal

---

## Screen 15 — Empty State (First Launch)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                                          [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│                          Selamat datang di JadiMikir!                           │
│                                                                                  │
│                    Kamu belum punya sesi belajar. Mulai dari sini:              │
│                                                                                  │
│             ┌─────────────────────────────────────────────────────┐             │
│             │                                                     │             │
│             │   Matematika SMP                                    │             │
│             │   42 topics · 860 cards                             │             │
│             │                                                     │             │
│             │   [▶  Mulai Belajar — ambil tes penempatan singkat] │             │
│             │                                                     │             │
│             │   [  Skip tes, mulai dari awal]                     │             │
│             │                                                     │             │
│             └─────────────────────────────────────────────────────┘             │
│                                                                                  │
│                      [Ganti subjek  ↕]                                          │
│                                                                                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Empty state is focused — one primary action, no noise
- **B** Diagnostic is the recommended path but not forced
- **C** Subject track change accessible if onboarding choice needs revisiting

---

## Screen 16 — Mastery Gate: Topic Locked Pending Final Review

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Sistem Persamaan Linear                                               │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │   🏆  Hampir selesai!                                                   │    │
│  │                                                                         │    │
│  │   Kamu sudah menjawab semua kartu setidaknya sekali.                    │    │
│  │   Untuk membuka kunci topik berikutnya, kamu perlu mencapai             │    │
│  │   70% mastery score di sesi review terakhir.                            │    │
│  │                                                                         │    │
│  │   Mastery sekarang:   ████████████████░░░░  64%    (butuh 70%)         │    │
│  │                                                                         │    │
│  │   Kartu yang masih perlu diperkuat:  8 cards                           │    │
│  │   Topik terlemah:  Metode Eliminasi (63%)  ·  Soal Cerita (55%)        │    │
│  │                                                                         │    │
│  │   [Lanjutkan Review →]          [Drill Metode Eliminasi dulu]          │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│   Kenapa mastery gate ini ada?                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Topik-topik selanjutnya (Trigonometri, Persamaan Kuadrat) membutuhkan │   │
│   │  pemahaman solid di sini. Melanjutkan terlalu cepat biasanya           │   │
│   │  menyebabkan frustasi di depan. Sedikit sabar sekarang = jauh          │   │
│   │  lebih mudah nanti.                                                    │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Mastery gate explained, not just enforced — "why" panel always visible
- **B** Shows exact gap (64% vs 70%) so the finish line is concrete
- **C** Pinpoints weakest subtopics so learner drills the right thing
- **D** Two paths: continue general review OR targeted drill — learner chooses
