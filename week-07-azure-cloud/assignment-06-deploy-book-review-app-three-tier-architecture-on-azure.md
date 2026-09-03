# Assignment 6 — Capstone: Deploy Book Review App (Three-Tier Architecture) on Azure

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

This is the most important assignment of the course. You will deploy the Book Review App in a production-ready, best-practice-compliant three-tier architecture on Azure: separated presentation, application, and database tiers, least-privilege network access, a controlled public entry point, protected secrets, and availability/monitoring evidence.

---

# Task 1 — Design the Azure Three-Tier Architecture

## Goal

Create an architecture diagram and implementation plan identifying the presentation, application, and database components, the chosen Azure services, the public entry point, and the internal traffic paths.

### Evidence

#### Screenshot 1 — Architecture diagram showing the public entry point, three tiers, network boundaries, and traffic flow

<img width="1536" height="1024" alt="1" src="https://github.com/user-attachments/assets/793879ba-f8ad-4d05-908e-3e0ca1056089" />


---

#### Screenshot 2 — Written architecture assumptions and selected Azure services

<img width="1536" height="1024" alt="2" src="https://github.com/user-attachments/assets/3b06dd64-85b1-4eb9-8660-b883ee64dff1" />


---

# Task 2 — Create the Azure Network Foundation

## Goal

Create a dedicated Resource Group and VNet with separate subnets for the web, application, and database tiers, keeping the application and database tiers without direct public access.

### Evidence

#### Screenshot 3 — Resource Group overview showing the assignment resources

<img width="1792" height="1043" alt="3" src="https://github.com/user-attachments/assets/4203ffe3-ee68-4179-9b89-0ab55dec6e9b" />

<img width="1791" height="1042" alt="3 1" src="https://github.com/user-attachments/assets/ed7ad07a-f921-4d53-8ff8-53fa78ed0148" />

---

#### Screenshot 4 — VNet overview showing the address space and all required subnets

<img width="1783" height="1065" alt="4" src="https://github.com/user-attachments/assets/40c58353-1064-4e0d-877c-7e8fb94faddf" />

<img width="1777" height="1069" alt="4 1" src="https://github.com/user-attachments/assets/6be8b3e0-1c7b-4bd5-ba22-642af5d7690d" />

<img width="1790" height="1078" alt="4 2" src="https://github.com/user-attachments/assets/cc8766fb-5af6-43c1-a64d-5930adf8066d" />

<img width="1792" height="1042" alt="4 3" src="https://github.com/user-attachments/assets/e157c1ef-710e-4d10-a6ea-cfa0b8fa8fc7" />

---

#### Screenshot 5 — Route-table or Private DNS evidence where applicable

<img width="1792" height="1041" alt="5 1" src="https://github.com/user-attachments/assets/4e1ec954-6021-4bbd-8655-f4b1a178d7ed" />

<img width="1792" height="1043" alt="5 2" src="https://github.com/user-attachments/assets/d96dc172-689f-40e8-b5ff-d018e2cfe639" />

<img width="1792" height="1044" alt="5 3" src="https://github.com/user-attachments/assets/b5447a3b-4d18-447c-9fab-651f2f4dae4c" />

---

# Task 3 — Configure Security and Secret Management

## Goal

Apply least-privilege NSG rules so traffic flows Internet → public entry point → web tier → application tier → database tier, and store credentials in Azure Key Vault or another approved secure mechanism.

### Evidence

#### Screenshot 6 — NSG rules proving least-privilege access between the tiers

<img width="1792" height="1042" alt="6 1" src="https://github.com/user-attachments/assets/609c10a1-d45e-4c73-b7c9-429c304c806e" />

<img width="1792" height="1044" alt="6 2" src="https://github.com/user-attachments/assets/a6ffe479-4090-42c0-8ff6-23a7db8e7f1b" />

<img width="1792" height="1041" alt="6 3" src="https://github.com/user-attachments/assets/190886ae-0e21-4d6d-96d2-1d81ad47403d" />

---

#### Screenshot 7 — Key Vault or approved secret-management configuration (without displaying secret values)

