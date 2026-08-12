# Assignment 2 — Deploy Personal Portfolio Website on S3

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will deploy a static personal portfolio website quickly and reliably using Amazon S3 Static Website Hosting. You will download the portfolio template, create an S3 bucket, upload the static files, enable static website hosting, configure public read access, and validate the deployment through the S3 website endpoint.

---

# Task 1 — Download the Website Template Locally

## Goal

Download or clone the portfolio website template from GitHub and confirm `index.html` is present.

### Evidence

#### Screenshot 1 — File Explorer or terminal showing the template folder contents with `index.html` visible

<img width="842" height="385" alt="Screenshot 1" src="https://github.com/user-attachments/assets/f994896d-33f5-419c-a51a-9af3849f5e5d" />


---

# Task 2 — Create an S3 Bucket for Website Hosting

## Goal

Create a globally unique S3 bucket in your chosen AWS region.

### Evidence

#### Screenshot 2 — S3 bucket created screen showing the bucket name and region

<img width="1791" height="967" alt="Screenshot 2" src="https://github.com/user-attachments/assets/b32d097b-9207-436d-881e-0e136c2e4b0d" />


---

# Task 3 — Upload Website Files to the Bucket

## Goal

Upload the contents of the template folder (not the folder itself) so `index.html` sits at the bucket root.

### Evidence

#### Screenshot 3 — S3 bucket Objects view showing `index.html` at the top or root level

<img width="1792" height="944" alt="Screenshot 3" src="https://github.com/user-attachments/assets/d492397a-78b2-47e1-bbbb-4952844af02e" />


---

# Task 4 — Enable Static Website Hosting

## Goal

Enable S3 Static Website Hosting with `index.html` as the index document and `error.html` as the error document.

### Evidence

#### Screenshot 4 — Static website hosting enabled screen showing the Website endpoint

<img width="1792" height="997" alt="Screenshot 4" src="https://github.com/user-attachments/assets/6fba7885-fba1-4314-a2dd-ff56f0632f02" />


---

# Task 5 — Make the Website Public (Bucket Policy + Permissions)

## Goal

Adjust Block Public Access settings and save a bucket policy that grants public read access to the website objects.

### Evidence

#### Screenshot 5 — Bucket policy page showing the policy saved successfully, with the bucket name visible

<img width="1792" height="993" alt="Screenshot 5" src="https://github.com/user-attachments/assets/88922e80-6861-4a6e-82b4-323eb26dfdc6" />


---

# Task 6 — Verify Website Works (Public Endpoint Test)

## Goal

Load the site through the S3 website endpoint and confirm the homepage, images, and CSS load correctly.

### Evidence

#### Screenshot 6 — Browser showing the live website with the S3 website endpoint visible in the address bar

<img width="1792" height="1081" alt="Screenshot 6" src="https://github.com/user-attachments/assets/c0410f97-6fae-4a73-a969-0f63aa6c46bd" />


---

# Task 7 — (Optional) Update One Small Detail and Re-Upload

## Goal

Edit a small visible detail, re-upload it to S3, and confirm the change appears live.

### Evidence

#### Screenshot 7 (optional) — Before and after views, or a browser view showing the updated text

<img width="1792" height="996" alt="Screenshot 7 1" src="https://github.com/user-attachments/assets/95ccbc28-bd6b-4a61-918e-83b3f09ec54f" />

<img width="1792" height="1077" alt="Screenshot 7 2" src="https://github.com/user-attachments/assets/5a838108-811a-4a02-8c69-444ddf29d736" />


---

# Submission Instructions

- Add all required screenshots in your submission
- Include the live S3 Website Endpoint URL
- Do not expose sensitive AWS account information

---

# Completion Checklist

- [✅ ] Task 1: Template downloaded/cloned with `index.html` confirmed (Screenshot 1)
- [✅ ] Task 2: Globally unique S3 bucket created (Screenshot 2)
- [✅ ] Task 3: Website files uploaded with `index.html` at bucket root (Screenshot 3)
- [✅ ] Task 4: Static website hosting enabled (Screenshot 4)
- [✅ ] Task 5: Public-read bucket policy saved (Screenshot 5)
- [✅ ] Task 6: Live website verified through the S3 website endpoint (Screenshot 6)
- [✅ ] Task 7: Optional small update re-uploaded and verified (Screenshot 7)
- [✅ ] S3 Website Endpoint URL included
- [✅ ] No sensitive account information exposed

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
