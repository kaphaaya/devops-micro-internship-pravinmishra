# Assignment 5 — Deploy EpicBook Web App on Azure VM with Azure Database for MySQL

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will deploy the EpicBook web application on Azure using an Ubuntu Virtual Machine to host the frontend and backend, and Azure Database for MySQL Flexible Server (private access) to store user and product data. You will build the network, provision the resources, deploy the application, and prove that the complete user flow works through the VM's public IP.

---

# Task 1 — Create Network Infrastructure

## Goal

Create a VNet (10.0.0.0/16) with a public subnet (10.0.1.0/24) for the VM and a private subnet (10.0.2.0/24) for MySQL, with NSGs allowing HTTP (80)/SSH (22) publicly and MySQL (3306) only from the VM subnet, plus a Public IP and Network Interface for the VM.

### Evidence

#### Screenshot 1 — Virtual Network overview showing the 10.0.0.0/16 address space and both subnets

<img width="1789" height="999" alt="1" src="https://github.com/user-attachments/assets/929eaba3-6415-4a48-acb1-9172fe865e48" />


---

#### Screenshot 2 — Public and private NSG inbound rules showing ports 80, 22, and restricted 3306 access

<img width="1204" height="933" alt="2 0" src="https://github.com/user-attachments/assets/087ba212-47d9-4d7a-b8a1-c861beb3b7f7" />
<img width="1055" height="968" alt="2 2" src="https://github.com/user-attachments/assets/c0e41255-c3ac-449d-bc6d-f4c975fb1f36" />

---

#### Screenshot 3 — Public IP and Network Interface association for the Virtual Machine

<img width="1215" height="960" alt="3" src="https://github.com/user-attachments/assets/033bddeb-7922-48ee-862b-d131a93955a6" />


---

# Task 2 — Provision Azure Virtual Machine

## Goal

Launch an Ubuntu 22.04 LTS VM (Standard B1s or equivalent) in the public subnet, and install Node.js, npm, Nginx, Git, and MySQL Client.

### Evidence

#### Screenshot 4 — Virtual Machine overview showing Ubuntu, size, public IP, and subnet

<img width="1792" height="991" alt="4" src="https://github.com/user-attachments/assets/5f8248b4-f311-48bf-a8ee-3b296af44c6d" />


---

#### Screenshot 5 — Terminal showing successful software installation or installed-version checks

<img width="898" height="480" alt="5" src="https://github.com/user-attachments/assets/0f255bcc-c7e1-4c13-890f-e7dd0d6c1701" />


---

# Task 3 — Deploy the EpicBook Application

## Goal

Clone the EpicBook repository, install dependencies, build the frontend, configure Nginx to serve it, and configure the Node.js/Express.js backend to connect to MySQL using environment variables.

### Evidence

#### Screenshot 6 — Terminal showing the EpicBook repository cloned and dependencies installed

<img width="1033" height="973" alt="6" src="https://github.com/user-attachments/assets/7839ef80-4d45-4005-beeb-a6c460a69ba0" />


---

#### Screenshot 7 — Nginx configuration or service status proving the frontend is configured to be served

<img width="751" height="588" alt="7" src="https://github.com/user-attachments/assets/c3ce58b1-c2db-4d77-a746-0fe82fd0682a" />


---

#### Screenshot 8 — Backend process or listening-port evidence (without exposing environment-variable secrets)

<img width="866" height="588" alt="8" src="https://github.com/user-attachments/assets/a720c995-b573-424d-a64d-d7e0029dbfbf" />


---

# Task 4 — Setup Azure Database for MySQL

## Goal

Create a private Azure Database for MySQL Flexible Server (VNet Integration) in the private subnet, create the database user and schema, import the SQL dump, and restrict access to the VM subnet only.

### Evidence

#### Screenshot 9 — MySQL Flexible Server overview showing Private access (VNet Integration)

<img width="868" height="629" alt="9" src="https://github.com/user-attachments/assets/df971b29-cb80-45fb-9495-be78484d249a" />


---

#### Screenshot 10 — Networking configuration showing the private subnet and restricted access

<img width="865" height="628" alt="10" src="https://github.com/user-attachments/assets/964dd5fd-a839-431c-82fe-505336a69872" />


---

#### Screenshot 11 — MySQL Client output showing the EpicBook database or imported tables (no password visible)

<img width="882" height="578" alt="11" src="https://github.com/user-attachments/assets/4f1351e6-65ef-4025-a895-709367cbd25a" />


---

# Task 5 — Test End-to-End Functionality

## Goal

Confirm the EpicBook application loads through the VM's public IP and that viewing products, adding items to the cart, and placing orders all work.

### Evidence

#### Screenshot 12 — Browser showing the EpicBook application with the Virtual Machine public IP visible

<img width="1792" height="1079" alt="12" src="https://github.com/user-attachments/assets/dd7a24bd-c3ba-4600-aa2d-51d3726cebff" />


---

#### Screenshot 13 — Proof of a successful database-backed action (viewing products, adding to cart, or placing an order)

<img width="854" height="622" alt="13" src="https://github.com/user-attachments/assets/e998e894-2e2d-47ec-acbd-a3b275b63f18" />


---

#### Public IP URL

Paste the public IP URL of your Virtual Machine here:

http://20.84.91.51

---

# Submission Instructions

- Add all required screenshots in your submission
- Include the Virtual Machine public IP URL
- Do not expose database passwords, connection strings, or subscription IDs

---

# Completion Checklist

- [✅] Task 1: Network foundation created with public/private subnets and NSGs (Screenshots 1–3)
- [✅] Task 2: VM provisioned and required software installed (Screenshots 4–5)
- [✅] Task 3: EpicBook frontend and backend deployed (Screenshots 6–8)
- [✅] Task 4: Private Azure Database for MySQL created and data imported (Screenshots 9–11)
- [✅] Task 5: End-to-end functionality validated (Screenshots 12–13, Public IP URL)
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
