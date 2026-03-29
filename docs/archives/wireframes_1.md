# JadiMikir — Desktop Wireframes (v2, revised 2026-03-29)

ASCII wireframes for all 18 screens. Desktop reference only.
**Mobile (390px) variants are required for all screens — flagged as Phase-next design work. See Section 19.**

> Revision notes: all Critical/High/Medium issues from the 2026-03-29 critique have been addressed inline.
> Previous version archived; diff tracked in git history.

---

## Screen 1 — Home / Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                                          [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Selamat datang kembali!                                                         │
│  ─────────────────────────────────────────────────────────                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Streak      │  │  XP Total    │  │  Mastered    │  │  Due Today   │        │
│  │  12 days     │  │  4,820 xp    │  │  18 / 42     │  │  14 cards    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│  [Flame icon]        [Star icon]       topics            cards                  │
│                                                                                  │
│  ── Today's Session ───────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  [▶  Start Review Session]   ← PRIMARY button (bg-primary)             │    │
│  │  14 due cards across 5 topics                                           │    │
│  │  ─────────────────────────────────────────────────────────────────────  │    │
│  │  [Browse Topics]             ← GHOST button (border only)              │    │
│  │  Find a new topic to start learning                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Continue Learning ─────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Sistem Persamaan Linear               │  │  Trigonometri Dasar            │ │
│  │  ████████████░░░░░░  62%               │  │  ██░░░░░░░░░░░░░░░░  12%       │ │
│  │  In Progress  · 8 due                  │  │  Just started                  │ │
│  │  [Continue →]                          │  │  [Start →]                     │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Bilangan Bulat  ✓ Mastered            │  │  Faktorisasi Prima              │ │
│  │  ████████████████████  100%            │  │  ████████████░░░░░░  58%        │ │
│  │  Review in 4 days                      │  │  In Progress  · 3 due           │ │
│  │  [Review →]                            │  │  [Continue →]                   │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│                                                  [View All Topics →]            │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Stat cards: streak, XP, mastered topics count (label "Mastered" not "Topics Done"), due today
- **B** Stat card icons: use Lucide icons (Flame, Star, BookOpen, Clock) — no emoji
- **C** Today's Session: primary action is a full `bg-primary` button; secondary is a ghost/border button — never equal visual weight
- **D** "View Skill Tree →" removed — deferred until 50+ questions; replaced with single "View All Topics →"
- **E** Topic cards show mastery status text (In Progress / Just started / Mastered) — not emoji

---

## Screen 2 — Active Question Session

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Sistem Persamaan Linear           Q 07 / 20          [Quit session ×]           │
│  Progress: ████████████████░░░░░░░░░░░░░░  7 / 20                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Topic tag: [Substitution Method]   Difficulty: ●●○○○  Easy · 2/5               │
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

**Quit session confirm dialog (shown on [Quit session ×] click):**
```
┌──────────────────────────────────────────────────┐
│  Keluar sesi?                                     │
│  Progress sesi ini tidak disimpan.               │
│                                                   │
│  [Lanjutkan sesi]    [Ya, keluar]                │
└──────────────────────────────────────────────────┘
```

**Annotations**
- **A** "← Back" removed from header — only [Quit session ×] exists for leaving; it triggers a confirm dialog
- **B** Question counter uses `StepCounter` pattern: "Q 07 / 20" (monospace, zero-padded) — no tilde approximation
- **C** Difficulty shows both dots AND a text label: "Easy · 2/5" — never dots alone
- **D** Progress bar = session progress only; stat cards are hidden during session to reduce distraction
- **E** All 4 choices are full-width vertical rows — this layout is fixed across all question types (S2, S5, S9)

---

## Screen 3 — Answer Feedback

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Sistem Persamaan Linear           Q 07 / 20                                     │
│  Progress: ████████████████░░░░░░░░░░░░░░  7 / 20                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ✓  Jawaban benar!   +50 XP                                                      │
│  ══════════════════════════════════════════════════════════════════════════       │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  2x + y = 7  ,  x − y = 2                                              │    │
│  │  Berapakah nilai x?                                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  A  x = 1                                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  B  x = 2                                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────── ✓ Jawaban kamu · Benar ───┐      │
│  │  C  x = 3                                                              │     │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  D  x = 4                                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Penjelasan:  Tambahkan kedua persamaan: (2x+y) + (x-y) = 7+2          │    │
│  │  → 3x = 9 → x = 3. Substitusi kembali untuk memeriksa: y = 1.         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│                                                   [Pertanyaan berikutnya →]     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Wrong answer variant (choice A selected):**
```
│  ✗  Belum tepat.                                                                 │
│  ══════════════════════════════════════════════════════════════════════════       │
│  ┌──────────────────────────────────────────── ✗ Jawaban kamu ──────────┐       │
│  │  A  x = 1                                                              │      │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────── ✓ Jawaban benar ─────────┐       │
│  │  C  x = 3                                                              │      │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  (choices B and D shown in default/neutral state)                                │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Penjelasan:  Tambahkan kedua persamaan: 3x = 9 → x = 3.              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
```

