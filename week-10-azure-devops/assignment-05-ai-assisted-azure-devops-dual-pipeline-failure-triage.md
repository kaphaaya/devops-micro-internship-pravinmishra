# Assignment 5 — AI-Assisted Azure DevOps Dual-Pipeline Failure Triage

Part of the DevOps Micro Internship (DMI) — Agentic AI Track

---

## Student Information

**Full Name:** Aziz Oaldie Kafayat

**GitHub Repository or Fork URL:** https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-10-azure-devops/assignment-05-ai-assisted-azure-devops-dual-pipeline-failure-triage.md

**Linkedin Post URL:** https://lnkd.in/p/eF-Sv8zs

---

## Purpose

In this assignment, I configured an AI-assisted, read-only failure-triage workflow for the EpicBook Infrastructure and Application Pipelines. The workflow uses Bash to gather Azure DevOps pipeline evidence and Claude Code to analyze the evidence and recommend a recovery action while keeping all changes under human control.

---

# Task 0 — Verify Tools, Authentication, and Pipeline Details

## Goal

Verify the required tools, Azure DevOps authentication, organization and project details, and numeric pipeline IDs.

No screenshot is required for this task.

---

# Task 1 — Capture the Healthy Baseline and Prepare the Supplied Files

## Goal

Confirm that both EpicBook pipelines are healthy and place the supplied assignment files in the correct repository locations.

## Evidence

### Screenshot 1 — Healthy Baseline for Both Pipelines

Terminal output showing the latest completed Infrastructure and Application Pipeline runs with successful results.

<img width="1291" height="234" alt="1" src="https://github.com/user-attachments/assets/ac794d41-6d24-4062-b4f3-c7d3901dbdf0" />


## Notes

### 1. What proves that both pipelines were healthy before the drill?

Before introducing the controlled failure, I checked the latest completed runs of both the Infrastructure and Application pipelines in Azure DevOps. The Infrastructure pipeline was successful, and the Application pipeline was also successful. Their successful statuses established that both pipelines were working before I introduced the deliberate dependency error.

### 2. Why is a healthy baseline necessary before introducing a controlled failure?

A healthy baseline gives me a reliable starting point for comparison. If a pipeline fails after I introduce a controlled error, I can compare the new result with its previous successful run and identify what changed. Without this baseline, I might mistakenly blame my test change for a problem that already existed.

---

# Task 2 — Configure and Review the Supplied CLAUDE.md

## Goal

Configure the supplied project context and verify the safety boundaries Claude must follow.

## Evidence

### Screenshot 2 — CLAUDE.md Context and Safety Rules

`CLAUDE.md` open in the editor with the Project Overview, Incident Workflow, Safety Rules, and Output Rules visible.

<img width="985" height="661" alt="2" src="https://github.com/user-attachments/assets/55f17d6c-746b-4b55-928c-489028b246f2" />

<img width="991" height="693" alt="2 1" src="https://github.com/user-attachments/assets/c0b7f15b-37cc-4ce8-92de-a1ed0ef12d50" />

## Notes

### 1. Why does Claude need project-specific operational context?

Claude needs project-specific context so that it understands what the EpicBook project does, which pipelines are involved, where to find relevant evidence, and what actions it is allowed to recommend. Without this information, it might make assumptions about the project or suggest changes that are unsuitable for the environment. The CLAUDE.md file provides the instructions and context Claude needs to work within the project's boundaries.

### 2. Which rules keep the human responsible for the recovery action?

The safety rules require Claude to gather evidence, analyze failures, and recommend a recovery action without applying the fix itself. The workflow separates gathering information from taking action. I remain responsible for reviewing the recommendation, deciding whether it is appropriate, applying the fix, and verifying the result. This ensures that AI supports my decision-making rather than making operational changes without my approval.

### 3. Which rules protect pipeline credentials and application secrets?

The rules prohibit exposing personal access tokens, passwords, authorization headers, SSH keys, service connection credentials, and database credentials. Sensitive values must not be included in reports or screenshots. The workflow should use authenticated Azure DevOps access without printing or storing secret values in the script. This reduces the risk of accidentally exposing credentials in source control or assignment evidence.
---

# Task 3 — Configure and Validate the Supplied Pipeline Triage Script

