# Collect Edge Browser Evidence for Weekly Impact Reporting

Collect all Edge browser history for the past week and create an evidence file summarizing browsing activity.

## Configuration

Before running, read `~/weekly/config.yaml` for user-specific values:
- `user_name` - Your full name
- `user_email` - Your email (for identifying work profile)

## Arguments
- `$ARGUMENTS` - Optional: Start date in YYYY-MM-DD format (defaults to previous Sunday)

## Instructions

### Step 0: Load Configuration

Read `~/weekly/config.yaml` to get user-specific values.

### Step 1: Calculate date range
- Find the most recent Sunday that has passed (this is the END of the work week)
- Start date: The Monday before that Sunday (6 days before the end Sunday)
- End date: That Sunday (the end of the work week)
- The folder is ALWAYS named after the end-of-week Sunday
- Format dates as YYYY-MM-DD

### Step 2: Create directory structure (if not exists)
```
~/weekly/weeks/{end-sunday-date}/
└── evidence/
```

### Step 3: Query Edge history using the edge-history MCP server

**Get browsing statistics:**
Use `mcp__edge-history__get_history_stats` with start_date and end_date to get:
- Total visits
- Unique URLs
- Top 20 domains visited

**Get detailed history:**
Use `mcp__edge-history__read_history_by_date` with start_date and end_date to get all browsing entries.

### Step 4: Analyze and categorize browsing activity by domain/purpose

**Work-Related Categories:**
- **Azure DevOps**: dev.azure.com, visualstudio.com (ADO boards, PRs, wikis)
- **GitHub**: github.com (repos, PRs, issues)
- **Microsoft 365**: outlook.office.com, teams.microsoft.com, sharepoint.com, loop.microsoft.com
- **Documentation**: learn.microsoft.com, docs.microsoft.com, MDN, Stack Overflow
- **Development Tools**: localhost, npm, PyPI, nuget.org
- **AI/LLM**: claude.ai, chat.openai.com, copilot.microsoft.com

**Filter out:**
- Personal browsing (social media unless work-related)
- Generic search engine queries
- News/entertainment sites

### Step 5: Extract meaningful activities from URLs
- ADO work item IDs from URLs (e.g., workitems/edit/12345)
- GitHub PR/issue numbers
- Documentation topics being researched
- SharePoint/OneDrive files accessed
- Teams channels/chats accessed

### Step 6: Group activities by day and category

## Output Format

Write to `~/weekly/weeks/{end-sunday-date}/evidence/edge.md`:

```markdown
# Edge Browser Activity Evidence - Week of {start-date} to {end-date}

## Summary

| Metric | Value |
|--------|-------|
| Total Page Visits | {n} |
| Unique URLs | {n} |
| Active Days | {n} |

### Top Domains
| Domain | Visits |
|--------|--------|
| {domain} | {count} |

---

## Work Activity by Category

### Azure DevOps
- **{Date}**: Viewed work item #{id} - {inferred title/context}
- **{Date}**: Reviewed PR #{id} in {repo}
- **{Date}**: Edited wiki page {page}

### GitHub
- **{Date}**: Viewed PR #{number} in {owner}/{repo}
- **{Date}**: Browsed issues in {owner}/{repo}
- **{Date}**: Reviewed code in {file path}

### Documentation & Research
- **{Date}**: Researched "{topic}" on {site}
- **{Date}**: Read docs for {library/API}

### Microsoft 365
- **{Date}**: Accessed SharePoint site {site}
- **{Date}**: Viewed Loop component/page
- **{Date}**: Used Teams {channel/chat context}

### Development & Tools
- **{Date}**: Worked on localhost:{port} ({inferred project})
- **{Date}**: Viewed package {name} on npm/PyPI

### AI Assistance
- **{Date}**: Used Claude.ai for {inferred purpose}
- **{Date}**: Used GitHub Copilot / ChatGPT

---

## Daily Browsing Timeline

### {Day}, {Date}

**Morning (before noon):**
- {time} - {activity summary}

**Afternoon:**
- {time} - {activity summary}

**Evening (after 5pm):**
- {time} - {activity summary}

---

*Evidence collected from Edge browser history (work profile: {user_email})*
```

## Important Notes

- Use the edge-history MCP server tools (`mcp__edge-history__*`)
- The MCP server automatically copies the database to avoid lock conflicts
- Focus on work-related browsing - filter out obvious personal activity
- Infer context from URLs where possible (work item IDs, PR numbers, doc topics)
- Group repetitive visits to the same resource (don't list 50 visits to the same ADO board)
- For localhost URLs, try to infer project from port number or path
- Respect privacy - summarize activity patterns rather than listing every URL
- If the MCP server fails, ensure Edge is the default browser profile path is correct
