# Assignment 7 — AI-Assisted AWS Security and Cost Audit

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build a read-only Bash script that audits the AWS resources you deployed earlier this week — your S3 static site, EC2 instance(s), security groups, RDS database, and EBS volumes — for common security and cost misconfigurations.

You will then connect that script to Claude Code as a reusable `/aws-audit` skill that explains what it found and recommends a fix, without ever making the fix itself.

Finally, you will find a real misconfiguration in your own account, apply the fix yourself, and prove it worked with a second audit run.

---

# Task 1 — Confirm Your AWS Resources and Set Up Your Workspace

## Goal

Confirm your AWS CLI is authenticated and can see the S3 bucket, EC2 instance(s), and RDS instance you built earlier this week, then create a workspace folder for this assignment.

### Evidence

#### Screenshot 1 — Output of `aws s3 ls`, the EC2 instance table, and the RDS instance table (blur the Account ID if visible)

<img width="1660" height="674" alt="Screenshot 1" src="https://github.com/user-attachments/assets/396d2916-f2ac-4c70-a51c-534d32be6d9a" />


---

#### Screenshot 2 — Output of `pwd` and `find . -maxdepth 4 -type d | sort`

<img width="1666" height="679" alt="Screenshot 2" src="https://github.com/user-attachments/assets/e31f316a-ed2c-43e5-ba63-aad66e9750ce" />


---

### Notes You Must Write (Very Important)

**1. Which resources from this week's earlier assignments did you see in the listings?**

- I saw three main resources in the listings: the S3 bucket named brown-phaaya-audit-bucket-2026, two EC2 instances (i-0e8db79e724f7daf7 and i-0c9bba4fe52c406e9) both in running state launched by the Auto Scaling Group, and the RDS MySQL database instance three-tier-app-db in available state. These resources make up the three-tier architecture (web tier with ALB, application tier with ASG, and database tier with RDS) that was created earlier.

**2. Why must you confirm your resources exist before writing an audit script against them?**

- Confirming resources exist before writing the audit script is essential because the script needs real infrastructure to inspect and audit. If the resources don't exist, the audit script's AWS CLI calls would fail or return empty results, making it impossible to gather evidence about security misconfigurations or cost issues. By verifying upfront that the S3 bucket, EC2 instances, and RDS database are actually deployed and accessible, we ensure the audit script will have real data to analyze and real findings to report.

---

# Task 2 — Define Safety Rules in CLAUDE.md

## Goal

Create a `CLAUDE.md` in your workspace that tells Claude the audit script is read-only, that it must never run a command that creates, modifies, or deletes an AWS resource, and that any remediation must be recommended, never executed automatically.

### Evidence

#### Screenshot 3 — `CLAUDE.md` open in VS Code showing all four sections

<img width="1792" height="881" alt="Screenshot 3" src="https://github.com/user-attachments/assets/d42627b6-e75a-483b-8c82-897f0aeeca5a" />


---

### Notes You Must Write (Very Important)

**1. Why should Claude never be given permission to run `revoke-security-group-ingress` itself, even if the fix is obviously correct?**

- Because security changes to live infrastructure should never be automated without human approval, even when the fix is logically sound. An AI agent executing remediation commands directly removes human accountability — if something goes wrong, there's no decision-maker to trace it back to. The assignment design intentionally separates the roles: Bash gathers evidence, Claude analyzes and recommends, but only the human executes. This keeps a human in the loop for every security-changing decision, which is a core principle of safe infrastructure management.

**2. Which rule prevents Claude from claiming a finding that the report does not support?**

- The rule: "Use only the Bash audit report as the primary source of evidence" and "Do not claim a finding unless the report contains supporting evidence." These two rules together mean Claude can only report what the script actually found in aws-audit-report.txt. It can't invent findings or make claims based on assumptions — everything must be backed by the actual report output.

---

# Task 3 — Plan the Audit with Claude Code

## Goal

Ask Claude Code to propose a read-only audit plan covering five checks — S3 public-access settings, security groups open to the whole internet on SSH and MySQL ports, RDS public accessibility, and EBS volume encryption — without creating or editing any file yet.

### Evidence

#### Screenshot 4 — Claude Code showing the five-check plan

