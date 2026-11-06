# Assignment 6 — AI-Assisted Terraform Drift and Policy Review

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Student Details

**Full Name:** Aziz Olaide Kafayat

**GitHub Repository/Folder URL:** https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-08-terraform/assignment-06-ai-assisted-terraform-drift-and-policy-review.md
---

## Purpose

Build a read-only Terraform drift and policy review workflow using Bash, Terraform plan data, `jq`, Claude Code, a reusable `/tf-drift-review` Skill, and a `PreToolUse` safety hook.

The workflow must follow this pattern:

```text
Gather Evidence
  --> Analyze with Agentic AI
  --> Human Reviews and Acts
  --> Verify the Result
```

The `/tf-drift-review` Skill and `tf-drift-check.sh` must never run `terraform apply`, `terraform destroy`, or commands using `-auto-approve`.

---

# Task 1 — Confirm the Clean Baseline and Create the Workspace

## Goal

Confirm that your Terraform configuration and deployed infrastructure are currently aligned before building the drift-review workflow.

## Evidence

### Screenshot 1 — Clean Terraform Plan

Add a screenshot of `terraform plan` showing no pending changes.

<img width="877" height="109" alt="1" src="https://github.com/user-attachments/assets/7de852e4-2e08-4ab8-9e45-565212f6529f" />


---

### Screenshot 2 — Assignment Workspace

Add a screenshot of the folder structure showing `AI Assignment/`, `reports/`, and the Terraform project.

<img width="878" height="191" alt="2" src="https://github.com/user-attachments/assets/502ded6e-199a-4834-b5e2-551689cf3352" />


## Questions

### 1. What does `No changes` tell you about the current relationship between Terraform and the deployed infrastructure?

It means Terraform has compared the deployed infrastructure with the declared configuration and found no differences requiring changes. The infrastructure is aligned with the Terraform configuration at that point in time.

### 2. Why is a clean baseline important before introducing a test change?

A clean baseline gives me a reliable starting point. If Terraform reports a change after I introduce a controlled modification, I can identify that change as the result of my test rather than confusing it with an existing difference.

---

# Task 2 — Create Project Context and Safety Rules in `CLAUDE.md`

## Goal

Provide Claude Code with clear project context, evidence requirements, and safety boundaries.

## Evidence

### Screenshot 3 — Project Context and Safety Rules

Add a screenshot of `CLAUDE.md` open in VS Code showing the Project Overview, Review Workflow, Safety Rules, and Output Rules.

<img width="1344" height="754" alt="3" src="https://github.com/user-attachments/assets/1e595f01-c121-459f-9cca-084a8186db62" />

<img width="1348" height="486" alt="3 1" src="https://github.com/user-attachments/assets/e9b5eaba-0a6f-48ef-a792-b2ef754a40d7" />

## Questions

### 1. Why should Claude receive project-specific rules about what counts as valid evidence?

Project-specific rules help Claude understand the infrastructure, the expected review process and which sources of information it should trust. They prevent it from making assumptions or presenting unsupported conclusions as verified findings.

### 2. Why must the human remain responsible for running `terraform apply`?

Because terraform apply changes real infrastructure and can affect availability, security and resources that may incur costs. A human must review the proposed changes, understand their impact and explicitly approve the action before it is executed.

### 3. Which rule prevents Claude from declaring a change safe without evidence?

The evidence-based review rule requires Claude to inspect the Terraform plan and generated reports before making a risk assessment. It must distinguish confirmed findings from assumptions and cannot declare a change safe without supporting evidence.

---

# Task 3 — Build the Terraform Drift and Policy Check Script

## Goal

Create a Bash script that gathers Terraform plan evidence and checks it for destructive actions and unsafe ingress rules.

## Evidence

### Screenshot 4 — Script Variables and Checks Array

Add a screenshot of the top section of `tf-drift-check.sh` showing the variables and `checks` array.

<img width="1327" height="870" alt="4" src="https://github.com/user-attachments/assets/8b847642-cd69-40c0-96bb-989e540e4bf9" />


---

### Screenshot 5 — Destructive-Action and Open-Ingress Checks

Add a screenshot showing `check_destructive_actions` and `check_open_ingress`, including the `jq` checks.

