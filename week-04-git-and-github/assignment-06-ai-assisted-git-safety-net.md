# Assignment 6 — Building an AI-Assisted Git Safety Net (PR Ready Check)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In Week 2 you built Claude Code hooks that block a dangerous action *before* it happens (`PreToolUse`), and a restricted skill that could look but not touch (`allowed-tools` without `Write`). In this assignment you will discover that Git has the exact same idea, decades older: a **pre-commit hook** that blocks a commit before it's created.

You will build both halves of a real "PR Ready" workflow:

1. A **Git hook that follows fixed rules** — scans staged changes for hardcoded secrets and oversized files and refuses the commit. No AI involved, no guessing, just a rule that gives the same answer every time.
2. A **restricted Claude Code skill** (`/pr-ready`) that reads your staged diff and drafts a Pull Request title, description, and a short list of things worth a second look — the kind of judgment a fixed rule can't make (mixed changes, missing context, unclear intent). The skill never commits, pushes, or opens the PR. You do that yourself, using its draft as a starting point.

This mirrors the Agentic Loop from Week 3's Linux triage assignment: **Gather → Analyze → Human Act → Verify**. The hook and the skill both gather and analyze; only you act.

---

# Task 0 — Confirm Your Fork and Create a Feature Branch

## Goal

Confirm you are working in your own fork, then create a dedicated branch for this assignment.

### Evidence

#### Screenshot 1 — Output of git remote -v and git branch showing the new branch


<img width="837" height="382" alt="Screenshot 1 1" src="https://github.com/user-attachments/assets/b8554216-f11e-46cd-a239-cb96b7ace771" />

---

### Notes

**1. Why create a dedicated branch instead of doing this work on main?**

- When I create a separate branch, I get a safe space to work without messing with the main code. I can experiment, test, and make changes freely, then submit a clean Pull Request with just my work.

---

# Task 1 — Stage a Change With Realistic Risk

## Goal

