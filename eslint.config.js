import tailwindcss from 'eslint-plugin-tailwindcss'
import tsParser from '@typescript-eslint/parser'

export default [
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  // Tailwind CSS configuration - using plugin directly
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      tailwindcss,
    },
    rules: {
      // Tailwind class ordering (catches disorganised AI output)
      'tailwindcss/classnames-order': 'warn',
      // Ban arbitrary Tailwind values like bg-[#ff0000]
      'tailwindcss/no-arbitrary-value': 'error',
    },
  },
  // Custom rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Ban hardcoded hex/rgb in className strings
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\#[0-9a-fA-F]{3,8}/]',
          message: 'Use a design token instead of a hardcoded hex value.',
        },
        {
          selector: 'Literal[value=/rgb\\(|rgba\\(/]',
          message: 'Use a design token instead of hardcoded rgb().',
        },
        {
          selector: 'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression > Property[key.name="boxShadow"]',
          message: 'Use shadow tokens (shadow-sm, shadow-md) instead of inline box-shadow.',
        },
      ],
    },
  },
]
