# Assignment 6 — AI-Assisted Ansible Change Risk Review

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will build an AI-assisted Ansible risk-review workflow using `ansible-playbook --check --diff`, Bash scripting, and Claude Code.

You will review possible server changes before applying them, classify risky tasks, and keep the final apply decision under human control.

---

# Task 1 — Confirm EpicBook Connectivity and Create the Workspace

## Goal

Confirm that your previous EpicBook Ansible project is working before creating the risk-review automation.

### Evidence

#### Screenshot 1 — Output of `ansible web -i inventory.ini -m ping`

<img width="900" height="267" alt="1" src="https://github.com/user-attachments/assets/a0fc189b-9004-48fb-8806-179856aa460b" />


---

#### Screenshot 2 — Output of `ansible-playbook -i inventory.ini site.yml --syntax-check`

<img width="892" height="96" alt="2" src="https://github.com/user-attachments/assets/902f35c9-9f71-4d34-bc39-a84352f10213" />


---

#### Screenshot 3 — Output of `pwd` and `find . -maxdepth 4 -type d | sort`

<img width="898" height="145" alt="3" src="https://github.com/user-attachments/assets/ba661827-bc08-45d7-acbe-3a4edbdd3e14" />


---

### Notes

Answer the following in your own words:

**1. What proves that Ansible can reach your EpicBook VM?**

The command:

ansible web -i inventory.ini -m ping

returned:

epicbook | SUCCESS
"ping": "pong"

The pong response proves that the Ansible controller successfully communicated with the EpicBook VM.

---

**2. Why should you confirm playbook syntax before building a risk-review script?**

Because the risk-review script depends on the playbook being valid. If the playbook has syntax errors, the review workflow would not be able to produce meaningful change information. Checking the syntax first confirms that the underlying playbook can be parsed successfully.

---

# Task 2 — Create Project Context and Safety Rules in CLAUDE.md

## Goal

Create a `CLAUDE.md` file that tells Claude Code how this project must behave.

### Evidence

#### Screenshot 4 — `CLAUDE.md` open in VS Code or terminal showing the safety rules

<img width="893" height="141" alt="4" src="https://github.com/user-attachments/assets/4468f94c-96d9-42a6-a8e6-494e2c29496e" />


---

### Notes

Answer the following in your own words:

**1. Why should Claude Code have project-specific safety rules?**

Claude Code needs to understand the purpose and boundaries of the project. In this assignment, Claude Code was being used to analyze infrastructure changes, not to apply them. The safety rules made that distinction explicit.

Why should the human run the real Ansible playbook manually?

The real playbook can change a server. The human should review the evidence and make the final decision because the consequences of a configuration change can affect availability, security, permissions, or data.

Which rule prevents Claude Code from applying changes automatically?

The rule:

Never apply, converge, or fix the playbook automatically.

prevents Claude Code from automatically making the infrastructure change.

---

**2. Why should the human run the real Ansible playbook manually?**

The Gather phase is represented by collecting evidence from the Ansible dry run using:

ansible-playbook --check --diff

The Bash script also gathers and stores the raw Ansible output.

Which part represents the Analyze phase?

The Analyze phase is represented by Claude Code reading the generated report and explaining which changes are risky, what category they belong to, and what their likely impact could be.

---

**3. Which rule prevents Claude Code from applying changes automatically?**

The rule:

Never apply, converge, or fix the playbook automatically.

prevents Claude Code from automatically making the infrastructure change.

---

# Task 3 — Ask Claude Code to Plan the Risk Review

## Goal

Use Claude Code to produce a read-only plan before writing the Bash script.

### Evidence

#### Screenshot 5 — Claude Code showing the four-category risk-classification plan

<img width="886" height="493" alt="5" src="https://github.com/user-attachments/assets/9411998b-fb40-4854-ba74-f6edf1c4793c" />


---

### Notes

Answer the following in your own words:

**1. Which part of this task represents the Gather phase?**

The Gather phase is represented by collecting evidence from the Ansible dry run using:

ansible-playbook --check --diff

The Bash script also gathers and stores the raw Ansible output.

