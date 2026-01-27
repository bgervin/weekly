---
name: weekly-impact
description: Generate comprehensive weekly impact reports by analyzing collected evidence against your goals. Creates audience-specific summaries for manager, skip-level, executive, and team. Use after running evidence collection skills.
license: MIT
metadata:
  author: bgervin
  version: "1.0"
---

# Weekly Impact Analysis

Generate a comprehensive weekly impact analysis comparing evidence against goals.

## Configuration

Before running, read `~/weekly/config.yaml` for user-specific values:
- `user_name` - Your full name
- `manager_name`, `skip_level_name`, `executive_name` - Report recipients
- `team_name` - Your team name

## Instructions

You are analyzing weekly work evidence to create an impact report for Connect check-ins.

### Step 0: Load Configuration

Read `~/weekly/config.yaml` to get user-specific values. Use these throughout the report generation.

### Step 1: Determine the Week

If no date argument is provided, use the most recent Sunday (yesterday if today is Monday, or the previous Sunday).
Format: `yyyy-mm-dd`

The week folder will be at: `~/weekly/weeks/{date}/`

### Step 2: Read All Evidence

Read ALL markdown files (*.md) from `~/weekly/weeks/{date}/evidence/` folder. These are your data sources:
- `ado.md` - Azure DevOps work items
- `claude.md` - Claude Code sessions
- `github.md` - GitHub PRs, issues, comments
- `edge.md` - Browser activity
- `M365.md` - Emails, Teams, meetings, files
- `CopilotChat.md` - M365 Copilot conversations

Also read the goals file: `~/weekly/goals.md`

### Step 3: Create Impact Folder

Ensure `~/weekly/weeks/{date}/impact/` exists.

### Step 4: Generate impact.md

Create `~/weekly/weeks/{date}/impact/impact.md` with the following structure:

```markdown
# Weekly Impact Report - Week Ending {date}

## Executive Summary
[2-3 sentence high-level summary of the week]

---

## Goal Alignment Scorecard

| Goal | Time Investment | Progress | Trend |
|------|-----------------|----------|-------|
| 1. Agent Quality Hero | [%] | [status] | [↑/↓/→] |
| 2. Developer Time-to-Value | [%] | [status] | [↑/↓/→] |
| 3. Modernize DevX Tooling | [%] | [status] | [↑/↓/→] |
| 4. AI-Forward Practices | [%] | [status] | [↑/↓/→] |
| 5. Team Culture | [%] | [status] | [↑/↓/→] |
| Unaligned/Operational | [%] | - | - |

---

## Goal 1: Agent Quality Hero (OKR 1.5.2)

### This Week's Progress
[Bullet points of specific accomplishments aligned to this goal]

### Evidence
[Links/references to specific work items, PRs, meetings, documents]

### Key Decisions Made
[Any decisions or positions taken]

### Blockers/Risks
[Current obstacles]

### Next Week Focus
[2-3 specific actions to advance this goal]

---

## Goal 2: Developer Time-to-Value (OKRs 1.5.1 & 1.5.3)

[Same structure as Goal 1]

---

## Goal 3: Modernize DevX Tooling (OKR 2.1.1)

[Same structure as Goal 1]

---

## Goal 4: AI-Forward Practices

[Same structure as Goal 1]

---

## Goal 5: Team Culture

[Same structure as Goal 1]

---

## Unaligned Work & Invisible Labor

### Operational Overhead
[Work that doesn't directly advance goals but keeps things running]

### Ad-hoc Requests
[Unplanned work that came up]

### Process/Compliance
[Time spent on required but non-goal activities]

### Recommendation
[Should any of this be eliminated, delegated, or turned into a goal?]

---

## What's on {user_name}'s Mind

Based on evidence patterns (research topics, Copilot queries, meeting discussions, communications):

### Strategic Questions Being Explored
[What big questions are being worked through?]

### Concerns & Tensions
[What's causing friction or worry?]

### Emerging Opportunities
[What new possibilities are being noticed?]

### Learning & Growth Areas
[What new knowledge is being acquired?]

---

## Contributing to Others' Success

### Direct Reports & Team
[How did work help team members succeed?]

### Cross-Team Collaboration
[How did work help other teams/orgs?]

### Knowledge Sharing
[Docs, guidance, advice shared]

---

## Leveraging Others' Work

### Dependencies Unblocked
[What did others do that enabled progress?]

### Collaboration Value
[Joint work that amplified impact]

### Tools & Resources Used
[External tools, platforms, people that accelerated work]

---

## Leadership Behaviors Demonstrated

| Behavior | Evidence |
|----------|----------|
| Create Clarity | [examples] |
| Generate Energy | [examples] |
| Deliver Success | [examples] |
| Customer Obsession | [examples] |
| Model, Coach, Care | [examples] |

---

## Artifacts Created This Week

| Type | Name | Purpose |
|------|------|---------|
| [Spec/PR/Doc/etc] | [Name] | [Why it matters] |

---

## Key Meetings & Decisions

| Meeting | Key Outcome/Decision |
|---------|---------------------|
| [meeting name] | [what was decided] |

---

*Generated: {timestamp}*
```