## Goal

Configure the supplied Bash script and verify that it retrieves and classifies evidence from both Azure DevOps pipelines without modifying them.

## Evidence

### Screenshot 3 — Pipeline Triage Script Configuration

Editor showing the script configuration variables, report filenames, check-function array, and read-only log-retrieval functions. Ensure that no token is visible.

<img width="982" height="639" alt="3" src="https://github.com/user-attachments/assets/a443f085-3a14-4575-b767-166375151bf8" />

<img width="991" height="657" alt="3 1" src="https://github.com/user-attachments/assets/9d423338-7a0c-491d-9f25-4772778e6f1d" />

<img width="983" height="637" alt="3 2" src="https://github.com/user-attachments/assets/43d38a86-e74e-4969-a11c-f289020d4eb7" />

<img width="991" height="551" alt="3 3" src="https://github.com/user-attachments/assets/44c42578-c7fc-4392-a697-0d3f9bcf26d3" />

---

### Screenshot 4 — Script Validation

Terminal showing successful Bash syntax validation and executable file permission.


## Notes

### 1. Why are pipeline metadata and step console logs handled separately?

Pipeline metadata tells me the overall status of a run, its ID, and other information about the pipeline execution. Console logs provide the detailed output from individual steps, including the actual error message. I need both because a failed status tells me that something went wrong, while the console logs help me understand where and why it happened.

### 2. How does the script obtain the actual console logs?

The Bash script uses authenticated, read-only Azure DevOps CLI/API operations to retrieve pipeline run information and then fetch the console logs associated with the relevant steps. It saves the retrieved evidence into report and log files so that Claude can analyze what happened. This is more useful than relying only on the overall run status because it provides the error details needed for diagnosis.

### 3. How does the check-function array control the classification loop?

The check-function array contains the classification checks that the script runs against the collected pipeline evidence. The script loops through these checks and uses their results to determine whether the pipelines are healthy or whether a failure category has been detected. Organizing the checks in an array makes the classification process easier to manage and extend without writing a separate loop for every check.

### 4. What prevents a failed but unmatched run from being reported as healthy?

The script must consider both the actual pipeline status and the results of its classification checks. A failed run should not be reported as healthy simply because its error does not match a known failure pattern. The workflow must preserve the failed status or return an appropriate unknown/unclassified result instead of treating an unrecognized failure as success. This is important because a new type of error may not match the checks that have already been defined.

### 5. Why are different exit codes useful to another automation tool?

Exit codes allow another tool to determine the result of the script without having to interpret all its printed output. For example, exit code 0 indicates that the healthy-state check completed successfully, while a non-zero code can indicate a failure or another unsuccessful result, depending on the script's defined exit-code rules. This makes the script easier to integrate into automated workflows because another tool can use the exit code to decide whether further investigation is required.

---

# Task 4 — Run and Understand the Healthy-State Report

## Goal

Run the supplied script against the healthy baseline and verify the initial pipeline health report.

## Evidence

### Screenshot 5 — Healthy Pipeline Report

Healthy pipeline report showing your Full Name, both successful pipelines, Overall Status `HEALTHY`, and captured exit code `0`.

<img width="690" height="527" alt="5" src="https://github.com/user-attachments/assets/256d7d8c-77c9-43a9-9d7b-6f8dbd096951" />


## Notes

### 1. What evidence proves that both pipelines are healthy?

The healthy-state report shows that both the Infrastructure and Application pipelines completed successfully. The report records their statuses and identifies the overall result as HEALTHY. The script also returns exit code 0, indicating that the health check completed successfully according to its defined rules.

### 2. Why must the baseline exit code be verified before the incident drill?

Verifying the baseline exit code confirms that the script itself completed successfully before I use it to diagnose an intentional failure. If the script already returns an unexpected exit code or cannot retrieve the required logs, I cannot confidently rely on its later diagnosis. Establishing a successful baseline helps me distinguish problems with the pipeline from problems with the triage tooling.

---

# Task 5 — Configure and Test the Supplied /pipeline-triage Skill

## Goal

Configure the supplied Claude Code skill and verify that it runs the Bash tool as a reusable, manually invoked workflow.

## Evidence

