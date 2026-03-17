---
name: git-guardrails-claude-code
description: Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, etc.) before they execute. Use when user wants to add safety guardrails to Claude Code, prevent destructive git operations, or set up git protection hooks.
---

# Git Guardrails for Claude Code

Set up a PreToolUse hook that prevents Claude from executing destructive git operations.

## Blocked commands

- `git push`
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .`
- `git restore .`
- `push --force`
- `reset --hard`

## Installation

### 1. Choose scope

- **Project-specific**: `.claude/settings.json` in your repo
- **Global**: `~/.claude/settings.json`

### 2. Copy the blocking script

Copy `scripts/block-dangerous-git.sh` to the appropriate hooks directory and make it executable:

```bash
# Project-specific
cp scripts/block-dangerous-git.sh .claude/hooks/block-dangerous-git.sh
chmod +x .claude/hooks/block-dangerous-git.sh

# Global
cp scripts/block-dangerous-git.sh ~/.claude/hooks/block-dangerous-git.sh
chmod +x ~/.claude/hooks/block-dangerous-git.sh
```

### 3. Add hook configuration

Add to your `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

### 4. Customize blocked patterns (optional)

Edit `DANGEROUS_PATTERNS` in the script to add or remove patterns.

### 5. Test

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | .claude/hooks/block-dangerous-git.sh
# Should exit 2 with BLOCKED message to stderr
```

## How it works

The hook intercepts all Bash tool calls. If a command matches a dangerous pattern, Claude receives a message that it "does not have authority" to run the command and the operation is blocked (exit code 2).
