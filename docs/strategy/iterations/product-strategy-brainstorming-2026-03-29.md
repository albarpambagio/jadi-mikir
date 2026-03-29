# Product Strategy Brainstorming Session - Grill-Me Interview
**Date**: 2026-03-29  
**Participants**: User (founder/product lead) + AI (using grill-me skill)

## Core Ideas Discussed

### 1. "Managed Anki" Positioning
- **Problem**: Casual learners overwhelmed by Anki's customization (deck settings, card management, card types)
- **Solution**: Abstract away complex configurations, provide preconfigured FSRS parameters
- **Key Questions**:
  - What FSRS settings to expose/hide based on user expertise?
  - How to integrate with existing settings/topic detail screens?
  - At what point do advanced users get configuration access?

### 2. User-Generated Content Strategy
- **Goal**: Reduce creator's content burden while enabling community contributions
- **Format**: Predefined MCQ structure (question, options, correct answer, explanation, tags, difficulty)
- **Validation**: Frontend-only (character limits, basic checks)
- **Distribution**: External sharing (Google Drive, WhatsApp) - no in-app distribution platform

### 3. Structured vs Unstructured Content Models
- **Structured Content**: Topics/subtopics/prerequisites (current system)
- **Unstructured Content**: Flat flashcard decks (no hierarchy)
- **User Choice**: Explicit selection when creating content
- **Labeling**: Visual indicators in topic browser
- **Convertibility**: Users can add structure later to unstructured content

## Key Tensions Identified

### Learning Feature Adaptation
For unstructured content, we questioned how core features would function:
- **Mastery Gates**: How to work without prerequisite relationships?
- **FSRS Scheduling**: How to schedule without topical dependencies?
- **Topic Unlocks**: What happens to "unlocks after this topic" feature?
- **Weak Area Analysis**: How to show weak areas without subtopic tags?
- **Session Logic**: How does current `session.tsx` adapt when topical structure is missing?

### Implementation Reality Check
- Current system assumes topical structure throughout (`masteryGateThresholdPercent`, `isPrerequisiteMasterySatisfied`, topic unlock logic)
- Moving between models requires significant feature adaptation
- Need to define clear boundaries of what features work in each model

## Next Steps
1. Define concrete FSRS configuration abstraction for beginners
2. Specify exact MCQ format for user-generated content
3. Detail how learning features adapt for unstructured content
4. Create UI mockups showing structured vs unstructured content in topic browser
5. Plan migration path for users to add structure to existing unstructured decks

## Key Insight
While the dual-model approach offers flexibility, it creates significant complexity in maintaining a coherent learning experience across both content types. The team needs to clearly define which features are available in each model and how users transition between them.