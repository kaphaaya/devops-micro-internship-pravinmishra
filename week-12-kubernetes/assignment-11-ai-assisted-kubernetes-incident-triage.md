# Assignment 11 — AI-Assisted Kubernetes Incident Triage

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

Configure a read-only Bash triage script for your Book Review App, connect it to Claude Code through `/k8s-triage`, simulate one controlled failure, recover the application manually, and verify recovery.

**Workflow: Gather → Analyze → Human Act → Verify**

---

## Submission Details

**Full Name:** AZIZ OLAIDE KAFAYAT

**Kubernetes Platform:** Amazon EKS (AWS)

**Selected Workload:** backend Deployment

**Namespace:** book-review

**GitHub Repository URL:** https://github.com/kaphaaya/ai-assisted-kubernetes-triage

**Simulated Incident:** Invalid container image tag — kaphaaya/book-review-backend:does-not-exist

**Baseline Status:** WARN — 3 checks passed, 2 warnings, 0 failures. The warnings were due to historical backend container restarts and Kubernetes warning events.

**Recovery Status:** WARN — 3 checks passed, 2 warnings, 0 failures. The backend Deployment was successfully restored to its original image, kaphaaya/book-review-backend:v1. The backend Pod became healthy, the Deployment returned to 1/1 available replicas, and the Service had a ready backend endpoint (192.168.78.9). The remaining warnings were historical restart counts and Kubernetes events, including the deliberately simulated failure.

---

# Task 1 — Discover the Application and Capture a Healthy Baseline

## Goal

Identify the actual application configuration and prove that the selected workload is healthy before incident simulation.

### Evidence

#### Screenshot 1 — Healthy Pods and ready Service backends

<img width="864" height="766" alt="1" src="https://github.com/user-attachments/assets/1fe4063c-b972-4348-b5ab-22b4505a9b1b" />


---

#### Screenshot 2 — Workspace directory structure

<img width="861" height="839" alt="2" src="https://github.com/user-attachments/assets/806dbe0b-8245-4c90-906c-3456add871e3" />

<img width="863" height="916" alt="2 1" src="https://github.com/user-attachments/assets/f926d4d9-3bbc-4eb8-993f-3391af8bc47e" />


<img width="864" height="918" alt="2 2" src="https://github.com/user-attachments/assets/a36440f0-625c-408e-a464-976e95998c0b" />

### Notes

**1. What proves the selected Pods are ready, not merely running?**

The Pod status shows Running, but the readiness column also confirms that the containers are ready. For example, the backend Pod showed 1/1, meaning its one container was ready to receive traffic. Running alone does not guarantee readiness.

**2. What proves the Service has ready backends?**

The Kubernetes Service endpoints command returned a backend IP address and port. This confirms that the Service had a ready backend endpoint to which it could route traffic.

**3. Why must the original image be recorded before incident simulation?**

Recording the original image gives me a known-good configuration to restore after the simulated failure. Without it, I could introduce uncertainty during recovery or restore the wrong image.

---

# Task 2 — Configure CLAUDE.md

## Goal

Define the project configuration, incident workflow, and safety boundary for Claude Code.

### Evidence

#### Screenshot 3 — CLAUDE.md showing application configuration, workflow, safety rules, and output rules

<img width="760" height="1018" alt="3 1" src="https://github.com/user-attachments/assets/b493783d-d003-4a16-b494-e8058354fca9" />

<img width="712" height="875" alt="3 2" src="https://github.com/user-attachments/assets/661310a3-6e01-4128-ae63-a88114681d75" />

### Notes

**1. Why does Claude need project-specific cluster rules?**

Claude needs the actual cluster name, namespace, Deployment name, container name and Service configuration to investigate the correct application. These rules also establish the boundaries within which it should operate.

**2. Why must a human execute recovery commands?**

