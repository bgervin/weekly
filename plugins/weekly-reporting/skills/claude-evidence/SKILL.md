---
name: claude-evidence
description: Collect Claude Code session history including prompts and projects worked on. Use when gathering evidence of AI-assisted development for weekly reporting.
license: MIT
compatibility: Requires local access to ~/.claude/history.jsonl. Local execution only.
metadata:
  author: bgervin
  version: "1.0"
---

# Collect Claude Code Evidence for Weekly Impact Reporting

Collect all Claude Code conversation activity for the past week and create an evidence file.

## Configuration

Before running, read `~/weekly/config.yaml` for user-specific values:
- `user_name` - Your full name (for report headers)

## Arguments
- `$ARGUMENTS` - Optional: Start date in YYYY-MM-DD format (defaults to previous Sunday)

## Instructions

### Step 0: Load Configuration

Read `~/weekly/config.yaml` to get user-specific values.

### Step 1: Calculate date range
- End date: Today's date (or Saturday of the week)
- Start date: The most recent Sunday (or provided date)
- Format dates as YYYY-MM-DD

### Step 2: Create directory structure (if not exists)
```
~/weekly/weeks/{sunday-date}/
├── evidence/
└── impact/
```

### Step 3: Read Claude Code history from `~/.claude/history.jsonl`
- Each line is a JSON object with: `display` (prompt text), `timestamp` (epoch ms), `project` (path), `sessionId` (uuid)
- Filter entries where timestamp falls within the date range
- Group entries by project path

### Step 4: For each project with activity
- Identify the repository/project name from the path
- Summarize the types of work done based on prompt patterns:
  - Specification writing (specs, documentation)
  - Implementation (code changes, features, fixes)
  - Configuration (setup, tooling, MCP)
  - Research/exploration (searching, understanding code)
  - Testing (running tests, debugging)

### Step 5: Analyze conversation themes
- Look for patterns in the prompts (feature names, issue numbers, work items)
- Identify PRs created or issues addressed
- Note any tools or frameworks set up

### Step 6: Organize results by project, then by work type

## Output Format

Write to `~/weekly/weeks/{sunday-date}/evidence/claude.md`:

```markdown
# Claude Code Activity Evidence - Week of {start-date} to {end-date}

## Summary

{1-2 sentence overview of the week's Claude Code usage}

---

## {owner}/{repo} (or Project Name)

### Specification Development

**{Work Item or Feature Name}** ({Date})
- {What was created/defined}
- {Key decisions or models}
- {Resulting PR if applicable}

### Implementation Work

**{Feature or Fix Name}** ({Date range})
- {What was implemented}
- {Files/components affected}
- {Issues addressed, PRs created}

### Configuration/Tooling

**{Tool or Setup Name}** ({Date})
- {What was configured}
- {Integration details}

---

## {Another Project}
...

---

## Key Outcomes

| Category | Count | Details |
|----------|-------|---------|
| Specs Written | {n} | {list} |
| PRs Created | {n} | {PR numbers} |
| PRs Merged | {n} | {PR numbers} |
| Issues Addressed | {n} | {issue numbers} |
| Tools Configured | {n} | {list} |

---

## Session Themes

1. **{Theme 1}**: {Description of pattern or focus area}

2. **{Theme 2}**: {Description of pattern or focus area}
```

## Important Notes

- The history.jsonl file contains prompts only, not full conversation transcripts
- Use prompt text to infer the type of work being done
- Cross-reference with github.md evidence for PR/issue numbers when available
- Group related prompts into coherent work items
- For detailed session data, check `~/.claude/projects/{project-path-hash}/` directories
- Session transcript files (*.jsonl) in project directories contain full conversation history if deeper analysis is needed
- Summarize lengthy work into concise bullet points
- Identify work items by patterns like "WI-", "Issue #", "PR #" in prompts
