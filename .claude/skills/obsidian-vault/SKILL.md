---
name: obsidian-vault
description: Manage an Obsidian vault by searching, creating, and linking notes. Use when user wants to interact with their Obsidian vault, create notes, find notes, or manage their knowledge base.
---

# Obsidian Vault

## Vault details

- **Location**: `/mnt/d/Obsidian Vault/AI Research/`
- **Structure**: Flat — all notes at root level, no subdirectories
- **Naming**: Title case (e.g., `Ralph Wiggum Index.md`)
- **Organization**: Wikilinks and index notes instead of folders

## Workflows

### Search for a note by name

```bash
find "/mnt/d/Obsidian Vault/AI Research/" -name "*.md" | grep -i "keyword"
```

### Search note contents

```bash
grep -rl "keyword" "/mnt/d/Obsidian Vault/AI Research/"
```

### Create a note

1. Use title case for the filename
2. Write focused content (one learning unit per note)
3. Add `[[wikilinks]]` to related notes
4. List dependencies and related notes at the bottom
5. Use hierarchical numbering for sequenced content (e.g., `01.`, `02.`)

### Find backlinks to a note

```bash
grep -rl "[[Note Title]]" "/mnt/d/Obsidian Vault/AI Research/"
```

### Find index notes

```bash
find "/mnt/d/Obsidian Vault/AI Research/" -name "*Index*"
```

## Conventions

- Index notes aggregate related topics: e.g., `Ralph Wiggum Index.md`
- Link with `[[Note Title]]` syntax (Obsidian wikilinks)
- Keep notes focused — one concept per note
- Avoid folders; use wikilinks for navigation
