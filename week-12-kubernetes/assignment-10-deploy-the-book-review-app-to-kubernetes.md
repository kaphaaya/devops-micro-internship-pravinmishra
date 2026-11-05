# Assignment 10 — Capstone: Deploy the Book Review App to Kubernetes

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

Deploy the Book Review App as a production-style three-tier application using Kubernetes manifests or Helm charts, with an accessible frontend, an internal backend, and a managed or persistent MySQL database.

---

## Submission Details

**Full Name:** Aziz Olaide Kafayat

**Kubernetes Platform:** Amazon EKS (AWS Elastic Kubernetes Service)

**Namespace:** book-review

**Frontend URL or IP:** http://a5e7dfdbabc274fee8e92a993cb447f5-290084377.us-east-1.elb.amazonaws.com/

**Access Method:** Public AWS LoadBalancer

**GitHub Manifests or Helm Chart URL:** https://github.com/kaphaaya/kubernetes_manifests

**Architecture Diagram:**

<img width="1672" height="941" alt="Kubernetes Book Review Deployment Overview" src="https://github.com/user-attachments/assets/6fb9d990-38b6-42bc-b4b6-0c5ae40f4c50" />


---

# Task 1 — Prepare the Kubernetes Cluster and Project

## Goal

Prepare the cluster, application source, container images, and tooling needed for the deployment.

### Evidence

#### Screenshot 1 — Active Kubernetes context and Ready nodes

<img width="792" height="148" alt="1" src="https://github.com/user-attachments/assets/a778cb74-ac0e-4be9-aa93-4a0bc648f6d0" />


---

#### Screenshot 2 — If using Helm: Output of `helm version`

Required only if you choose Helm. Skip this screenshot if using YAML manifests.

Not applicable — using YAML manifests.

---

# Task 2 — Design the Three-Tier Kubernetes Architecture

## Goal

Document the workloads, networking, configuration, storage, and permitted communication paths before deployment.

### Evidence

#### Screenshot 3 — Completed Kubernetes architecture diagram

<img width="1672" height="941" alt="3" src="https://github.com/user-attachments/assets/756e03d7-a04c-4146-9266-b1b7d68ec8a2" />


---

# Task 3 — Create ConfigMaps and Secrets

## Goal

Provide application configuration and credentials without embedding sensitive values in images or committing them to Git.

### Evidence

#### Screenshot 4 — ConfigMap configuration or describe output showing non-sensitive values

<img width="787" height="642" alt="4" src="https://github.com/user-attachments/assets/1af5232e-fae5-4011-b937-14b7e826d8dc" />


---

#### Screenshot 5 — Secret references or describe output showing names and keys without sensitive values

<img width="791" height="238" alt="5" src="https://github.com/user-attachments/assets/cc585eea-e112-4265-a4ac-e474b0259773" />


---

# Task 4 — Deploy and Configure the MySQL Data Tier

## Goal

Provide persistent MySQL storage and allow the backend to connect without exposing the database publicly.

### Evidence

#### Screenshot 6 — Managed MySQL status or MySQL StatefulSet and PVC status

<img width="790" height="466" alt="6" src="https://github.com/user-attachments/assets/d0fa1ddf-6d44-4283-a01c-6e9efeefd35b" />

---

#### Screenshot 7 — Successful database connectivity or schema verification with credentials hidden

<img width="861" height="318" alt="7" src="https://github.com/user-attachments/assets/5f423758-d2a7-4e3a-9ca6-470799e09943" />


---

# Task 5 — Deploy the Backend Application Tier

## Goal

Run one or two Node.js/Express backend replicas on port 3001 and expose them through an internal ClusterIP Service.

### Evidence

#### Screenshot 8 — Backend Deployment, ready Pods, and internal Service

<img width="861" height="318" alt="7" src="https://github.com/user-attachments/assets/01f20643-5b5a-43f1-991d-8544d4b64c26" />


---

#### Screenshot 9 — Backend startup logs and database connectivity evidence

If the application does not log successful database connections, provide a successful database-backed request alongside the startup logs.

<img width="859" height="219" alt="9" src="https://github.com/user-attachments/assets/902d65a0-9823-46e7-bf1d-ec4010fd44c1" />


---

# Task 6 — Deploy the Frontend and Configure Nginx

## Goal

Run the Next.js frontend behind Nginx on port 80 and proxy API requests to the internal backend Service.

### Evidence

#### Screenshot 10 — Frontend Deployment and Ready Pods