A human must approve and execute recovery commands because infrastructure changes can affect application availability and other workloads. Human control ensures that recommendations are reviewed before changes are made.

**3. Which rule prevents an unsupported diagnosis?**

The rule requiring Claude to base its conclusions on collected Kubernetes evidence and distinguish confirmed facts from assumptions. It must not invent a root cause when the available evidence does not prove one.

---

# Task 3 — Plan the Read-Only Triage Workflow

## Goal

Ask Claude Code to explain the five health checks before running the supplied script.

### Evidence

#### Screenshot 4 — Claude Code showing the five-check read-only plan

<img width="926" height="795" alt="4 1" src="https://github.com/user-attachments/assets/e772e479-593a-47b6-8f3f-e200755a8457" />

<img width="922" height="666" alt="4 2" src="https://github.com/user-attachments/assets/5d0b4998-48b1-449c-ab29-9a4d8ac05d19" />

### Notes

**1. Which part represents the Gather phase?**

The Bash triage script represents the Gather phase. It collects Deployment status, Pod readiness, container restarts, Kubernetes warning events and Service endpoints.

**2. How did you verify that Claude did not change anything?**

I used the read-only triage workflow and reviewed Claude's actions and recommendations. The script used inspection commands to collect evidence, while the recovery command was only recommended for me to execute manually. I performed the actual image restoration myself.

**3. Why is planning before coding useful for incident triage?**

Planning identifies the information needed to diagnose an incident before implementation begins. It also helps ensure that the checks are relevant, the workflow is structured and the safety boundaries are clear.

---

# Task 4 — Configure and Validate the Bash Script

## Goal

Configure the supplied triage script for the selected workload and validate its syntax.

### Evidence

#### Screenshot 5 — Script configuration variables and checks array

<img width="903" height="1024" alt="5" src="https://github.com/user-attachments/assets/e80b264a-ee66-49ff-900c-81062ef335f3" />

---

#### Screenshot 6 — Functions for status, readiness, restarts, events, and Service backends

<img width="786" height="995" alt="6" src="https://github.com/user-attachments/assets/07df3326-055f-4964-a45f-dfc303deb4b4" />

<img width="901" height="903" alt="6 1" src="https://github.com/user-attachments/assets/b2419d5c-caea-474a-9979-8bee6ce1a377" />

<img width="690" height="669" alt="6 2" src="https://github.com/user-attachments/assets/3574c08a-2bb5-46a7-a178-6dff84330fc5" />

---

#### Screenshot 7 — Preflight, summary, and exit-code logic

<img width="735" height="532" alt="7" src="https://github.com/user-attachments/assets/d3407bec-4b5a-43a1-8ae9-52703ca989e6" />


---

#### Screenshot 8 — Successful syntax validation and executable permission

<img width="923" height="205" alt="8" src="https://github.com/user-attachments/assets/030fb327-7602-4b08-83ef-7f26348f9481" />


### Notes

**1. Why must the script fail when no Pods match the configured selector?**

If no Pods match the selector, the script cannot confirm the health of the intended workload. Treating an empty result as healthy could produce a misleading report and hide an actual problem.

**2. How does the readiness check detect a running but unready Pod?**

It checks the Pod's readiness state rather than relying only on its Running status. A Pod can be running while its container is not ready to serve application traffic.

**3. Why are Service backends checked separately from Pod health?**

A Pod can be healthy without being correctly registered as a Service backend. Checking endpoints separately confirms whether the Service has ready destinations for incoming traffic.

**4. What do exit codes 0, 1, and 2 represent?**

0 — All checks passed; the workload is healthy.

1 — Warnings were detected, but no checks failed.

2 — A failure or critical preflight problem was detected.
---

# Task 5 — Run the Healthy Baseline Report

## Goal

Run the script on the healthy application and confirm that it contains no failed checks.

### Evidence

#### Screenshot 9 — Baseline report showing your full name and all checks

