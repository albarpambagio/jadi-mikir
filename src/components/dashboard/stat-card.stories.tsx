import type { Meta, StoryObj } from "@storybook/react"
import { StatCard } from "./stat-card"
import { Flame, Star, Target, Clock } from "lucide-react"

const meta = {
  title: "Dashboard/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Streak: Story = {
  args: {
    icon: Flame,
    label: "Streak",
    value: "12 days",
    variant: "fire",
  },
}

export const XP: Story = {
  args: {
    icon: Star,
    label: "XP Total",
    value: "4,820",
    variant: "xp",
  },
}

export const TopicsDone: Story = {
  args: {
    icon: Target,
    label: "Topics Done",
    value: "18 / 42",
    variant: "topics",
  },
}

export const DueToday: Story = {
  args: {
    icon: Clock,
    label: "Due Today",
    value: "14 cards",
    variant: "due",
  },
}