<img width="612" height="463" alt="5" src="https://github.com/user-attachments/assets/477244ea-2909-4298-a73c-2f70b5eb6f54" />


---

### Screenshot 6 — Script Validation and Permissions

Add a screenshot showing successful `bash -n` and `ls -l` output.

<img width="721" height="92" alt="6" src="https://github.com/user-attachments/assets/59979f7a-dad7-4812-8520-4482caebbd6a" />

## Questions

### 1. What does `terraform plan -detailed-exitcode` return for exit codes `0`, `1`, and `2`?

Exit code 0: Terraform completed successfully and found no changes.

Exit code 1: Terraform encountered an error while generating the plan.

Exit code 2: Terraform completed successfully and found changes that would be made.



### 2. Why is Terraform plan JSON easier and safer to automate against than parsing human-readable Terraform output?

Terraform plan JSON provides structured data that tools such as jq can inspect directly. It allows the script to identify resource actions, changes and security-rule information using predictable fields instead of relying on text formatting, spacing or wording that may change.

### 3. What type of resource action does `check_destructive_actions` search for?

It searches for resource actions containing delete, which identifies planned resource deletions and the deletion component of resource replacements.
### 4. Why does finding a `delete` action also help detect replacements?

Terraform represents a replacement as a combination of deletion and creation actions. Checking for delete therefore helps identify replacements as well as resources that will be completely removed.

### 5. Why must this script never run `terraform apply`?

The script is designed to gather evidence and assess risk, not make infrastructure changes. Running terraform apply would remove the human approval step and could change or destroy infrastructure without an independent review.

---

# Task 4 — Run the Script Against the Clean Baseline

## Goal

Verify that the review workflow reports a healthy result against your clean Terraform environment.

## Evidence

### Screenshot 7 — Healthy Baseline Report

Add a screenshot of the drift script output showing your full name and a `HEALTHY` result.

<img width="709" height="334" alt="7" src="https://github.com/user-attachments/assets/0b7e3f07-72e2-4061-87ed-54dbc06aa2b0" />


---

### Screenshot 8 — Baseline Script Exit Code

Add a screenshot showing the captured script exit code `0`.

<img width="710" height="37" alt="8" src="https://github.com/user-attachments/assets/9b52a04d-8fca-485f-8a52-bcc8fa66f799" />


## Questions

### 1. What is the Overall Status of your baseline?

The Overall Status was HEALTHY. The baseline review found no pending Terraform changes or destructive actions, and the script returned exit code 0.

### 2. Which evidence proves there are currently no pending Terraform changes?

The Terraform plan summary showed 0 to add, 0 to change, 0 to destroy. The script also returned exit code 0, confirming that Terraform completed successfully without finding pending changes.

### 3. Was `reports/tfplan.json` created? Explain why or why not.

No. The workflow used Terraform plan JSON as input for the jq checks, but it did not retain a file named reports/tfplan.json. The script generated the evidence needed for its checks and saved the review result in reports/tf-drift-report.txt.

---

# Task 5 — Create and Run the `/tf-drift-review` Claude Code Skill

## Goal

Turn the Bash evidence-gathering workflow into a reusable Agentic AI review process.

## Evidence

### Screenshot 9 — `/tf-drift-review` Skill Configuration

Add a screenshot of `SKILL.md` showing the frontmatter, allowed tools, and safety rules.

<img width="625" height="709" alt="9" src="https://github.com/user-attachments/assets/6b0ca64a-9d3e-43c5-8079-51799c6e17b0" />


---

### Screenshot 10 — Clean Agentic AI Review

Add a screenshot of `/tf-drift-review` showing the clean `HEALTHY` result.

<img width="1471" height="516" alt="10 1" src="https://github.com/user-attachments/assets/a5a168fd-5e16-4537-9776-9e1930a51718" />

<img width="1470" height="400" alt="10 2" src="https://github.com/user-attachments/assets/56c4283c-396e-404a-aaf9-c554333c84ea" />

## Questions

### 1. Why does this Skill have `Bash`, `Read`, and `Grep`, but not `Write`?

