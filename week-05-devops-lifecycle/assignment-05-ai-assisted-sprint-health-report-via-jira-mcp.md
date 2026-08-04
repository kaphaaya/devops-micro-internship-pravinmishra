# Assignment 5 — AI-Assisted Sprint Health Report via Jira MCP

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will connect Claude Code to your Jira board through an MCP server, the same way you connected it to GitHub in Week 2, and build a read-only `/sprint-health` skill. The skill reads your current sprint through Jira's API and reports sprint velocity, stories at risk of missing the sprint, and items missing an estimate — but it must never create, edit, comment on, or transition a single ticket itself. You will prove that boundary holds by making a real change on the board yourself and confirming the skill only ever reports, never acts.

---

# Task 1 — Create a Jira API Token

## Goal

Generate an API token from your Atlassian account that the MCP server will use to authenticate with your Jira site. Do not screenshot the token value itself.

### Evidence

#### Screenshot 1 — Jira API token creation confirmation page showing the token name, with the token value not visible

<img width="1792" height="999" alt="Screenshot 1" src="https://github.com/user-attachments/assets/5a611e47-4b4f-49dc-aa88-a13fa6e2e17f" />


### Notes You Must Write (Very Important):

Why does the MCP server need your site URL and account email in addition to the token?

- The API token alone isn't enough because Jira needs to know which instance to connect to. My site URL tells the MCP server exactly where my Jira board lives (e.g., azizolaidekafayat.atlassian.net). The email identifies which user account the token belongs to, so Jira can verify permissions and authenticate my access. Together, these three pieces: site URL, email, and token, form a complete authentication handshake.

---

# Task 2 — Create .mcp.json at the Project Root

## Goal

Create or update `.mcp.json` at your project root with a Jira MCP server block, following the same shape as the GitHub MCP server you configured in Week 2.

### Evidence

#### Screenshot 2 — `.mcp.json` open in VS Code showing the Jira server configuration

<img width="1792" height="1118" alt="Screenshot 2" src="https://github.com/user-attachments/assets/ec0d723f-9184-4107-b4ec-dc1487227abd" />


### Notes You Must Write (Very Important):

Compare this jira block to the github block from Week 2 Assignment 5. The GitHub server ran via npx (a Node.js package); this one runs via uvx (a Python package) — what stays exactly the same shape despite that difference, and why doesn't Claude Code care which language a given MCP server is written in?

- The structure is identical: both have command, args, and env with placeholder variables. GitHub uses npx (Node.js) and Jira uses uvx (Python), but Claude Code treats them the same way because MCP is language-agnostic. The protocol is what matters, not the implementation. Claude Code just runs whatever command you specify and expects an MCP-compliant server to respond on the other end. It doesn't care if that server is written in Python, Node, Go, or anything else.

---

# Task 3 — Add Your Credentials to settings.local.json

## Goal

Add your Jira site URL, account email, and API token to `.claude/settings.local.json`, and confirm that file is listed in `.gitignore` so it is never committed.

### Evidence

#### Screenshot 3 — `settings.local.json` open in VS Code showing the `env` section, with the actual token value blurred or covered

<img width="1785" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/583b9760-c76a-4b68-b16b-62ed0ca8a1df" />


### Notes You Must Write (Very Important):

Why must JIRA_API_TOKEN live in settings.local.json and never in .mcp.json?

- Because .mcp.json is committed to Git and shared publicly on GitHub. If I put the token there, it would be exposed to anyone who clones the repo. settings.local.json stays in .gitignore, so it never leaves my machine. The token is a secret credential. It's the same reason you never hardcode passwords in code. The .mcp.json file uses placeholder variables like ${JIRA_API_TOKEN} that point to the actual secret stored safely in the local settings file.

---

# Task 4 — Verify the Connection with /mcp

## Goal

Restart Claude Code and confirm the Jira MCP server shows as connected.

### Evidence

#### Screenshot 4 — `/mcp` output showing `jira: connected`

<img width="1792" height="1120" alt="Screenshot 4" src="https://github.com/user-attachments/assets/2109177d-c52e-42b7-8c1a-58bc1cd04058" />


---

# Task 5 — Run a Live Query to Prove Real Board Data

## Goal

Ask Claude to list the issues in your current active sprint through the Jira MCP connection, and confirm the result matches what you see on your live board in the browser.

### Evidence

#### Screenshot 5 — Claude's response showing the live sprint issue list retrieved via Jira MCP

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/4e4ab58e-8229-419c-8289-1fb15c0ec4bc" />


### Notes You Must Write (Very Important):

How did you confirm this was real board data and not something Claude guessed?

- I compared Claude's response directly to my live Jira board in the browser. The issue keys (DMIWEB-16, DMIWEB-17, etc.), summaries, and statuses matched exactly what I saw on the Sprint board. If Claude was just guessing, it would have made up generic issue names or statuses. The fact that it pulled my exact sprint data with my exact issue keys proved it was reading from the live MCP connection.