### Screenshot 6 — Pipeline-Triage Skill Definition

`SKILL.md` showing the frontmatter, manual-invocation setting, narrowly scoped tools, safety rules, and required output structure.

<img width="736" height="652" alt="6" src="https://github.com/user-attachments/assets/adfc4500-de8c-4e9b-86cd-534b46272d3d" />

<img width="730" height="287" alt="6 1" src="https://github.com/user-attachments/assets/267eeb02-8494-4ea4-b0d9-ec1ff828e92c" />

---

### Screenshot 7 — Healthy Skill Result

Healthy `/pipeline-triage` result showing that both pipelines are healthy and no fix is required.

<img width="729" height="489" alt="7" src="https://github.com/user-attachments/assets/b767439d-33c3-4a44-9b90-2781ff13a8ee" />

<img width="737" height="589" alt="7 1" src="https://github.com/user-attachments/assets/f029cd35-51e1-4c1d-831e-6e1a5cdc4394" />

<img width="735" height="128" alt="7 2" src="https://github.com/user-attachments/assets/c941a04b-b80f-401b-ba47-519fc4ba3eaf" />


## Notes

### 1. Why is `disable-model-invocation: true` appropriate for this skill?

I used disable-model-invocation: true so that Claude would not automatically invoke the skill on its own. I wanted to run /pipeline-triage manually when I was ready to inspect the pipelines. This gives me control over when the workflow starts and makes the investigation more deliberate.

### 2. Why should the skill avoid broad Bash approval?

Broad Bash approval could allow Claude to execute commands beyond those needed for pipeline diagnosis. Some commands could modify files, change Git history, push code, or affect infrastructure. Restricting Bash permissions reduces the risk of unintended changes and keeps the skill focused on gathering and analyzing evidence.

### 3. What work is performed by Bash, and what work is performed by Claude?

Bash performs the operational work of querying Azure DevOps, collecting pipeline metadata and console logs, running the defined checks, and saving the resulting evidence. Claude interprets that evidence, identifies the likely failure category, explains the relevant error, and recommends a recovery action. Separating these responsibilities allows the data collection to remain repeatable while using AI to make the results easier to understand.

### 4. Why are permission rules required in addition to written safety instructions?

Written safety instructions tell Claude what it should and should not do, but instructions alone are not a technical restriction on every command it might execute. Permission rules provide an additional layer of control over the tools available to the skill. Combining clear instructions with restricted permissions helps prevent accidental changes and makes the workflow safer.

---

# Task 6 — Introduce a Safe Failure in the Application Pipeline

## Goal

Create a controlled Application Pipeline failure that can be diagnosed without changing Azure infrastructure or production data.

## Evidence

### Screenshot 8 — Controlled Application Pipeline Failure

Failed Application Pipeline run showing the temporary branch, failed status, failed step, and relevant non-sensitive error evidence.

<img width="1100" height="846" alt="8" src="https://github.com/user-attachments/assets/7331561d-cf36-4e9c-b64d-40a314a4cf43" />


## Notes

### 1. What exact failure did you introduce?

I deliberately changed the valid accounting dependency in package.json from "accounting": "^0.4.1" to "accounting-intentionally-missing": "^99.99.99". This introduced a dependency that does not exist in the npm registry. I then added an npm ci validation step to the Application pipeline so that the invalid dependency would be detected during the Validate stage rather than going unnoticed.

### 2. Which category should detect it?

The failure belongs to the Dependency Installation Failure category. The pipeline attempts to install the dependencies defined in the application files, but npm cannot find the intentionally invalid package in the registry. The installation therefore fails before the deployment stage can proceed.

### 3. Why is the failure safe and easily reversible?

The failure was introduced on a separate branch called drill/pipeline-failure, rather than directly on main. It changed the application's dependency declaration for testing purposes and did not require me to deliberately damage Azure infrastructure or production data. I could reverse the intentional change through Git without deleting the validation step needed to catch similar problems in the future.

### 4. How did you prevent the deliberate failure from reaching `main` or changing the deployed application?

kept the intentional failure on drill/pipeline-failure and did not merge it into main. The pipeline's npm ci step was added to the Validate stage, so the invalid dependency was detected before deployment could proceed. This allowed me to demonstrate the failure and diagnose it without intentionally deploying the broken dependency to the application environment.