These tools allow Claude to execute the read-only review script, inspect the generated reports and search for relevant evidence. Write is excluded to prevent the Skill from modifying project files, Terraform configuration or review evidence during its analysis.

### 2. Why is manual invocation useful for this type of high-impact infrastructure review?

Manual invocation means the review starts when I explicitly request it. This gives me control over when the infrastructure is assessed and prevents an unintended or automatic review process from initiating actions around sensitive infrastructure.

### 3. Which part of the workflow is deterministic Bash automation?

The tf-drift-check.sh script performs the deterministic checks. It runs the Terraform plan, processes the plan JSON with jq, checks destructive actions and unrestricted ingress rules, generates the report and returns an exit code based on the result.

### 4. Which part requires Claude's reasoning?

Claude's reasoning is used to interpret the generated evidence, explain what the findings mean, distinguish newly introduced drift from pre-existing conditions, assess the risks and recommend appropriate human review.

### 5. Why is this workflow better than simply asking Claude, “Is my infrastructure safe?”

The workflow gives Claude actual Terraform plan evidence and automated policy-check results to analyse instead of relying on a general question. Its conclusions can be traced to specific findings, while the safety rules and hook provide controls over infrastructure-changing actions.

---

# Task 6 — Introduce a Controlled Difference and Detect It

## Goal

Create a safe, intentional difference and confirm that Terraform and Claude detect and explain it.

## Evidence

### Screenshot 11 — Controlled Difference

Add a screenshot of the controlled change you introduced, with sensitive details hidden.

<img width="723" height="852" alt="11" src="https://github.com/user-attachments/assets/8db16cfe-3e37-45cb-b16e-38f8f2094819" />


---

### Screenshot 12 — Detected Difference and Risk Assessment

Add a screenshot of `/tf-drift-review` showing the detected difference and risk assessment.

<img width="614" height="497" alt="12" src="https://github.com/user-attachments/assets/0f5b4efd-b90b-4579-9734-eca805473390" />


---

### Screenshot 13 — Detected Drift Report

Add a screenshot of `drift-detected-report.txt` showing your full name and the `WARN` or `FAIL` result.

<img width="644" height="407" alt="13" src="https://github.com/user-attachments/assets/7562acc0-efa8-4853-b123-056c04e8c773" />


## Questions

### 1. What change did you introduce?

I manually added a tag to the AWS Web Tier security group:

Key: TestDrift

Value: manual-change

The security group was book-review-dev-web-sg.



### 2. Was it true infrastructure drift or a Terraform configuration change?

It was true infrastructure drift. I changed the live AWS resource directly through the AWS Console without changing the Terraform configuration. The live resource therefore no longer matched the declared configuration.

### 3. What Terraform plan evidence proves that a change is pending?

Terraform detected one in-place update to module.security.aws_security_group.web.

The plan showed:

0 to add

1 to change

0 to destroy

It specifically showed that the TestDrift = manual-change tag would be removed from tags and tags_all.

### 4. Was the action an update, deletion, replacement, or security-rule change?

It was an in-place update. Terraform proposed removing the manually added tag. It was not a resource deletion, replacement or security-rule change.



### 5. What did Claude recommend?

Claude recommended reviewing the Terraform plan and the detected drift before taking action. It identified the tag removal as a metadata-only change, confirmed that no resource deletion or replacement was planned, and advised against applying changes automatically. It also highlighted the need to distinguish the pending tag change from pre-existing ingress findings.



### 6. Why should you review the recommendation before taking action?

Claude's recommendation is based on the evidence available to it, but infrastructure changes can have real operational and financial consequences. Reviewing the plan independently helps confirm that the proposed action is expected, safe and limited to the intended resource before approving it.

---

# Task 7 — Add a `PreToolUse` Hook to Block Unsafe Apply Attempts

## Goal

Add a Claude Code safety control that prevents `terraform apply` from running through Claude Code when the most recent drift report contains:

```text
Overall Status: FAIL
```

## Evidence

### Screenshot 14 — `PreToolUse` Safety Hook

Add a screenshot of `.claude/settings.json` showing the `PreToolUse` safety hook.

<img width="1481" height="913" alt="14" src="https://github.com/user-attachments/assets/394f94ec-ef20-4052-a7e8-61d334400c48" />