<img width="1791" height="1110" alt="9" src="https://github.com/user-attachments/assets/f953b985-af1e-4197-828c-906732deec58" />

---

#### Screenshot 10 — Captured exit code and final summary

<img width="940" height="204" alt="10" src="https://github.com/user-attachments/assets/3764edba-47c5-4a24-a606-ffa3bbac3106" />


### Notes

**1. What is the baseline status?**

The baseline status was WARN. The report recorded 3 checks passed, 2 warnings and 0 failures. The warnings related to historical backend container restarts and Kubernetes warning events.

**2. Which evidence proves the Service has a ready backend?**

The backend Service endpoint output showed 192.168.78.9:3001, confirming that a ready backend endpoint was available.

**3. What is the difference between a warning and a failure?**

A warning identifies something that needs attention but does not necessarily mean the workload is currently unavailable. A failure indicates that a required health check has not passed or a critical condition prevents the workload from being considered healthy.

---

# Task 6 — Configure and Run the Claude Code Skill

## Goal

Connect the Bash script to a manually invoked Claude Code evidence-analysis workflow.

### Evidence

#### Screenshot 11 — SKILL.md showing frontmatter and safety rules

<img width="936" height="943" alt="11" src="https://github.com/user-attachments/assets/337069e2-ab5b-461a-87e3-710285eb74fd" />

<img width="940" height="942" alt="11 1" src="https://github.com/user-attachments/assets/0af1416e-3063-46a4-81c9-166c82942a59" />

---

#### Screenshot 12 — Baseline `/k8s-triage` analysis

<img width="925" height="1057" alt="12" src="https://github.com/user-attachments/assets/ebc2bd77-65e0-40ec-9b21-ac9c8afd1dae" />

<img width="944" height="730" alt="12 1" src="https://github.com/user-attachments/assets/f58cdbd7-9b21-4c58-a9fb-f17c2c55f03c" />

### Notes

**1. What does Bash do in this workflow?**

Bash runs the read-only Kubernetes checks and collects structured evidence about the application. It reports Deployment status, Pod readiness, restarts, warning events and Service endpoints.

**2. What does Claude do in this workflow?**

Claude uses the /k8s-triage skill to interpret the collected evidence, identify possible causes, explain the findings and recommend an appropriate recovery action. It does not execute the recovery on my behalf.

**3. Why are instructions alone insufficient to guarantee read-only access?**

Instructions tell the AI what it should or should not do, but they are not a technical security boundary. Actual access must also be controlled through permissions, restricted credentials and safe tool configurations. A read-only script helps limit the actions performed during evidence collection.

---

# Task 7 — Simulate One Controlled Incident

## Goal

Create one controlled failure, save its evidence, and let Claude analyze it without executing recovery.

### Evidence

#### Screenshot 13 — Failed or unready Pod evidence and current Service backends

<img width="940" height="661" alt="13" src="https://github.com/user-attachments/assets/489947db-43ee-4f62-9633-9f356a1ef962" />

---

#### Screenshot 14 — Failed `/k8s-triage` analysis with evidence and a suggested manual recovery command

<img width="939" height="976" alt="14" src="https://github.com/user-attachments/assets/fc39ce97-366d-41cb-9f81-bf1e4ce93ac8" />

<img width="941" height="319" alt="14 1" src="https://github.com/user-attachments/assets/a50bf804-1844-4754-a0c2-416e645a8ec3" />

---

#### Screenshot 15 — Saved `incident-failure-report.txt`

<img width="940" height="883" alt="15" src="https://github.com/user-attachments/assets/3429269d-1fca-4b0c-8698-1a5a83abf684" />


### Notes

**1. Which failure did you choose?**

I deliberately changed the backend Deployment's container image to an invalid image tag:

kaphaaya/book-review-backend:does-not-exist

**2. Which checks failed, and what evidence proved it?**