<img width="861" height="101" alt="10" src="https://github.com/user-attachments/assets/26b7e76b-baca-4c18-84c1-2c912c231901" />


---

#### Screenshot 11 — Nginx reverse-proxy configuration showing the internal backend Service name and port 3001

<img width="872" height="690" alt="11" src="https://github.com/user-attachments/assets/cd999e4f-579e-40d2-a6ad-dd62ae42cf61" />

---

# Task 7 — Configure External and Internal Networking

## Goal

Expose the frontend and enforce the intended communication path between application tiers.

### Evidence

#### Screenshot 12 — Frontend LoadBalancer or Ingress configuration and assigned endpoint, or documented local access method

<img width="874" height="100" alt="12" src="https://github.com/user-attachments/assets/ceccca92-de62-4d0e-8f00-a30c436138e5" />


---

#### Screenshot 13 — Internal backend Service and NetworkPolicy or equivalent restriction, with access-test evidence

<img width="865" height="952" alt="13" src="https://github.com/user-attachments/assets/98c5a6d0-a3bc-4b03-ba2d-4537ec57e314" />


---

# Task 8 — Validate the Application End to End

## Goal

Prove that the frontend, backend, and MySQL database work together and collect operational evidence.

### Evidence

#### Screenshot 14 — `kubectl get all` output for the book-review namespace

<img width="871" height="733" alt="14" src="https://github.com/user-attachments/assets/a29a7759-28b1-409a-b146-57f6ded775ef" />

---

#### Screenshot 15 — Functional Book Review App in the browser with the URL visible, including evidence of a successful user flow

<img width="874" height="931" alt="15" src="https://github.com/user-attachments/assets/8ae17e24-32aa-4dde-b4a8-d2a9297b84fd" />


---

#### Screenshot 16 — Frontend or Nginx container logs

<img width="873" height="169" alt="16" src="https://github.com/user-attachments/assets/842c6fc7-faab-4a6c-8fec-14ac6f52af0f" />

---

#### Screenshot 17 — Backend logs and evidence of a successful database-backed operation

<img width="857" height="112" alt="17" src="https://github.com/user-attachments/assets/a1828d10-397d-4398-b277-56cd1cd03b3d" />


---

#### Screenshot 18 — Optional: Kubernetes dashboard

Not attempted.

Multiple images may be included under a screenshot number when needed to demonstrate the complete user flow.

---

# Task 9 — Optional: Implement Production Improvements

## Goal

Add selected improvements without breaking the required three-tier architecture.

### Evidence

#### Screenshot 19 — Optional: Evidence of selected Helm, HPA, probe, or TLS improvements

Not attempted.

---

# Task 10 — Publish Your Book Review App Deployment on LinkedIn

## Goal

Explain your three-tier architecture, demonstrate the working application, and share what you learned.

### Evidence

#### Screenshot 20 — Published LinkedIn post about your Book Review App deployment on Kubernetes

<img width="553" height="883" alt="linkedin post" src="https://github.com/user-attachments/assets/729cb571-474b-4196-a56a-0563f56921b3" />

### LinkedIn Post URL

https://lnkd.in/p/eau56j7z

---

# Final Summary

## What Worked

Describe the application components and user flows you successfully deployed and tested.

Successfully deployed the Book Review Application on Amazon EKS using Kubernetes. The deployment consisted of a Next.js frontend, Nginx reverse proxy, Node.js backend and MySQL database.

Built and pushed the frontend and backend Docker images to Docker Hub, deployed the application workloads, and configured Kubernetes Services for internal communication and public access through an AWS LoadBalancer.

Configured MySQL using a StatefulSet with persistent EBS storage through a 5Gi gp3 PersistentVolumeClaim. Verified that the database was accessible and contained the Books, Reviews and Users tables, including seeded book records.

Configured Kubernetes ConfigMaps and Secrets for application settings and credentials. Also implemented Kubernetes networking controls and verified the running application components and database connectivity.

## Issues and Fixes

Describe the main issues encountered, their causes, and how you resolved them.

Insufficient worker node memory: The original t3.small worker node did not have sufficient memory to schedule the MySQL Pod. Addressed the resource constraint by adjusting workload resource requirements and adding worker capacity.

EBS CSI driver configuration: Encountered IAM policy and add-on configuration conflicts while setting up persistent storage. Resolved these by using the correct EBS CSI IAM policy and configuring the EKS add-on.