---

# Task 7 — Diagnose and Save the Incident Evidence

## Goal

Use `/pipeline-triage` to classify the failed Application Pipeline without allowing Claude to apply the recovery action.

## Evidence

### Screenshot 9 — Failed-State Diagnosis and Incident Report

`/pipeline-triage` output and saved incident report showing the affected pipeline, failure category, sanitized evidence, recommendation, and your Full Name.

<img width="858" height="653" alt="9" src="https://github.com/user-attachments/assets/c55e3f0a-b749-4a5a-a8a7-319b8cf47203" />

<img width="855" height="201" alt="9 1" src="https://github.com/user-attachments/assets/40521c01-d8bf-4a90-8967-4aafebef2d79" />

## Notes

### 1. Which failure category was identified?

Claude identified the problem as a Dependency Installation Failure in the Application pipeline. The failure occurred because the application referenced a package name and version that could not be found in the npm registry.

### 2. What exact evidence supported the diagnosis?

The failed Application pipeline run was run ID 75, associated with the drill/pipeline-failure branch. The console output contained the following errors:
- npm error code E404
- 404 Not Found - GET https://registry.npmjs.org/accounting-intentionally-missing
- accounting-intentionally-missing@^99.99.99 is not in this registry.
This evidence directly connected the failure to the intentionally invalid dependency. The incident report also recorded the affected pipeline, the failure category, the recommended recovery action, and the fact that the Infrastructure pipeline remained healthy at baseline run 59.

### 3. Did Claude apply the fix or rerun the pipeline? Why is that important?

No. Claude analyzed the evidence and recommended the recovery action, but it did not apply the fix or rerun the pipeline as part of the diagnosis. I remained responsible for deciding what to change and carrying out the recovery. This separation is important because an AI-generated recommendation should be reviewed before it affects a working application or deployment process.

### 4. Which part represents Gather, and which part represents Analyze?

Gather was the stage in which the Bash script collected the Infrastructure and Application pipeline statuses, run details, and console logs from Azure DevOps. It also saved the evidence needed for investigation.

Analyze was the stage in which Claude examined that evidence, identified the invalid npm dependency as the cause of the Application pipeline failure, classified the incident, and recommended restoring the valid dependency. The incident report recorded the findings before I applied the fix.
---

# Task 8 — Apply the Human-Reviewed Fix and Verify Recovery

## Goal

Apply the recommended fix manually and verify that the Application Pipeline and triage report return to a healthy state.

## Evidence

### Screenshot 10 — Corrected Application Pipeline Run

Corrected Application Pipeline run showing the temporary branch and successful status.

<img width="1742" height="946" alt="10" src="https://github.com/user-attachments/assets/1a5497d0-c7f2-415b-a75c-44a8de6adf2b" />

---

### Screenshot 11 — Recovery Triage Result

Recovery `/pipeline-triage` output showing Overall Status `HEALTHY`, exit code `0`, your Full Name, and both saved report filenames.

<img width="1210" height="493" alt="11" src="https://github.com/user-attachments/assets/4c10c4bc-fda9-4e75-89b5-5179dc670e44" />

<img width="1212" height="608" alt="11 1" src="https://github.com/user-attachments/assets/d9196c8d-5056-43de-a0f7-5556394e99aa" />


## Notes

### 1. What exact fix did you apply?

I reverted the Git commit that introduced the intentionally invalid dependency. This restored the original "accounting": "^0.4.1" entry in package.json while preserving the separate commit that added npm ci to the Validate stage. I then pushed the recovery commit to drill/pipeline-failure and started a fresh Application pipeline run against that branch. The new run completed successfully.

### 2. Did the fix match Claude’s recommendation? Explain briefly.

Yes. Claude recommended removing the invalid dependency and restoring the correct dependency declaration. I followed that recommendation by reverting only the intentional failure commit instead of reverting the entire latest commit. This distinction mattered because the latest commit also contained the npm validation step, which I needed to retain to detect dependency installation failures in future runs.

### 3. What evidence proves that the pipeline recovered?

