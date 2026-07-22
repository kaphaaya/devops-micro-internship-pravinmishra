# Assignment 2 — CodeTrack: Tracking, Staging, Committing + Deploy to EC2

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will track and stage project files, create two meaningful Git commits in `CodeTrack`, verify your commit history, and deploy the CodeTrack static website to an EC2 instance using Nginx. This connects local version-control practice with a basic manual deployment workflow used in real DevOps environments.

---

# Task 1 — Verify Git Setup and Enter the Repository

## Goal

Confirm that Git works and that you are inside the correct `CodeTrack` repository.

### Evidence

#### Screenshot 1 — Output of `pwd` showing you're inside `CodeTrack`

<img width="845" height="378" alt="Screenshot 1" src="https://github.com/user-attachments/assets/bbbc7940-b1f6-4681-b7c4-6dd1d558af4b" />
---

#### Screenshot 2 — Output of `git status` showing no "not a git repository" error

<img width="840" height="379" alt="Screenshot 2" src="https://github.com/user-attachments/assets/3be4bae2-4952-4b2e-b928-2fc76821ce33" />


---

# Task 2 — Create index.html and style.css

## Goal

Create the two starter UI files inside `CodeTrack`.

### Evidence

#### Screenshot 3 — Output of `ls` showing `index.html` and `style.css`

<img width="848" height="384" alt="Screenshot 3" src="https://github.com/user-attachments/assets/ed9430a3-f58f-40d5-883e-537fe867dfb9" />


---

# Task 3 — Add Starter Content

## Goal

Copy the provided starter HTML and CSS content into your local `index.html` and `style.css` files.

### Evidence

#### Screenshot 4 — Your editor showing the contents of `index.html` and `style.css`

<img width="1441" height="895" alt="Screenshot 4" src="https://github.com/user-attachments/assets/0d9b769d-fa26-49a4-8e41-c6991ebfdda2" />

<img width="1442" height="898" alt="Screenshot 4 1" src="https://github.com/user-attachments/assets/9eab04a8-f25e-4b50-af3f-27d1c649523a" />

---

# Task 4 — Track and Stage Files Correctly

## Goal

Confirm both files show as untracked, then stage them individually with `git add`.

### Evidence

#### Screenshot 5 — Output of `git status` showing both files as untracked

<img width="852" height="391" alt="Screenshot 5" src="https://github.com/user-attachments/assets/9d5fd179-8b32-4719-aa0c-4daa187bb54e" />

---

#### Screenshot 6 — Output of `git status` showing both files staged under "Changes to be committed"

<img width="844" height="389" alt="Screenshot 6" src="https://github.com/user-attachments/assets/aac1d80a-3668-4700-9afc-dc98fb3be821" />


---

# Task 5 — Create the First Commit (Clean Initial Commit)

## Goal

Commit the staged starter files using the message `Initial UI scaffold: add index.html and style.css`, then check the log.

### Evidence

#### Screenshot 7 — Output of `git commit`

<img width="853" height="388" alt="Screenshot 7" src="https://github.com/user-attachments/assets/48d6ec03-7645-4b31-855c-010033dc0f8f" />


---

#### Screenshot 8 — Output of `git log --oneline` showing the first commit

<img width="849" height="376" alt="Screenshot 8" src="https://github.com/user-attachments/assets/6f0876b1-3fcb-4471-8aef-5b17d0b8d7b0" />


---

# Task 6 — Modify index.html and Create a Second Commit

## Goal

Follow the instruction comment inside `index.html` to update the Student Name and Group Name, then commit that change separately using the message `Update homepage content: heading, tagline, CTA button`.

### Evidence

#### Screenshot 9 — Browser showing the updated page with your Student Name and Group Name visible

<img width="1785" height="997" alt="Screenshot 9" src="https://github.com/user-attachments/assets/9d3e81b5-f2b9-48f9-b317-363990bf8990" />


---

#### Screenshot 10 — Output of `git status` showing `index.html` as modified

<img width="849" height="388" alt="Screenshot 10" src="https://github.com/user-attachments/assets/e1b99378-e219-40c3-a984-267042d786d9" />


---

#### Screenshot 11 — Output of `git commit`

<img width="846" height="385" alt="Screenshot 11" src="https://github.com/user-attachments/assets/5152a3e8-eef7-40bc-b829-5c58f4ea6a0d" />



---

#### Screenshot 12 — Output of `git log --oneline` showing two commits

<img width="839" height="390" alt="Screenshot 12" src="https://github.com/user-attachments/assets/a71eb7aa-807b-4d03-b7c2-c601adcb232d" />


---

# Task 7 — Deploy to EC2 with Nginx (Static Website)

## Goal

Install and start Nginx on your EC2 instance, then copy `index.html` and `style.css` into the Nginx web root.

### Evidence

#### Screenshot 13 — Output of `systemctl status nginx --no-pager` showing Nginx `active (running)`

<img width="890" height="379" alt="Screenshot 13" src="https://github.com/user-attachments/assets/9c21f0c5-dc02-46c1-8979-29f2f20278b0" />


---

#### Screenshot 14 — Output of `curl -I http://localhost` showing `HTTP/1.1 200 OK`


---

#### Screenshot 15 — Browser showing the CodeTrack site loaded at `http://<EC2_PUBLIC_IP>`, with your Full Name and Group Name visible

<img width="1361" height="928" alt="Screenshot 15" src="https://github.com/user-attachments/assets/0968df6a-82c4-406f-88a9-c1b1f036e55a" />


---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://www.linkedin.com/posts/aziz-kafayat_spun-up-a-fresh-ec2-instance-wrestled-with-ugcPost-7485666168025030656-mDAN/?highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7485666171032252416&highlightedUpdateType=SOCIAL_SHARE&origin=SOCIAL_SHARE&utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU

---

#### Screenshot — LinkedIn post showing the deployed CodeTrack application

<img width="793" height="923" alt="Linkedin Screenshot" src="https://github.com/user-attachments/assets/664ab7df-ab66-439b-91e7-857dde7f6f9c" />

---

# Submission Instructions

- Add all required screenshots in your submission
- Full Name and Group Name must be visible in the deployed application evidence
- `git log --oneline` output must show at least two meaningful commits
- Do not expose AWS access keys, passwords, private key contents, or other sensitive information

---

# Completion Checklist

- [ ] `CodeTrack` repository verified with `git status` (Screenshots 1–2)
- [ ] `index.html` and `style.css` created and populated (Screenshots 3–4)
- [ ] Starter files staged and committed in the first commit (Screenshots 5–8)
- [ ] Student Name and Group Name updated in `index.html` (Screenshot 9)
- [ ] Second controlled commit created (Screenshots 10–12)
- [ ] Nginx active on the EC2 instance and CodeTrack reachable via its public IP (Screenshots 13–15)
- [ ] LinkedIn post published and URL submitted
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