On your own fork of this repository (the one you've been submitting your DMI work in since onboarding), create a new branch and stage a change that a real reviewer should catch: a hardcoded-looking secret and a leftover debug statement.

### Evidence

#### Screenshot 1 — Output of  `git status` showing the staged file on feature/ai-pr-ready

<img width="893" height="381" alt="Screenshot 1" src="https://github.com/user-attachments/assets/91757a20-64ea-49d0-8399-327045504d01" />


---

### Notes

**1. Why does this assignment use an obviously fake key instead of a real one?**

- I'm using a file with actual security problems like hardcoded passwords and debugging leftover to test how the pre-commit hook and Claude Code skill catch them before I commit. It's showing me how these automated checks work in real life to keep bad code out of the repo.

---

# Task 2 — Write a Real Git Pre-Commit Hook

## Goal

Create a tracked, shareable pre-commit hook that blocks a commit containing secret-like patterns or files over 1MB.

### Evidence

#### Screenshot 2 — `hooks/pre-commit` open in VS Code showing the full script

<img width="837" height="378" alt="Screenshot 2" src="https://github.com/user-attachments/assets/86e0fe67-f272-4e0c-ae8d-8d73ec593365" />


---

#### Screenshot 3 — Output of `git config core.hooksPath` confirming it points to `hooks`

<img width="1148" height="905" alt="Screenshot 3" src="https://github.com/user-attachments/assets/79a4329b-2ddc-432c-b7f4-3f9d189fd8d6" />


---

### Notes

**1. Why is `hooks/pre-commit` tracked in the repo instead of living only in `.git/hooks/`?**

- If the hook only lived in .git/hooks/, it would be local to my machine and wouldn't get shared when someone else clones the repo. By tracking it in the hooks/ directory and configuring git to point there with core.hooksPath, everyone on the team gets the same hook automatically. It ensures the safety standard travels with the code.

---

**2. Compare this to `PreToolUse` from Week 2 Assignment 6. What does each one intercept, and what do they have in common?**

- Both intercept an action right before it happens. PreToolUse blocks Claude Code tool use before it runs, and the pre-commit hook blocks git commits before they're created. They're both gatekeepers using fixed rules to catch problems early. They don't guess or negotiate, they just follow their rules and give the same answer every time. Both prevent bad stuff from reaching the next stage.

---

# Task 3 — Prove the Hook Blocks the Risky Commit

## Goal

Attempt to commit the staged file from Task 1 and show the hook rejecting it.

### Evidence

#### Screenshot 4 — Terminal showing `git commit` rejected with the hook's "BLOCKED" message naming the exact file

<img width="848" height="379" alt="Screenshot 4" src="https://github.com/user-attachments/assets/6d30ef48-66f6-4aa6-a2dc-b6ba8100100e" />


---

### Notes

**1. Which line in `hooks/pre-commit` matched your fake key, and why did it match?**

- The hook has a pattern that looks for AKIA at the start of a string, which is how AWS access keys begin. My fake key started with AKIA, so the regex matched it immediately. The hook doesn't need to know if it's real or fake, it just spots the pattern that real AWS keys follow and blocks it.

---

**2. Could this hook have caught a poorly-named variable that stores a secret without the `AKIA` prefix? What does that tell you about the limits of a fixed rule like this?**

- No, it couldn't. If I named a variable password = "mysecret123" or api_key = "actualtoken", the hook would miss it completely. Fixed rules can only catch what they're specifically told to look for. They're good at spotting known patterns like AWS keys or common secret formats, but they're blind to context. Someone could hide a real secret behind a generic variable name and sail right past. That's why you need both the hook and human review, and why the Claude Code skill does the judgment work the fixed rule can't.

---

# Task 4 — Build the `/pr-ready` Skill

## Goal

Create a manually invoked Claude Code skill that reads your staged changes and produces a PR-readiness report and a draft PR description — without writing, committing, or pushing anything itself.

### Evidence

#### Screenshot 5 — `SKILL.md` frontmatter showing `allowed-tools: Bash, Read, Grep` (no `Write`) and `disable-model-invocation: true`

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/3b6c4896-bc29-4781-8528-ee285dee9719" />


---

#### Screenshot 6 — `/pr-ready` output while the risky file is still staged, showing it flagged the secret and/or debug statement

<img width="834" height="391" alt="Screenshot 6" src="https://github.com/user-attachments/assets/287e6b8c-f12b-4887-8e90-056eba2bb98d" />


---

### Notes

**1. Why does `/pr-ready` have `Bash` and `Read` but not `Write`?**

- Read and Bash let me gather and analyze the staged diff, but no Write means I can't actually make changes. I can look at the code, spot problems, draft suggestions, but I can't commit, push, or touch the repo. It mirrors the agentic loop: I gather and analyze, then you act. The restriction keeps me honest, making sure the final decision stays human.

---

**2. The pre-commit hook and `/pr-ready` both looked at the same staged diff. Did they flag the same things? What did one catch that the other didn't?**

- The hook caught the AKIA pattern because that's its single job, one regex rule. The skill caught that too, but it also flagged the debug statement (like console.log or print()) that the hook never looked for. The hook is literal and fast, the skill is semantic and thoughtful. The hook prevents obvious disasters, the skill catches things that need judgment, like unclear intent or mixed concerns in one commit. Together they're stronger than either alone.

---

# Task 5 — Fix the Issues and Re-Verify

## Goal

Remove the secret and debug statement, then prove both gates now pass clean.

### Evidence

#### Screenshot 7 — `git commit` succeeding after the fix (no BLOCKED message)

<img width="844" height="385" alt="Screenshot 7" src="https://github.com/user-attachments/assets/fc4f367a-708e-4ad9-9686-ccf146988ece" />


---

#### Screenshot 8 — Second `/pr-ready` run showing a clean risk report and a drafted PR title + description

<img width="1792" height="1120" alt="Screenshot 8" src="https://github.com/user-attachments/assets/cb53fc87-2afc-40c4-a5f5-5ada82d164e5" />


---

### Notes

**1. What exactly did you change to satisfy the pre-commit hook?**

- I removed the fake AWS key that started with AKIA from the file. I also deleted the debug statement that was left in the code. Once those two things were gone, the staged file no longer matched any of the hook's patterns, so it let the commit through.

---

# Task 6 — Push and Open a Pull Request Using the AI Draft

## Goal

Push your branch and open a real Pull Request, using `/pr-ready`'s drafted title and description as your starting point — read it critically and edit before you use it.

**Important:** Open this Pull Request with base repository set to **your own fork** — not the shared upstream `pravinmishraaws/devops-micro-internship-pravinmishra` repository. This assignment's hook and skill files are your own practice work, not a change meant for the shared class repo.

### Evidence

#### Screenshot 9 — Your Pull Request showing the base repository is your own fork, plus the title and description, with the `/pr-ready` draft visible for comparison (paste it in the PR conversation or your notes below)

<img width="1377" height="990" alt="Screenshot 9" src="https://github.com/user-attachments/assets/2bb5e5c0-c9fa-49a6-9fba-a80f060baa15" />


---

#### PR Link

https://github.com/kaphaaya/devops-micro-internship-interviews/pull/1

---

### Notes

**1. What, if anything, did you edit in the AI's drafted PR description before using it? Why?**

- I read through the draft the skill produced and edited a few things. The skill suggested some technical details that were accurate but too verbose for the title. I shortened it and made it clearer what the actual change was about. I also made the description more direct and less formal, so it reads like my own voice and not an AI template. The skill gives you a solid starting point, but you need to shape it into something that actually matches how you'd write.

---

**2. If you had blindly copy-pasted the AI's draft without reading it, what could go wrong?**

- A lot. The skill could have misunderstood what my changes were really for, or made assumptions about impact that weren't true. It might have flagged things that aren't actually problems, or missed context about why I made certain choices. Reviewers would immediately know it was AI-generated and wouldn't trust it. Worse, I'd be putting my name on something I didn't actually review or vouch for. The whole point of the skill is to help me think, not to replace my thinking.

---

**3. Why does this PR need to target your own fork instead of the shared upstream repository?**

- A lot. The skill could have misunderstood what my changes were really for, or made assumptions about impact that weren't true. It might have flagged things that aren't actually problems, or missed context about why I made certain choices. Reviewers would immediately know it was AI-generated and wouldn't trust it. Worse, I'd be putting my name on something I didn't actually review or vouch for. The whole point of the skill is to help me think, not to replace my thinking.

---

# Task 7 — Map the Workflow to the Agentic Loop

## Goal

Explain this assignment's workflow using the same Gather → Analyze → Human Act → Verify structure from Week 3.

### Notes

**1. Which step(s) represent Gather?**

- Both the pre-commit hook and /pr-ready skill represent Gather. They read the staged diff and collect information about what changed.

---

**2. Which step(s) represent Analyze?**

- The hook analyzes using fixed rules, checking for known secret patterns and file sizes. The skill analyzes using judgment, flagging debug statements, mixed concerns, and unclear intent. Both happen before I act.
---

**3. Which step is Human Act, and why must a human — not Claude — run `git commit`, `git push`, and open the PR?**

- Human Act is me reviewing the skill's output, deciding to fix the issues, staging the clean code, and running the commit and push myself. The hook and skill inform me, but they can't decide what's actually safe or what my intent was. Only I can read the flags, think about context, and decide "yes, this is ready." If Claude could commit and push, I'd lose control of what actually goes into my repo.

---

**4. Which step is Verify?**

- Verify is the hook letting the commit through after it's clean, and the PR showing up in my repo with the changes applied. The actual code is now there, the gates passed, and the review can happen.

---

**5. In one or two sentences: why do you need *both* the fixed-rule pre-commit hook and the AI skill? Isn't one enough?**

- The hook is fast and reliable but blind to context; it only catches known patterns. The skill sees intent and judgment but could miss obvious mistakes. Together they catch both obvious disasters and subtle problems that need thinking.

---

# Task 8 — LinkedIn Post

## Goal

Publish a LinkedIn post summarizing what you built and what you learned about combining fixed-rule safety checks with AI-assisted review.

### Evidence

#### LinkedIn Post URL

https://www.linkedin.com/posts/aziz-kafayat_week-4-of-dmi-just-shipped-something-that-ugcPost-7486163707547430912-z5nj/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU

---

## Key Learnings

Add 3-5 bullet points on what you learned this week.

- Layered defenses work better than single gates. One catches what the other misses
- Restricting tools (no Write access) keeps automation honest and humans in control
- Shared, tracked hooks beat local setup every time. Code safety scales when it's versioned
- The best AI help knows exactly when to stop and ask you to decide
- This pattern (Gather → Analyze → Human Act) works for git workflows, security, and due diligence


---

# Submission Instructions

- Ensure `hooks/pre-commit` and `.claude/skills/pr-ready/SKILL.md` are committed to your GitHub repository
- Add all required screenshots to your submission
- All written answers must be in your own words
- Do not use a real secret or credential anywhere in your submission — the fake key in Task 1 is intentional and must stay clearly fake
- Open your Pull Request against your own fork, not the shared upstream repository
- Push your final changes to your forked repository
- Include your PR link and LinkedIn post URL

---

## GitHub Repository URL

Paste your forked repository URL here:

https://github.com/kaphaaya/devops-micro-internship-interviews

---

# Completion Checklist

- [ ] Branch `feature/ai-pr-ready` created with a staged file containing a fake secret and a debug statement
- [ ] `hooks/pre-commit` created and tracked in the repo (not only in `.git/hooks/`)
- [ ] `core.hooksPath` configured to point at `hooks/`
- [ ] Pre-commit hook shown blocking the risky commit
- [ ] `.claude/skills/pr-ready/SKILL.md` created with correct `allowed-tools` (no `Write`) and `disable-model-invocation: true`
- [ ] `/pr-ready` run against the risky diff and shown flagging issues
- [ ] Risky file fixed; `git commit` succeeds cleanly
- [ ] `/pr-ready` re-run showing a clean report and drafted PR title/description
- [ ] Pull Request opened using the AI draft as a starting point, with your own fork as the base repository (not upstream), PR link included
- [ ] Agentic Loop mapping (Task 7) completed in your own words
- [ ] LinkedIn post published and URL submitted
- [ ] All required screenshots added
- [ ] GitHub repository URL provided

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory) focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## 📌 Resources

- 🌐 DMI Official Website: https://pravinmishra.com/dmi  
- 🎓 DevOps for Beginners (Udemy): https://www.udemy.com/course/devops-for-beginners-docker-k8s-cloud-cicd-4-projects/  
- 🎓 Agentic AI DevOps with Claude Code: https://www.udemy.com/course/ultimate-agentic-ai-devops-with-claude-code/  
- 🎓 DevOps with Claude Code: Terraform, EKS, ArgoCD & Helm: https://www.udemy.com/course/devops-with-claude-code-terraform-eks-argocd-helm/  
- ▶️ YouTube Playlist: https://www.youtube.com/playlist?list=PLFeSNDtI4Cho  
- 🔗 Pravin Mishra (LinkedIn): https://www.linkedin.com/in/pravin-mishra-aws-trainer/  
- 🏢 CloudAdvisory (LinkedIn): https://www.linkedin.com/company/thecloudadvisory/

---

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
