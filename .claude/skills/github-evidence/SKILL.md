---
name: github-evidence
description: Collect GitHub PRs created, reviewed, and merged, plus issues and comments. Use when gathering evidence of code contributions for weekly reporting.
license: MIT
compatibility: Requires github MCP server and GITHUB_TOKEN environment variable.
metadata:
  author: bgervin
  version: "1.0"
---

# Collect GitHub Evidence for Weekly Impact Reporting

Collect all GitHub activity for the specified user over the past week and create an evidence file.

## Configuration

Before running, read `~/weekly/config.yaml` for user-specific values:
- `github_username` - Your GitHub handle

## Arguments
- `$ARGUMENTS` - Optional: GitHub username (defaults to github_username from config) or "username:date" format (e.g., "bgervin:2026-01-19")

## Instructions

### Step 0: Load Configuration

Read `~/weekly/config.yaml` to get the default github_username.

### Step 1: Parse arguments
Extract username and optional start date from `$ARGUMENTS`. If not provided, use github_username from config and calculate the previous Sunday as the start date.

### Step 2: Calculate date range
- End date: Today's date
- Start date: The most recent Sunday (or provided date)
- Format dates as YYYY-MM-DD

### Step 3: Create directory structure (if not exists)
```
~/weekly/weeks/{sunday-date}/
├── evidence/
└── impact/
```

### Step 4: Query GitHub using MCP tools for ALL activity types
Run these searches in parallel:
- `author:{username} created:{start}..{end}` - PRs and issues created
- `commenter:{username} updated:{start}..{end}` - Items commented on
- `reviewed-by:{username} updated:{start}..{end}` - PRs reviewed
- `assignee:{username} updated:{start}..{end}` - Items assigned

### Step 5: For each PR found, get additional details
- Files changed count and lines changed (use `get_pull_request_files`)
- Related issues it closes
- Merge status

### Step 6: Organize results by repository, then by activity type
- Pull Requests Created
- Pull Requests Merged
- Pull Requests Reviewed
- Pull Requests Commented
- Issues Created
- Issues Commented
- Issues Assigned/Status Changed

### Step 7: Format each item as:
```
- **{type} #{number}**: {action} "{title}" on {date} at {time}
  - {additional context: files changed, closes issues, etc.}
```

### Step 8: Write to file
`~/weekly/weeks/{sunday-date}/evidence/github.md`

## Output Format

```markdown
# GitHub Activity Evidence - Week of {start-date} to {end-date}

## {owner}/{repo}

### Pull Requests Created

- **PR #123**: created "feat: add new feature" on 2026-01-20 at 3:45pm
  - 5 files changed (~120 lines)
  - Closes #100, #101
  - Status: Open/Merged

### Pull Requests Reviewed

- **PR #456**: reviewed "fix: bug fix" on 2026-01-21 at 10:00am
  - Approved/Requested changes/Commented

### Issues Created

- **Issue #789**: created "Feature request: new capability" on 2026-01-22 at 2:30pm

### Issues Commented

- **Issue #101**: commented on "Bug report" on 2026-01-23 at 11:15am

---

## {another-owner}/{another-repo}
...
```

## Important Notes

- Use the GitHub MCP server tools (mcp__github__*), not the gh CLI
- Always search with `per_page: 100` to get comprehensive results
- For lengthy PRs, summarize the description into a 1-liner
- Include timezone context when displaying times
- If multiple activities on the same item, list each on its own line