---

**2. Which part represents the Analyze phase?**

The Analyze phase is represented by Claude Code reading the generated report and explaining which changes are risky, what category they belong to, and what their likely impact could be.

How did you verify Claude Code did not create or edit files?

The assignment instructed Claude Code not to create or edit files. The workflow was designed around read-only analysis. The project also used explicit safety rules in CLAUDE.md and the skill itself prohibited editing.

---

**3. How did you verify Claude Code did not create or edit files?**

The changed_tasks array stores task names that Ansible reports as changes during the dry run.


---

# Task 4 — Build the Ansible Risk Review Script

## Goal

Create a Bash script that runs an Ansible dry run and classifies risky changes.

### Evidence

#### Screenshot 6 — Top section of `ansible-check-review.sh` showing `full_name`, `playbook_path`, `inventory_path`, and the `checks` array

<img width="895" height="757" alt="6" src="https://github.com/user-attachments/assets/4a6b498d-0134-4a32-84fe-bac430a643e0" />


---

#### Screenshot 7 — Middle section showing `extract_changed_tasks` and `check_tasks_matching_pattern`

<img width="894" height="756" alt="7" src="https://github.com/user-attachments/assets/7db18dc4-8212-4a23-b97e-4f5fb87c3450" />
<img width="897" height="668" alt="7 1" src="https://github.com/user-attachments/assets/c5018f1d-ff4f-44ce-9eda-c5148041a8b6" />


---

#### Screenshot 8 — Bottom section showing the loop, summary, and exit behavior

<img width="896" height="780" alt="8" src="https://github.com/user-attachments/assets/a453d42f-a234-4856-8cac-2612503b037e" />


---

#### Screenshot 9 — Output of `bash -n ansible-check-review.sh` and `ls -l ansible-check-review.sh`

<img width="897" height="95" alt="9" src="https://github.com/user-attachments/assets/5a6c6b41-d80c-4e11-b98b-0f5c53f2ca3c" />


---

### Notes

Answer the following in your own words:

**1. What is stored in the `changed_tasks` array?**

The changed_tasks array stores task names that Ansible reports as changes during the dry run.

---

**2. Which function finds changed tasks from the Ansible output?**

Add your answer here.

---

**3. Why does the script use `--check --diff`?**

It uses --check so the playbook can be previewed without applying the changes, and --diff so supported modules can show what is different.

Why does the script use different exit codes?

Different exit codes allow the script to communicate the result clearly:

0 = healthy
1 = warning
2 = risky/failure

This allows both humans and automation systems to understand whether the result requires attention.

---

**4. Why does the script use different exit codes for healthy, warning, and failed results?**

The file removal was classified as risky because the task matched the removal pattern used by the script.
The task was:
common : Remove temporary EpicBook risk test file
The script detected words and patterns related to removal, such as remove, delete, and state: absent.
The dry run showed that:
/tmp/epicbook-risk-test
would change from an existing file to an absent state.
This is important because file deletion is a destructive operation. If the wrong file were targeted in a real environment, it could cause data loss or break an application or configuration.
In this assignment, the file was intentionally created as a test file, so I understood why the change was being made. However, the risk-review workflow correctly treated the operation as something that required human review before application.

---

# Task 5 — Run the Baseline Dry-Run Review

## Goal

Run the script against your current EpicBook playbook and confirm the baseline risk status.

### Evidence

#### Screenshot 10 — Output of `./ansible-check-review.sh`

<img width="898" height="487" alt="10" src="https://github.com/user-attachments/assets/f61edb4b-4b31-4c39-b843-8fd35de0acb9" />


---

#### Screenshot 11 — Output of `echo "Captured Exit Code: $script_exit_code"` and `cat reports/ansible-risk-report.txt`

<img width="899" height="473" alt="11" src="https://github.com/user-attachments/assets/b5c272c4-3240-4952-b05b-cc658052aa41" />


---

### Notes

Answer the following in your own words:

**1. What was the overall status of your baseline run?**

The baseline status was:

WARN - changes present, review recommended

The dry run completed successfully, with:

