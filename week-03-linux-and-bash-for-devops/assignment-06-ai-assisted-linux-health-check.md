# Assignment 6 — Build an AI-Assisted Linux Health Check (AI-Assisted Linux Incident Triage)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build a read-only Bash triage script that checks the health of your Ubuntu server and Nginx application, connect it to Claude Code as a reusable `/linux-triage` skill, simulate a controlled Nginx incident, use the skill to gather and analyze evidence, recover the service manually, and verify recovery. The workflow follows the Agentic Loop: Gather → Analyze → Human Act → Verify.

---

# Task 1 — Confirm the Healthy Baseline and Create the Workspace

## Goal

Confirm that Nginx and the React application are healthy before building the automation.

### Evidence

#### Screenshot 1 — Output of `systemctl is-active nginx`, `ss -ltn | grep ':80'`, and `curl -I http://localhost`

<img width="914" height="379" alt="Screenshot 1" src="https://github.com/user-attachments/assets/aa6c39fc-d117-43eb-ab7d-48baa0b6e590" />


---

#### Screenshot 2 — Output of `pwd` and `find . -maxdepth 4 -type d | sort` showing the workspace folder structure

<img width="755" height="32" alt="Screenshot 2" src="https://github.com/user-attachments/assets/b1d1363a-3eb3-4c8a-9420-54e8cfd2f8c7" />

<img width="491" height="251" alt="Screenshot 2 1" src="https://github.com/user-attachments/assets/5a223da6-2d82-412c-9059-e3c5e1d78b69" />

---

### Notes

Answer the following in your own words:

**1. What proves that Nginx is running?**

- When I run systemctl is-active nginx, it tells me the status of the Nginx service. If it returns "active," that's my proof that Nginx is actually running on my system right now. I can also check the process directly to see that Nginx is using system resources and responding to requests.

---

**2. What proves that the server is listening for HTTP traffic?**

- The ss -ltn | grep ':80' command shows me all the ports my server is listening on. When I see port 80 in that output with Nginx listed as the service, that proves my server is actively listening for HTTP traffic. Then when I run curl -I http://localhost, I get a response back from the server, which confirms it's not just listening but also able to respond to actual requests.
---

**3. Why must you capture a healthy baseline before simulating an incident?**

- I need to capture a healthy baseline because I need to know what normal looks like before I break things. If I don't know what the system looks like when everything is working correctly, how will I know what's different when something goes wrong? The baseline gives me a reference point. I can compare the broken state to the healthy state and see exactly what changed, which helps me understand the problem and fix it faster.

---

# Task 2 — Create Project Context and Safety Rules in CLAUDE.md

## Goal

Tell Claude exactly what this project does and what it is not allowed to do.

### Evidence

#### Screenshot 3 — CLAUDE.md open in VS Code showing all four sections (Project Overview, Incident Workflow, Safety Rules, Output Rules)

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/57b32c7d-bb20-46c4-8aeb-0e748b17c6e9" />


---

### Notes

Answer the following in your own words:

**1. Why should Claude receive project-specific operational rules?**

- I need project-specific rules so I understand what this project is trying to accomplish, which steps I should follow, and what actions I should never take. These rules keep me aligned with how the team wants to handle incidents. Without them, I might try to be too helpful and make changes that aren't what the team actually wants. The rules make sure my advice matches the real workflow.

---

**2. Why is the human required to execute the recovery command?**
- I recommend what command to run, but you have to be the one who actually runs it. You get to review what I suggest, think about whether it's safe for your system, and decide if it makes sense before you execute it. I shouldn't be making changes to your server on my own. You're the one responsible for your infrastructure, so you need to approve and execute the recovery step yourself.

---

**3. Which rule prevents Claude from making an unsupported diagnosis?**

- The rule "Do not claim a root cause unless the report contains supporting evidence" stops me from guessing at what caused the problem. I can't just say something is wrong without evidence to back it up. If the report doesn't show me proof that supports a certain diagnosis, I have to stay quiet about it instead of making up an explanation.
---

# Task 3 — Use Agentic AI to Plan Before Writing the Script

## Goal

Use Claude Code to inspect the environment and produce a read-only plan before creating any Bash code.

### Evidence

#### Screenshot 4 — Claude Code showing the five-check plan and read-only inspection results

<img width="1792" height="1120" alt="Screenshot 4" src="https://github.com/user-attachments/assets/6b96181d-b455-4be7-96bf-c30904d3e72f" />