**Annotations**
- **A** Per-distractor "Why wrong" labels removed — only the correct answer is highlighted, wrong answer is marked, one explanation panel shown
- **B** Response time ("Time: 12s") removed from UI — this is an internal FSRS automaticity signal, not a user-facing metric
- **C** All 4 choices use the same full-width row format; only end-of-row label changes (✓ Benar / ✗ Jawaban kamu / neutral)
- **D** Correct answer: success-colored left border. Wrong answer selected: error-colored left border. Others: neutral. No per-choice text explanations.

---

## Screen 4 — Knowledge Graph / Skill Tree *(Deferred)*

> **Status: DEFERRED.** This screen is not built until the content library reaches 50+ questions per topic across at least 8 topics. Navigation CTAs pointing to this screen are hidden in all other screens until the threshold is met.

**Stub state shown when a learner navigates to /skill-tree before threshold:**

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Skill Tree                                                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│                    [NetworkIcon — large, muted]                                  │
│                                                                                  │
│                    Skill Tree belum tersedia                                     │
│                                                                                  │
│                    Fitur ini akan muncul setelah kamu menyelesaikan             │
│                    lebih banyak topik. Terus belajar!                           │
│                                                                                  │
│                    [Lihat Daftar Topik →]                                       │
│                                                                                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Full skill tree wireframe (for future implementation):**

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
│  Selected node → opens Topic Detail (Screen 12) as a side panel or navigation  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** "View Skill Tree →" links removed from S1, S17, S18 until threshold is met — replaced with "View All Topics →"
- **B** Selected node navigates to Screen 12 (Topic Detail) — no duplicate inline panel
- **C** Mobile version requires different interaction model (no zoom+pan canvas) — to be designed separately

---

## Screen 5 — Remediation Drill

### 5a — Gate Prompt (separate screen)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Kembali ke sesi    Sistem Persamaan Linear · Soal 7 dari 20                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │  [AlertTriangle icon]  Ada celah yang perlu ditutup                    │    │
│  │                                                                         │    │
│  │  Kamu melewatkan 3 soal yang mengandalkan  Faktorisasi Prima.           │    │
│  │  Latihan singkat ini akan membantu sebelum kamu lanjut.                │    │
│  │                                                                         │    │
│  │  Perkiraan: ~5 menit  ·  8 soal terarah                               │    │
│  │                                                                         │    │
│  │  [Mulai Latihan Singkat]           [Lewati untuk sekarang]             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 5b — Drill In Progress (separate screen)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Latihan: Faktorisasi Prima          Q 03 / 08          [Keluar latihan]         │
│  Progress: ████████░░░░░░░░  3 / 8                                               │
│                                                                                  │
│  Konteks: Setelah latihan ini, kamu kembali ke Sistem Persamaan Linear, soal 7. │
│  ─────────────────────────────────────────────────────────────────────────────   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Topic tag: [Faktorisasi Prima]   Difficulty: ●●○○○  Easy · 2/5                 │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Faktorisasi prima dari 60 adalah ...                                   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  A  2² × 3 × 5                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  B  2 × 3 × 5                                                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  C  2³ × 3                                                              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  D  2² × 15                                                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│                                               [Confirm Answer →]                │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** 5a and 5b are separate screens — not stacked on one wireframe. The gate prompt fires first; drill begins after confirmation.
- **B** Choice layout: 4 full-width vertical rows — identical to S2. No 3-column layout for any question type.
- **C** Parent session context is shown as a persistent breadcrumb/note at the top of 5b — not just a footer afterthought
- **D** "Skip for now" on 5a preserves autonomy; learner resumes the parent session at question 7 immediately

---

## Screen 6 — Progress Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back       Progress Dashboard                                                 │
│  Filter: [This Week ▾]   [All Topics ▾]                                         │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ── Kartu Perlu Ditinjau ─────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  [AlertCircle icon]  2 kartu sudah jatuh tempo                          │    │
│  │  Tinjau sekarang untuk menjaga retensi memorimu.                        │    │
│  │                                                       [Tinjau Sekarang →] │   │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Summary ───────────────────────────────────────────────────────────────────  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Pertanyaan  │  │  Akurasi     │  │  XP          │  │  Streak      │        │
│  │    247       │  │    78%       │  │   +1,240     │  │   12 hari    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                                  │
│  ── Aktivitas Harian ──────────────────────────────────────────────────────────  │
│  (bar chart component — no charting library required; use styled div bars)      │
│   Sen  ████████████████  42q                                                    │
│   Sel  ████████████████████████  61q                                            │
│   Rab  ████████  22q                                                            │
│   Kam  ████████████  33q                                                        │
│   Jum  ████████████████████  51q                                                │
│   Sab  ████████████  38q  ← today                                               │
│   Min  ─                                                                        │
│                                                                                  │
│  ── Mastery per Topik ─────────────────────────────────────────────────────────  │
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
│  ── Retensi ───────────────────────────────────────────────────────────────────  │
│  Kartu yang masih diingat setelah 30 hari:  84%   ████████████████░░░░          │
│                                                                                  │
│                        [Ekspor Data Saya ↓]                                     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Filtered state annotation:** filter controls ([This Week ▾] [All Topics ▾]) are Phase 2. In v1, show them as inactive/disabled with a "Segera hadir" tooltip if clicked. Filtered-state wireframe is TBD.

