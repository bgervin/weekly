# Collect M365 Evidence for Weekly Impact Reporting

Collect all Microsoft 365 activity for the past week and create an evidence file using the WorkIQ MCP.

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

### Step 3: Query WorkIQ MCP for each category
Run these queries using `mcp__workiq__ask_work_iq`:

**Query 1 - Emails:**
```
List all emails I sent or replied to in the past week ({start} to {end}). For each email, include the date, recipients (To), subject line, and a brief summary of what I wrote.
```

**Query 2 - Teams Messages:**
```
List all Teams message threads I participated in during the past week ({start} to {end}), including individual chats, group chats, and channel conversations. Exclude meeting chats. For each conversation, include the date, the people involved, and summarize my contributions to the thread.
```

**Query 3 - Meetings:**
```
List all meetings I attended in the past week ({start} to {end}) where I either spoke (based on transcript) or sent messages in the meeting chat. For each meeting, include the date, title, my key contributions from the transcript or chat, and any outcomes or decisions made. If I attended but there's no transcript or chat, still include the meeting with just the title.
```

**Query 4 - Files:**
```
List all files and documents I worked on in the past week ({start} to {end}) - including files I created, edited, reviewed, or commented on. For each document, include the dates I worked on it, what I contributed, and who else was involved (co-authors, reviewers, or recipients).
```

**Query 5 - Loop:**
```
List all Loop files, Loop pages, and Loop components I created, edited, or commented on in the past week ({start} to {end}). For each Loop item, include the title, the date I worked on it, what I did (created, edited, commented), and summarize my contributions or changes.
```

### Step 4: Organize and format results into the M365.md file

## Output Format

Write to `~/weekly/weeks/{sunday-date}/evidence/M365.md`:

```markdown
# M365 Activity Evidence - Week of {start-date} to {end-date}

## Emails Sent/Replied

| Date | To | Subject | Summary |
|------|-----|---------|---------|
| {date} | {recipient} | {subject} | {summary of what I wrote} |

---

## Teams Message Threads (Non-Meeting)

### {Day, Date}

- **{Chat type}: {Participants}**
  - {My contribution 1}
  - {My contribution 2}

---

## Meetings Attended

### {Day, Date}

**{Meeting Title}** ({Transcribed/Not transcribed})
- {My contribution from transcript or chat}
- {Another contribution}
- **Outcomes**: {Decisions or action items}

---

## Files Contributed To

### Confirmed Author

**{Document Title}** ({File type})
- **Dates worked**: {dates}
- **My contribution**: {what I did}
- **Others involved**: {collaborators}

### Collaboration/Review

**{Document Title}** ({File type})
- **Dates worked**: {dates}
- **My contribution**: {what I did}
- **Others involved**: {collaborators}

---

## Loop Activity

### Loop Components/Pages Edited or Commented

- **{Date}** - **{Loop title}**
  - {What I did/added/commented}

### Loop Workspace Administration

- **{Date}** - **{Workspace name}**
  - {Action taken: invited collaborators, created, etc.}
```

## Important Notes

- Use the WorkIQ MCP tool (`mcp__workiq__ask_work_iq`), not direct Graph API calls
- Run queries in parallel when possible to speed up collection
- For meetings without transcripts, still include the meeting title
- Summarize lengthy contributions into 1-2 line descriptions
- Group Teams messages by date, then by chat/channel
- For files, distinguish between "Confirmed Author" (explicitly listed) and "Collaboration/Review" (participated in discussions)
- Loop activity may be limited - the tool doesn't always expose per-component edit history
- If a query times out, retry it once before moving on