---

### Screenshot 15 — Blocked Apply Attempt

Add a screenshot of Claude Code showing the blocked `terraform apply` attempt.

<img width="629" height="453" alt="15" src="https://github.com/user-attachments/assets/10f0b945-be74-42e1-be34-f7787fc4abbb" />



## Questions

### 1. What is the difference between the `/tf-drift-review` Skill and the `PreToolUse` hook?

The /tf-drift-review Skill guides Claude through gathering and analysing Terraform evidence and explaining the findings. The PreToolUse hook is an enforcement mechanism that checks a command before Claude Code executes it. In this assignment, it blocks terraform apply when the latest report contains Overall Status: FAIL.

### 2. Which component performs analysis?

The Claude Code /tf-drift-review Skill performs the analysis. It uses the evidence collected by the Bash script to explain the drift, interpret the findings and assess the risks.

### 3. Which component enforces the safety gate?

The Claude Code PreToolUse hook enforces the safety gate. It checks the command and the latest drift report before allowing the Bash tool to proceed.
### 4. Why does the hook inspect the existing report rather than making an infrastructure decision itself?

The report contains the findings produced by the evidence-gathering and review workflow. The hook does not need to understand the infrastructure or independently assess the risk. Its responsibility is to enforce a clear rule based on the recorded status: block terraform apply when the report contains Overall Status: FAIL.

### 5. Why is a deterministic guard useful for high-impact commands?

A deterministic guard provides a consistent control that does not depend on an AI agent remembering or interpreting safety instructions correctly. It can block a prohibited command before execution, reducing the possibility of accidental or unauthorised infrastructure changes.

---

# Task 8 — Resolve the Difference and Verify the Final State

## Goal

Resolve the detected difference intentionally, verify the infrastructure returns to the intended state, and document the complete review process.

## Evidence

### Screenshot 16 — Human-Reviewed Resolution

Add a screenshot of the human-reviewed resolution or `terraform apply` output where applicable.

<img width="636" height="120" alt="16" src="https://github.com/user-attachments/assets/0f9342a5-e592-40dc-99cf-d3e2a1736e03" />


---

### Screenshot 17 — Final Healthy Review

Add a screenshot of the final `/tf-drift-review` showing `HEALTHY`.

<img width="1466" height="828" alt="17" src="https://github.com/user-attachments/assets/2d390670-49f4-4ab3-95ec-2cf4cda35b2e" />

<img width="1460" height="205" alt="17 1" src="https://github.com/user-attachments/assets/1d35fde0-6895-402e-b181-bc22b7d24f36" />

---

### Screenshot 18 — Saved Reports

Add a screenshot of `ls -lah reports` showing both:

- `drift-detected-report.txt`
- `resolved-report.txt`

<img width="725" height="104" alt="18" src="https://github.com/user-attachments/assets/49d65014-642a-4de6-beef-59e65bea7d3b" />


---

### Screenshot 19 — Drift Review Summary

Add a screenshot of `drift-review-summary.md` showing all required sections and your full name.

<img width="1463" height="882" alt="19" src="https://github.com/user-attachments/assets/cafbfa83-fcb1-4abd-892b-17bb9c71ce8f" />

<img width="1459" height="293" alt="19 1" src="https://github.com/user-attachments/assets/96164907-f3d5-414f-b197-a5e89eefa6d9" />

## Terraform Drift Review Summary

### 1. Change Introduced

Explain the controlled change you introduced.

State whether it was:

- True infrastructure drift, or
- A Terraform configuration change

I manually added a tag with the key TestDrift and the value manual-change to the AWS Web Tier security group, book-review-dev-web-sg.

This was true infrastructure drift, not a Terraform configuration change. The AWS resource was modified directly through the console, while the Terraform configuration remained unchanged.

### 2. Evidence Collected

Describe the Terraform plan evidence and affected resource.

Before introducing the controlled difference, Terraform reported no pending changes.

After adding the tag, terraform plan -detailed-exitcode detected a pending in-place update to:

module.security.aws_security_group.web

The plan summary was:

0 to add

1 to change

0 to destroy

The plan showed that Terraform intended to remove TestDrift = manual-change from the security group's tags and tags_all.