**Annotations**
- **A** Overdue-cards alert moved to TOP of screen — most urgent action, never buried
- **B** Summary stats use `StatDisplay` pattern (monospace value, labeled)
- **C** Bar chart is a styled div component — no third-party charting library
- **D** Retention health section merged into the bottom — it's context, not primary action
- **E** Export CTA at the bottom reinforces data ownership without disrupting the flow

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
│   │   [Lock icon]  Datamu milikmu sepenuhnya                               │   │
│   │       Tidak ada akun. Tidak ada data yang dikirim ke server.            │   │
│   │                                                                         │   │
│   │   [Brain icon]  Belajar seperti punya tutor pribadi                    │   │
│   │       Algoritma FSRS menyesuaikan jadwal belajar dengan pemahamanmu.   │   │
│   │                                                                         │   │
│   │   [TrendingUp icon]  Lihat kemajuan yang nyata                         │   │
│   │       Mastery, XP, dan streak membuat progres terasa berwujud.          │   │
│   │                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Step 1 dari 3  ● ○ ○                                                          │
│                                                                                  │
│                                           [Mulai →]                             │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** "Import backup file" removed — first-time users have no backup; this is moved to Settings → Data
- **B** Icons use Lucide React (Lock, Brain, TrendingUp) — no emoji
- **C** Step indicator has both text ("Step 1 dari 3") and dots — dots alone are insufficient for first-time users
- **D** No terms/agreements, no email field — intentionally absent

---

## Screen 8 — Onboarding Step 2: Choose Subject Track

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Pilih topik yang ingin kamu pelajari                   Step 2 dari 3  ○ ● ○  │
│   ─────────────────────────────────────────────────────────────────────────      │
│   Kamu bisa ganti ini kapan saja di Pengaturan.                                  │
│                                                                                  │
│   ┌─────────────────────────────────────────────┐                               │
│   │  [BookOpen icon]  Matematika SMP  ← Aktif   │  ← SELECTABLE, full border   │
│   │      Aljabar, geometri, trigonometri         │                               │
│   │      42 topik · 860 kartu                    │                               │
│   └─────────────────────────────────────────────┘                               │
│                                                                                  │
│   ┌─────────────────────────────────────────────┐                               │
│   │  [Microscope icon]  IPA SMP                 │  ← DISABLED (greyed)          │
│   │      Segera hadir                            │                               │
│   └─────────────────────────────────────────────┘                               │
│                                                                                  │
│   ┌─────────────────────────────────────────────┐                               │
│   │  [FileText icon]  Bahasa Indonesia           │  ← DISABLED (greyed)         │
│   │      Segera hadir                            │                               │
│   └─────────────────────────────────────────────┘                               │
│                                                                                  │
│   ┌─────────────────────────────────────────────┐                               │
│   │  [Globe icon]  Bahasa Inggris                │  ← DISABLED (greyed)         │
│   │      Segera hadir                            │                               │
│   └─────────────────────────────────────────────┘                               │
│                                                                                  │
│   ← Back                                          [Lanjut →]  (enabled: 1 selected) │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Only Matematika SMP is selectable — pre-selected by default. Other 3 subjects are greyed (opacity-50, pointer-events-none) with "Segera hadir" label — no false choice
- **B** [Lanjut →] is enabled because a selection exists (pre-selected). If the user deselects (edge case), button disables.
- **C** Cards are full-width stacked list (not 2×2 grid) — scales better to mobile when adapted

---

## Screen 9 — Onboarding Step 3: Diagnostic Placement

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Tes Penempatan Singkat                                  Step 3 dari 3  ○ ○ ● │
│   ─────────────────────────────────────────────────────────────────────────      │
│   Jawab beberapa soal supaya kami bisa melewati topik yang sudah kamu kuasai.  │
│   Hingga 15 soal · Adaptif · Berhenti lebih awal jika levelmu sudah jelas.     │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Progress: ████████░░░░░░░░░░░░░░░░  4 soal dijawab                    │   │
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
│                   Tidak ingin ikut tes?  [Lewati tes penempatan]                │
│                                                                                  │
│  ← Back                                                          [Konfirmasi →] │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**"Lewati tes" destination:** goes directly to Screen 10 with all topics in "Available" state (no skipping, no results breakdown).

