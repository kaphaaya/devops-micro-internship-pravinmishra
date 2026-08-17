# Assignment 5 — Deploy a Highly Available Two-Tier Application on AWS (VPC + ALB + ASG + Multi-AZ RDS)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will design and deploy a highly available two-tier web application on AWS: highly available networking across two Availability Zones, an Application Load Balancer, an Auto Scaling Group for the web tier, and a private Multi-AZ RDS database. You must prove high availability with real failure tests.

---

# Task 1 — Create HA Networking (VPC + 4 Subnets + IGW + NAT + Route Tables)

## Goal

Build a VPC (10.0.0.0/16) with two public and two private subnets across two Availability Zones, an Internet Gateway, a NAT Gateway, and the matching public/private route tables.

### Evidence

#### Screenshot 1 — VPC details showing CIDR 10.0.0.0/16

<img width="1757" height="875" alt="Screenshot 1" src="https://github.com/user-attachments/assets/640f29fd-8077-4fbd-8b2f-a5814bd5cfc5" />
.

---

#### Screenshot 2 — Subnets list showing four subnets and their Availability Zones

<img width="1792" height="1001" alt="Screenshot 2" src="https://github.com/user-attachments/assets/8d8802dd-5d48-4769-8e4c-45f4e4b2656b" />

<img width="1792" height="999" alt="Screenshot 2 1" src="https://github.com/user-attachments/assets/274dea68-4fb3-4ff7-9767-5bb660cb57fc" />



---

#### Screenshot 3 — Public route table showing the Internet Gateway route and both public-subnet associations

<img width="1792" height="996" alt="Screenshot 3" src="https://github.com/user-attachments/assets/b57dd296-20ce-4a3b-8976-8594b3dcf419" />

---

#### Screenshot 4 — Private route table showing the NAT Gateway route and both private-subnet associations

<img width="1792" height="994" alt="Screenshot 4" src="https://github.com/user-attachments/assets/c5be09f2-3adc-4761-9310-3505008c3089" />


---

#### Screenshot 5 — NAT Gateway status showing Available and the Elastic IP

<img width="1792" height="995" alt="Screenshot 5" src="https://github.com/user-attachments/assets/0537fcec-7bd1-47af-9c17-90dc0121ef90" />


---

# Task 2 — Create Security Groups (ALB, EC2, RDS) with Least Privilege

## Goal

Create `ha-alb-sg` (HTTP public), `ha-web-sg` (HTTP only from `ha-alb-sg`, SSH from your IP), and `ha-db-sg` (database port only from `ha-web-sg`).

### Evidence

#### Screenshot 6 — ALB Security Group inbound rules

<img width="1782" height="998" alt="Screenshot 6" src="https://github.com/user-attachments/assets/f3459fcf-c701-40ce-9b8f-5181c84cedcb" />


---

#### Screenshot 7 — EC2 Security Group inbound rules showing the ALB Security Group reference and SSH from your IP

<img width="1791" height="995" alt="Screenshot 7" src="https://github.com/user-attachments/assets/1e2e5f9c-d4ad-4596-b0d0-5765a72a5056" />

---

#### Screenshot 8 — RDS Security Group inbound rule showing the database port allowed only from the EC2 Security Group

<img width="1742" height="926" alt="Screenshot 8" src="https://github.com/user-attachments/assets/657af947-bff2-47ec-a326-0178f550ad62" />


---

# Task 3 — Deploy Database Tier (RDS Multi-AZ in Private Subnets)

## Goal

Launch a private, Multi-AZ RDS database (MySQL or PostgreSQL) using the private DB Subnet Group and `ha-db-sg`.

### Evidence

#### Screenshot 9 — RDS summary showing Multi-AZ = Yes and Publicly accessible = No

<img width="1792" height="998" alt="Screenshot 9" src="https://github.com/user-attachments/assets/4f9e5be6-cca5-45dd-a00c-0edf58e7c859" />

<img width="1792" height="997" alt="Screenshot 9 1" src="https://github.com/user-attachments/assets/76336522-aed0-4b27-b7e7-08a20d1aff3e" />



---

#### Screenshot 10 — RDS connectivity section showing the DB Subnet Group and Security Group

<img width="1792" height="1000" alt="Screenshot 10" src="https://github.com/user-attachments/assets/8d900ba3-6a5d-441c-bb2b-98fe2638a91d" />


---

# Task 4 — Build a Launch Template (User Data Installs App + Connects to DB)

## Goal

Create a Launch Template whose user data installs the web-server runtime, deploys the application, configures the database connection, and starts the required services.

### Evidence

#### Screenshot 11 — Launch Template details showing that user data exists, including a visible snippet

<img width="1792" height="995" alt="Screenshot 11" src="https://github.com/user-attachments/assets/ada55d1e-75cb-4928-b312-f1ca4c1ab198" />


---

#### Screenshot 12 — A running instance created from the template showing that the application responds on port 80 through a local test or browser using its public IP

<img width="1792" height="1080" alt="Screenshot 12" src="https://github.com/user-attachments/assets/ffc5f8ea-b447-46aa-b670-0cdc88ae3cd4" />


---

# Task 5 — Create an Application Load Balancer (ALB) Across 2 Public Subnets

## Goal

Create an internet-facing ALB across both public subnets with an HTTP listener and a healthy instance target group.

### Evidence

#### Screenshot 13 — ALB details showing two public subnets in two Availability Zones

<img width="1744" height="940" alt="Screenshot 13" src="https://github.com/user-attachments/assets/5ad824c6-5810-4f76-9382-ab1517fb3934" />


---

#### Screenshot 14 — Target group showing at least one healthy target

<img width="1779" height="958" alt="Screenshot 14" src="https://github.com/user-attachments/assets/11705577-2b56-4a66-9eba-7ad0d00d5067" />