<img width="1792" height="1120" alt="Screenshot 4" src="https://github.com/user-attachments/assets/d096d786-7bce-47a3-9355-911957288311" />

<img width="1792" height="1120" alt="Screenshot 4 1" src="https://github.com/user-attachments/assets/e58408fc-8862-416a-b1a4-36d7db0d88f2" />



---

### Notes You Must Write (Very Important)

**1. Which part of this task represents the Gather phase?**

- The Gather phase is when Claude reads CLAUDE.md and proposes the exact AWS CLI commands (describe-, get-, list-*) that will collect evidence from your account. It's planning what data to gather before any script runs.

**2. Did every proposed command start with `describe-`, `get-`, or `list-`? Why does that matter?**

Write your answer here.

- Yes, every command should start with describe-, get-, or list- because these are read-only operations that don't modify anything. This matters because the audit must never change your infrastructure — it only observes and reports what it finds.

# Task 4 — Build the AWS Audit Script

## Goal

Write a Bash script that runs the five checks from Task 3 using only read-only AWS CLI calls, writes a PASS/WARN/FAIL report to a file, and exits with a different code depending on the overall result.

Make it executable and confirm it has no syntax errors.

### Evidence

#### Screenshot 5 — Top section of `aws-audit.sh` showing the variables and the checks array

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/2cc94533-2bd7-49b9-b508-0fb92701c829" />


---

#### Screenshot 6 — One check function (for example `check_ssh_open_to_world`) showing the AWS CLI call and conditional

<img width="1792" height="1120" alt="Screenshot 6" src="https://github.com/user-attachments/assets/44d0cbe3-c407-482f-b12a-75f4f2173f3f" />

---

#### Screenshot 7 — Output of `bash -n scripts/aws-audit.sh` and `ls -l scripts/aws-audit.sh`
<img width="909" height="672" alt="Screenshot 7" src="https://github.com/user-attachments/assets/2f80c308-c9d9-4664-a46c-8806150dffd1" />


---

### Notes You Must Write (Very Important)

**1. What is stored in the checks array, and how does the loop use it?**

### Notes You Must Write (Very Important)

**1. What is stored in the checks array, and how does the loop use it?**


- The checks array stores the names of five security check functions: check_s3_public_access, check_ssh_open_to_world, check_mysql_open_to_world, check_rds_public_access, and check_ebs_encryption. The for loop at the bottom of the script iterates through each function name in the array and executes it in sequence. This design makes it easy to add new checks later — you just add a new function name to the array and write the function, and the loop will automatically run it without needing to modify the loop itself.

**2. Why does every AWS CLI call in this script use `--query` and `--output text` instead of parsing raw JSON?**

- Using --query and --output text extracts only the specific data value we need as plain text, rather than returning the entire JSON response. This makes it much simpler to work with in Bash shell conditionals (if statements) because we can directly compare the text result without needing to parse JSON. If we didn't use --query, we'd need additional tools like jq to extract values from the JSON, making the script more complex and slower to run.

**3. Why does the script use different exit codes for HEALTHY, WARN, and FAIL?**

- Different exit codes (0 for HEALTHY, 1 for WARN, 2 for FAIL) follow Unix conventions and allow other tools and Claude Code to quickly understand the overall audit status without reading the entire report file. Exit code 0 signals success, 1 signals a warning/non-critical issue, and 2 signals a failure/critical issue. This makes the script composable with other automation tools that check exit codes to decide what to do next — for example, Claude Code can read the exit code and decide whether to flag the audit as a critical issue requiring immediate attention.

---

# Task 5 — Run the Baseline Audit

## Goal

Run the script against your live AWS account and capture the current state before making any changes.

### Evidence

#### Screenshot 8 — Output of `./scripts/aws-audit.sh` showing your Full Name and all five checks

<img width="914" height="687" alt="Screenshot 8" src="https://github.com/user-attachments/assets/419c09e9-25ff-456a-8387-927635e29cd3" />


---

#### Screenshot 9 — Output showing the captured exit code and final summary

<img width="915" height="683" alt="Screenshot 9" src="https://github.com/user-attachments/assets/2d2ae6f4-af2c-49fa-92ec-fa1968d22ef6" />