<img width="1149" height="149" alt="7" src="https://github.com/user-attachments/assets/e3c3b9be-218a-49e7-8834-388b505c68f6" />


---

# Task 4 — Deploy the Presentation (Web) Tier

## Goal

Deploy the Book Review App presentation layer on the approved web-tier compute service, configured to route requests to the internal application-tier endpoint, and not directly exposed except through the public entry service.

### Evidence

#### Screenshot 8 — Web-tier compute overview showing subnet and availability configuration

<img width="1792" height="1040" alt="8" src="https://github.com/user-attachments/assets/233d3e97-6cec-4403-86d5-394b50afbfbc" />


---

#### Screenshot 9 — Terminal or service output proving the presentation layer is running

<img width="1140" height="344" alt="9" src="https://github.com/user-attachments/assets/b336aa5e-7138-4328-bf4a-9da6942491d5" />


---

# Task 5 — Deploy the Business (Application) Tier

## Goal

Deploy the Book Review App backend privately in the application subnet, configured to use the private database endpoint and secured environment values, reachable only through its internal endpoint.

### Evidence

#### Screenshot 10 — Application-tier compute overview showing private subnet placement

<img width="1792" height="1042" alt="10" src="https://github.com/user-attachments/assets/3e55cbda-838e-47c8-85be-316e0919a042" />


---

#### Screenshot 11 — Backend process, service, or listening-port evidence

<img width="1147" height="149" alt="11" src="https://github.com/user-attachments/assets/75db8481-613a-4fce-947a-fe5457450356" />


---

#### Screenshot 12 — Internal health-check or API response (without exposing secrets)

<img width="1143" height="210" alt="12" src="https://github.com/user-attachments/assets/5dcfb0b1-d385-452f-bcbb-ecbf2c3deb4a" />


---

# Task 6 — Deploy the Managed Database Tier

## Goal

Create a private Azure managed database (public access disabled), with availability/backup/retention settings, the Book Review App schema imported, and access restricted to the application tier only.

### Evidence

#### Screenshot 13 — Database overview showing private connectivity and public access disabled

<img width="1792" height="1042" alt="13" src="https://github.com/user-attachments/assets/321ada8a-d524-4257-8685-9617aebf837e" />


---

#### Screenshot 14 — Availability, backup, and retention configuration

<img width="1792" height="1045" alt="14" src="https://github.com/user-attachments/assets/867ce3b8-637f-46e9-ad42-6dabc55832c2" />


---

#### Screenshot 15 — Successful schema or connectivity verification (without exposing credentials)

<img width="1147" height="417" alt="15" src="https://github.com/user-attachments/assets/b5daae80-4e3e-4a1a-a4c4-1a836fe0951c" />


---

# Task 7 — Configure Traffic Management, Availability, and Monitoring

## Goal

Configure the approved public entry service with health probes and backend pools, internal routing for the application tier where required, and enable Azure Monitor/diagnostics/logs/alerts for the key resources.

### Evidence

#### Screenshot 16 — Public entry service showing listener, frontend endpoint, and healthy web targets

<img width="1792" height="1028" alt="16 1" src="https://github.com/user-attachments/assets/d2aede2a-6915-4dfa-87fe-684592318587" />

<img width="1792" height="1041" alt="16 2" src="https://github.com/user-attachments/assets/a5e71f73-6785-47b5-a350-7c11b5e3091d" />


---

#### Screenshot 17 — Internal application-tier load-balancing or routing configuration where applicable

<img width="1147" height="392" alt="17" src="https://github.com/user-attachments/assets/0a6e6939-5330-42b1-9c39-46fbdbcb0dbc" />


---

#### Screenshot 18 — Azure Monitor, diagnostic settings, logs, metrics, or alert evidence

<img width="1790" height="1041" alt="18" src="https://github.com/user-attachments/assets/477eb734-6dbd-4296-95fe-72fcc7248328" />

<img width="1792" height="1040" alt="18 1" src="https://github.com/user-attachments/assets/7bbba708-364c-43d2-866c-70460ef86098" />

