# UI generation constraints for JadiMahir

You are generating React/TypeScript UI components for JadiMahir. Before writing any code, read VISUAL-SPEC.md in the repo root.

If the user or CONTEXT provides a Figma URL (figma.com/design/...), use the Figma MCP get_design_context with the file key and node Id from the URL. Use the returned screenshot and hints for layout and hierarchy only; implement colors, spacing, and typography from the project tokens and VISUAL-SPEC.md. Do not copy hex values or arbitrary spacing from Figma—map to our token scale.

Hard constraints — never violate these:
- All colors must use Tailwind tokens from the @theme config. Never use hex, rgb(), or Tailwind arbitrary values like bg-[#abc].
- No gradients on interactive elements (buttons, cards, inputs). Gradients only for data visualisation.
- Border radius: rounded-sm (4px), rounded-md (8px), or rounded-lg (12px) only. Never rounded-xl, rounded-2xl, or rounded-full on non-pill elements.
- Box shadows: shadow-sm or shadow-md only. Never stacked shadows. Never shadow on resting state cards.
- Typography: use the type scale classes (text-xs through text-3xl). Never arbitrary font sizes.
- Spacing: use Tailwind spacing scale. Never arbitrary px values outside the 4px grid.
- No more than 2 font weights in a single component (regular + medium, or regular + semibold).

When generating a new component:
1. State which CVA variants you'll create and why.
2. Identify which design tokens you're using.
3. Write the component.
4. Write the Storybook story covering all variants.
5. State any visual decisions that might need review.