---

### Notes

Answer the following in your own words:

**1. Which part of this task represents the Gather phase?**

- The Gather phase is when I use read-only commands to collect information about the system. I run commands to check Nginx status, see what's listening on port 80, test the HTTP response, and check disk usage and available memory. I'm not making any changes yet, just observing what's actually happening on the server.
---

**2. Did Claude follow the instruction not to create files? How did you verify this?**
Yes, It followed the instruction. It only ran read-only inspection commands and didn't create any new files. I verified this by checking what's in the workspace directory and confirming that no new Bash scripts or other files appeared. Everything I did was just checking things, not writing anything new.
---

**3. Why is planning before coding useful in DevOps automation?**

- Planning before I write code helps me think through what the script actually needs to check and what each result means. I can catch missing steps or unsafe ideas before I even start coding. If I just start writing code without planning, I might build something broken or incomplete and have to redo it later. Planning saves me time and makes sure my automation is solid from the start.

---

# Task 4 — Build the Linux Triage Bash Script

## Goal

Create one Bash script that gathers consistent Linux and Nginx health evidence.

### Evidence

#### Screenshot 5 — Top section of `linux-triage.sh` showing variables, thresholds, and the checks array

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/6dae2df2-7abc-497a-b97d-d1bbbac21d88" />


---

#### Screenshot 6 — Middle section showing check functions and conditionals

<img width="1792" height="1120" alt="Screenshot 6" src="https://github.com/user-attachments/assets/cee575d9-a663-4335-a4a0-abe6948c7fc4" />


---

#### Screenshot 7 — Bottom section showing the loop, summary function, and exit behavior

<img width="1792" height="1120" alt="Screenshot 7" src="https://github.com/user-attachments/assets/6ea57ae6-19b8-484d-9077-78d28eddcaf3" />


---

#### Screenshot 8 — Output of `bash -n scripts/linux-triage.sh` (no syntax errors) and `ls -l scripts/linux-triage.sh` showing executable permission

<img width="916" height="322" alt="Screenshot 8" src="https://github.com/user-attachments/assets/7c73597b-7e26-4132-b41f-51f4428eedbb" />


---

### Notes

Answer the following in your own words:

**1. What is stored in the checks array?**

- The checks array holds the names of my five check functions. Each name represents one specific health check: checking if Nginx is running, checking port 80, testing the HTTP response, checking disk usage, and checking available memory.

---

**2. How does the `for` loop use that array?**

- My for loop goes through the checks array one function name at a time. Each time it loops, it runs that function. So it starts with the first function, runs it completely, then moves to the second function, and keeps going until all five checks have run in order.

---

**3. Why are the health checks separated into functions?**

- Separating each check into its own function makes my script much cleaner and easier to work with. If something goes wrong with one check, I can fix just that function without breaking the others. It also makes the script easier to read because I can see at a glance what each function is responsible for.

---

**4. What is the purpose of `$(...)` in this script?**

- The $(...) syntax runs a command and captures whatever it outputs. I use it throughout my script to grab things like the current timestamp, the hostname, HTTP status codes, how much disk I'm using, how much memory is available, and the recent logs from Nginx. It lets me collect all that system information dynamically.

---

**5. Why does the script use different exit codes for HEALTHY, WARN, and FAIL?**

- The exit code tells me or any other tool what the final status of the server is without having to read the entire report. Exit code 0 means everything passed. Exit code 1 means I found a warning. Exit code 2 means at least one check failed. This way I can quickly see how serious the problem is just by checking the exit code.

---

# Task 5 — Run and Understand the Healthy-State Report

## Goal

Run the Bash script against the healthy server and verify that it creates a report.

### Evidence

#### Screenshot 9 — Output of `./scripts/linux-triage.sh` showing your Full Name and all five check results

<img width="1792" height="1120" alt="Screenshot 9" src="https://github.com/user-attachments/assets/fe69b8d3-7d44-4baf-832d-2e2c33de06fb" />


---

#### Screenshot 10 — Output showing the captured exit code and final summary

<img width="1792" height="1120" alt="Screenshot 10" src="https://github.com/user-attachments/assets/c76568a0-5559-4f0e-a2aa-8b0ff2b4469f" />


---

### Notes

Answer the following in your own words:

**1. What is the overall status of your healthy baseline?**

- The overall status of my baseline is HEALTHY. My report doesn't show any failed checks, which means I'm ready to move forward to the incident simulation. Everything is working the way it should be.