---

# Task 6 — Create Auto Scaling Group (ASG) in 2 Public Subnets

## Goal

Create an Auto Scaling Group from the Launch Template across both public subnets, with desired capacity 2, minimum 2, and maximum 4, registered to the ALB target group.

### Evidence

#### Screenshot 15 — Auto Scaling Group showing desired, minimum, and maximum capacity and the selected subnet Availability Zones

<img width="1792" height="998" alt="Screenshot 15" src="https://github.com/user-attachments/assets/6e339f12-ec3d-4854-b4b8-835e37c9ded7" />


---

#### Screenshot 16 — EC2 instances list showing two running instances in different Availability Zones

<img width="1792" height="996" alt="Screenshot 16" src="https://github.com/user-attachments/assets/256b6717-ae27-480e-a637-e9240e96e770" />

---

# Task 7 — Configure App to Use RDS + Validate Read/Write

## Goal

Confirm the application communicates with the RDS database through the ALB DNS name with at least one read and one write operation.

### Evidence

#### Screenshot 17 — Browser showing the application loaded through the ALB DNS name with the URL visible

<img width="1792" height="1075" alt="Screenshot 17" src="https://github.com/user-attachments/assets/4d23f519-1a3e-4e58-8732-85ef3a01e681" />


---

#### Screenshot 18 — Proof of a database write through a UI message or database query output

<img width="1350" height="384" alt="Screenshot 18" src="https://github.com/user-attachments/assets/4f4a328a-3baa-4deb-87a1-ba8e278b2659" />


---

# Task 8 — High Availability Tests (Must Do Both)

## Goal

Test A: terminate one web instance and confirm the Auto Scaling Group replaces it automatically without interrupting the ALB.

Test B: simulate an Availability Zone impact (stop, detach, or reduce desired capacity in one AZ) and confirm the application stays available.

### Evidence

#### Screenshot 19 — EC2 showing the terminated instance and the newly launched instance; timestamps are helpful

<img width="1792" height="990" alt="Screenshot 19" src="https://github.com/user-attachments/assets/838eb295-952c-43af-b31b-890a0ec0d4ba" />

<img width="1791" height="965" alt="Screenshot 19 1" src="https://github.com/user-attachments/assets/38281cc1-49d0-44e4-8cbd-b7c5a137401a" />

---

#### Screenshot 20 — Target group showing healthy targets after replacement

<img width="1791" height="995" alt="Screenshot 20" src="https://github.com/user-attachments/assets/c495920e-1c21-4ff5-be61-c922ded192f0" />


---

#### Screenshot 21 — Evidence that an instance was removed, detached, placed in Standby, or stopped in one Availability Zone

<img width="1792" height="997" alt="Screenshot 21" src="https://github.com/user-attachments/assets/e38bd9d1-0723-49ba-a5a2-5e555ebb264e" />


---

#### Screenshot 22 — Browser showing that the ALB DNS endpoint still works during the change

<img width="1792" height="1074" alt="Screenshot 22" src="https://github.com/user-attachments/assets/24eb8ea9-437e-428a-97a3-1fc124709c85" />

---

# Task 9 — Architecture and Test-Results Summary

## Goal

Summarize the VPC/subnet layout, the ALB and Auto Scaling Group setup, the private Multi-AZ RDS setup, and the results of both high-availability tests.

### Evidence

#### Screenshot 23 — A simple architecture diagram, which may be hand-drawn, or an AWS console overview showing the components

<img width="1536" height="1024" alt="diagram" src="https://github.com/user-attachments/assets/616a01d6-19a9-402c-b3db-385ccacf66ae" />


---

### Notes

Summarize the VPC and subnets across the two Availability Zones.

Write your answer here.

Summarize the ALB and Auto Scaling Group setup.

Write your answer here.

Summarize the private Multi-AZ RDS setup.

Write your answer here.

Summarize the results of both high-availability tests.

Write your answer here.

---

# LinkedIn Post (Required)

## Goal

Publish a LinkedIn post about the high-availability build, including the ALB URL (or a redacted screenshot), three to five lines on what you built and how you tested high availability, and one proof screenshot.

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://www.linkedin.com/posts/aziz-kafayat_i-broke-my-aws-application-on-purpose-ugcPost-7495215525560582144-2S3Y/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU

---

#### Screenshot of LinkedIn post

<img width="555" height="922" alt="linkedin 1" src="https://github.com/user-attachments/assets/371dba29-609f-4965-a68a-4c1517d6641c" />

<img width="554" height="943" alt="linkedin 2" src="https://github.com/user-attachments/assets/4255a36b-c0e9-4e49-9186-1c9b6daddcda" />

---

# Submission Instructions

- Add all required screenshots in your submission
- Do not expose passwords, connection strings, private keys, or account IDs

---

# Completion Checklist

- [✅] Task 1: VPC, four subnets, IGW, NAT Gateway, and route tables created (Screenshots 1–5)
- [✅] Task 2: Least-privilege ALB, EC2, and RDS security groups created (Screenshots 6–8)
- [✅] Task 3: Private Multi-AZ RDS created (Screenshots 9–10)
- [✅] Task 4: Self-configuring Launch Template created and tested (Screenshots 11–12)
- [✅] Task 5: ALB created across both public subnets (Screenshots 13–14)
- [✅] Task 6: Auto Scaling Group running two instances across two AZs (Screenshots 15–16)
- [✅] Task 7: Application verified through the ALB with a database read and write (Screenshots 17–18)
- [✅] Task 8: Both high-availability tests completed (Screenshots 19–22)
- [✅] Task 9: Architecture and test-results summary completed (Screenshot 23 & Notes)
- [✅] LinkedIn post published and URL submitted
- [✅] No sensitive data exposed

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