**Annotations**
- **A** Three-button row replaced: only ← Back (left) and [Konfirmasi →] (right) in the footer
- **B** [Lewati tes penempatan] is a secondary text link placed above the footer — clearly secondary, not equal to Confirm
- **C** Progress bar shows "X soal dijawab" (not "X / 15") — adaptive early-stop means the total is not a fixed promise
- **D** Description clarifies "Hingga 15 soal · Adaptif" so learners know it may end early

---

## Screen 10 — Diagnostic Results & Starting Point

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Tes penempatan selesai!                                                        │
│   ─────────────────────────────────────────────────────────────────────────      │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  [CheckCircle icon — large]                                             │   │
│   │                                                                         │   │
│   │  Kamu bisa melewati 3 topik — menghemat sekitar 2 minggu belajar.      │   │
│   │  Ini titik mulaimu: Faktorisasi Prima                                   │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ── Detail penempatan ──────────────────────────────────────────────────────   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Sudah dikuasai (dilewati)        Akan dipelajari                       │   │
│   │  ───────────────────────────      ──────────────────────────────────    │   │
│   │  ✓ Bilangan Bulat                 → Faktorisasi Prima       (mulai)     │   │
│   │  ✓ Operasi Dasar                  → Pangkat & Akar                      │   │
│   │  ✓ FPB & KPK                      → Pecahan & Desimal                   │   │
│   │                                   → Sistem Persamaan Linear             │   │
│   │  3 topik dilewati                 → … 38 topik lainnya                  │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Estimasi untuk menguasai seluruh track: ~6–8 minggu (20 mnt/hari)            │
│   (dihitung berdasarkan hasil tes penempatan kamu)                              │
│                                                                                  │
│                              [Mulai Belajar →]                                  │
│                                                                                  │
│   Preferensi sesi harian dapat diubah kapan saja di [Pengaturan].              │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Screen opens with a celebration moment (CheckCircle icon + summary win) before the curriculum table
- **B** Session length preference removed from this screen — it belongs in Settings; a link to Settings is included at the bottom
- **C** Time estimate is labeled "(dihitung berdasarkan hasil tes penempatan kamu)" — not a static claim
- **D** Skip path (from S9) also lands here with: "Kamu memilih untuk mulai dari awal. Semua topik tersedia." and no skipped list

---

## Screen 11 — Session Complete

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Sesi selesai!                                                                  │
│   ─────────────────────────────────────────────────────────────────────────      │
│                                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │  Pertanyaan  │  │  Akurasi     │  │  XP          │  │  Waktu       │       │
│   │    22        │  │    86%       │  │   +310 xp    │  │   18 mnt     │       │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                                  │
│   [Flame icon]  Streak: 12 hari → 13 hari!                                      │
│   ████████████████████░░  13 / 30  ← Tujuan streak bulanan                      │
│   (30 hari adalah tujuan bawaan; dapat diubah di Pengaturan)                    │
│                                                                                  │
│   ── Progres Topik Sesi Ini ────────────────────────────────────────────────── │
│   Sistem Persamaan Linear    62% → 74%   ████████████████░░░░  +12%            │
│   Faktorisasi Prima         100%         ████████████████████  ✓ masih tajam   │
│   Pecahan & Desimal          44% → 58%   ███████████░░░░░░░░░  +14%            │
│                                                                                  │
│   ── Area Lemah ────────────────────────────────────────────────────────────── │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Kamu melewatkan 3/4 soal tentang:  Metode Substitusi                  │   │
│   │  [Latihan subtopik ini sekarang]         [Ingatkan di sesi berikutnya] │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ── Jadwal Berikutnya ─────────────────────────────────────────────────────── │
│   Review berikutnya:  Besok                                                      │
│   Topik:  Sistem Persamaan Linear (6 kartu) · Pecahan & Desimal (3 kartu)      │
│                                                                                  │
│   [Kembali ke Beranda]                    [Tinjau lebih lanjut →]               │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Emoji removed from heading — plain text, matches convention
- **B** Streak goal (30) annotated with source: default value, configurable in Settings
- **C** "Area Lemah" section moved ABOVE "Jadwal Berikutnya" — most actionable item, above the fold before CTAs
- **D** "Another Session →" renamed "Tinjau lebih lanjut →" (triggers another review of due cards)
- **E** Next due shows day only ("Besok") — no specific time (FSRS schedules by day, not exact time)
- **F** 5 sections maximum: stat cards, streak, topic progress, weak areas, next due + CTAs

---

