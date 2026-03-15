import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    // "@storybook/addon-vitest", // Temporarily disabled for testing
    "@storybook/addon-a11y",
    "@storybook/addon-backgrounds",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
    // "@storybook/addon-viewport" // REMOVED: Deprecated in Storybook 9.0+
  ],
  "framework": "@storybook/react-vite"
};
export default config;