---

**2. Which exact Linux evidence proves the application is serving traffic?**

- I found two pieces of evidence in my report that prove the application is serving traffic:
[PASS] Port 80 is listening
[PASS] Local HTTP check returned status 200
Port 80 listening proves that my server is ready and waiting to receive HTTP traffic from clients. The HTTP status 200 proves that when I tested it, the application behind Nginx actually responded with a successful result. Together, these two checks confirm that my application is actively serving traffic.

---

**3. Did your script return exit code 0 or 1? Explain why.**

- My script returned exit code 0 because all five of my health checks passed without any problems. Nginx was active, port 80 was listening, the application returned HTTP 200, and my disk usage and available memory were both within healthy limits. Since I didn't find any failures or warnings, I got exit code 0, which tells me the server is completely healthy.

---

**4. What is the difference between a warning and a failure in this script?**

-A warning means my server and application are still running fine, but I found a resource condition that I should pay attention to before it becomes a bigger problem. I get a warning when my root disk usage is between 80% and 89%, or when my available memory drops below 100 MB.
A failure is much worse. It means one of my core health checks completely failed. I get a failure when Nginx is inactive, port 80 is not listening, the application doesn't return HTTP 200, or when my root disk usage reaches 90% or higher. A failure means something is actually broken right now.

---

# Task 6 — Create and Run the /linux-triage Skill

## Goal

Turn the Bash script into a reusable, manually invoked Agentic AI workflow.

### Evidence

#### Screenshot 11 — `SKILL.md` showing the frontmatter, allowed tool restrictions, and safety rules

<img width="1792" height="1120" alt="Screenshot 11" src="https://github.com/user-attachments/assets/5685c6a7-83a4-43fc-a30f-fab3c318fa31" />

---

#### Screenshot 12 — `/linux-triage` output for the healthy server

<img width="1792" height="1120" alt="Screenshot 12" src="https://github.com/user-attachments/assets/84f165ff-8364-4c20-950c-2640ab296676" />

---

### Notes

Answer the following in your own words:

**1. Why does this skill have Bash, Read, and Grep, but not Write?**

- My skill uses Bash because I need to run the Linux triage script. I use Read because I need to open and look at the report that the script creates. I use Grep so I can search for specific PASS, WARN, or FAIL results in the report. I don't need Write because I'm not supposed to create or edit any files during the triage process. My job is to analyze what's already there, not change anything.

---

**2. Why is `disable-model-invocation: true` useful for this skill?**

- This setting makes sure Claude can't just decide to run the skill on its own. I have to manually invoke /linux-triage myself, which means I stay in control of when the server gets inspected. This prevents Claude from accidentally running checks or making changes when I don't want it to.

---

**3. What part is performed by Bash, and what part is performed by Claude?**

- Bash does the actual work of collecting evidence. It checks whether Nginx is running, whether port 80 is listening, what the HTTP response is, how much disk I'm using, how much memory is available, and it grabs the recent Nginx logs. It writes all those results to linux-health-report.txt.
Claude's job is to read that report and explain what it means. I identify any warnings or failures, figure out what's probably causing them, and recommend a safe next step. But I never actually execute the recovery command myself.

---

**4. Why is this better than asking Claude "Is my server healthy?" without giving it evidence?**

- If I just ask Claude that general question without any evidence, Claude doesn't really know what's happening on my actual server. It can only guess. But with the /linux-triage skill, I first run the Bash script to collect real, current evidence. Then Claude bases its answer on actual data: the Nginx status, whether port 80 is listening, the HTTP response, disk usage, available memory, and the logs. That's so much better than guessing.
---

# Task 7 — Simulate an Nginx Incident and Let the Skill Diagnose It

## Goal

Create a controlled service failure, gather evidence through Bash, and let Claude analyze the evidence without taking recovery action.

### Evidence

#### Screenshot 13 — Output showing Nginx is inactive and the HTTP request fails

<img width="921" height="378" alt="Screenshot 13" src="https://github.com/user-attachments/assets/615b5503-fe66-4918-97dc-e72daa8371dd" />


---

#### Screenshot 14 — `/linux-triage` output showing failed evidence, most likely cause, and a suggested recovery command

<img width="1792" height="1120" alt="Screenshot 14" src="https://github.com/user-attachments/assets/12909a27-2f8b-45d7-8e0c-fd54b4374401" />