## Screen 12 — Topic Detail View

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back     Sistem Persamaan Linear                                              │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  Mastery   ████████████████░░░░░░  74%    Status: In Progress             │  │
│  │  Kartu     48 total · 8 jatuh tempo · 12 mendatang · 28 mastered          │  │
│  │  Prasyarat  ✓ Faktorisasi Prima     ✓ Pangkat & Akar                      │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ── Subtopik ──────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Subtopik                    Kartu   Akurasi   Status                   │    │
│  │  ─────────────────────────────────────────────────────────────────────  │    │
│  │  Metode Substitusi            12      91%        ✓ Kuat                 │    │
│  │  Metode Eliminasi             12      63%        [AlertTriangle] Perlu latihan │
│  │  Metode Grafik                 8      78%        ● Oke                  │    │
│  │  Soal Cerita (Word Problems)  16      55%        [AlertTriangle] Perlu latihan │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Membuka Topik Baru ────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Menguasai topik ini membuka:                                           │    │
│  │  → Trigonometri Dasar  [Start →]    → Persamaan Kuadrat  [Preview →]   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  [Mulai Sesi →]          [Latih subtopik lemah →]                               │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  [Reset topik ⚠]  ← destructive: text-red border-red, requires confirm dialog  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Reset topic confirm dialog:**
```
┌──────────────────────────────────────────────────────┐
│  Reset topik ini?                                     │
│  Semua progres kartu FSRS akan dihapus permanen.     │
│  Tindakan ini tidak dapat dibatalkan.                │
│                                                       │
│  [Batal]              [Ya, reset]  ← text-red        │
└──────────────────────────────────────────────────────┘
```

**Annotations**
- **A** "Cards Breakdown" section removed — redundant with the header row (same numbers)
- **B** [Reset topik] is visually separated from primary CTAs: below a divider, styled as destructive (red border, red text), requires confirmation dialog
- **C** Breadcrumb is "← Back" (dynamic) — not hardcoded "← Skill Tree"
- **D** "Membuka Topik Baru" section is a full card, not inline text — more prominent, drives motivation
- **E** "Perlu latihan" status uses AlertTriangle Lucide icon instead of ⚠ character

---

## Screen 13 — Settings

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Pengaturan                                                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ── Preferensi Belajar ─────────────────────────────────────────────────────── │
│                                                                                  │
│  Target durasi sesi        [10 mnt]  [20 mnt ✓]  [30 mnt]  [Kustom: ___]      │
│  Kartu baru per sesi       [5]  [10 ✓]  [15]  [Tanpa batas]                   │
│  Tampilkan label kesulitan  [● Ya ✓]        [○ Tidak]                           │
│  Tampilkan timer jawaban    [● Ya ✓]        [○ Tidak]                           │
│  Pengingat harian          [● Aktif: 19:00]  [○ Nonaktif ✓]                    │
│  (Memerlukan izin notifikasi browser. Jika ditolak, pengingat tidak berfungsi.) │
│                                                                                  │
│  ── Pengaturan Mastery ─────────────────────────────────────────────────────── │
│                                                                                  │
│  Threshold mastery gate    [60%]  [70% ✓]  [80%]  [90%]                        │
│  (Ini adalah nilai yang harus dicapai untuk membuka topik berikutnya.          │
│   Pengaturan ini juga terlihat di layar Mastery Gate saat kamu mencapainya.)   │
│  Trigger remediasi         [● Otomatis — setelah 2 kali salah berturut ✓]      │
│                            [○ Manual — saya yang pilih kapan latihan]           │
│  Interleaving              [● Aktif ✓ — campur topik tiap sesi]                 │
│                            [○ Nonaktif — fokus satu topik]                      │
│                                                                                  │
│  ── Tujuan Streak ─────────────────────────────────────────────────────────── │
│                                                                                  │
│  Tujuan streak bulanan     [14 hari]  [30 hari ✓]  [60 hari]  [Kustom: ___]   │
│  (Ditampilkan sebagai bilah tujuan di layar Sesi Selesai.)                     │
│                                                                                  │
│  ── Data & Privasi ─────────────────────────────────────────────────────────── │
│                                                                                  │
│  Semua data tersimpan di    Browser IndexedDB (perangkat ini)                   │
│  Penyimpanan digunakan      1,2 MB dari ~10 MB tersedia                         │
│                                                                                  │
│  [Ekspor semua data sebagai JSON ↓]   → navigasi ke Screen 14                  │
│  [Impor file backup ↑]               → navigasi ke Screen 14                   │
│                                                                                  │
│  [Hapus semua data ⚠]  ← text-red, border-red, requires confirmation           │
│                                                                                  │
│  ── Tentang ────────────────────────────────────────────────────────────────── │
│  JadiMikir v0.1.0   ·   Local-only   ·   Tidak perlu akun                      │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Streak goal is now configurable in Settings — source of the "30" shown on Session Complete (S11)
- **B** Mastery gate threshold annotation explains it is also shown on the gate screen (S16) — cross-link context
- **C** Notification permission denial noted inline ("Jika ditolak, pengingat tidak berfungsi") — no separate wireframe needed for the common case
- **D** "Hapus semua data" styled as destructive (text-red, border-red) — visually distinct from export/import CTAs
- **E** Export and Import navigate to Screen 14 (Data Export) rather than being inline — reduces Settings screen length

---

