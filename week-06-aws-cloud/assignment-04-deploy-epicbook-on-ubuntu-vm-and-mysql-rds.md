# Assignment 4 — Deploy EpicBook on Ubuntu VM + MySQL RDS with Secure Cloud Network

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will deploy the EpicBook web application in AWS using a secure two-tier architecture: an Ubuntu EC2 instance with Nginx in a public subnet, and a private MySQL RDS database with restricted security-group access. The completed deployment must prove that the frontend, backend, and private database communicate successfully end to end.

---

# Task 1 — Create VPC + Public/Private Subnets + Routing

## Goal

Create `epicbook-vpc` (10.0.0.0/16) with a public subnet (10.0.1.0/24) and a private subnet (10.0.2.0/24), attach an Internet Gateway, and route only the public subnet to it.

### Evidence

#### Screenshot 1 — VPC details showing CIDR 10.0.0.0/16

<img width="1792" height="998" alt="Screenshot 1" src="https://github.com/user-attachments/assets/97de29fd-3649-4ca6-bbf2-54c3b4cb46db" />


---

#### Screenshot 2 — Subnets list showing both subnets and their CIDRs

<img width="1792" height="1000" alt="Screenshot 2" src="https://github.com/user-attachments/assets/6621774c-d735-4c6b-84f5-48594abb7beb" />


---

#### Screenshot 3 — Route table showing 0.0.0.0/0 → IGW and association with the public subnet

<img width="1792" height="993" alt="Screenshot 3" src="https://github.com/user-attachments/assets/adcf3729-d9cd-4a33-befa-7b5bdb83af7f" />


---

# Task 2 — Create Security Groups (EC2 + RDS) with Least Privilege

## Goal

Create `epicbook-ec2-sg` (SSH from your IP, HTTP/HTTPS public) and `epicbook-rds-sg` (MySQL 3306 only from `epicbook-ec2-sg`).

### Evidence

#### Screenshot 4 — EC2 security-group inbound rules showing ports and sources

<img width="1792" height="1077" alt="Screenshot 4" src="https://github.com/user-attachments/assets/a80477a7-3782-4908-95b1-56e0054ab78e" />


---

#### Screenshot 5 — RDS security-group inbound rule showing MySQL 3306 allowed from the EC2 security group

<img width="1786" height="980" alt="Screenshot 5" src="https://github.com/user-attachments/assets/66ac9133-791c-469b-ad80-41f0db78cf2d" />


---

# Task 3 — Launch Ubuntu EC2 in Public Subnet

## Goal

Launch an Ubuntu 20.04 instance in the public subnet with `epicbook-ec2-sg` attached, and connect to it over SSH.

### Evidence

#### Screenshot 6 — EC2 instance summary showing the public IPv4 address, subnet, and security group

<img width="1788" height="991" alt="Screenshot 6 1" src="https://github.com/user-attachments/assets/c34a6a43-e5fb-4027-99d0-96c044cb9508" />

<img width="1582" height="819" alt="Screenshot 6 2" src="https://github.com/user-attachments/assets/435c1059-a5b0-4b31-b82f-7b9265f68861" />

---

#### Screenshot 7 — Terminal showing a successful SSH login with the `ubuntu@...` prompt

<img width="1028" height="384" alt="Screenshot 7" src="https://github.com/user-attachments/assets/f76e032d-617a-4558-b58b-19934d92812b" />


---

# Task 4 — Install Required Software on EC2

## Goal

Install Node.js, npm, Nginx, and the MySQL client on the instance, and confirm Nginx is running.

### Evidence

#### Screenshot 8 — Output of `node -v` and `npm -v`

<img width="998" height="380" alt="Screenshot 8" src="https://github.com/user-attachments/assets/5f64284c-12f9-4941-b1b2-bb8c4996d93c" />

---

#### Screenshot 9 — Output of `systemctl status nginx`

<img width="1060" height="385" alt="Screenshot 9" src="https://github.com/user-attachments/assets/c27f635a-93b5-430b-a853-6866c3ea60b2" />


---

#### Screenshot 10 — Output of `mysql --version`

<img width="1062" height="386" alt="Screenshot 10" src="https://github.com/user-attachments/assets/37c3dba7-e4d9-47e6-b6c4-81eeb8a25a07" />

---

# Task 5 — Create RDS MySQL in Private Subnet (No Public Access)

## Goal

Create a private MySQL RDS instance in `epicbook-vpc` using a DB Subnet Group over the private subnet, with `epicbook-rds-sg` attached and public access disabled.

### Evidence

#### Screenshot 11 — RDS instance summary showing Publicly accessible: No

<img width="1792" height="993" alt="Screenshot 11" src="https://github.com/user-attachments/assets/86d9840f-d8b3-4d47-99ee-c9583c172e10" />


---