---

#### Screenshot 15 — `incident-failure-report.txt` showing the failed checks and your Full Name

<img width="1792" height="501" alt="Screenshot 15" src="https://github.com/user-attachments/assets/2fc87860-4a81-4994-84c5-202df3b6ee2e" />


---

### Notes

Answer the following in your own words:

**1. Which three checks failed?**

- The Nginx service check, the port 80 check, and the local HTTP check all failed when I stopped Nginx. The disk and memory checks weren't affected because stopping the service doesn't change how much disk or memory I'm using. Those two checks still passed.

---

**2. What evidence supports the conclusion that Nginx is unavailable?**

- My report shows three pieces of evidence that prove Nginx is unavailable. First, the Nginx service is not active. Second, port 80 is not listening anymore. Third, when I ran the local HTTP request, it returned status 000 instead of 200. Together, these three results show me that Nginx is completely down and my application cannot receive any HTTP traffic.

---

**3. Did Claude execute the recovery command? Why is that important?**

- No, Claude only recommended the recovery command but never ran it. That's really important because I had to review the evidence, understand what went wrong, and decide whether the recommended action was safe before actually running it. This prevents an AI tool from automatically changing my server during an incident without my approval. I stay in control the entire time.

---

**4. Which phase of the Agentic Loop is represented by the Bash report?**

- The Bash report represents the Gather phase. My script collected current evidence about Nginx status, whether port 80 was listening, what the HTTP response was, disk usage, available memory, and recent logs. It gathered all the facts about what's actually happening on the server.

---

**5. Which phase is represented by Claude's explanation?**

- Claude's explanation represents the Analyze phase. Claude read the evidence from my report, identified which checks failed, explained what probably caused the problem, and recommended a safe recovery command for me to review. Claude took the raw data and made sense of it.

---

# Task 8 — Recover Manually, Verify Again, and Write the Incident Summary

## Goal

Recover the service as the human operator and prove that the system is healthy again.

### Evidence

#### Screenshot 16 — Output showing Nginx is active and `curl -I http://localhost` returns 200 OK

<img width="927" height="389" alt="Screenshot 16" src="https://github.com/user-attachments/assets/a8e7f0d8-10b7-429b-bcf6-7e690e80f515" />


---

#### Screenshot 17 — Second `/linux-triage` output showing successful recovery with no FAIL results

<img width="1792" height="1120" alt="Screenshot 17" src="https://github.com/user-attachments/assets/f8053ce1-2f91-45d1-92ee-9e80051aad41" />


---

#### Screenshot 18 — Output of `ls -lah reports` showing both `incident-failure-report.txt` and `recovery-report.txt`

<img width="1792" height="1120" alt="Screenshot 18" src="https://github.com/user-attachments/assets/fa5ec4b0-1fff-4c9a-9cde-a29191035b35" />


---

#### Screenshot 19 — `incident-summary.md` showing all required sections and your Full Name

<img width="1792" height="1120" alt="Screenshot 19" src="https://github.com/user-attachments/assets/81d7a330-0e21-4dc1-a122-d4f9ab99772a" />


---

### Notes

Answer the following in your own words:

**1. What action did you execute manually?**

- After I reviewed the evidence and read Claude's recommendation, I manually ran:
sudo systemctl start nginx
I had to execute this command myself. Claude only recommended it, it never ran the command for me.

---

**2. What evidence proves that the service recovered?**

- I ran systemctl is-active nginx and it returned active, which showed me Nginx was running again. Then I tested with curl -I http://16.171.38.215 and got HTTP/1.1 200 OK, which proved the application was responding to requests. When I ran /linux-triage again, the service check, port 80 check, and HTTP check all showed PASS, confirming everything came back online.

---

**3. Why is the second triage run necessary?**

- Just restarting Nginx doesn't automatically mean my entire server is healthy again. I needed to run the triage script a second time to check all five health checks again and verify that the service, port, HTTP response, disk, and memory were all in good shape. It's my proof that the recovery actually worked.
---

**4. What could go wrong if an AI agent automatically restarted every failed service?**

- If Claude just automatically restarted services on its own, I could miss what actually caused the problem in the first place. Maybe the service failed because of a bad configuration, a resource shortage, a missing dependency, or something else serious. Automatically restarting it could just hide the real issue, create an endless restart loop, or make the incident worse. That's why the evidence needs to be reviewed first by a human who understands the system.

---

