---
name: ado-evidence
description: Collect Azure DevOps work item activity including state changes, comments, and revisions. Use when gathering evidence of ADO contributions for weekly reporting.
license: MIT
compatibility: Requires azure-devops MCP server and ADO_PAT environment variable.
metadata:
  author: bgervin
  version: "1.0"
---

# Collect ADO Evidence for Weekly Impact Reporting

Collect all Azure DevOps work item activity for the past week and create an evidence file using the ADO MCP server.

## Configuration

Before running, read `~/weekly/config.yaml` for user-specific values:
- `user_name` - Your full name
- `user_email` - Your email address
- `ado_project` - Your Azure DevOps project
- `ado_organization` - Your ADO org URL

## Arguments
- `$ARGUMENTS` - Optional: Start date in YYYY-MM-DD format (defaults to previous Sunday)

## Instructions

### Step 0: Load Configuration

Read `~/weekly/config.yaml` to get user-specific values (user_name, user_email, ado_project, ado_organization).

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

### Step 3: Query ADO for user's recent activity
Use `mcp__azure-devops__wit_my_work_items`:
- Use `type: "myactivity"` to get work items with recent user activity
- Use project from config.yaml (ado_project)
- Get up to 100 items to ensure comprehensive coverage

### Step 4: Get work item details
Use `mcp__azure-devops__wit_get_work_items_batch_by_ids`:
- Fetch full details for all work items returned
- Capture: ID, title, work item type, state, assigned to

### Step 5: For each relevant work item, get revision history
Use `mcp__azure-devops__wit_list_work_item_revisions`:
- Filter revisions to those within the date range
- Filter revisions to those made by the user (from config: user_name / user_email)
- Track these changes:
  - State changes (New → Active, Active → Resolved, etc.)
  - Assignment changes (assigned to self, reassigned to others)
  - Description updates (spec work, design details)
  - Title changes
  - Iteration/sprint changes

### Step 6: Get comments
Use `mcp__azure-devops__wit_list_work_item_comments`:
- Filter comments within the date range
- Filter comments authored by the user
- Summarize comment content (especially spec PR links, design decisions)

### Step 7: Organize results by work item type in this order:
1. Key Results (OKRs)
2. Epics
3. Features
4. User Stories
5. Tasks
6. Bugs

### Step 8: Format each work item with:
- Work item ID and title
- Bulleted list of activities with dates

## Output Format

Write to `~/weekly/weeks/{sunday-date}/evidence/ado.md`:

```markdown
# ADO Activity Evidence - Week Ending {sunday-date}

**User:** {user_name} ({user_email})
**Project:** {ado_project}
**Period:** {start-date} to {end-date}

---

## Key Results (OKRs)

### {ID} - {Title}
- **{Date}:** {Activity description}
- **{Date}:** {Another activity}

---

## Epics

### {ID} - {Title}
- **{Date}:** {Activity description}

---

## Features

### {ID} - {Title}
- **{Date}:** {Activity description}
- **{Date}:** {Another activity}

---

## User Stories

### {ID} - {Title}
- **{Date}:** {Activity description}

---

## Tasks

### {ID} - {Title}
- **{Date}:** {Activity description}

---

## Bugs

### {ID} - {Title}
- **{Date}:** {Activity description}

---

*Evidence collected from Azure DevOps revision history and comments API*
```

## Activity Types to Capture

Format activities as follows:
- **State changes:** "Changed state from {old} to {new}"
- **Self-assignment:** "Assigned work item to self"
- **Reassignment:** "Reassigned work item to {person}"
- **Description updates:** "Updated description with {summary of changes}"
- **Comments:** "Added comment: {brief summary or link}"
- **Creation:** "Created work item"
- **Iteration changes:** "Moved to iteration {iteration name}"

## Important Notes

- Use the ADO MCP server tools (`mcp__azure-devops__*`), not the az CLI
- The organization is from config.yaml (ado_organization)
- Default project is from config.yaml (ado_project)
- Run batch queries in parallel when possible to speed up collection
- Revision history contains all field changes - filter to meaningful ones
- Compare consecutive revisions to determine what changed
- The `Changed By` field in revisions identifies who made each change
- Skip work items with no user activity in the date range
- For description changes, summarize what was added (e.g., "spec details", "Plan A/B/C options")
- Include ongoing ownership items (Key Results) even without specific changes
- If a work item type section has no items, omit that section from output