### Step 5: Generate to-{manager}.md (Direct Manager)

Create `~/weekly/weeks/{date}/impact/to-{manager_name}.md` (use lowercase, hyphenated version of manager_name from config):

```markdown
# Weekly Update - Week of {date}

Hi {manager_name},

## TL;DR
[1-2 sentences: What's the one thing to know?]

## Progress on Key Deliverables

### Agent Quality (OKR 1.5.2)
[1-2 bullet points of tangible progress]

### Time-to-Value (OKRs 1.5.1/1.5.3)
[1-2 bullet points]

### Team/Operational
[1-2 bullet points]

## Blockers Needing Your Help
[Any escalations or air cover needed]

## Looking Ahead
[What I'm focused on next week]

---
{user_name}
```

### Step 6: Generate to-{skip_level}.md (Skip Level)

Create `~/weekly/weeks/{date}/impact/to-{skip_level_name}.md` (use lowercase, hyphenated version):

Focus on strategic impact and cross-org influence:

```markdown
# Weekly Highlights - Week of {date}

Hi {skip_level_name},

## Strategic Progress

### Quality-First Platform Story
[How the Agent Quality work is advancing the broader DevX strategy]

### Cross-Org Coordination
[Key stakeholder engagements, alignment achieved]

### Customer/Partner Signal
[Any pilot feedback or customer insights]

## Emerging Risks or Opportunities
[Strategic items that may need LT visibility]

## Team Health
[Brief note on team morale/capacity]

---
{user_name}
```

### Step 7: Generate to-{executive}.md (Executive Level)

Create `~/weekly/weeks/{date}/impact/to-{executive_name}.md` (use lowercase version):

Focus on business outcomes and executive-level signal:

```markdown
# Weekly Signal - Week of {date}

Hi {executive_name},

## One Thing to Know
[Single most important insight or progress point]

## Customer Impact
[How this week's work moves the needle on adoption/retention]

## Cross-Org Progress
[Key alignment achieved across DevX/Azure/MCS]

## Ask or FYI
[Any item needing executive visibility or decision]

---
{user_name}
```

### Step 8: Generate to-team.md

Create `~/weekly/weeks/{date}/impact/to-team.md`:

```markdown
# Top of Mind - Week of {date}

Hey team,

## What I'm Thinking About

[Authentic reflection on the strategic questions, challenges, and opportunities being worked through. Share context that helps the team understand the "why" behind priorities.]

## Wins to Celebrate

[Call out specific contributions from team members]

## Heads Up

[Upcoming changes, things to be aware of]

## How I Can Help

[Offer specific support]

---
{user_name}
```

### Important Guidelines

1. **Be Honest**: If time wasn't spent on a goal, say so. The scorecard should reflect reality.

2. **Be Specific**: Reference actual PRs, work items, meetings, documents by name/number.

3. **Be Concise**: Executives skim. Use bullets. Lead with the punchline.

4. **Be Actionable**: Next week's focus should be concrete, not vague.

5. **Surface Invisible Labor**: Make visible the work that doesn't show up in commits but is essential.

6. **Preserve Voice**: These are from the user - maintain a professional but authentic tone.

7. **Altitude Matters**:
   - Manager: Tactical, what's shipping, what needs help
   - Skip Level: Strategic, cross-org, team health
   - Executive: Business outcomes, customer impact, decisions needed
   - Team: Context, recognition, support

### Output

After creating all files, summarize what was generated and highlight the most notable insights from the analysis.
