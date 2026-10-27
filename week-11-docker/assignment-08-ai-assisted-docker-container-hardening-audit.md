# Assignment 8 — AI-Assisted Docker Container Hardening Audit

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will build a read-only Bash script that audits a running Docker container for common hardening gaps — running as root, missing health checks, unpinned image tags, privileged mode, and unnecessary exposed ports — then connect that script to Claude Code as a reusable `/docker-audit` skill. You will run the audit against your production-grade EpicBook stack, fix what it finds by editing the Dockerfile yourself, rebuild the image, and re-run the audit to prove the fix worked. Claude analyzes evidence and recommends a fix; it never edits your Dockerfile or rebuilds the image itself.

---

# Target Container

**Target Container Name:* epicbook-backend

---

# Task 1 — Prepare the Audit Workspace

## Goal

Create an audit workspace and confirm that the supplied files are available.

### Evidence

#### Screenshot 1 — Audit Workspace Files

Add a terminal screenshot showing your full name and both supplied files:

```text
docker-audit.sh
SKILL.md
```

<img width="844" height="114" alt="1" src="https://github.com/user-attachments/assets/e359a274-5650-44fc-971b-2c0f654b56d1" />


---

# Task 2 — Add the Docker Audit Skill to Claude Code

## Goal

Add the supplied `docker-audit` skill to Claude Code and confirm that it is available.

### Evidence

#### Screenshot 2 — Docker Audit Skill Available in Claude Code

Add a screenshot of Claude Code showing `docker-audit` in the available skill list.

<img width="841" height="930" alt="2" src="https://github.com/user-attachments/assets/e1b66833-dfb1-4ca0-b420-504d03632c5a" />


---

# Task 3 — Validate the Audit Script

## Goal

Verify the audit script line endings, Bash syntax, and usage message.

### Evidence

#### Screenshot 3 — Script Validation

Add a terminal screenshot showing:

- LF line-ending check
- Successful `bash -n docker-audit.sh` validation
- Your full name
- The usage message displayed when the script runs without a container name

<img width="843" height="235" alt="3" src="https://github.com/user-attachments/assets/566bd041-8199-40fa-842f-af39ecf67359" />


---

# Task 4 — Run the Initial Docker Security Audit

## Goal

Audit a running container and record the initial findings.

### Evidence

#### Screenshot 4 — Selected Target Container

Add a terminal screenshot showing:

- Your full name
- `docker ps`
- The audit command using the selected target container name

<img width="836" height="231" alt="4" src="https://github.com/user-attachments/assets/0f7c6cee-08b8-4538-8f6a-9cd72f14cf99" />


---

#### Screenshot 5 — Initial Audit Results

Add a terminal screenshot showing the initial Docker audit results.

<img width="843" height="364" alt="5" src="https://github.com/user-attachments/assets/71179edd-1e47-419e-8f83-f38ff229e8bb" />


---

# Task 5 — Use AI Assistance to Understand the Findings

## Goal

Use the supplied `docker-audit` skill to understand the initial audit results safely.

### Evidence

#### Screenshot 6 — Audit Explanation and Recommended Fix

Add a Claude Code screenshot showing:

- Audit finding
- Security risk
- Recommended manual fix
- Verification method

<img width="842" height="727" alt="6" src="https://github.com/user-attachments/assets/c85b764c-8a77-4e57-8673-d1b4dd3548cc" />


---

# Task 6 — Apply One Container-Hardening Fix

## Goal

Manually fix one WARN or FAIL finding from the initial audit.

### Evidence

#### Screenshot 7 — Hardening Configuration Change

Add a screenshot of the updated Dockerfile or `docker-compose.yml` showing the selected hardening fix.

<img width="842" height="559" alt="7" src="https://github.com/user-attachments/assets/516f5a8b-c48d-43f8-869c-5eede4d32ed6" />

<img width="842" height="503" alt="7 1" src="https://github.com/user-attachments/assets/8ac7240f-862f-4135-93fd-6991c838661c" />

---

#### Screenshot 8 — Updated Service Running

Add a terminal screenshot showing your full name and the rebuilt or recreated service/container running successfully.

<img width="842" height="179" alt="8" src="https://github.com/user-attachments/assets/72866b57-a044-480c-9569-6b03c2020996" />

---

# Task 7 — Re-Run the Audit and Compare Results

## Goal

Verify that the selected hardening fix improved the container configuration.

### Evidence

#### Screenshot 9 — Final Audit Results

Add a terminal screenshot showing:

- Your full name
- The updated running container
- The final audit report

<img width="838" height="532" alt="9" src="https://github.com/user-attachments/assets/5b261bfc-265c-4f6d-b481-802e20c20289" />


---

### Before-and-After Comparison

Write a short comparison covering:

- Initial audit finding
- Dockerfile or Docker Compose change applied
- Final audit result
- Security benefit of the improvement

### Before-and-After Comparison

**Initial audit finding:** The initial container hardening audit returned five PASS results and one WARN. The warning identified that the backend image, `epicbook-production-backend`, did not have an explicit image tag.

**Hardening change applied:** I updated the backend service in `docker-compose.yml` to use the explicit image tag `epicbook-backend:20261027`. I then built the tagged image and recreated only the backend service.

**Final audit result:** Pending confirmation from the final audit report.

**Security benefit:** Explicit image tags improve image identification and deployment traceability, making it easier to distinguish versions and manage deployments consistently. However, tags alone do not guarantee that an image is immutable; using an image digest provides stronger assurance of the exact image content.

---

# LinkedIn Requirement

## Goal

Create a LinkedIn post about the container security checks you performed, one hardening improvement you applied, and why the improvement matters.

### Evidence

**LinkedIn Post URL:** https://lnkd.in/p/eicgFZdD

#### LinkedIn Post Screenshot

Add a screenshot of the published LinkedIn post, including the final audit result.

<img width="469" height="602" alt="linkedin post" src="https://github.com/user-attachments/assets/995bb30a-c00a-419a-875e-12d84035cfce" />

---

# Submission Instructions

- Include Screenshots 1–9 exactly as specified.
- Include the target container name and before-and-after comparison.
- Include the LinkedIn post URL and screenshot.
- Ensure that your full name is visible in all required terminal screenshots.
- Do not expose passwords, API keys, tokens, account IDs, or `.env` file contents.

---

# Completion Checklist

- [ ] Audit workspace created and supplied files verified
- [ ] `docker-audit` skill added to Claude Code
- [ ] Audit script validated successfully
- [ ] Running target container identified
- [ ] Initial Docker audit completed
- [ ] Claude Code explanation of findings captured
- [ ] One hardening fix applied manually
- [ ] Affected service or container rebuilt and recreated
- [ ] Final Docker audit completed
- [ ] Before-and-after comparison completed
- [ ] Screenshots 1–9 included
- [ ] LinkedIn post URL and screenshot included
- [ ] No sensitive information exposed

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