---

### Notes You Must Write (Very Important)

**1. What is the overall status of your baseline audit?**

- FAIL (exit code 2) — the RDS instance is publicly accessible.

**2. Did any check return FAIL or WARN? If so, which one, and what evidence did it show?**

- Yes, one FAIL: [FAIL] RDS instance 'three-tier-app-db' is publicly accessible. This means the database is exposed to the internet, which is a major security risk.

**3. If every check passed, what does that tell you about the security posture of your account so far?**

- Not applicable since we have a failure. But if all passed, it would indicate strong security: S3 blocks public access, no security groups expose SSH/MySQL to the internet, RDS is private, and all EBS volumes are encrypted.

---

# Task 6 — Build and Run the /aws-audit Skill

## Goal

Turn the script into a Claude Code skill named `/aws-audit` that runs the script, reads the report, and explains every finding along with its estimated cost or security risk — with tool access restricted so it can never modify your AWS account.

### Evidence

#### Screenshot 10 — `SKILL.md` showing the frontmatter, tool restrictions, and safety rules

<img width="1792" height="1120" alt="Screenshot 10" src="https://github.com/user-attachments/assets/285c7b52-ef37-40aa-8efb-3291ecee4eb6" />


---

#### Screenshot 11 — `/aws-audit` output showing findings, cost/risk impact, and a recommended remediation command (or a clean report if your baseline passed everything)
<img width="1792" height="1120" alt="Screenshot 11" src="https://github.com/user-attachments/assets/bb247f78-33ec-4697-969d-dff663536498" />

<img width="1792" height="1120" alt="Screenshot 11 1" src="https://github.com/user-attachments/assets/1f038897-c1db-4e38-99db-59e08a3a9268" />



---

### Notes You Must Write (Very Important)

**1. Why does this skill have Bash, Read, and Grep, but not Write?**

- Because the skill is read-only. It gathers evidence (Bash), reads the report (Read), searches it (Grep), but never modifies files or resources. Write is excluded to prevent Claude from executing fixes — it can only recommend them.

**2. What part is performed by Bash, and what part is performed by Claude?**

- Bash runs the audit script and generates the report file. Claude reads that report and analyzes it, explaining findings in business terms (security risk, potential cost impact), and recommending remediation commands.

**3. Why is estimating cost/risk impact something the AI adds on top of a plain PASS/FAIL script?**

- The script only knows facts (PASS/FAIL). Claude understands AWS business implications — it translates "RDS is publicly accessible" into "Your database is exposed to the internet, risking data breach and unauthorized access charges."

---

# Task 7 — Fix a Real Finding and Re-Verify

## Goal

Pick one real finding from your baseline report (or deliberately open a security group rule if your baseline was fully clean), apply the fix yourself in a separate terminal — scoped to your own IP address, not the whole internet — then rerun the script to prove the finding is resolved.

### Evidence

#### Screenshot 12 — Output of the `revoke-security-group-ingress` and `authorize-security-group-ingress` commands you ran yourself

<img width="1792" height="1120" alt="Screenshot 12" src="https://github.com/user-attachments/assets/a41172d4-b550-4fab-a01c-a59950768568" />

<img width="1792" height="1120" alt="Screenshot 12 1" src="https://github.com/user-attachments/assets/acf9d2fe-2ebc-432a-9a54-346d4b06c2f7" />

<img width="1792" height="1120" alt="Screenshot 12 2" src="https://github.com/user-attachments/assets/cb09f304-3a82-4f52-b7a2-4325f484f9d1" />


---

#### Screenshot 13 — Rerun of `./scripts/aws-audit.sh` showing the finding is now PASS

<img width="916" height="687" alt="Screenshot 13" src="https://github.com/user-attachments/assets/7286a824-103d-4ba5-ab4a-05e04c2988b3" />


---

### Notes You Must Write (Very Important)

**1. Which exact finding did you fix, and what command did you run?**

- I fixed the RDS publicly accessible finding by running: aws rds modify-db-instance --db-instance-identifier three-tier-app-db --no-publicly-accessible --apply-immediately --region eu-west-1. This changed the PubliclyAccessible attribute from True to False, making the database private.
**2. Why did you scope the new rule to your own IP address instead of leaving it open to `0.0.0.0/0`?**

