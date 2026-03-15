## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context.

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## Aesthetic review (UI changes only — skip if backend-only)

Run `npm run storybook` and open each changed story. Check each in 60 seconds:

- [ ] No hardcoded colors or magic pixel values (lint passes)
- [ ] Max 2 accent colors visible on screen at once
- [ ] No gradient on interactive elements (buttons, inputs, cards)
- [ ] Shadows only on elevated/interactive states, not resting
- [ ] Font sizes all come from the type scale (xs through 3xl)
- [ ] Spacing looks regular — no element visually "floats" or feels crowded
- [ ] Hover/focus states change one thing, not three simultaneously
- [ ] Component looks plausible in both light and dark mode (use Storybook backgrounds addon)

If any box is unchecked, add a note explaining why it's intentional.

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
