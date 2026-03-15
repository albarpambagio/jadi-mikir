# Agent Browser Integration

## Overview

Vercel Agent Browser has been successfully integrated into the project for AI agent-driven UI testing. This enables autonomous browser automation for Storybook component testing, visual regression testing, and UI interaction workflows.

## Installation Status

### ✅ Completed Steps

1. **Global Installation**: `agent-browser@0.20.5` installed globally via npm
2. **Chrome Download**: Chrome for Testing v146.0.7680.80 installed
3. **Skill Integration**: `agent-browser` skill added to `.agents/skills/agent-browser/`
4. **OpenCode Integration**: Skill available to OpenCode and other AI agents
5. **Basic Testing**: Verified with example.com workflow

### System Information

- **Agent Browser Version**: 0.20.5
- **Chrome Version**: 146.0.7680.80 (Chrome for Testing)
- **Platform**: Windows x64 (Native Rust binary)
- **Skill Location**: `.agents/skills/agent-browser/SKILL.md`
- **Chrome Location**: `C:\Users\albar\.agent-browser\browsers\chrome-146.0.7680.80`

## Architecture

### Client-Daemon Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Rust CLI      │────▶│   Rust Daemon   │
│  (agent-browser)│     │  (CDP Bridge)   │
└─────────────────┘     └─────────────────┘
                                │
                                ▼
                         ┌─────────────┐
                         │   Chrome    │
                         │   Browser   │
                         └─────────────┘
```

- **No Node.js required** for daemon operation
- **Direct CDP access** via Chrome DevTools Protocol
- **Background daemon** persists between commands for speed

## Core Workflow

### Pattern: Snapshot-Ref Interaction

Every browser automation follows this pattern:

1. **Navigate**: `agent-browser open <url>`
2. **Snapshot**: `agent-browser snapshot -i` (get element refs like `@e1`, `@e2`)
3. **Interact**: Use refs to click, fill, select
4. **Re-snapshot**: After navigation or DOM changes

### Example: Testing Storybook Components

```bash
# Start Storybook
npm run storybook

# In another terminal, test components
agent-browser open http://localhost:6006
agent-browser snapshot -i
# Output: @e1 [button], @e2 [input], @e3 [link]

# Test component interactions
agent-browser click @e1  # Click a button
agent-browser fill @e2 "test input"  # Fill an input
agent-browser screenshot component-test.png
```

## Command Reference

### Core Commands

| Command | Description |
|---------|-------------|
| `agent-browser open <url>` | Navigate to URL |
| `agent-browser snapshot -i` | Get interactive elements with refs |
| `agent-browser click @e1` | Click element by ref |
| `agent-browser fill @e1 "text"` | Fill input by ref |
| `agent-browser screenshot <file>` | Take screenshot |
| `agent-browser close` | Close browser |

### Storybook-Specific Testing

```bash
# Test specific component story
agent-browser open "http://localhost:6006/iframe.html?id=button--primary"
agent-browser snapshot -i
agent-browser click @e1  # Test button interaction
agent-browser screenshot button-primary.png
```

## AI Agent Integration

### Skill Configuration

The `agent-browser` skill is configured in `.agents/skills/agent-browser/SKILL.md` with:

- **Trigger phrases**: "open a website", "fill out a form", "take a screenshot", etc.
- **Allowed tools**: `Bash(npx agent-browser:*)`, `Bash(agent-browser:*)`
- **Workflow documentation**: Snapshot-ref pattern, authentication options

### OpenCode Usage

OpenCode can now use agent-browser for:

1. **Visual Testing**: Automated screenshot testing with annotated refs
2. **Component Interaction**: Test UI components autonomously
3. **Storybook Testing**: Navigate and test component stories
4. **Cross-browser**: Chrome via agent-browser, others via Playwright

## Authentication Options

For testing authenticated components:

1. **Persistent Profile**: `agent-browser --profile ~/.myapp open <url>`
2. **Session Name**: `agent-browser --session-name myapp open <url>`
3. **State File**: `agent-browser --state ./auth.json open <url>`
4. **Auth Vault**: Encrypted credential storage

## Complementary Tool Strategy

### Agent-Browser (New)
- **AI Agent-Driven UI Testing**: CLI automation for AI agents
- **Storybook Visual Testing**: Automated screenshot testing
- **Session Persistence**: Reuse authenticated sessions
- **Native Performance**: Rust daemon, fast execution

### Playwright (Existing)
- **Unit/Integration Tests**: Vitest integration
- **API Testing**: Network mocking and interception
- **CI/CD Pipelines**: Existing Playwright workflows
- **Multi-browser**: Firefox, WebKit support

## Testing Workflow

### Local Development

```bash
# 1. Start Storybook
npm run storybook

# 2. Test components with agent-browser
agent-browser open http://localhost:6006
agent-browser snapshot -i
agent-browser click @e1  # Test component interaction
agent-browser screenshot test-results.png
agent-browser close
```

### AI Agent Testing

```bash
# AI agents can use the snapshot-ref pattern
# Example: Test all Button stories
for story in primary secondary disabled; do
  agent-browser open "http://localhost:6006/iframe.html?id=button--$story"
  agent-browser snapshot -i
  agent-browser click @e1
  agent-browser screenshot "button-$story.png"
done
```

## Configuration

### Environment Variables

- `AGENT_BROWSER_SESSION_NAME`: Auto-save/restore session
- `AGENT_BROWSER_ENCRYPTION_KEY`: Encrypt state files
- `AGENT_BROWSER_ALLOWED_DOMAINS`: Restrict navigation
- `AGENT_BROWSER_DEFAULT_TIMEOUT`: Operation timeout (ms)

### Project Configuration

Create `agent-browser.json` in project root:

```json
{
  "headed": false,
  "screenshotDir": "./test-results",
  "allowedDomains": "localhost:6006,example.com"
}
```

## Verification

### Installation Verification

```bash
# Check version
agent-browser --version

# Test basic workflow
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser close
```

### Skill Integration Verification

```bash
# Check skill location
ls -la .agents/skills/agent-browser/

# Verify OpenCode can access skill
# (Skill should be auto-detected by OpenCode)
```

## Benefits

1. **AI-Optimized**: Snapshot-ref pattern ideal for AI agents
2. **Native Performance**: Rust daemon, no Node.js overhead
3. **Session Persistence**: Reuse authenticated sessions
4. **Visual Testing**: Annotated screenshots with element refs
5. **CLI Automation**: Easy scripting for Storybook testing
6. **Complementary**: Works alongside existing Playwright setup

## Next Steps

1. **Expand Story Coverage**: Create stories for all UI components
2. **AI Agent Testing**: Configure AI agents to test components
3. **Visual Regression**: Set up screenshot comparison workflows
4. **CI/CD Integration**: Add agent-browser to CI pipelines
5. **Documentation**: Update AGENTS.md with agent-browser usage

## Troubleshooting

### Chrome Not Found

```bash
agent-browser install
```

### Permission Errors

- Run as administrator on Windows
- Check Chrome installation path

### Slow Performance

- Increase timeout: `export AGENT_BROWSER_DEFAULT_TIMEOUT=45000`
- Use persistent profiles for faster auth

## Resources

- **Agent Browser Repo**: https://github.com/vercel-labs/agent-browser
- **Skill Documentation**: `.agents/skills/agent-browser/SKILL.md`
- **Chrome for Testing**: https://developer.chrome.com/blog/chrome-for-testing/