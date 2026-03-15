# Recommendation System

The project has a **multi-layered recommendation system**:

## 1. Topic Recommendations (`src/lib/engines/recommendations.ts`)

Ranks topics using weighted scoring:

| Weight | Factor |
|--------|--------|
| 30% | Due reviews (cards needing FSRS复习) |
| 25% | Streak risk |
| 20% | Mastery gap (how far from 60-80% mastery) |
| 15% | Recent activity (days since last practice) |
| 10% | Difficulty balance |

Returns top 3 topics with:
- Reason for recommendation
- Priority (high/medium/low)
- Questions due
- Estimated time

## 2. Diagnostic Assessment (`src/lib/engines/diagnostic.ts`)

Initial placement test to determine learner's level:

- 5 questions per topic (2 easy, 2 medium, 1 hard)

| Score | Level | Initial Mastery | Target |
|-------|-------|-----------------|--------|
| 80%+ | advanced | 60% | 80% |
| 60-79% | intermediate | 30% | 60% |
| <60% | beginner | 0% | 40% |

## 3. Remediation Engine (`src/lib/engines/remediation.ts`)

Recommends practice after failures — targets specific weak areas based on recent incorrect answers.

## Key Entry Points

- `getRecommendations(topics)` → overall recommendations with streak status
- `getRecommendedTopic(topics)` → single top recommendation
- `calculatePlacement()` → diagnostic result after quiz