The backend Deployment and Pod health checks identified the problem. The new backend Pod showed 0/1 readiness and ErrImagePull. Kubernetes events also recorded an image pull failure and ImagePullBackOff. The image could not be found on Docker Hub, confirming that the invalid image tag caused the incident.

**3. Did Claude execute recovery? Why is that important?**

No. Claude analysed the failure report and recommended restoring the original image, but I executed the recovery command manually. This was important because it maintained human control over infrastructure changes and prevented the AI from making an unapproved modification.

**4. Why might the Service retain ready backends during the incident?**

During a rolling update, Kubernetes may keep an existing healthy Pod running while the replacement Pod is failing. The Service can therefore continue to have a ready endpoint even though the new Pod cannot start. This is why checking Service endpoints alone is not enough to establish the health of the entire Deployment.

---

# Task 8 — Recover Manually and Verify

## Goal

Restore the healthy configuration yourself and verify recovery using a second triage report.

### Evidence

#### Screenshot 16 — Recovered Pods and ready Service backends

<img width="940" height="151" alt="16" src="https://github.com/user-attachments/assets/35aeaeed-19a7-424e-8ec1-8a7657b98cca" />


---

#### Screenshot 17 — Recovered `/k8s-triage` analysis

<img width="939" height="1058" alt="17" src="https://github.com/user-attachments/assets/add9f485-4732-4135-9c30-67e638ee0dbc" />

<img width="934" height="551" alt="17 1" src="https://github.com/user-attachments/assets/6dde309c-526c-414a-b0ee-d09ec2a9fc36" />

---

#### Screenshot 18 — Reports directory showing failure and recovery reports

<img width="926" height="104" alt="18" src="https://github.com/user-attachments/assets/de17517e-6ce5-4d7a-8528-35e1b6c66bbc" />

---

#### Screenshot 19 — `incident-summary.md` with all required sections

<img width="941" height="1045" alt="19" src="https://github.com/user-attachments/assets/ae028be7-ea8b-4725-b489-13ca3847e977" />

<img width="941" height="916" alt="19 1" src="https://github.com/user-attachments/assets/a3c02abe-969a-4032-8ad1-14588fe02316" />

### Notes

**1. What manual recovery action did you execute?**

I restored the backend Deployment to its original working image:

kubectl set image deployment/backend \
  backend=kaphaaya/book-review-backend:v1 \
  -n book-review

I then waited for the rollout to complete:
kubectl rollout status deployment/backend \
  -n book-review --timeout=180s

The rollout completed successfully.

**2. What proves the workload recovered?**

The backend Deployment returned to 1/1 available replicas, the replacement backend Pod was running and ready, and the backend Service had a ready endpoint at 192.168.78.9. The recovery triage report recorded 3 passed checks, 2 warnings and 0 failures.

**3. Why is the second triage run necessary?**

The second triage run provides evidence that the recovery was successful. It verifies the actual state of the Deployment, Pods and Service after the manual recovery instead of assuming that a successful rollout command means everything is healthy.

**4. Why should AI not automatically restart every failing production workload?**

A failing workload does not always need a restart. The underlying cause could be an incorrect configuration, a missing dependency, insufficient resources or a storage problem. Automatically restarting workloads without understanding the cause could create further downtime, disrupt healthy services or make the incident worse. AI should help investigate and recommend actions, while consequential recovery decisions remain under human control.

### Remaining WARN Results

Explain any WARN results remaining after recovery, or write “None.”

The recovery report contained 2 warnings and 0 failures.
1. Historical container restarts: The previous backend Pod had recorded 6 restarts. This was a historical restart count, not evidence that the recovered Pod was currently failing.
2. Historical Kubernetes warning events: The report retained 5 warning events, including the earlier scheduling and container events and the deliberately introduced image-pull failure. These events remained in the event history even after the backend was recovered.
The warnings were documented rather than ignored. The backend Deployment was available, the Service had a ready backend endpoint, and no FAIL results remained.