**5. In one sentence, explain the difference between using AI as a chatbot and using AI in this agentic workflow.**

- A chatbot just answers my question, but in this agentic workflow, Claude uses tools to gather and analyze real server evidence while I stay in control and approve every action before it happens.

---

# Incident Summary

Fill in all seven sections below in your own words.

**Full Name:** AZIZ OLAIDE KAFAYAT

**Date:** 17/07/2026

---

**1. Reported Symptom**

- Nginx stopped responding to requests. When I checked the service status and tried to access the application, I got no response. The server appeared to be offline.

---

**2. Evidence Collected**

I ran my linux-triage script and it showed three failed checks:

- [FAIL] Nginx service is inactive
- [FAIL] Port 80 is not listening
- [FAIL] Local HTTP check returned status 000

The disk and memory checks still passed, which told me the resource issues weren't the problem.

---

**3. Most Likely Cause**

- Based on the evidence, Nginx was completely stopped. The service wasn't running, so nothing was listening on port 80, and the HTTP request failed because there was no server to respond. The Nginx service itself was the issue.

---

**4. Human-Approved Recovery Action**

- After reviewing Claude's recommendation and the evidence in the report, I manually executed:
sudo systemctl start nginx
This restarted the Nginx service.

---

**5. Verification**

- I ran systemctl is-active nginx and it returned active. Then I tested with curl -I http://16.171.38.215 and got HTTP/1.1 200 OK back. Finally, I ran /linux-triage again and all five checks passed, including the three that had failed before.

---

**6. Safety Decision**

- I allowed to use the Bash script to gather evidence and analyze it because that's read-only. Claude could recommend actions but could not execute the recovery command itself. I had to review the evidence, understand what happened, and manually run the restart command. This kept me in control and prevented Claude from making changes without my approval.

---

**7. Agentic Loop Mapping**

This incident followed the complete Agentic Loop:

1. Gather: My Bash script collected evidence about Nginx, port 80, HTTP response, disk, and memory
2. Analyze: Claude read the report and identified that Nginx was the problem
3. Human Act: I reviewed the recommendation and manually ran sudo systemctl start nginx
4. Verify: I ran /linux-triage again and confirmed all checks passed and the service recovered

---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/aziz-kafayat_just-completed-a-real-world-linux-incident-ugcPost-7484065105391988736-XjcV/?highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7484065106432237568&highlightedUpdateType=SOCIAL_SHARE&origin=SOCIAL_SHARE&utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU`

---

#### Screenshot — Published LinkedIn post

<img width="568" height="927" alt="Linkedin Post" src="https://github.com/user-attachments/assets/c8d7144e-effe-4584-93c6-56c96400dedc" />


---

# GitHub Repository URL

Paste the URL of your GitHub folder or repository containing the assignment files here:

'https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-03-linux-and-bash-for-devops/assignment-06-ai-assisted-linux-health-check.md'

---

# Submission Instructions

- Add all required screenshots in your submission
- Full Name must be visible in required screenshots and the Bash report
- All written answers must be in your own words
- Do not expose sensitive information (keys, passwords, AWS account IDs, tokens)
- GitHub URL must be included in this document

---

# Completion Checklist

- [ ] Task 1: Healthy baseline confirmed, workspace created (Screenshots 1–2, Notes answered)
- [ ] Task 2: CLAUDE.md created with all four sections (Screenshot 3, Notes answered)
- [ ] Task 3: Five-check plan produced by Claude using read-only tools (Screenshot 4, Notes answered)
- [ ] Task 4: `linux-triage.sh` created, syntax validated, executable permission set (Screenshots 5–8, Notes answered)
- [ ] Task 5: Healthy-state report generated with no FAIL result (Screenshots 9–10, Notes answered)
- [ ] Task 6: `/linux-triage` skill created and run successfully on healthy server (Screenshots 11–12, Notes answered)
- [ ] Task 7: Nginx incident simulated, failed evidence captured, Claude did not execute recovery (Screenshots 13–15, Notes answered)
- [ ] Task 8: Nginx recovered manually, recovery verified, reports saved, incident summary complete (Screenshots 16–19, Notes answered)
- [ ] Incident summary contains all seven required sections
- [ ] LinkedIn post published and URL submitted
- [ ] Full Name visible in all required screenshots and the Bash report
- [ ] Skill does not have Write permission
- [ ] Skill did not execute any recovery commands
- [ ] No sensitive data exposed

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
