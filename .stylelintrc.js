export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Allow Tailwind-specific at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'custom-variant', 'theme', 'layer', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'color-no-invalid-hex': true,
    // Disallow any color that isn't a var()
    'color-named': 'never',
    'declaration-property-value-disallowed-list': {
      'box-shadow': ['/^(?!var\\()/'],  // must use var() or none
      'background': ['/gradient/'],      // no gradients in CSS files
      'background-image': ['/.+/'],      // all backgrounds via tokens
    },
    'unit-disallowed-list': ['vmax'],    // AI loves vmax for no reason
    // Allow OKLCH format without deg suffix
    'hue-degree-notation': null,
    'lightness-notation': null,
    'alpha-value-notation': null,
  },
}
