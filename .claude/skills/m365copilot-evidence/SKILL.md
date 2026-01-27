# Collect M365 Copilot Chat Evidence for Weekly Impact Reporting

Collect M365 Copilot (BizChat) conversation history for the past week and create an evidence file using the Playwright scraper.

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

### Step 3: Run the Copilot scraper from `~/weekly/tools/copilot-scraper/`:
```bash
cd ~/weekly/tools/copilot-scraper && npx ts-node copilot-history-scraper.ts --max 50
```

**Important**: This requires Edge browser. The script will:
- Launch Edge with Windows SSO (no extension needed)
- Navigate to https://m365.cloud.microsoft/chat
- Scrape conversation history from the sidebar
- Save results to `copilot-history.json`

### Step 4: Read the scraped JSON from `~/weekly/tools/copilot-scraper/copilot-history.json`

### Step 5: Filter conversations to those within the date range
- Check the `scrapedAt` timestamp for each conversation
- Or infer dates from conversation content if timestamps are missing
- Note: BizChat doesn't expose exact conversation dates, so include recent conversations

### Step 6: Organize results by theme or topic
- Group related conversations together
- Identify patterns (research, analysis, content creation, troubleshooting)
- Extract key prompts and insights from each conversation

## Output Format

Write to `~/weekly/weeks/{sunday-date}/evidence/CopilotChat.md`:

```markdown
# M365 Copilot Chat Evidence - Week of {start-date} to {end-date}

## Summary

{1-2 sentence overview of the week's Copilot usage}

---

## Conversations

### {Conversation Title}

**Topic:** {Brief categorization - Research, Analysis, Content Creation, etc.}

**My Prompt:**
> {The user's prompt/question}

**Key Insights from Copilot:**
- {Main point 1}
- {Main point 2}
- {Main point 3}

**Artifacts/Outcomes:**
- {Any documents, decisions, or outputs mentioned}

---

### {Another Conversation Title}
...

---

## Usage Patterns

| Category | Count | Examples |
|----------|-------|----------|
| Research/Analysis | {n} | {topics} |
| Content Creation | {n} | {documents, updates} |
| Technical Help | {n} | {tools, troubleshooting} |
| Meeting Prep | {n} | {meetings, agendas} |

---

## Key Themes

1. **{Theme 1}**: {Description of pattern or focus area}

2. **{Theme 2}**: {Description of pattern or focus area}

---

*Evidence collected via M365 Copilot Chat UI scraping*
```

## Important Notes

- The scraper requires Edge browser and uses Windows SSO for authentication
- BizChat conversations are not exposed via API - scraping is the only way to access history
- The `copilot-history.json` contains the raw scraped data for reference
- Screenshots of each conversation are saved as `copilot-conv-{n}.png` in the scraper directory
- If the scraper fails to find conversations, check `copilot-debug.png` and `copilot-debug.html`
- Run the scraper manually first if authentication is needed
- The conversation list may include more than just the target week - filter appropriately
- Summarize lengthy Copilot responses into key bullet points
- Cross-reference with M365 evidence for documents/files mentioned in conversations