#### Screenshot 12 — Connectivity & security section showing the VPC and attached security group

<img width="1778" height="997" alt="Screenshot 12" src="https://github.com/user-attachments/assets/c66f4bd2-3465-4914-a132-93ab0a26c4f3" />

<img width="1792" height="998" alt="Screenshot 12 1" src="https://github.com/user-attachments/assets/6220e22e-853f-4595-8d9a-ec3184a3244c" />

---

# Task 6 — Initialize Database (SQL Dump Import)

## Goal

Connect to RDS from EC2, create the `epicbook` database, and import the provided SQL dump.

### Evidence

#### Screenshot 13 — Terminal showing successful `SHOW TABLES;` output with tables listed

<img width="1017" height="379" alt="Screenshot 13" src="https://github.com/user-attachments/assets/9d692df2-83d4-4a49-9c2a-672961899d79" />


---

# Task 7 — Deploy EpicBook Backend and Configure Environment Variables

## Goal

Clone the EpicBook repository, install backend dependencies, configure `.env` with the RDS endpoint and credentials, and start the backend on port 3000.

### Evidence

#### Screenshot 14 — Terminal showing the repository cloned and the `ls` output

<img width="1790" height="1079" alt="Screenshot 14" src="https://github.com/user-attachments/assets/cc836ba2-fb46-41c8-af91-c9f06c9b08c0" />


---

#### Screenshot 15 — Terminal showing the backend running, or `ss -tulpn` showing the port open

<img width="998" height="380" alt="Screenshot 15" src="https://github.com/user-attachments/assets/93a3eec4-9d74-40df-97a0-28a8e4f6bcfc" />


---

#### Screenshot 16 — `curl` output proving the backend responds; a 200, 301, or 404 response is acceptable if the service responds

<img width="1016" height="385" alt="Screenshot 16" src="https://github.com/user-attachments/assets/87adc9e6-d735-42db-ab1c-b258616f4fb1" />


---

# Task 8 — Serve Frontend Using Nginx + Reverse Proxy to Backend

## Goal

Copy the frontend files to the Nginx web root and configure Nginx to reverse-proxy `/api/` to the Node backend.

### Evidence

#### Screenshot 17 — `nginx -t` success output

<img width="1001" height="383" alt="Screenshot 17" src="https://github.com/user-attachments/assets/2c9ffdf2-1695-4cb9-883b-06a2806ef6a3" />


---

#### Screenshot 18 — Nginx configuration snippet showing the `/api/` reverse proxy

<img width="1013" height="379" alt="Screenshot 18" src="https://github.com/user-attachments/assets/7b8975ad-6162-45fd-8ce2-6262b44b4598" />


---

# Task 9 — End-to-End Testing (Frontend ↔ Backend ↔ RDS)

## Goal

Verify the frontend loads publicly, the backend responds through Nginx, and EC2 can query the private RDS database.

### Evidence

#### Screenshot 19 — Browser showing the EpicBook application loaded with the public IP visible

<img width="972" height="391" alt="Screenshot 19" src="https://github.com/user-attachments/assets/337fffe2-a71a-4463-8eac-64225a770fa4" />



---

#### Screenshot 20 — Terminal showing a successful API call through the public endpoint, such as `curl http://<EC2_PUBLIC_IP>/api/...`

<img width="1792" height="1120" alt="Screenshot 20" src="https://github.com/user-attachments/assets/6c660a30-f1ce-46c0-9b13-b3eda8407e03" />


---

#### Screenshot 21 — Terminal showing the successful database connectivity test using `SELECT 1;` or similar


<img width="972" height="391" alt="Screenshot 19" src="https://github.com/user-attachments/assets/6bc8b802-a0b4-4853-a578-4d0826f00f2a" />

---

# Submission Instructions

- Add all required screenshots in your submission
- Do not expose PEM contents, passwords, `.env` values, or other secrets

---

# Completion Checklist

- [✅] Task 1: VPC, public/private subnets, IGW, and public routing created (Screenshots 1–3)
- [✅] Task 2: Least-privilege EC2 and RDS security groups created (Screenshots 4–5)
- [✅] Task 3: Ubuntu EC2 launched in the public subnet with SSH verified (Screenshots 6–7)
- [✅] Task 4: Node.js, npm, Nginx, and MySQL client installed (Screenshots 8–10)
- [✅] Task 5: Private MySQL RDS created with no public access (Screenshots 11–12)
- [✅] Task 6: Database initialized from the SQL dump (Screenshot 13)
- [✅] Task 7: Backend deployed and responding on port 3000 (Screenshots 14–16)
- [✅] Task 8: Nginx serving the frontend and reverse-proxying to the backend (Screenshots 17–18)
- [✅] Task 9: Frontend, backend, and RDS verified end to end (Screenshots 19–21)
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
