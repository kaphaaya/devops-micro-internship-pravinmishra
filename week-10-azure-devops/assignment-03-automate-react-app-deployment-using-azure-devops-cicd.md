# Assignment 3 — Automate React App Deployment Using Azure DevOps CI/CD

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will create a multi-stage Azure DevOps pipeline that builds, tests, publishes, and deploys a React application to an Ubuntu VM hosted on AWS or Azure. The pipeline will automatically run when changes are committed to `main`, transfer the production build as an artifact, and deploy it through Nginx.

---

# Task 0 — Verify the Starting Environment

## Goal

Confirm that Azure DevOps, the pipeline agent, Terraform, Ansible, and the selected cloud environment are ready.

No submission screenshot is required for this task.

---

# Task 1 — Import and Personalize the React Application

## Goal

Import the React application into Azure Repos and add your Full Name and the current date.

## Evidence

### Screenshot 1 — Imported React Project in Azure Repos

Add a screenshot of Azure Repos showing:

* Imported React project
* Repository name
* `main` branch
* Project files

<img width="1257" height="918" alt="1" src="https://github.com/user-attachments/assets/030d185b-81b1-4179-a9d8-2eedf8a8936c" />


---

# Task 2 — Provision and Configure the Target VM

## Goal

Provision an Ubuntu VM using Terraform and configure Nginx, React SPA routing, SSH access, and deployment permissions using Ansible.

No separate submission screenshot is required for this task.

---

# Task 3 — Create or Update the SSH Service Connection

## Goal

Create or update an Azure DevOps SSH Service Connection that allows the pipeline to connect securely to the target VM.

No separate submission screenshot is required for this task.

> Do not include the VM password, SSH private key, token, or another secret in the submission.

---

# Task 4 — Author the Multi-Stage Azure Pipeline

## Goal

Create an Azure Pipeline containing Build, Test, Publish, and Deploy stages with an automatic trigger for commits to `main`.

## Evidence

### Screenshot 2 — Multi-Stage Pipeline YAML

Add a screenshot of the Azure Pipeline YAML open in the editor showing:

* Trigger
* Build stage
* Test stage
* Publish stage
* Deploy stage

<img width="1791" height="1001" alt="2" src="https://github.com/user-attachments/assets/f7ecebc9-f243-417f-b6b6-304f433ea7e9" />

<img width="1790" height="993" alt="2 1" src="https://github.com/user-attachments/assets/b135b64b-20ca-42a3-a812-093a99023704" />


> Do not expose passwords, private keys, tokens, or cloud credentials.

---

# Task 5 — Run the Pipeline and Resolve Configuration Issues

## Goal

Complete a successful end-to-end pipeline run containing all four stages.

## Evidence

### Screenshot 3 — Successful Multi-Stage Pipeline Run

Add a screenshot of one Azure DevOps pipeline run showing all four stages succeeded:

* Build
* Test
* Publish
* Deploy

<img width="1534" height="949" alt="3" src="https://github.com/user-attachments/assets/fa0839bf-5649-424e-b702-35a3ca4d03f1" />


---

# Task 6 — Verify the Deployment on the VM

## Goal

Confirm that the pipeline deployed the production-ready React files to the correct Nginx web root.

## Evidence

### Screenshot 4 — Post-Deployment Contents of /var/www/html

Add a screenshot of the pipeline SSH verification log or VM terminal showing the post-deployment contents of:

`/var/www/html`

<img width="596" height="192" alt="4" src="https://github.com/user-attachments/assets/5adba8ae-8e50-4068-b39b-393568c5359b" />


---

# Task 7 — Verify the Website and Automatic Trigger

## Goal

Confirm that the React application is accessible and that a commit to `main` automatically triggers the CI/CD pipeline.

## Evidence

### Screenshot 5 — Deployed React Application

Add a browser screenshot showing:

* Deployed React application
* VM public IP address in the browser address bar
* Your Full Name
* Deployment date

<img width="819" height="1048" alt="5" src="https://github.com/user-attachments/assets/0b606da2-a3ec-4a63-9a26-a9e44590a628" />


## Final Application URL

http://98.87.18.254/

Replace the placeholder and paste your final application URL below:

[Paste your final application URL here.]

---

# CI/CD Workflow Summary

Write a short explanation of the CI/CD workflow you created.

### Assignment 3: Automating React App Deployment Using Azure DevOps CI/CD 🚀

In this project, I built a CI/CD pipeline to automate the deployment of a React application to an AWS EC2 instance.

**What I did:**

- **Azure Repos:** Imported the React application and managed the source code.
- **AWS EC2:** Set up an Ubuntu server to host the application.
- **Nginx:** Configured the web server to serve the React production build.
- **Azure Pipelines:** Created a YAML pipeline with four stages:
  1. **Build** — Installed dependencies and built the React app.
  2. **Test** — Ran the application's tests.
  3. **Publish** — Published and verified the build artifact.
  4. **Deploy** — Transferred the build to EC2 and deployed it using SSH.

**What I learned:**

I encountered repeated deployment failures caused by Linux file permissions. By investigating the logs and changing the deployment process to use a staging directory, I worked toward a more reliable deployment workflow.

**Final outcome:** All four pipeline stages eventually completed successfully. ✅

This project helped me understand how source control, automated testing, build artifacts, SSH, Linux permissions, and web server configuration work together in a CI/CD pipeline.

---

# LinkedIn Requirement

## Evidence

### Screenshot 6 — LinkedIn Post

Add a screenshot of your LinkedIn post showing:

* Post text
* At least one image or link

<img width="553" height="919" alt="linkedin" src="https://github.com/user-attachments/assets/d320b373-a3a6-435b-99a1-585c60dce62d" />


## LinkedIn Post URL

https://lnkd.in/p/e-sryqvj

> Do not expose VM passwords, tokens, private keys, cloud credentials, or other sensitive information.

---

# Submission Instructions

* Complete all tasks in sequence.
* Include the short CI/CD workflow summary.
* Include Screenshots 1–6.
* Include the final application URL.
* Include the public LinkedIn post URL.
* Confirm that all screenshots are readable and show the required context.
* Do not expose passwords, PATs, private keys, cloud credentials, subscription IDs, account IDs, or other secrets.
* Follow the Assignment Submission Guidelines.

---

# Completion Checklist

* [ ] All tasks were completed in sequence
* [ ] The correct React repository was imported into Azure Repos
* [ ] Your Full Name and date were added to the application
* [ ] The pipeline YAML was authored and committed to the repository
* [ ] Commits to `main` trigger the pipeline automatically
* [ ] The pipeline contains Build, Test, Publish, and Deploy stages
* [ ] All four stages succeeded in the same pipeline run
* [ ] The production build moved between stages as a pipeline artifact
* [ ] The Deploy stage used the SSH Service Connection
* [ ] No password or secret is stored in the YAML
* [ ] `index.html` is directly inside `/var/www/html`
* [ ] Raw React source code was not deployed to the Nginx web root
* [ ] `node_modules/` was not deployed to the Nginx web root
* [ ] Nginx is active
* [ ] The application opens through the VM public IP address
* [ ] Your Full Name and date are visible in the browser screenshot
* [ ] Screenshots 1–6 are included and readable
* [ ] No password, token, private key, account ID, or other secret is visible
* [ ] The final application URL is included
* [ ] The LinkedIn post is published
* [ ] The LinkedIn post URL is included

---

*This submission is part of the DevOps Micro Internship (DMI) — Agentic AI Track.*
