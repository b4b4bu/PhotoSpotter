---
name: request-refactor-plan
description: Create a detailed refactoring plan with incremental commits, filed as a GitHub issue. Use when user wants to plan a refactor, create a refactoring issue, or document a code improvement plan.
---

# Request Refactor Plan

Guide the user through creating a detailed refactoring plan with incremental commits, then file it as a GitHub issue.

## Process

### 1. Gather Requirements

Ask for:
- Detailed description of the problem
- Ideas for the solution

### 2. Verify Context

Explore the repository to understand the current state of the code.

### 3. Explore Alternatives

Discuss other potential approaches before committing to one.

### 4. Detailed Interview

Conduct a thorough discussion of the implementation details.

### 5. Define Scope

Establish exactly what will and won't change in this refactor.

### 6. Assess Testing

Review existing test coverage and plan the testing strategy.

### 7. Plan Commits

Break the work into tiny, working increments. Each commit should leave the code in a working state.

### 8. Create Issue

File a GitHub issue using `gh issue create` with the template below.

## Issue Template

```
## Problem Statement

[Developer's perspective on the issue]

## Solution

[Developer's proposed approach]

## Commits

[Detailed implementation plan in plain English, with minimal commit sizes]

Each commit should:
- Leave code in a working state
- Be as small as possible
- Have a clear, descriptive message

## Decision Document

Key decisions covering:
- Modules affected
- Interface changes
- Architecture decisions
- Schema changes (if any)
- API contracts (if any)

## Testing Decisions

- Testing strategy
- Which behaviors will be tested
- Relevant test precedents in the codebase

## Out of Scope

[What this refactor explicitly does NOT include]

## Further Notes

[Optional: additional context]
```

Keep each refactoring step as small as possible to maintain working code throughout the process.
