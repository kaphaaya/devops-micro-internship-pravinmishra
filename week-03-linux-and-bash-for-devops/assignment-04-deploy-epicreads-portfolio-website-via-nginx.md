# Assignment 4 — Deploy EpicReads Portfolio Website via Nginx

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will deploy a static portfolio website on an Ubuntu VM using Nginx. You will download the website template, add your ownership proof in the footer, deploy the files to the Nginx web root, and verify the website is publicly accessible via a browser.

---

# Task 0 — Pre-flight Check

## Goal

Verify the Ubuntu VM and Nginx are ready for deployment.

### Evidence

#### Screenshot 0 — Output of `sudo systemctl status nginx --no-pager` showing Active (running)

<img width="1787" height="495" alt="Screenshot 0" src="https://github.com/user-attachments/assets/8d9d1ab2-3a75-4194-aaf9-5b6ee4b2acea" />


---

# Task 1 — Get the Website Source Code

## Goal

Download and extract the portfolio website template.

### Evidence

#### Screenshot 1 — Output of `ls -la` showing the extracted project folder

<img width="588" height="385" alt="Screenshot 1" src="https://github.com/user-attachments/assets/5734ee6a-6e26-4b50-a19e-6026204b1a13" />

---

# Task 2 — Add Ownership Proof (Anti-Copy Change)

## Goal

Update the website footer with your deployment details.

### Evidence

#### Screenshot 2 — Nano editor open with the updated footer showing your Full Name, Group, Week, and Date

<img width="1792" height="1120" alt="Screenshot 2" src="https://github.com/user-attachments/assets/54038077-3457-4058-9243-fc6814bc514e" />


---

# Task 3 — Deploy Website via Nginx

## Goal

Deploy the portfolio website to the Nginx web root.

### Evidence

#### Screenshot 3 — Output of `sudo nginx -t` showing configuration test successful

<img width="1513" height="477" alt="Screenshot 3" src="https://github.com/user-attachments/assets/bd1604d8-7801-45ad-b9ae-dd5b75750238" />


---

#### Screenshot 4 — Output of `ls /var/www/html` showing deployed website files

<img width="977" height="383" alt="Screenshot 4" src="https://github.com/user-attachments/assets/37942c90-3ced-409d-a2c0-25fe54075abd" />


---

# Task 4 — Verify Website is Live

## Goal

Verify the deployed website is publicly accessible and the footer contains your details.

### Evidence

#### Screenshot 5 — Output of `curl ifconfig.me` showing the server's public IP address

<img width="976" height="390" alt="Screenshot 5" src="https://github.com/user-attachments/assets/6789a5b1-06da-4356-8f89-09faac616c89" />


---

#### Screenshot 6 — Browser showing the live website with your Full Name and deployment details in the footer

<img width="1604" height="1076" alt="Screenshot 6" src="https://github.com/user-attachments/assets/468833df-b1b0-4f02-bca6-8b25cd64a563" />

---

# Task 5 — Mini Real DevOps Operational Check

## Goal

Verify the deployed website and Nginx service are healthy.

### Evidence

#### Screenshot 7 — Output of `systemctl is-enabled nginx`

<img width="973" height="106" alt="Screenshot 7" src="https://github.com/user-attachments/assets/838224cd-bd2e-4995-aaab-c14e17fafd34" />


---

#### Screenshot 8 — Output of `curl -I http://localhost` showing 200 OK

<img width="977" height="380" alt="Screenshot 8" src="https://github.com/user-attachments/assets/a45554ea-b6f1-42f6-a467-e6f717733268" />


---

# LinkedIn Post (Mandatory)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/aziz-kafayat_dmi-cohort-4-live-micro-internship-waiting-activity-7483920619131281412-SmD4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU`

---

#### Screenshot — Published LinkedIn post showing the live website with your Full Name in the footer

<img width="821" height="875" alt="Linkedin Post" src="https://github.com/user-attachments/assets/7e3b98fb-5872-4d30-99f9-ef05c8919067" />

---

# Submission Instructions

- Add all required screenshots in your submission
- Full name must be visible in required screenshots
- Ownership proof in the footer is mandatory
- Do not expose sensitive information (keys, passwords, account IDs)

---

# Completion Checklist

- [ ] Screenshot 0: Nginx service status (active/running)
- [ ] Screenshot 1: Website files downloaded and extracted
- [ ] Screenshot 2: Footer updated with Full Name, Group, Week, and Date
- [ ] Screenshot 3: Nginx configuration test successful
- [ ] Screenshot 4: Website files deployed to /var/www/html
- [ ] Screenshot 5: Public IP retrieved
- [ ] Screenshot 6: Live website accessible in browser with footer details
- [ ] Screenshot 7: Nginx enabled on boot
- [ ] Screenshot 8: Local HTTP response returns 200 OK
- [ ] LinkedIn post published and URL submitted
- [ ] Full Name visible in all required screenshots
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
