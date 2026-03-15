import type { Meta, StoryObj } from "@storybook/react"
import { DashboardHeader } from "./dashboard-header"

const meta = {
  title: "Dashboard/Header",
  component: DashboardHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onExport: () => console.log("Export"),
    onSettings: () => console.log("Settings"),
  },
}

export const WithUser: Story = {
  args: {
    userName: "Ahmad",
    onExport: () => console.log("Export"),
    onSettings: () => console.log("Settings"),
  },
}