The Bash script initially encountered a jq parsing error during the ingress check. I used Claude Code to investigate and correct the script. The corrected review then identified the pending tag change and two pre-existing public ALB ingress rules.

### 3. Risk Assessment

Explain the risk identified by the Bash check and Claude Code.

The pending Terraform change was a metadata-only tag removal. It did not involve deleting or replacing a resource or changing its security rules.

The corrected review identified two pre-existing unrestricted ingress rules on the public Application Load Balancer:

HTTP, port 80, from 0.0.0.0/0.

HTTPS, port 443, from 0.0.0.0/0.

These were separate from the newly introduced tag drift and were associated with the public-facing load balancer.

The review also demonstrated why a clean Terraform plan and a security-policy review are not necessarily the same thing. The final clean-plan review reported zero pending open-ingress findings; this does not independently prove that every existing security group has been audited.

### 4. Human-Approved Action

Explain the action you reviewed and executed manually.

I reviewed the Terraform plan in the normal terminal and confirmed that the only proposed change was the removal of the manually added TestDrift tag.

After confirming that the plan showed zero additions, one in-place update and zero destructions, I manually approved and executed terraform apply.

Terraform removed the test tag without creating or destroying any resources.

### 5. Verification

Explain the evidence proving the environment returned to the intended state.

After the apply, I ran terraform plan again.

Terraform returned:

No changes. Your infrastructure matches the configuration.

I then ran tf-drift-check.sh again. The final report showed:

Overall Status: HEALTHY

Terraform Plan Summary: 0 to add, 0 to change, 0 to destroy

Destructive Actions: 0

Open Ingress Findings: 0

The final report was saved as reports/resolved-report.txt.

### 6. Safety Decision

Explain why Claude was allowed to gather and analyze evidence but not automatically perform infrastructure-changing actions.

After the apply, I ran terraform plan again.

Terraform returned:

No changes. Your infrastructure matches the configuration.

I then ran tf-drift-check.sh again. The final report showed:

Overall Status: HEALTHY

Terraform Plan Summary: 0 to add, 0 to change, 0 to destroy

Destructive Actions: 0

Open Ingress Findings: 0

The final report was saved as reports/resolved-report.txt.
### 7. Agentic Loop Mapping

Explain how your workflow followed:

```text
Gather --> Analyze --> Human Act --> Verify
```

Gather: The Bash script ran the Terraform plan, generated plan JSON, checked for destructive actions and unrestricted ingress rules, and produced a drift report.

Analyze: Claude Code used the /tf-drift-review Skill to interpret the report, identify the manually added tag, explain the pending change and distinguish it from pre-existing ingress findings.

Human Act: I reviewed the Terraform plan, confirmed that the proposed change was limited to removing the test tag, and manually approved and executed terraform apply.

Verify: I ran Terraform plan again and confirmed there were no pending changes. I also reran the drift-review script, which returned an overall status of HEALTHY.

## Questions

### 1. What action did you execute to resolve the difference?

I manually executed terraform apply after reviewing and approving the plan. Terraform removed the manually added TestDrift tag from the AWS Web Tier security group.

### 2. Did you review `terraform plan` before taking action?

Yes. I reviewed the plan and confirmed that it proposed only one in-place update to remove the TestDrift tag, with zero additions and zero destructions.

### 3. What evidence proves the environment is now aligned?

The final terraform plan returned No changes. Your infrastructure matches the configuration. The final drift-review report also returned Overall Status: HEALTHY, with zero additions, changes, destructions, destructive actions and open-ingress findings in the pending plan review.

### 4. Why is a second drift review required after the fix?

A second review confirms that the intended change was successfully reconciled and that no unexpected differences remain. It provides fresh evidence instead of assuming that a successful apply automatically means the infrastructure is aligned.

### 5. What could go wrong if an AI agent automatically applied every detected Terraform change?

An AI agent could apply an unexpected, destructive or incorrectly interpreted change. This could cause service disruption, security exposure, data loss or unnecessary infrastructure costs. Human review is necessary to confirm that a proposed change is understood and authorised before it is applied.

### 6. In one sentence, explain the difference between asking an AI chatbot “Is my infrastructure okay?” and using this evidence-based Agentic AI workflow.