---

# Task 8 — Validate the Production-Style Deployment

## Goal

Confirm the Book Review App works end to end through the public endpoint, with at least one database read and one write, confirm private tiers are not internet-reachable, and complete a safe availability test.

### Evidence

#### Screenshot 19 — Browser showing the Book Review App through the public endpoint

<img width="1792" height="1079" alt="19" src="https://github.com/user-attachments/assets/7d2e1805-c949-433b-8c17-57132be7b437" />


---

#### Screenshot 20 — Proof of successful database-backed read and write operations

<img width="1470" height="692" alt="20 1" src="https://github.com/user-attachments/assets/acdd2a8d-2290-4f07-8c5a-356f3ee9fd85" />

<img width="1443" height="733" alt="20 2" src="https://github.com/user-attachments/assets/ef893c3a-786d-4490-bc8e-4354255f09a5" />

<img width="1460" height="728" alt="20 3" src="https://github.com/user-attachments/assets/6aad6e19-563a-412b-a78b-964cf4e70682" />

---

#### Screenshot 21 — Evidence that private tiers are not publicly accessible

<img width="1410" height="216" alt="21" src="https://github.com/user-attachments/assets/45d0bb14-d64b-4fd4-ac11-b04fe95868ca" />


---

#### Screenshot 22 — Availability-test and healthy-target evidence

<img width="1792" height="1044" alt="22" src="https://github.com/user-attachments/assets/89bc4717-f5a1-4f07-bb22-79625315b9df" />


---

#### Public Endpoint

Paste your public endpoint URL here:

http://20.219.114.239

---

### Notes

Summarize what worked, issues encountered and how they were fixed, and the availability/security/secrets/monitoring/backup choices made.

WHAT WORKED:
- Multi-tier architecture successfully deployed on Azure
- Load balancer routing traffic through public endpoint
- Frontend and backend communication across subnets
- Database connectivity with SSL
- CORS configuration for cross-VM requests
- Nginx reverse proxy for API routing

ISSUES ENCOUNTERED & FIXES:
1. Frontend couldn't reach backend - FIXED: Updated API URL and nginx config
2. CORS blocking requests - FIXED: Added frontend IP to allowed origins
3. Backend on wrong port (5000 vs 3001) - FIXED: Set PORT=3001 in .env
4. Database credentials missing - FIXED: Added .env with Azure MySQL details
5. Load balancer showing 0% healthy - FIXED: Added Frontend VM to backend pool
6. Nginx serving static files - FIXED: Replaced with reverse proxy config
7. Build cache issues - FIXED: Rebuilt with npm run build

SECURITY CHOICES:
- Least-privilege NSG rules between tiers
- Database public access disabled
- Private subnets for app and database tiers
- SSL connection to Azure MySQL
- Environment variables in .env (not hardcoded)

AVAILABILITY CHOICES:
- Azure Load Balancer for redundancy
- Health probes checking port 80 every 15 seconds
- Backend pool with healthy instance monitoring

MONITORING & BACKUP:
- Diagnostic settings on load balancer
- Database backup retention: 7 days
- Azure Monitor metrics for VMs (CPU, Memory, Network)
- Application logs via PM2

---

# Submission Instructions

- Add all required screenshots and links in your submission
- Do not expose passwords, keys, connection strings, or subscription IDs

---

# Completion Checklist

- [✅] Task 1: Architecture diagram and assumptions documented (Screenshots 1–2)
- [✅] Task 2: Network foundation created with isolated tiers (Screenshots 3–5)
- [✅] Task 3: Least-privilege security and secret management configured (Screenshots 6–7)
- [✅] Task 4: Presentation tier deployed (Screenshots 8–9)
- [✅] Task 5: Application tier deployed privately (Screenshots 10–12)
- [✅] Task 6: Managed database tier deployed privately (Screenshots 13–15)
- [✅] Task 7: Public entry, internal routing, and monitoring configured (Screenshots 16–18)
- [✅] Task 8: End-to-end validation and availability test completed (Screenshots 19–22, Public Endpoint, Notes)
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
