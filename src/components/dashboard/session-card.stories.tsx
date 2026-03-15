import type { Meta, StoryObj } from "@storybook/react"
import { SessionCard } from "./session-card"

const meta = {
  title: "Dashboard/SessionCard",
  component: SessionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SessionCard>

export default meta
type Story = StoryObj<typeof meta>

export const ReviewSession: Story = {
  args: {
    type: "review",
    title: "Start Review Session",
    description: "14 due cards across 5 topics",
    onAction: () => console.log("Start review"),
  },
}

export const NewTopic: Story = {
  args: {
    type: "new-topic",
    title: "Start New Topic",
    description: "Browse all topics in skill tree",
    onAction: () => console.log("New topic"),
  },
}
