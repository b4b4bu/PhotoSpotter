---
name: prd-to-issues
description: Break a PRD into independently-grabbable GitHub issues using vertical slices. Use when user wants to convert a PRD into issues, create tickets from a product spec, or break down a feature into tasks.
---

# PRD to Issues

Convert a product requirements document into GitHub issues using vertical slice methodology.

## Process

### 1. Locate the PRD

Get the PRD via:
- GitHub issue number: `gh issue view <number>`
- URL: fetch with web tools
- Direct paste: user provides content

### 2. Explore the codebase

Use the Agent tool to understand the current implementation state before drafting slices.

### 3. Draft vertical slices

Each issue should be a **tracer bullet** — a thin slice that cuts through all integration layers end-to-end, not a single horizontal layer.

**Two slice types:**

- **HITL** (Human-In-The-Loop): requires architectural decisions or design reviews before proceeding
- **AFK** (Away From Keyboard): can be implemented and merged without human input

**Thin slices over thick ones.** Each completed slice delivers a demoable, end-to-end feature.

### 4. Present the breakdown

Before creating issues, share the breakdown with the user:
- Are the slices the right granularity?
- Are dependencies correct?
- Is HITL/AFK categorization right?

Iterate until aligned.

### 5. Create GitHub issues in dependency order

Use this template:

```
gh issue create --title "<slice title>" --body "$(cat <<'EOF'
## Parent PRD

Closes #<prd-issue-number>

## What

[What this slice delivers — one demoable capability]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blockers

- Blocked by #<issue> (if applicable)

## User Stories Addressed

- Story 1 from PRD
- Story 2 from PRD
EOF
)"
```