PersistentVolumeClaim pending: The PVC initially remained pending because the MySQL Pod could not be scheduled. Once sufficient capacity was available, the volume was provisioned and the PVC became Bound.

MySQL authentication: An incorrectly formatted terminal command caused authentication and shell errors. Corrected the command and successfully accessed the database using credentials from the Kubernetes Secret.

CloudFormation nodegroup creation: An additional managed nodegroup creation exceeded the CloudFormation maximum wait time during infrastructure troubleshooting.


## Tools and Sources Used

List the documentation and tools that helped you complete the assignment.

Amazon Web Services (AWS)

Amazon Elastic Kubernetes Service (EKS)

Kubernetes and kubectl

eksctl

AWS CLI

Docker and Docker Hub

MySQL 8.0

Amazon EBS and gp3 StorageClass

Kubernetes StatefulSets, Deployments, Services, ConfigMaps, Secrets, PersistentVolumeClaims and NetworkPolicies

Nginx

Git and GitHub

Official AWS, Kubernetes and Docker documentation

DevOps Micro Internship Assignment 10 guide

## Optional Improvements

Describe any optional improvements implemented, or write “Not attempted.”

Not attempted.

## Cleanup or Reuse Plan

State which resources were removed or why the environment is being retained.

The public frontend LoadBalancer Service was deleted to release the associated AWS load balancer. The book-review namespace was subsequently deleted, removing the application Deployments, Pods, StatefulSet, Services, ConfigMaps, Secrets and PVC resources.

The remaining EKS worker nodegroup and control plane cleanup is being completed after application evidence was captured. The final cleanup of the worker nodegroup, EKS cluster, associated EBS volumes and other billable AWS resources is intended to prevent unnecessary charges.

Local project files, Kubernetes manifests, screenshots and Docker Hub images are retained for documentation, GitHub submission and future reuse.

---

# Submission Instructions

- Include your Kubernetes manifests or Helm chart in the linked repository.
- Submit Secret examples containing placeholders only.
- Include Screenshot 1, Screenshots 3–17, and Screenshot 20.
- Include Screenshot 2 only if using Helm.
- Screenshots 18–19 are optional.
- Keep screenshot numbering consistent with the guidelines.
- Use clear, readable screenshots showing relevant configuration, commands, and outputs.
- Make your full name visible in required screenshots.
- Complete the submission details and Final Summary.
- Include your published LinkedIn post URL.
- Capture required evidence before cleanup.
- Do not expose passwords, tokens, JWT secrets, actual Secret values, kubeconfig contents, cloud credentials, or confidential account information.

---

# Completion Checklist

- [ ] Selected and configured a supported Kubernetes platform
- [ ] Confirmed the context and Ready nodes (Screenshot 1)
- [ ] Created and selected the book-review namespace
- [ ] Inspected the application repository
- [ ] Prepared images accessible to the cluster
- [ ] Confirmed Helm if using charts (Screenshot 2, conditional)
- [ ] Created the architecture diagram (Screenshot 3)
- [ ] Created ConfigMaps and Secrets (Screenshots 4–5)
- [ ] Excluded actual Secret values from Git and screenshots
- [ ] Provisioned private managed MySQL or persistent Kubernetes MySQL (Screenshot 6)
- [ ] Initialized the required database and schema
- [ ] Verified database connectivity or schema (Screenshot 7)
- [ ] Deployed one or two backend replicas listening on port 3001
- [ ] Created the backend ClusterIP Service (Screenshot 8)
- [ ] Verified backend-to-database connectivity (Screenshot 9)
- [ ] Deployed one or two frontend replicas behind Nginx (Screenshot 10)
- [ ] Configured API proxying through the internal backend Service (Screenshot 11)
- [ ] Configured and documented frontend access (Screenshot 12)
- [ ] Enforced backend access restrictions (Screenshot 13)
- [ ] Confirmed that the backend and database are not publicly exposed
- [ ] Captured resource status for book-review (Screenshot 14)
- [ ] Tested application functionality and database writes (Screenshots 15 and 17)
- [ ] Verified saved data after application restart
- [ ] Captured frontend and backend logs (Screenshots 16–17)
- [ ] Included optional dashboard or improvement evidence if attempted (Screenshots 18–19)
- [ ] Published the LinkedIn post (Screenshot 20)
- [ ] Included the LinkedIn post URL
- [ ] Documented issues, fixes, and useful sources
- [ ] Recorded cleanup status or reuse plans
- [ ] No sensitive data exposed

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