---

# Task 9 — Publish Your Kubernetes Incident-Triage Workflow on LinkedIn

## Goal

Share the incident-triage workflow you completed and explain the role of human control.

### Evidence

#### Screenshot 20 — Published LinkedIn post about your Kubernetes incident-triage workflow

<img width="552" height="938" alt="linkedin post " src="https://github.com/user-attachments/assets/5c289709-ac62-428e-9184-b12bca9734b8" />


### LinkedIn Post URL

https://lnkd.in/p/exvF9Tza

---

# Required Project Files

Include these files in your project repository:

- `CLAUDE.md`
- `lab-config.md`
- `scripts/k8s-triage.sh`
- `.claude/skills/k8s-triage/SKILL.md`
- `reports/incident-failure-report.txt`
- `reports/recovery-report.txt`
- `incident-summary.md`

Your `incident-summary.md` must contain:

1. Reported Symptom
2. Evidence Collected
3. Most Likely Cause
4. Human-Approved Recovery Action
5. Verification
6. Safety Decision
7. Agentic Loop Mapping

---

# Final Summary

## Evidence and Cause

Summarize the evidence and the supported cause of the incident.

Add your summary here.

## Manual Recovery

Describe the command or configuration change you performed.

Add your summary here.

## Verification

Explain how the recovery report and Kubernetes outputs confirmed recovery.

Add your summary here.

## Safety Decision

Explain how you kept Claude’s role limited to evidence gathering and analysis.

Add your summary here.

---

# Submission Instructions

- Include all 20 required screenshots under their corresponding Evidence sections.
- Complete all Notes questions in your own words.
- Include the required project files in your linked repository.
- Include your published LinkedIn post URL.
- Use clear, readable screenshots showing relevant commands, configuration, and outputs.
- Display your full name before taking required terminal screenshots.
- Preserve the failure report before recovery.
- Ensure the baseline and recovery reports contain no FAIL results.
- Explain any WARN results remaining after recovery.
- Review reports, logs, configuration records, and screenshots before publishing.
- Do not expose credentials, kubeconfig contents, tokens, certificates, JWT secrets, or confidential account information.

---

# Completion Checklist

- [ ] Confirmed the personal lab context
- [ ] Discovered and recorded application configuration
- [ ] Recorded the original working image
- [ ] Captured healthy Pods and ready Service backends (Screenshot 1)
- [ ] Created the workspace (Screenshot 2)
- [ ] Configured CLAUDE.md (Screenshot 3)
- [ ] Reviewed the five-check triage plan (Screenshot 4)
- [ ] Configured and reviewed the supplied script (Screenshots 5–7)
- [ ] Passed Bash syntax validation and set executable permission (Screenshot 8)
- [ ] Captured a baseline report with no FAIL (Screenshot 9)
- [ ] Captured the correct exit code (Screenshot 10)
- [ ] Configured and invoked `/k8s-triage` (Screenshots 11–12)
- [ ] Simulated one controlled incident manually (Screenshot 13)
- [ ] Reviewed Claude’s failed-state analysis (Screenshot 14)
- [ ] Saved failure evidence before recovery (Screenshot 15)
- [ ] Executed recovery manually and waited for rollout completion
- [ ] Confirmed recovered Pods and ready Service backends (Screenshot 16)
- [ ] Captured recovery analysis with no FAIL (Screenshot 17)
- [ ] Explained any remaining warnings
- [ ] Saved failure and recovery reports (Screenshot 18)
- [ ] Completed the seven-section incident summary (Screenshot 19)
- [ ] Answered all Notes questions
- [ ] Published the LinkedIn post (Screenshot 20)
- [ ] Included the LinkedIn post URL
- [ ] Included all required project files
- [ ] Checked that no sensitive information is exposed

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

*This submission is part of DevOps Micro Internship (DMI) — Agentic AI Track.*
