# Assignment 6 — Capstone Assignment — Deploy Book Review App (Three-Tier Architecture) on AWS

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

This is the most important assignment of the course. You will deploy the Book Review App in a fully production-style three-tier architecture on AWS: a Next.js Web Tier behind Nginx and a public ALB, a private Node.js/Express App Tier behind an internal ALB, and a private Multi-AZ MySQL RDS database with a read replica. You are expected to design, deploy, isolate, debug, and document the result independently.

---

# Task 1 — Architecture Diagram

## Goal

Create an architecture diagram showing the custom VPC (10.0.0.0/16), the six subnets across two Availability Zones (two public Web Tier, two private App Tier, two private Database Tier), the public ALB, Web Tier EC2/Nginx, internal ALB, private App Tier EC2, private Multi-AZ RDS with its read replica, and the permitted traffic flow.

### Evidence

#### Diagram image or link



<img width="1536" height="1024" alt="diagram" src="https://github.com/user-attachments/assets/300a3ab8-449b-48bb-8c9a-1c9703aab68d" />


# Task 2 — AWS Region & Services Used

## Goal

Record the AWS Region used and list every AWS service used across networking, compute, load balancing, security, and the database.

### Notes

**Region:**

-eu-west-1 (Europe, Ireland)

---

**Services:**

Networking:
Amazon VPC, Subnets (6 total across 2 AZs), Internet Gateway, NAT Gateway, Route Tables (public web, private app, private database), Network ACLs, EC2 Instance Connect Endpoint

Compute:
Amazon EC2 (Web Tier instance running Next.js and Nginx, App Tier instance running Node.js and Express)

Load Balancing:
Application Load Balancer x2 (one public internet-facing for the Web Tier, one internal for the App Tier), Target Groups x2 (web-tier-tg on port 80, app-tier-tg on port 3001), Listeners

Security:
Security Groups x5 (web-alb-sg, web-ec2-sg, internal-alb-sg, app-ec2-sg, db-sg), IAM (instance roles)

Database:
Amazon RDS for MySQL 8.4 (Multi-AZ primary with automatic standby failover, plus one read replica for read scaling)

Developer Tools: 
PM2 (process manager), Nginx (reverse proxy), Node.js, Next.js, Git
---

# Task 3 — Public Entry Point

## Goal

Confirm the Book Review App loads through the public ALB DNS name.

### Evidence

#### Public ALB DNS


http://web-public-alb-1545575364.eu-west-1.elb.amazonaws.com

---

# Task 4 — Evidence Screenshots

## Goal

Capture visual proof of every tier and load balancer.

### Evidence

#### Web EC2

<img width="1557" height="904" alt="web-ec2" src="https://github.com/user-attachments/assets/47b81f6f-765d-43f8-a828-08722dcae236" />


---

#### App EC2

<img width="1555" height="904" alt="app-ec2" src="https://github.com/user-attachments/assets/ce822ba0-2066-4395-80b0-96543b0b6e45" />


---

#### Public ALB

<img width="1792" height="995" alt="public-alb" src="https://github.com/user-attachments/assets/9cf9a98e-4aa2-4c27-a0bc-3ad68eb915ae" />

---

#### Internal ALB

<img width="1792" height="945" alt="internal alb" src="https://github.com/user-attachments/assets/0411268e-599f-49c9-8e4c-0d8a22131280" />


---

#### RDS + Replica

<img width="1792" height="994" alt="rds + replica" src="https://github.com/user-attachments/assets/23399d28-6f7b-49a6-9d3c-1180121b5437" />


---

#### App UI proof

<img width="1792" height="1073" alt="APP UI" src="https://github.com/user-attachments/assets/668abd02-08af-4758-b7d6-5a570da8e4d3" />


---

# Task 5 — Summary

## Goal

Summarize what worked in the final deployment, the issues encountered and how each was fixed, and the tools or sources used to research and debug.

### Notes

**What worked:**

-I successfully built a complete three-tier AWS architecture from scratch. 

-The VPC with six subnets across two availability zones came together cleanly, with public subnets for the Web Tier, private subnets for the App Tier, and isolated private subnets for the database. 

-The Internet Gateway, NAT Gateway, and route tables all worked as expected, giving the Web Tier direct internet access while keeping the App and Database Tiers completely private. 

-Both load balancers were provisioned correctly, with the public ALB serving the Web Tier and the internal ALB routing traffic to the backend. 

-The RDS MySQL database came up with Multi-AZ enabled and a read replica, and the App Tier connected to it successfully. 

-The Next.js frontend built and deployed cleanly behind Nginx, and the Node.js backend connected to the database and seeded sample data on startup. 

-Both target groups registered healthy instances.

---

**Issues + fixes:**

-The first issue was SSH access to the App Tier instance. Since it lives in a private subnet with no public IP, I could not SSH into it directly from my local machine. I fixed this by setting up an EC2 Instance Connect Endpoint in the private App Tier subnet, which gave me browser-based terminal access without needing a bastion host or a public IP address.

-The second issue was a database name mismatch. The backend .env file had the wrong DB_NAME value, which was set to the RDS instance identifier instead of the actual database name. I ran SHOW DATABASES on the RDS instance, found the correct name was book_review_db, updated the .env file, and restarted the backend with PM2.

-The third issue was that the backend package.json had no start script defined, so pm2 start npm -- start kept failing with a missing script error. I fixed this by starting the process directly with node src/server.js instead.

-The fourth issue was a 504 Gateway Timeout when the frontend tried to call the backend API through the internal ALB. I traced it through each layer and found the Nginx proxy_pass was missing the explicit port number. I updated the proxy_pass to include :80 and adjusted the health check success codes to accept 307 responses alongside 200.

-The fifth issue was a 307 redirect on the frontend that was sending all traffic to an external URL. I helped a fellow cohort member troubleshoot this same issue, and the fix was a clean PM2 restart after a fresh Next.js build.

---

**Tools/sources used:**

-AWS Management Console (EC2, VPC, RDS, Target Groups, Load Balancers), 
-EC2 Instance Connect Endpoint for private instance access, 
-Curl for layer-by-layer connectivity testing, 
-PM2 for process management, Nginx for reverse proxying, 
-MySQL client for direct database verification, 
-Browser Developer Tools (Console and Network tabs) for frontend debugging, 
-and Claude for real-time troubleshooting and architectural guidance throughout the build.

---

# LinkedIn Post (Required)

## Goal

Publish a LinkedIn post sharing the capstone deployment, including the public ALB DNS (or a redacted screenshot), three to five lines on what you built and why it is production-style, and one proof screenshot.

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://www.linkedin.com/posts/aziz-kafayat_i-just-deployed-a-full-three-tier-cloud-architecture-ugcPost-7495605648420909056-Ctr1/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU

---

#### Screenshot of LinkedIn post

<img width="384" height="908" alt="linkedin post" src="https://github.com/user-attachments/assets/bf3ee814-b55a-47e9-8c95-9db00a768c4e" />


---

# Submission Instructions

- Add all required screenshots and links in your submission
- Do not expose passwords, RDS credentials, connection strings, private keys, or account IDs

---

# Completion Checklist

- [✅] Task 1: Architecture diagram completed
- [✅] Task 2: AWS Region and services documented
- [✅] Task 3: Public ALB DNS confirmed working
- [✅] Task 4: All six evidence screenshots captured (Web Tier, App Tier, both ALBs, RDS + replica, app UI)
- [✅] Task 5: Deployment summary completed (what worked, issues/fixes, tools/sources)
- [✅] LinkedIn post published and URL submitted
- [✅] App Tier and Database Tier confirmed not publicly accessible
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