unreachable=0
failed=0

Did any tasks report changed?

Yes.

The baseline detected:

common : Update apt cache
epicbook : Install EpicBook dependencies

---

**2. Did any tasks report `changed`?**

The baseline status was:

WARN - changes present, review recommended

The dry run completed successfully, with:

unreachable=0
failed=0

Did any tasks report changed?

Yes.

The baseline detected:

common : Update apt cache
epicbook : Install EpicBook dependencies

---

**3. Were any changed tasks flagged as risky?**

No.

None of the baseline changed tasks matched the four high-risk categories.

What does the script exit code mean?

The baseline returned:

Exit Code: 1

This meant that changes were detected and review was recommended, but the script did not detect one of the specifically defined risky categories.

---

**4. What does the script exit code mean?**

The script exit code tells you the overall result of the risk review and whether the script detected something that needs attention.
- Exit code 0 = The review completed successfully and no risky changes were detected.
- Exit code 1 = Changes were detected, but no high-risk category was triggered. Human review is recommended.
- Exit code 2 = A risky change was detected, such as a file/package removal. The change should not be applied without explicit human review.
In my assignment, the risky file-removal test returned:
Script Exit Code: 2
This was because the script detected:
common : Remove temporary EpicBook risk test file
So, the exit code acts as a simple signal that another system, CI pipeline, or human can use to understand the result of the risk review without having to read the entire report.

---

# Task 6 — Create and Run the Claude Code Skill

## Goal

Turn the Bash script into a reusable Claude Code skill called `/ansible-risk-review`.

### Evidence

#### Screenshot 12 — `SKILL.md` showing the frontmatter, allowed tools, and safety rules

<img width="892" height="654" alt="12" src="https://github.com/user-attachments/assets/63caf6e2-1598-4018-be39-72f4d864460b" />


---

#### Screenshot 13 — Claude Code output after running `/ansible-risk-review`

<img width="901" height="773" alt="13" src="https://github.com/user-attachments/assets/6237bcfb-3b99-4d22-af32-95cfed2c8c4a" />


---

### Notes

Answer the following in your own words:

**1. Why does this skill allow `Bash`, `Read`, and `Grep`?**

Bash is needed to run the risk-review script. Read is needed to inspect the generated reports. Grep can be used to search the output for relevant evidence.

Why does the skill not allow file editing?

Because the skill is designed to review changes, not modify infrastructure files. Preventing editing reduces the chance of Claude Code changing the environment while it is supposed to be analyzing it.

---

**2. Why does this skill not allow file editing?**

The skill does not allow file editing because its purpose is to provide a **read-only safety review** of Ansible changes.

It prevents Claude Code from accidentally changing the infrastructure configuration while it is supposed to be analysing it. The skill specifically says:

> “Do not edit files.”

This means Claude Code can **read the playbook, inspect the dry-run output, analyse the risks, and generate recommendations**, but it cannot modify the playbook, inventory, Terraform files, or secrets.

This keeps the process under human control:

**Read → Analyse → Recommend → Human decides → Apply**.

That separation is important because otherwise the same AI reviewing a potentially risky change could also modify the files and introduce or apply another change without human approval.

---

**3. What part is handled by Bash?**

Bash performs the deterministic work:

runs Ansible check mode

captures output

detects changed tasks

classifies risks

generates the report

returns the exit code

---

**4. What part is handled by Claude Code?**

Claude Code interprets the report and explains the meaning of the detected changes and risks in human-readable language.

Why is this better than asking Claude Code if the playbook is safe without giving it evidence?

Because Claude Code is working from actual Ansible dry-run evidence instead of guessing what the playbook might do. The Bash script provides concrete information about the current server state and proposed changes.

---

**5. Why is this better than asking Claude Code if the playbook is safe without giving it evidence?**

Because Claude Code is working from actual Ansible dry-run evidence instead of guessing what the playbook might do. The Bash script provides concrete information about the current server state and proposed changes.

---

# Task 7 — Introduce a Controlled Risky Change and Let the Skill Catch It

## Goal