The fresh Application pipeline run completed successfully after the dependency was restored. This showed that the deliberate dependency installation failure had been resolved. The Infrastructure pipeline also remained healthy. The final recovery triage should provide additional evidence by showing HEALTHY, exit code 0, and the required report filenames.

### 4. Why is a second triage run required after the pipeline becomes green?

A successful pipeline run confirms that the pipeline completed successfully, but it does not automatically prove that the triage workflow has collected and classified the latest results correctly. Running /pipeline-triage again checks the current state of both pipelines, confirms that the recovery is reflected in the report, and verifies that the triage tool still works after the incident. This provides evidence of both application recovery and successful incident verification.

### 5. What risk would be created if Claude could automatically edit, push, approve, and rerun the pipeline?

Giving Claude unrestricted authority to edit code, push changes, approve them, and rerun pipelines could allow an incorrect diagnosis or unsuitable fix to cause further problems without human review. It could also push unintended changes into shared branches or trigger deployments before the consequences were understood. Keeping recovery actions under human control provides an opportunity to review the evidence, verify the proposed fix, and decide when it is safe to execute.

---

# LinkedIn Post — Mandatory

## LinkedIn Post URL

https://lnkd.in/p/eF-Sv8zs

## Evidence

### Screenshot 12 — Published LinkedIn Post

Published LinkedIn post showing its text and at least one image or link.

<img width="550" height="908" alt="linkedin" src="https://github.com/user-attachments/assets/443518b4-137c-48ba-b8d3-6547ac774987" />


---

# Required Repository Files

Confirm that the following files are available in your repository:

* [ ] `CLAUDE.md`
* [ ] `pipeline-triage.sh`
* [ ] `.claude/skills/pipeline-triage/SKILL.md`
* [ ] `reports/incident-failure-report.txt`
* [ ] `reports/recovery-report.txt`

---

# Submission Instructions

* Complete all tasks in sequence.
* Include all 12 required screenshots.
* Answer every Notes question in your own words.
* Include your GitHub repository or fork URL.
* Include your public LinkedIn post URL.
* Ensure your Full Name appears in the required reports.
* Do not include raw logs containing sensitive information.
* Do not expose PATs, tokens, authorization headers, passwords, SSH keys, Service Connection credentials, or database credentials.

---

# Completion Checklist

* [ ] Both Azure DevOps pipelines were healthy before the drill.
* [ ] The supplied files were copied to the correct repository locations.
* [ ] Only the required student-specific placeholders were updated.
* [ ] `CLAUDE.md` contains the required context and safety rules.
* [ ] `pipeline-triage.sh` passed Bash syntax validation.
* [ ] The script has executable permission.
* [ ] The script uses read-only Azure DevOps operations.
* [ ] The script retrieves pipeline metadata and console logs.
* [ ] No token or password is stored in the script.
* [ ] The healthy baseline reported `HEALTHY` with exit code `0`.
* [ ] `/pipeline-triage` was invoked manually.
* [ ] The skill does not have broad Bash approval.
* [ ] The controlled failure affected only the Application Pipeline.
* [ ] The failure occurred before deployment changes were applied.
* [ ] The deliberate failure was not merged into `main`.
* [ ] The failed-state report was saved before applying the fix.
* [ ] Claude diagnosed the failure but did not apply the fix.
* [ ] The fix was reviewed and applied manually.
* [ ] The corrected Application Pipeline completed successfully.
* [ ] The recovery triage reported `HEALTHY` with exit code `0`.
* [ ] `incident-failure-report.txt` exists.
* [ ] `recovery-report.txt` exists.
* [ ] All Notes questions have been answered.
* [ ] All 12 screenshots have been added.
* [ ] The GitHub repository or fork URL has been included.
* [ ] The LinkedIn post is public.
* [ ] The LinkedIn post URL has been included.
* [ ] No sensitive information is exposed.

---

# Final Submission

**Full Name:** Aziz Oaldie Kafayat

**GitHub Repository or Fork URL:** https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-10-azure-devops/assignment-05-ai-assisted-azure-devops-dual-pipeline-failure-triage.md

**Linkedin Post URL:** https://lnkd.in/p/eF-Sv8zs

---

*This submission is part of the DevOps Micro Internship (DMI) — Agentic AI Track.*