## Screen 14 — Export & Data Portability

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Pengaturan    Data & Portabilitas                                             │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  Datamu tersimpan 100% di perangkat ini. Ekspor untuk backup atau pindah        │
│  ke perangkat lain.                                                              │
│                                                                                  │
│  ══════════════════════════════════════════════════════════════════════════════  │
│  EKSPOR                                                                          │
│  ══════════════════════════════════════════════════════════════════════════════  │
│                                                                                  │
│  ── Yang disertakan ────────────────────────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  ✓  Semua status kartu FSRS & riwayat tinjauan                          │    │
│  │  ✓  XP, streak, dan skor mastery                                        │    │
│  │  ✓  Progres topik & hasil diagnostik                                    │    │
│  │  ✓  Semua pengaturan & preferensi                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  Format:   [● JSON (backup penuh) ✓]    [○ CSV (ringkasan progres saja)]        │
│  Nama file:  jadimikir-backup-2026-03-29.json  (di-generate otomatis)           │
│                                                                                  │
│  [Unduh Backup ↓]                                                               │
│                                                                                  │
│  ══════════════════════════════════════════════════════════════════════════════  │
│  IMPOR                                                                           │
│  ══════════════════════════════════════════════════════════════════════════════  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │   [  Drop file backup di sini, atau klik untuk pilih file  ]            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Setelah file dipilih: preview sebelum konfirmasi ──────────────────────── │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  File: jadimikir-backup-2026-02-15.json                                 │    │
│  │  Dibuat: 15 Feb 2026  ·  42 hari lalu                                   │    │
│  │  Berisi: 18 topik · 247 soal dijawab · Streak: 9 hari                  │    │
│  │                                                                         │    │
│  │  [AlertTriangle icon]  Mengimpor akan menggantikan semua data saat ini. │    │
│  │  Tindakan ini tidak dapat dibatalkan.                                   │    │
│  │                                                                         │    │
│  │  [ ] Saya mengerti — ganti data sekarang dengan backup ini             │    │
│  │                                                                         │    │
│  │  [Impor]  (nonaktif sampai checkbox dicentang)                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Export and Import separated by a full-width divider with bold section headings — visual distinction between the two operations
- **B** Backup preview shown after file is selected — before any confirmation. Shows: filename, creation date, age in days, key stats. Prevents accidental import of wrong/old backup.
- **C** Confirmation checkbox + disabled Import button remains — good friction for a destructive action
- **D** Filename is auto-generated with today's date — no manual entry needed

---

## Screen 15 — Empty State (First Visit, Before Onboarding)

