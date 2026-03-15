import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainLayout } from './main-layout';

const meta = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    // Note: viewport addon removed in Storybook 9.0+
    // Use viewport parameter directly if needed
    chromatic: { 
      delay: 200, // Wait for fonts to load
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage - optimized for performance
export const Default: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">Card 1</div>
          <div className="bg-white p-4 rounded-lg shadow">Card 2</div>
          <div className="bg-white p-4 rounded-lg shadow">Card 3</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          <p className="text-gray-600">This is a sample content area to test layout behavior with longer content.</p>
        </div>
      </div>
    ),
  },
};

// Stress test with long content - reduced for performance
export const LongContent: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard with Long Content</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Long Section Title</h2>
          <p className="text-gray-600 mb-4">
            This is a long paragraph of text to test how the layout handles content that might 
            cause horizontal scrolling or layout shifts.
          </p>
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <span>Item {i + 1}</span>
                <span className="text-gray-500">Description {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
};

// Empty state test
export const EmptyState: Story = {
  args: {
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-500">No content yet</h2>
          <p className="text-gray-400 mt-2">Start by creating your first question set.</p>
        </div>
      </div>
    ),
  },
};
