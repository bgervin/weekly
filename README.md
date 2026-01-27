# Weekly Impact Reporting

Automated weekly impact reporting using Claude Code skills. Collects evidence from multiple sources (GitHub, Azure DevOps, M365, browser history, AI tools) and generates structured impact reports for different audiences.

## Setup

1. **Copy configuration template**
   ```bash
   cp config.example.yaml config.yaml
   ```
   Edit `config.yaml` with your personal values.

2. **Set environment variables** for MCP servers:
   - `GITHUB_TOKEN` - GitHub personal access token
   - `ADO_ORG_URL` - Azure DevOps org URL (e.g., `https://dev.azure.com/your-org`)
   - `ADO_PAT` - Azure DevOps personal access token

3. **Install scraper dependencies**
   ```bash
   cd tools/copilot-scraper && npm install
   ```

## Usage

Run Claude Code from this directory:
```bash
cd ~/weekly
claude
```

### Evidence Collection Skills

Run these skills to gather evidence from each source:

| Skill | Description |
|-------|-------------|
| `/ado-evidence` | Collect Azure DevOps work item activity |
| `/github-evidence` | Collect GitHub PRs, issues, and comments |
| `/m365-evidence` | Collect M365 activity (email, Teams, meetings, files) |
| `/m365copilot-evidence` | Collect M365 Copilot chat history |
| `/claude-evidence` | Collect Claude Code session history |
| `/edge-evidence` | Collect Edge browser history |

### Impact Report Generation

After collecting evidence, generate impact reports:

| Skill | Description |
|-------|-------------|
| `/weekly-impact` | Generate comprehensive impact report with audience-specific summaries |

## Directory Structure

```
~/weekly/
├── .claude/skills/          # Project-scoped skills (committed)
├── tools/copilot-scraper/   # M365 Copilot scraper tool (committed)
├── config.example.yaml      # Configuration template (committed)
├── .mcp.json               # MCP server config (committed)
├── .gitignore              # Excludes personal data (committed)
│
│  --- Personal (gitignored) ---
├── config.yaml             # Your personal settings
├── goals.md                # Your goals document
└── weeks/                  # Weekly data
    └── YYYY-MM-DD/
        ├── evidence/       # Raw evidence from each source
        └── impact/         # Generated impact reports
```

## Workflow

1. **Monday-Friday**: Do your work normally
2. **Friday/Weekend**: Run evidence collection skills
3. **Weekend**: Run `/weekly-impact` to generate reports
4. **Monday**: Copy relevant reports for Connect check-ins

## Requirements

- Claude Code CLI
- Node.js (for MCP servers and scraper)
- Edge browser (for M365 Copilot scraper - uses Windows SSO)
- GitHub personal access token
- Azure DevOps personal access token

## Contributing

Feel free to customize the skills for your workflow. The skill files are in `.claude/skills/*/SKILL.md`.
