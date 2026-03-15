import type { Meta, StoryObj } from "@storybook/react"
import { TopicCard } from "./topic-card"

const meta = {
  title: "Dashboard/TopicCard",
  component: TopicCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    mastery: {
      control: "select",
      options: ["not-started", "just-started", "in-progress", "completed"],
    },
  },
} satisfies Meta<typeof TopicCard>

export default meta
type Story = StoryObj<typeof meta>

export const InProgress: Story = {
  args: {
    title: "Sistem Persamaan Linear",
    progress: 62,
    mastery: "in-progress",
    dueCount: 8,
  },
}

export const JustStarted: Story = {
  args: {
    title: "Trigonometri Dasar",
    progress: 12,
    mastery: "just-started",
    dueCount: 0,
  },
}

export const Completed: Story = {
  args: {
    title: "Bilangan Bulat",
    progress: 100,
    mastery: "completed",
    dueCount: 0,
    reviewInDays: 4,
  },
}

export const NotStarted: Story = {
  args: {
    title: "Faktorisasi Prima",
    progress: 0,
    mastery: "not-started",
    dueCount: 0,
  },
}
