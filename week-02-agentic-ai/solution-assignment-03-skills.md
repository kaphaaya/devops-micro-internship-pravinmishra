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

<img width="1792" height="1120" alt="Screenshot 1" src="https://github.com/user-attachments/assets/675ce4fc-6d2e-434f-8165-246e591b5078" />

---

# Task 2 — Add the Skill Files

## Goal

Place all required skill files into their correct directories and verify their configuration.

### Evidence

#### Screenshot 2 — `.claude/skills/scaffold-terraform/` open in VS Code showing both `SKILL.md` and `template-spec.md`

<img width="1792" height="1120" alt="Screenshot 2" src="https://github.com/user-attachments/assets/120e46cb-54b0-4111-bc54-6bfdec6a6b6b" />

---

#### Screenshot 3 — Screenshot 3 — `tf-plan/SKILL.md` frontmatter showing `allowed-tools: Bash, Read, Grep` (no Write) and `disable-model-invocation: true`

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/4da9784b-e8de-4c71-a46f-6647e2cb5bed" />

---

# Task 3 — Run /scaffold-terraform

## Goal

Execute the `/scaffold-terraform` skill to generate a full Terraform infrastructure setup.

### Evidence

#### Screenshot 4 — Claude's response showing the scaffold complete with the file list

<img width="1792" height="1120" alt="Screenshot 4 0" src="https://github.com/user-attachments/assets/3447f998-c33b-40d8-8e03-88a76564f524" />

<img width="1792" height="1120" alt="Screenshot 4 1" src="https://github.com/user-attachments/assets/19baecb4-9389-4390-ac5d-5b978806bb5a" />

---

#### Screenshot 5 — VS Code sidebar showing the `terraform/` folder with all generated files inside

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/c211040d-91da-492a-8396-3e5847c7a1f4" />

---

# Task 4 — Run terraform init and /tf-plan

## Goal

Initialize Terraform and execute the `/tf-plan` skill to observe plan execution and output analysis.

### Evidence

#### Screenshot 6 — Claude's `/tf-plan` response showing it ran the command and analyzed the result (pass or auth error both count)

<img width="1792" height="1120" alt="Screenshot 6 0" src="https://github.com/user-attachments/assets/fbaeb192-c1c1-4c54-852c-3bed86fe5854" />

<img width="1792" height="1120" alt="Screenshot 6 1" src="https://github.com/user-attachments/assets/11a2c597-df11-42b6-9600-d93ee9c5c4a2" />

<img width="588" height="672" alt="Screenshot 6 3" src="https://github.com/user-attachments/assets/9442c804-3ccf-42ac-8eb9-f517aa3652f9" />

---

# Submission Instructions

- Ensure `.claude/skills/` folder and all skill files are committed to your GitHub repository
- Run all commands successfully and capture required screenshots
- Push final changes to your forked repository

---

## GitHub Repository URL

Paste your forked repository URL here:

'https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-02-agentic-ai/solution-assignment-03-skills.md'

## LinkedIn post URL

Paste your forked repository URL here:

`https://www.linkedin.com/posts/aziz-kafayat_dmibypravinmishra-agenticai-claudecode-share-7480630511191822336-SI2O/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU`
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
