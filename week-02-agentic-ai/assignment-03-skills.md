# Assignment 3 — Building Your Command Center

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build a local Claude Skills system by creating the `.claude/skills/` folder structure, adding predefined skill files, and executing a real agentic command (`/scaffold-terraform`) to generate infrastructure code. You will also observe how skills enforce tool restrictions and enable controlled automation.

---

# Task 1 — Create the Skill Folder Structure

## Goal

Create the required `.claude/skills/` directory structure for all skills.

### Evidence

#### Screenshot 1 — VS Code sidebar showing `.claude/skills/` folder with all 4 subfolders visible

<img width="1792" height="1120" alt="Screenshot 1" src="https://github.com/user-attachments/assets/7e4fb039-1c9e-4f32-9e2e-2e967204afba" />

---

# Task 2 — Add the Skill Files

## Goal

Place all required skill files into their correct directories and verify their configuration.

### Evidence

#### Screenshot 2 — `.claude/skills/scaffold-terraform/` open in VS Code showing both `SKILL.md` and `template-spec.md`

<img width="1792" height="1120" alt="Screenshot 2" src="https://github.com/user-attachments/assets/d11fb51d-a4d0-4ce4-8556-5bc0320aef9f" />

---

#### Screenshot 3 — Screenshot 3 — `tf-plan/SKILL.md` frontmatter showing `allowed-tools: Bash, Read, Grep` (no Write) and `disable-model-invocation: true`

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/922e7ecf-69cc-4c50-a21c-d30115f18d20" />

---

# Task 3 — Run /scaffold-terraform

## Goal

Execute the `/scaffold-terraform` skill to generate a full Terraform infrastructure setup.

### Evidence

#### Screenshot 4 — Claude's response showing the scaffold complete with the file list

<img width="1792" height="1120" alt="Screenshot 4 0" src="https://github.com/user-attachments/assets/80c99df7-0a72-406f-b6e3-fc1dddebcaea" />

<img width="1792" height="1120" alt="Screenshot 4 1" src="https://github.com/user-attachments/assets/0b2b3553-bb82-416c-a1a3-fe9fb70e48db" />

---

#### Screenshot 5 — VS Code sidebar showing the `terraform/` folder with all generated files inside

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/5e0c26e1-7d74-4f9e-9b4b-94b4ca756c7b" />

---

# Task 4 — Run terraform init and /tf-plan

## Goal

Initialize Terraform and execute the `/tf-plan` skill to observe plan execution and output analysis.

### Evidence

#### Screenshot 6 — Claude's `/tf-plan` response showing it ran the command and analyzed the result (pass or auth error both count)

<img width="1792" height="1120" alt="Screenshot 6 0" src="https://github.com/user-attachments/assets/70e9fff1-621c-40db-8941-b546cf1621fd" />

<img width="1792" height="1120" alt="Screenshot 6 1" src="https://github.com/user-attachments/assets/9f8dec10-eaba-4952-8587-f9d69f8a80e9" />

<img width="588" height="672" alt="Screenshot 6 3" src="https://github.com/user-attachments/assets/a3b7a7a2-bf00-46e2-9072-d80d6bf0c6b6" />

---

# Submission Instructions

- Ensure `.claude/skills/` folder and all skill files are committed to your GitHub repository
- Run all commands successfully and capture required screenshots
- Push final changes to your forked repository

---

## GitHub Repository URL

Paste your forked repository URL here:

https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-02-agentic-ai/solution-assignment-03-skills.md

## LinkedIn post URL

Paste your forked repository URL here:

https://www.linkedin.com/posts/aziz-kafayat_dmibypravinmishra-agenticai-claudecode-share-7480630511191822336-SI2O/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU
---

# Completion Checklist

- [ ] `.claude/skills/` folder created with all 4 skill folders
- [ ] All skill files placed correctly
- [ ] `tf-plan/SKILL.md` shows correct `allowed-tools` restrictions
- [ ] `/scaffold-terraform` executed successfully
- [ ] Terraform files generated inside `terraform/` folder
- [ ] `terraform init` executed successfully
- [ ] `/tf-plan` executed and output analyzed by Claude
- [ ] All required screenshots added
- [ ] GitHub repository URL included
- [ ] LinkedIn post URL included

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
