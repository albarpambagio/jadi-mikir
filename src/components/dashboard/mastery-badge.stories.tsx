import type { Meta, StoryObj } from "@storybook/react"
import { MasteryBadge } from "./mastery-badge"

const meta = {
  title: "Dashboard/MasteryBadge",
  component: MasteryBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: ["not-started", "just-started", "in-progress", "completed"],
    },
  },
} satisfies Meta<typeof MasteryBadge>

export default meta
type Story = StoryObj<typeof meta>

export const NotStarted: Story = {
  args: {
    level: "not-started",
  },
}

export const JustStarted: Story = {
  args: {
    level: "just-started",
  },
}

export const InProgress: Story = {
  args: {
    level: "in-progress",
  },
}

export const Completed: Story = {
  args: {
    level: "completed",
  },
}

export const CompletedWithReviewDays: Story = {
  args: {
    level: "completed",
    reviewInDays: 4,
  },
}
