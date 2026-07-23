# Assignment 5 — Open-Source Collaboration: Fork, Clone, Sync & Pull Request

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will contribute one small documentation change to a shared repository using a standard open-source collaboration workflow: fork, clone, configure remotes, branch, commit, sync with upstream, push, and open a Pull Request. This is a different, separate practice repository from the one you submit your DMI work in.

---

# Task 0 — Fork the Upstream Repository

## Goal

Fork `pravinmishraaws/devops-micro-internship-interviews` into your own GitHub account.

### Evidence

#### Screenshot 1 — Your fork page with your username and `devops-micro-internship-interviews` visible in the browser URL

<img width="1777" height="1069" alt="Screenshot 1" src="https://github.com/user-attachments/assets/057ffe01-3f3d-4d11-83c5-2ac01ea1df81" />


---

# Task 1 — Authenticate GitHub from the Terminal

## Goal

Configure one authentication method — HTTPS with a Personal Access Token, or SSH — so you can push to your fork. Use only one method.

### Evidence

#### Screenshot 2 — Output of `git config --global --get credential.helper` (HTTPS) or `ssh -T git@github.com` (SSH) showing successful authentication — never show your token or private key

<img width="1176" height="380" alt="Screenshot 2" src="https://github.com/user-attachments/assets/388fa6cc-25db-4e52-8fa4-3efa916880b2" />

---

# Task 2 — Clone Your Fork and Configure Remotes

## Goal

Clone your fork locally, then add the original repository as `upstream`.

### Evidence

#### Screenshot 3 — Output of `git remote -v` showing `origin` pointing to your fork and `upstream` pointing to `pravinmishraaws/devops-micro-internship-interviews`

<img width="1171" height="378" alt="Screenshot 3" src="https://github.com/user-attachments/assets/1c49e825-f46a-41d0-9da0-691432cfd3ee" />


---

# Task 3 — Create a Feature Branch and Make Your Change

## Goal

Create the branch `feature-readme-update`, add only your own entry (`Full Name — Group <Group Name/Number>`) to the Student List at the end of `pull_request.md`, and commit it with the message `docs: add my name to student list`.

### Evidence

#### Screenshot 4 — Output of `git status` showing `pull_request.md` modified before staging

<img width="1171" height="380" alt="Screenshot 4" src="https://github.com/user-attachments/assets/16bd59bc-bb5b-43b4-800a-15ac20ec90da" />


---

#### Screenshot 5 — Output of `git commit`

<img width="1171" height="378" alt="Screenshot 5" src="https://github.com/user-attachments/assets/89af3046-9bf8-44d9-9849-88c9fc130570" />


---

# Task 4 — Synchronize with Upstream and Push to Your Fork

## Goal

Fetch and merge `upstream/main` into your local default branch, rebase your feature branch onto it, then push `feature-readme-update` to your fork.

### Evidence

#### Screenshot 6 — Output of `git push -u origin feature-readme-update` showing a successful push

<img width="1171" height="382" alt="Screenshot 6" src="https://github.com/user-attachments/assets/87c997c1-9b2a-4e37-a1ef-a837066f76d8" />


---

#### Screenshot 7 — Your fork on GitHub showing `feature-readme-update` in the branch selector or a "Compare & pull request" banner

<img width="821" height="1081" alt="Screenshot 7" src="https://github.com/user-attachments/assets/5e381961-ecda-402c-b6d8-ed8e00530dff" />


---

# Task 5 — Create a Pull Request to Upstream

## Goal

Open a Pull Request from `feature-readme-update` on your fork to `main` on the upstream repository, using the title `docs: add my name to student list`.

### Evidence

#### Screenshot 8 — Pull Request creation page showing the correct base repository, base branch, head repository, compare branch, and title

<img width="1321" height="972" alt="Screenshot 8" src="https://github.com/user-attachments/assets/371384cc-7bab-4ea5-bc8c-98ee98c39c2a" />


---

#### Screenshot 9 — Successfully created Pull Request page with the PR number visible

<img width="1488" height="902" alt="Screenshot 9" src="https://github.com/user-attachments/assets/88cb362f-b2a1-468b-8198-d5d2c9fe908a" />


---

#### Pull Request URL

Paste your Pull Request URL here:

https://github.com/pravinmishraaws/devops-micro-internship-interviews/pull/354
---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

(https://www.linkedin.com/feed/update/urn:li:activity:7486085788288454656/

---

#### Screenshot — LinkedIn post showing your successfully created Pull Request

<img width="790" height="839" alt="Linkedin Screenshot" src="https://github.com/user-attachments/assets/d288e90e-55b1-460c-a57a-b1b71000491b" />


---

# Submission Instructions

- Add all required screenshots in your submission
- Do not expose a Personal Access Token, SSH private key, password, or authentication secret
- Only your own entry in `pull_request.md` may be added — do not edit or delete another student's entry
- Include your fork URL and Pull Request URL

---

## Fork URL

Paste your fork URL here:

https://github.com/kaphaaya/devops-micro-internship-interviews

---

# Completion Checklist

- [ ] Upstream repository forked to your GitHub account (Screenshot 1)
- [ ] GitHub authentication configured securely (Screenshot 2)
- [ ] Fork cloned locally with `origin` and `upstream` configured (Screenshot 3)
- [ ] Only `pull_request.md` modified, with your own entry added (Screenshots 4–5)
- [ ] Local default branch synchronized with `upstream/main`, feature branch rebased and pushed (Screenshots 6–7)
- [ ] Pull Request opened against the correct upstream repository and branch (Screenshots 8–9)
- [ ] Fork URL and Pull Request URL included
- [ ] LinkedIn post published and URL submitted
- [ ] No PAT, password, private key, or authentication secret exposed

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