---

# Task 6 — Build the /sprint-health Skill

## Goal

Create a `/sprint-health` skill restricted to read-only Jira tools plus `Read`, with no issue-mutating tools and no `Write`. Run it and confirm it produces a report covering sprint velocity, at-risk stories, and items missing an estimate.

### Evidence

#### Screenshot 6 — `SKILL.md` frontmatter showing `allowed-tools` limited to read-only Jira tools plus `Read`, with `disable-model-invocation: true`

<img width="1792" height="896" alt="Screenshot 6" src="https://github.com/user-attachments/assets/10ffae9e-16ce-4a49-bc76-8767e290945e" />


#### Screenshot 7 — `/sprint-health` output showing the full triage report against your real sprint

<img width="1792" height="1120" alt="Screenshot 7" src="https://github.com/user-attachments/assets/5344d90a-942d-430d-820b-7af567c5716c" />


### Notes You Must Write (Very Important):

1. Which Jira MCP tools does this skill's allowed-tools list include, and which mutating tools (create issue, update issue, transition issue, add comment) does it deliberately exclude?

- The skill includes: jira:search_issues, jira:get_issue, and jira:get_sprint. These are all read-only tools. I deliberately excluded jira:create_issue, jira:update_issue, jira:transition_issue, and jira:add_comment. I also excluded the Write tool entirely. This means the skill can only look at data, never change it.

2. Why does a Scrum Master need this restriction more than almost any other role in this course?

- A Scrum Master's job is to observe, report, and guide the team, not to make decisions for them. If a skill could edit tickets or move issues, it could accidentally corrupt the sprint or override human judgment. By locking the skill to read-only, I ensure it stays a tool for insight and transparency, not automation that makes decisions. The team owns the board. The skill just illuminates what's happening.
---

# Task 7 — Prove the Skill Never Mutates the Board

## Goal

Manually update one ticket on your board in the browser (for example, move a story to "Done" or add a missing estimate), then run `/sprint-health` again and confirm the new report reflects your change — proving the skill only ever reads live state and never wrote to the board itself.

### Evidence

#### Screenshot 8 — Second `/sprint-health` run showing the report now reflects your manual board change

<img width="1792" height="1120" alt="Screenshot 8" src="https://github.com/user-attachments/assets/98cf8db1-2e45-44d6-869c-07074df994bd" />


### Notes You Must Write (Very Important):

Map this assignment to Gather → Analyze → Human Act → Verify from Week 3 Assignment 6. Which step did you perform manually in the browser, and why must that step stay human?

- Gather: The sprint-health skill reads live sprint data from Jira via MCP (automated).
- Analyze: The skill produces a report identifying risks, velocity, and gaps (automated).
- Human Act: I manually moved a story to Done in the browser (human decision).
- Verify: The second sprint-health run confirmed the report reflected my change (automated verification). The Human Act step must stay human because only people should decide which tickets to move, which to estimate, and which to deprioritize. The skill informs but never decides.

---

# Submission Instructions

Complete all tasks in sequence.

Your submission must include:
- All 8 required screenshots
- All the required notes

---

# Completion Checklist

- [ ] Task 1: Jira API token created, value never screenshotted (Screenshot 1)
- [ ] Task 2: `.mcp.json` has the Jira server block (Screenshot 2)
- [ ] Task 3: Credentials stored in `settings.local.json`, token blurred, file gitignored (Screenshot 3)
- [ ] Task 4: `/mcp` shows the Jira server connected (Screenshot 4)
- [ ] Task 5: Live query returned real sprint data, verified against the browser (Screenshot 5)
- [ ] Task 6: `/sprint-health` skill created with correct read-only `allowed-tools`, and produced a full report (Screenshots 6–7)
- [ ] Task 7: A manual board change was reflected in a second `/sprint-health` run (Screenshot 8)
- [ ] Skill never created, edited, transitioned, or commented on any issue
- [ ] Reflection answered (Notes)
- [ ] No API token value exposed

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory) focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## 📌 Resources

- 🌐 DMI Official Website: https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme  
- 🎓 University: https://university.pravinmishra.com?utm_source=github&utm_medium=readme  
- 💬 Discord Community: https://discord.pravinmishra.com?utm_source=github&utm_medium=readme  
- 📝 Blog: https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme  
- ▶️ YouTube Playlist: https://www.youtube.com/playlist?list=PLFeSNDtI4Cho  
- 🔗 Pravin Mishra (LinkedIn): https://www.linkedin.com/in/pravin-mishra-aws-trainer/  
- 🏢 CloudAdvisory (LinkedIn): https://www.linkedin.com/company/thecloudadvisory/

---

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