Asking a chatbot relies on a general response, whereas this evidence-based workflow uses actual Terraform plan data, automated policy checks, AI analysis, deterministic safety controls and human approval before infrastructure changes are made.

---

# LinkedIn Post — Mandatory

## Goal

Publish a LinkedIn post in your own words describing:

- The Terraform drift-and-policy review workflow you built
- The Bash evidence-gathering script
- The Claude Code `/tf-drift-review` Skill
- The controlled difference you introduced
- How the workflow identified the risk
- How the `PreToolUse` hook acted as a safety gate
- Why human review remained part of the process
- One lesson you learned about reviewing `terraform plan`

Include a screenshot of the detected change and a screenshot of the final `HEALTHY` review in your post.

Suggested tags:

```text
#DMIByPravinMishra #Terraform #AgenticAI #ClaudeCode #DevOps
```

## LinkedIn Evidence

### LinkedIn Post URL

https://lnkd.in/p/eax5PwMF

### Published LinkedIn Post Screenshot — Mandatory

<img width="547" height="947" alt="linkedin post" src="https://github.com/user-attachments/assets/3374ce31-566e-46ed-891c-6fb8213db38c" />


---

# Required Assignment Files

Confirm that the following files are included in your GitHub repository:

- `CLAUDE.md`
- `AI Assignment/tf-drift-check.sh`
- `.claude/skills/tf-drift-review/SKILL.md`
- `.claude/settings.json` containing the safety hook
- `reports/drift-detected-report.txt`
- `reports/resolved-report.txt`
- `drift-review-summary.md`

---

# Submission Instructions

- Complete Tasks 1–8 in sequence.
- Include Screenshots 1–19 exactly as specified.
- Answer every question under Tasks 1–8 in your own words.
- Complete all seven sections of the Terraform Drift Review Summary.
- Include the GitHub repository/folder URL containing the assignment files.
- Include your full name in the required reports and screenshots.
- Include the LinkedIn post URL and a screenshot of the published LinkedIn post.
- Do not expose access keys, passwords, tokens, account IDs, private keys, Terraform secrets, or other sensitive information.
- Review all screenshots carefully and hide or redact sensitive details where necessary.

---

# Completion Checklist

- [ ] Confirmed a clean Terraform baseline
- [ ] Created the required assignment workspace
- [ ] Created or updated `CLAUDE.md`
- [ ] Added project context and safety rules
- [ ] Created `tf-drift-check.sh`
- [ ] Added my full name to the report
- [ ] Validated the Bash script
- [ ] Made the script executable
- [ ] Used `terraform plan -detailed-exitcode`
- [ ] Used Terraform plan JSON
- [ ] Used `jq` to inspect destructive actions
- [ ] Used `jq` to inspect unsafe ingress
- [ ] Confirmed the baseline returns `HEALTHY`
- [ ] Created `/tf-drift-review`
- [ ] Restricted the Skill to appropriate tools
- [ ] Confirmed the Skill remains read-only
- [ ] Confirmed the Skill never runs `terraform apply`
- [ ] Confirmed the Skill never runs `terraform destroy`
- [ ] Introduced a controlled detectable difference
- [ ] Correctly identified whether it was true drift or a configuration change
- [ ] Saved `drift-detected-report.txt`
- [ ] Added the `PreToolUse` safety hook
- [ ] Verified the hook blocks `terraform apply` when the report is `FAIL`
- [ ] Reviewed the Terraform evidence before resolving the change
- [ ] Performed any infrastructure-changing action manually
- [ ] Ran the drift review again after resolution
- [ ] Confirmed the final status is `HEALTHY`
- [ ] Saved `resolved-report.txt`
- [ ] Completed `drift-review-summary.md`
- [ ] Mapped the workflow to `Gather --> Analyze --> Human Act --> Verify`
- [ ] Included all 19 numbered screenshots
- [ ] Answered all required questions
- [ ] Published the required LinkedIn post
- [ ] Added the LinkedIn post URL and screenshot
- [ ] Included the GitHub repository/folder URL
- [ ] Confirmed that no sensitive information is exposed

---

*This submission is part of the DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