Not applicable for this fix (we made RDS private, not IP-scoped). But the principle is: least privilege means only grant access to those who need it. Scoping to your IP /32 restricts access to just you, while 0.0.0.0/0 exposes it to the entire internet — a massive security risk.


**3. Did Claude execute the remediation command, or did you? Why does that matter?**

 - I executed it. Claude only recommended it. This matters because security changes must have human approval and accountability. If something breaks, a human made the decision — not an automated AI system. This maintains the human-in-the-loop principle.

**4. Which phase of the Agentic Loop does the Bash script represent? Which phase does Claude's explanation represent? Which phase is you running the fix?**

- Bash script = Gather phase (collect evidence via read-only AWS CLI calls). Claude's explanation = Analyze phase (interpret findings and recommend action). You running the fix = Execute phase (human approves and performs the remediation). The loop then cycles back to Gather (re-audit to verify the fix worked).

---

# LinkedIn Post (Required)

## Goal

Create a LinkedIn post including:

- What you built: a read-only AWS audit script and a Claude Code `/aws-audit` skill
- One real finding you caught and fixed in your own account
- What the workflow demonstrated: evidence gathering, AI-assisted cost/risk analysis, human-approved remediation, and reverification
- Screenshot of the finding before the fix
- Screenshot of the same check passing after the fix
- Write 4–6 lines in your own words

Suggested tags:

`#DMIByPravinMishra #AWS #AgenticAI #ClaudeCode #DevOps`

### Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://www.linkedin.com/posts/aziz-kafayat_devops-aws-cloudengineering-ugcPost-7496253564076343296-2lnK/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU

---

#### Screenshot of Published LinkedIn Post

<img width="1792" height="947" alt="linkedin 1" src="https://github.com/user-attachments/assets/e3c69ee2-47d8-41b5-8c83-8101bf424ee5" />

<img width="1792" height="1002" alt="linkedin 2" src="https://github.com/user-attachments/assets/88ff9b84-5664-4afa-a78d-3364ed0d02d9" />



---

# Submission Instructions

Complete all tasks in sequence.

Your submission must include:

- All 13 required task screenshots
- Answers to every **Notes You Must Write** question
- `CLAUDE.md`
- `scripts/aws-audit.sh`
- `.claude/skills/aws-audit/SKILL.md`
- `reports/aws-audit-report.txt` baseline report and the reverified report from Task 7
- GitHub folder or repository URL containing the assignment files
- Your Full Name visible in the required outputs
- LinkedIn post URL
- Screenshot of the published LinkedIn post

Submit only a Google Doc link.

Add the GitHub URL inside the Google Doc.

Follow the Assignment Submission Guidelines.

---

# Completion Checklist

- [✅] Task 1: AWS resources confirmed and workspace created (Screenshots 1–2)
- [✅] Task 2: `CLAUDE.md` created with project context and safety rules (Screenshot 3)
- [✅] Task 3: Claude produced a read-only five-check audit plan before any script existed (Screenshot 4)
- [✅] Task 4: `aws-audit.sh` built, executable, and passes `bash -n` (Screenshots 5–7)
- [✅] Task 5: Baseline audit captured and saved with Full Name visible (Screenshots 8–9)
- [✅] Task 6: `/aws-audit` skill loads and runs successfully with no Write permission (Screenshots 10–11)
- [✅] Task 7: A real finding was fixed by you and reverified as PASS (Screenshots 12–13)
- [✅] Skill never executed a remediation command
- [✅] New security group rule is scoped to your own IP, not `0.0.0.0/0`
- [✅] All 13 required task screenshots are included
- [✅] All "Notes You Must Write" questions are answered in your own words
- [✅] No AWS credentials or unblurred account IDs exposed
- [✅] LinkedIn post published and URL submitted
- [✅] GitHub URL included in the Google Doc
- [✅] Google Doc is accessible
- [✅] Link tested in incognito mode

---

# Final Submission

Submit only your Google Doc link.

### Question

Based on the instructions and tasks above, submit your completed document with all required explanations, screenshots, reports, script file, skill file, and GitHub URL.

`Add your Google Doc link here`

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