Add a small controlled risky change in your lab playbook and confirm the script and Claude Code catch it before applying.

### Evidence

#### Screenshot 14 — The added risky task inside the role file

<img width="894" height="749" alt="14" src="https://github.com/user-attachments/assets/b77fc7e6-51fd-4749-962e-05391b581f26" />

---

#### Screenshot 15 — Output of `./ansible-check-review.sh`

<img width="892" height="456" alt="15" src="https://github.com/user-attachments/assets/69ccad35-2686-46d0-ba78-84e410c92d8f" />


---

#### Screenshot 16 — Claude Code `/ansible-risk-review` output showing the risky finding

<img width="897" height="774" alt="16" src="https://github.com/user-attachments/assets/bb1132fb-4db7-4145-9889-8f14eebf73ee" />


---

#### Screenshot 17 — Output of `cat reports/risky-change-report.txt`

<img width="892" height="458" alt="17" src="https://github.com/user-attachments/assets/141d7b78-162d-43dd-a722-c0f27eec156a" />


---

### Notes

Answer the following in your own words:

**1. Which risk category did the added task fall into?**

It fell into:

Package/File Removal

More specifically, the report identified:

risky (removal): common : Remove temporary EpicBook risk test file


---

**2. What evidence proves the task would change something?**

The Ansible dry run reported:

would change: common : Remove temporary EpicBook risk test file

The Bash report then classified it as a risky removal.

---

**3. Did Claude Code apply the playbook?**

No.

Claude Code only analyzed the report. The real playbook was later run manually by me.

---

**4. Why is it important that Claude Code only analyzed the risk?**

Because automatically applying a destructive change would remove the human approval step. Keeping Claude Code in an analysis role means the human can review the evidence before infrastructure is changed.

---

**5. Which phase of the Agentic Loop is represented by the Bash report?**

The Bash report mainly represents the:

Gather

phase because it collects evidence from the Ansible dry run.

It also performs some mechanical classification, which supports the Analyze phase.

---

# Task 8 — Apply as the Human, Verify, and Write the Change Summary

## Goal

Review the risky-change report, apply the playbook manually as the human operator, and verify the result.

### Evidence

#### Screenshot 18 — Output of the real playbook run showing the final recap with `failed=0`

<img width="895" height="751" alt="18" src="https://github.com/user-attachments/assets/8fb57a69-9877-48c2-968a-01b291f40b5f" />


---

#### Screenshot 19 — Output of `ansible web -i inventory.ini -m ping`

<img width="894" height="200" alt="19" src="https://github.com/user-attachments/assets/52355cdd-fa63-4c72-b7e9-22b5ab1eb9cc" />


---

#### Screenshot 20 — Second `/ansible-risk-review` output after applying the change

<img width="898" height="764" alt="20" src="https://github.com/user-attachments/assets/f2fe7684-dd8c-4584-b985-10022b1b7735" />


---

#### Screenshot 21 — Output of `ls -lah reports`

<img width="892" height="302" alt="21" src="https://github.com/user-attachments/assets/5c5c47e6-1353-4cce-bd0a-2431041faae2" />


---

#### Screenshot 22 — `change-summary.md` showing all required sections and your Full Name

<img width="901" height="738" alt="22" src="https://github.com/user-attachments/assets/6e78fb5d-7513-4c0a-a88e-8772e8160bf0" />

<img width="880" height="432" alt="22 1" src="https://github.com/user-attachments/assets/c2f9ef40-6599-4506-81c2-206d02c88e69" />

---

### Notes

Answer the following in your own words:

**1. What command did you run to apply the change for real?**
I manually ran:

ansible-playbook -i inventory.ini site.yml

---

**2. Who made the final decision to apply the playbook?**

I made the final decision after reviewing the risky-change report.

---

**3. What evidence proves the VM is still reachable?**

ansible web -i inventory.ini -m ping

and received:

epicbook | SUCCESS
"ping": "pong"
---

**4. Why should the risk review be run again after applying?**
Running the review again gives another view of the system after the change. It helps confirm what changes remain and whether there are unexpected differences after the playbook has been applied.