> **Entry logic:** Screen 15 fires on the very first visit to `/` when no learner data exists. After onboarding (Screens 7–10) completes, the app routes to Screen 1 (Home Dashboard). Screen 15 is NOT shown again after onboarding.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                                          [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│                          Selamat datang di JadiMikir!                           │
│                                                                                  │
│                    Mulai belajar — tidak perlu akun.                             │
│                                                                                  │
│             ┌─────────────────────────────────────────────────────┐             │
│             │                                                     │             │
│             │   Matematika SMP                                    │             │
│             │   42 topik · 860 kartu                              │             │
│             │                                                     │             │
│             │   [▶  Mulai — ambil tes penempatan singkat]         │             │
│             │                                                     │             │
│             │   [  Mulai dari awal tanpa tes]                     │             │
│             │                                                     │             │
│             └─────────────────────────────────────────────────────┘             │
│                                                                                  │
│                      [Ganti subjek →]                                           │
│                                                                                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Entry point: first visit only. Triggers onboarding flow (Screens 7–10) when either CTA is clicked
- **B** "Ganti subjek →" uses "→" not "↕" — implies navigation, not reordering
- **C** Focused: one subject card, two CTAs (primary + secondary), one tertiary link. No noise.

---

## Screen 16 — Mastery Gate: Topic Locked Pending Final Review

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Sistem Persamaan Linear                                               │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │  Kenapa ada mastery gate?                                               │    │
│  │  ─────────────────────────────────────────────────────────────────────  │    │
│  │  Topik berikutnya (Trigonometri, Persamaan Kuadrat) butuh fondasi kuat  │    │
│  │  di sini. Melanjutkan terlalu cepat biasanya menyebabkan frustrasi di  │    │
│  │  depan. Sedikit sabar sekarang = jauh lebih mudah nanti.               │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Status Mastery ─────────────────────────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │  Hampir selesai!                                                        │    │
│  │                                                                         │    │
│  │  Mastery sekarang:   ████████████████░░░░  64%    (butuh 70%)          │    │
│  │  Threshold (70%) dapat diubah di →  [Pengaturan]                       │    │
│  │                                                                         │    │
│  │  Kartu yang perlu diperkuat:  8 kartu                                  │    │
│  │  Topik terlemah:  Metode Eliminasi (63%)  ·  Soal Cerita (55%)         │    │
│  │                                                                         │    │
│  │  [Lanjutkan Review →]          [Latih Metode Eliminasi dulu]           │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** "Kenapa ada mastery gate?" explanation panel moved to TOP — learner reads the rationale BEFORE seeing they're blocked
- **B** "Threshold (70%) dapat diubah di → [Pengaturan]" — direct link so frustrated learners can tune the threshold
- **C** The threshold shown is pulled from the learner's configured value — not hardcoded 70%
- **D** Weakest subtopics drive the second CTA dynamically — if multiple weak topics exist, show the weakest one

---

## Screen 17 — All Topics (Subject Browser)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Semua Topik                                                           │
│  ─────────────────────────────────────────────────────────────────────────────   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Subjek saat ini: Matematika SMP                                                 │
│                                                                                  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  [BookOpen]  Matematika SMP  [Aktif]   │  │  [Microscope]  IPA SMP         │ │
│  │  ────────────────────────────────────  │  │  ──────────────────────────── │ │
│  │  Aljabar · Geometri                    │  │  38 topik · 720 kartu          │ │
│  │  Trigonometri · Statistika             │  │  Belum dimulai                 │ │
│  │                                        │  │                                │ │
│  │  42 topik · 860 kartu                  │  │  [Ganti ke subjek ini →]       │ │
│  │  Progress:  ████░░░░░░░░  18 / 42      │  │  [AlertTriangle] Mengganti     │ │
│  │  2 dikuasai · 8 jatuh tempo hari ini   │  │  subjek menjeda sesi aktifmu.  │ │
│  │                                        │  │  Progresmu tetap tersimpan.    │ │
│  │  [Lanjut →]   [Lihat Daftar Topik →]  │  │                                │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  [FileText]  Bahasa Indonesia          │  │  [Globe]  Bahasa Inggris       │ │
│  │  ────────────────────────────────────  │  │  ──────────────────────────── │ │
│  │  29 topik · 510 kartu                  │  │  35 topik · 680 kartu          │ │
│  │  Belum dimulai                         │  │  Belum dimulai                 │ │
│  │                                        │  │                                │ │
│  │  [Ganti ke subjek ini →]               │  │  [Ganti ke subjek ini →]       │ │
│  │  [AlertTriangle] Mengganti subjek      │  │  [AlertTriangle] Mengganti     │ │
│  │  menjeda sesi aktifmu. Progresmu       │  │  subjek menjeda sesi aktifmu.  │ │
│  │  tetap tersimpan.                      │  │  Progresmu tetap tersimpan.    │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Warning about subject switching moved INLINE to each inactive card — visible before the user clicks [Ganti]
- **B** Page summary replaced: "Subjek saat ini: Matematika SMP" — not "4 subjects · 1 active" (useless stat)
- **C** Search/filter UI removed — Phase 3 only; adds no value with 4 subjects
- **D** "View Skill Tree →" removed from active card — replaced with "Lihat Daftar Topik →" (links to S18)
- **E** Icons use Lucide React (BookOpen, Microscope, FileText, Globe) — no emoji

---

## Screen 18 — Topic List (within a Subject)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ← Semua Topik    Matematika SMP — Daftar Topik                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  [Search topics...             🔍]   Filter: [Semua ▾]   Sort: [Progres ▾]      │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  42 topik  ·  18 sedang belajar  ·  2 dikuasai  ·  22 terkunci/belum dimulai   │
│                                                                                  │
│  ── Sedang Dipelajari ─────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  ● Sistem Persamaan Linear          ████████████░░░░░░  62%  · 8 jatuh  │   │
│  │    Prasyarat: ✓ Faktorisasi Prima, ✓ Pangkat & Akar      [Lanjut →]     │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  ● Pecahan & Desimal                ██████████░░░░░░░░  58%  · 3 jatuh  │   │
│  │    Prasyarat: ✓ Bilangan Bulat, ✓ FPB & KPK              [Lanjut →]     │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  ● Pangkat & Akar                   ████░░░░░░░░░░░░░░  12%  · 0 jatuh  │   │
│  │    Prasyarat: ✓ Bilangan Bulat                            [Mulai →]      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ── Dikuasai ──────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  ◆ Bilangan Bulat                   ████████████████████  100%           │   │
│  │    Review dalam 4 hari                                    [Tinjau →]     │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  ◆ Faktorisasi Prima                ████████████████████  100%           │   │
│  │    Review dalam 1 hari                                    [Tinjau →]     │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ── Tersedia (belum dimulai) ──────────────────────────────────────────────────  │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  ○ Perbandingan                                                           │   │
│  │    Prasyarat: ✓ Pecahan & Desimal                         [Mulai →]      │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  ○ Operasi Aljabar                                                        │   │
│  │    Prasyarat: ✓ Bilangan Bulat                            [Mulai →]      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ── Terkunci ──────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  ○̶ Trigonometri Dasar                                                    │   │
│  │    Butuh: ✗ Pangkat & Akar (12%)                          [Lihat →]      │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  ○̶ Persamaan Kuadrat                                                     │   │
│  │    Butuh: ✗ Sistem Persamaan Linear (62%, butuh 70%)      [Lihat →]      │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  ○̶ Geometri Koordinat                                                    │   │
│  │    Butuh: ✗ Perbandingan (0%)  ·  ✗ Pangkat & Akar (12%) [Lihat →]      │   │
│  │    ··· 19 topik terkunci lainnya                          [Tampilkan]    │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│                          [Lihat Daftar Topik Lainnya →]                         │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Prerequisite rows now show actual names: "Prasyarat: ✓ Faktorisasi Prima, ✓ Pangkat & Akar" — not just "Prereqs: ✓"
- **B** Available (0%) rows have NO progress bar — empty bar is visual noise; absence is more informative
- **C** "View Skill Tree →" footer replaced with "Lihat Daftar Topik Lainnya →" (deferred skill tree)
- **D** Locked rows still show exact blocking prereq with current % — no mystery about what's needed

---

## Section 19 — Cross-Cutting Patterns

### 19a — Navigation Shell

The layout shell (`src/components/layout/layout.tsx`) wraps every screen. Its wireframe:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                              [Progress]  [Export data]  [Settings ⚙] │
│  (logo / wordmark — links to /)                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [ page content renders here ]                                                   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Navigation rules:**
- **Back navigation**: rendered by each page as "← Back" in its own header area — NOT in the shell. The back target is always the logical parent (breadcrumb), not browser history.
- **Shell links**: Progress (`/progress`), Export (`/data`), Settings (`/settings`) — always visible.
- **During session** (Screen 2): shell header is hidden — replaced by the session-specific header bar to minimize distraction.
- **During onboarding** (Screens 7–10): shell header is hidden — full-screen onboarding layout.

---

### 19b — Loading / Skeleton State Pattern

Reference: applied to any screen that reads from IndexedDB or fetches content JSON.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                              [Progress]  [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Selamat datang kembali!                                                         │
│  ─────────────────────────────────────────────────────────                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  ░░░░░░░░░   │  │  ░░░░░░░░░   │  │  ░░░░░░░░░   │  │  ░░░░░░░░░   │        │
│  │  ░░░░░░░     │  │  ░░░░░░░     │  │  ░░░░░░░     │  │  ░░░░░░░     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│  (░ = animated skeleton pulse, bg-muted/30, rounded)                             │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │    │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░                                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- Use the `Skeleton` component from `src/components/ui/skeleton.tsx` (shadcn)
- Every screen that loads async data must have a named skeleton component (e.g., `HomePageSkeleton`, `TopicDetailSkeleton`)
- Skeleton layout must match the real layout's column/row structure — not a generic spinner
- Target: skeleton visible for no longer than 300ms on typical IndexedDB reads; if longer, investigate storage performance

---

### 19c — Error State Pattern

Reference: applies when content JSON fails to load or IndexedDB is unavailable.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                              [Progress]  [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│                    [AlertCircle icon — large, text-muted]                        │
│                                                                                  │
│                    Tidak dapat memuat data                                       │
│                                                                                  │
│                    Coba refresh halaman. Jika masalah berlanjut,                │
│                    periksa apakah browser kamu memblokir penyimpanan lokal.     │
│                                                                                  │
│                    [Coba Lagi]                                                   │
│                                                                                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Error types and copy:**

| Situation | Heading | Body |
|---|---|---|
| Content JSON fetch failed | "Konten tidak tersedia" | "Periksa koneksi internetmu dan coba lagi." |
| IndexedDB unavailable | "Penyimpanan tidak dapat diakses" | "Browser kamu mungkin memblokir penyimpanan lokal. Coba di mode normal (bukan incognito)." |
| Import file corrupt | "File tidak valid" | "File backup tidak dapat dibaca. Pastikan file berasal dari JadiMikir." |

---

### 19d — Mobile Design Note

**All 18 screens require 390px (mobile) variants. This is Phase-next design work — not yet wireframed.**

Key adaptation areas per screen type:

| Screen type | Desktop pattern | Mobile adaptation needed |
|---|---|---|
| Dashboard (S1, S6) | 4-column stat bar, 2-column card grid | Stack to 2-column stats, 1-column cards |
| Session (S2, S3, S5, S9) | Full-width single column | Already single column — scroll behavior to verify |
| Topic browser (S17, S18) | 2×2 card grid, list rows | 1-column list for cards; rows stay rows |
| Topic detail (S12) | 2-column header stats | Stack to single column |
| Settings (S13) | Single-column list | Already single column — touch target sizes to verify (min 44px) |
| Onboarding (S7–S10) | Centered card layout | Full-width card, reduced padding |
| Skill tree (S4) | Zoom+pan canvas | Requires fundamentally different interaction (vertical scroll list or tabbed node view) |

**Priority for mobile adaptation:** S2 (session), S3 (feedback), S11 (session complete) — these are the most-used screens and mobile adaptation is highest impact.