What could go wrong if an AI agent applied Ansible changes automatically?

An AI agent could apply a change that causes service downtime, changes firewall access, modifies permissions, removes files, installs incompatible packages, or otherwise affects the server unexpectedly. Keeping the human in the approval loop reduces this risk.

---

**5. What could go wrong if an AI agent applied Ansible changes automatically?**

If an AI agent applied Ansible changes automatically, it could make a risky infrastructure change without a human checking the consequences first.

For example, it could:

- **Delete important files or packages**, causing data loss or breaking an application.
- **Restart critical services**, causing downtime.
- **Change firewall rules**, which could block legitimate access or expose services.
- **Modify users, permissions, or SSH keys**, potentially causing lockouts or security problems.
- **Install or update dependencies**, which could introduce compatibility problems.
- **Apply an unintended configuration change** because the agent misunderstood the task.

In this assignment, the temporary file removal demonstrated this risk. The workflow detected the deletion and returned **exit code `2`**, requiring human review before the real playbook was run.

The main lesson I learned is that **AI should analyse and recommend, while the human remains responsible for approving infrastructure changes**.

---

# LinkedIn Post Required

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here

https://lnkd.in/p/eFz7gbBA

---

#### Screenshot — Published LinkedIn post

<img width="549" height="836" alt="linkedin" src="https://github.com/user-attachments/assets/5a99f7f0-1eac-48f4-882c-fb8105124738" />


---

# Required Files

Confirm that the following files are included in your GitHub repository or assignment folder:

- [ ] `CLAUDE.md`
- [ ] `ansible-check-review.sh`
- [ ] `.claude/skills/ansible-risk-review/SKILL.md`
- [ ] `reports/risky-change-report.txt`
- [ ] `reports/post-apply-report.txt`
- [ ] `change-summary.md`

---

# Submission Instructions

- Add all required screenshots in your submission.
- Full Name must be visible in required screenshots and reports.
- All required notes must be answered clearly.
- Do not expose SSH private keys, passwords, cloud credentials, database credentials, or secret environment variables.
- Add your GitHub repository or folder URL inside this document.

---

# Completion Checklist

- [ ] Task 1: EpicBook connectivity confirmed and workspace created
- [ ] Task 2: `CLAUDE.md` created with safety rules
- [ ] Task 3: Claude Code produced a read-only risk-review plan
- [ ] Task 4: `ansible-check-review.sh` created and syntax checked
- [ ] Task 5: Baseline dry-run review completed
- [ ] Task 6: Claude Code `/ansible-risk-review` skill created and tested
- [ ] Task 7: Controlled risky change introduced and detected
- [ ] Task 8: Human applied the change and verified the result
- [ ] Risky-change report saved
- [ ] Post-apply report saved
- [ ] Change summary completed
- [ ] All screenshots added
- [ ] All notes answered
- [ ] LinkedIn post published
- [ ] LinkedIn post URL added
- [ ] No sensitive information exposed

---

## About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra and The CloudAdvisory, focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## Resources

- DMI Official Website: [https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme](https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme)
- University: [https://university.pravinmishra.com?utm_source=github&utm_medium=readme](https://university.pravinmishra.com?utm_source=github&utm_medium=readme)
- Discord Community: [https://discord.pravinmishra.com?utm_source=github&utm_medium=readme](https://discord.pravinmishra.com?utm_source=github&utm_medium=readme)
- Blog: [https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme](https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme)
- YouTube Playlist: [https://www.youtube.com/playlist?list=PLFeSNDtI4Cho](https://www.youtube.com/playlist?list=PLFeSNDtI4Cho)
- Pravin Mishra LinkedIn: [https://www.linkedin.com/in/pravin-mishra-aws-trainer/](https://www.linkedin.com/in/pravin-mishra-aws-trainer/)
- CloudAdvisory LinkedIn: [https://www.linkedin.com/company/thecloudadvisory/](https://www.linkedin.com/company/thecloudadvisory/)

---

*This submission is part of DevOps Micro Internship (DMI) — Agentic AI Track.*
