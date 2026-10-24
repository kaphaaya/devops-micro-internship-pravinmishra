# Assignment 4 — Docker Volumes and Bind Mounts

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will use Docker Bind Mounts and Docker Volumes to persist logs and application data outside a container’s lifecycle. You will verify that data remains available after containers are removed and recreated.

---

# Task 1 — Persist Nginx Logs Using a Bind Mount

## Goal

Deploy an Nginx container with a Bind Mount and verify that its log files remain on the VM host after the container is removed.

### Evidence

#### Screenshot 1 — Nginx Image Pull

Add a screenshot of the terminal showing successful completion of:

```bash
docker pull nginx:alpine
```

<img width="817" height="165" alt="1" src="https://github.com/user-attachments/assets/6bbc45a1-93fe-4fac-a8b7-f0f6bc1434e8" />


---

#### Screenshot 2 — Host Log Directory

Add a screenshot of the terminal showing the created host directory:

```text
$HOME/nginx-logs
```

<img width="764" height="193" alt="2" src="https://github.com/user-attachments/assets/fa42662d-4843-4d2a-a7aa-d853c7a76ff8" />


---

#### Screenshot 3 — Running Nginx Container with Port Mapping

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show the `myweb` container with:

```text
0.0.0.0:80->80/tcp
```

<img width="763" height="226" alt="3" src="https://github.com/user-attachments/assets/205df832-e588-4f00-b02a-dae754bf66e1" />


---

#### Screenshot 4 — Nginx Welcome Page

Add a browser screenshot showing the Nginx Welcome Page at:

```text
http://16.171.171.231/
```

Ensure that the VM public IP is visible in the address bar. Add your full name as a clear caption directly below the screenshot.

<img width="953" height="790" alt="4" src="https://github.com/user-attachments/assets/c5ec7d11-3b26-4816-aaf2-d708ba3545c8" />

---

#### Screenshot 5 — Bind-Mounted Log Files

Add a screenshot of the terminal showing the host log files and access-log content from:

```text
$HOME/nginx-logs
```

The output must show `access.log`, `error.log`, and an access-log entry created when you opened the Nginx page.

<img width="764" height="188" alt="5" src="https://github.com/user-attachments/assets/eb532f38-240f-4430-9314-5879e1ffefdb" />


---

#### Screenshot 6 — Nginx Container Removed

Add a screenshot of the terminal showing successful completion of:

```bash
docker stop myweb
docker rm myweb
```

<img width="765" height="87" alt="6" src="https://github.com/user-attachments/assets/cd58df93-1ee1-44f9-9b78-ede1e7bdb3c9" />


---

#### Screenshot 7 — Logs Persist After Container Removal

Add a screenshot of the terminal showing that `access.log` and `error.log` still exist in:

```text
$HOME/nginx-logs
```

The access log must retain its content after the container has been removed.

<img width="765" height="134" alt="7" src="https://github.com/user-attachments/assets/1e58ee31-8529-4458-9ff2-fcb464b51dcb" />

---

# Task 2 — Share Persistent Data Using a Docker Volume

## Goal

Deploy backend and frontend containers that share data through a named Docker Volume. Verify that the data remains after both containers are removed and recreated.

### Evidence

#### Screenshot 8 — Project File Structure

Add a screenshot of the terminal showing the `two-tier-app` project structure, including separate `backend` and `frontend` directories with a `Dockerfile` and `index.js` file in each.

<img width="765" height="102" alt="8" src="https://github.com/user-attachments/assets/1c24a96d-f7ad-41ba-a3fc-bbc649b0fda7" />

---

#### Screenshot 9 — Custom Docker Network

Add a screenshot of the terminal showing `mynetwork` in:

```bash
docker network ls
```

<img width="764" height="117" alt="9" src="https://github.com/user-attachments/assets/793f779f-4854-4a88-8668-702f598dfde5" />


---

#### Screenshot 10 — Docker Volume

Add a screenshot of the terminal showing `shared-data` in:

```bash
docker volume ls
```

<img width="764" height="100" alt="10" src="https://github.com/user-attachments/assets/e0c68edd-245e-4fae-8d65-5e9c5cd29944" />


---

#### Screenshot 11 — Backend Dockerfile

Add a screenshot of the terminal showing the completed backend `Dockerfile`.

<img width="765" height="429" alt="11" src="https://github.com/user-attachments/assets/80a77280-9149-4f60-ab51-de0ae3e8fecb" />


---

#### Screenshot 12 — Backend Image Build

Add a screenshot of the terminal showing successful completion of the `backend-app:latest` image build.

<img width="777" height="676" alt="12" src="https://github.com/user-attachments/assets/8327bedf-7773-47b7-a0ea-35d0c9e56b14" />


---

#### Screenshot 13 — Running Backend Container

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show the running `backend` container.

<img width="780" height="129" alt="13" src="https://github.com/user-attachments/assets/d7073b47-aeec-4c43-b348-94bba47da7f0" />

---

#### Screenshot 14 — Frontend Dockerfile

Add a screenshot of the terminal showing the completed frontend `Dockerfile`.

<img width="777" height="457" alt="14" src="https://github.com/user-attachments/assets/226523ce-5a00-4c75-bf5a-56d07aa72b00" />

---

#### Screenshot 15 — Frontend Image Build

Add a screenshot of the terminal showing successful completion of the `frontend-app:latest` image build.

<img width="776" height="469" alt="15" src="https://github.com/user-attachments/assets/d093f40c-72b3-4f12-983c-a7979dee9b08" />


---

#### Screenshot 16 — Running Backend and Frontend Containers

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show both `backend` and `frontend` containers running. Only `frontend` must have the published port mapping:

```text
0.0.0.0:80->80/tcp
```

<img width="776" height="132" alt="16" src="https://github.com/user-attachments/assets/41e28419-027e-4eb9-bb4a-1a2cde89fb3e" />


---

#### Screenshot 17 — Backend Write Operation

Add a screenshot of the terminal showing a successful backend write operation to the shared Docker Volume.

The output must include:

```text
Data written: Hello from Backend!
```

<img width="774" height="54" alt="17" src="https://github.com/user-attachments/assets/f742619a-e13e-4a9d-ab7c-309437f5bf56" />


---

#### Screenshot 18 — Frontend Reads Shared Data

Add a browser screenshot showing:

```text
Hello from Backend!
```

Add your full name as a clear caption directly below the screenshot.

<img width="953" height="296" alt="18" src="https://github.com/user-attachments/assets/81e63b37-5295-4072-b32b-c10ce94a4af0" />


---

#### Screenshot 19 — First Shared-Data Update

Add a browser screenshot showing:

```text
Test Data 1
```

Add your full name as a clear caption directly below the screenshot.

<img width="958" height="481" alt="19" src="https://github.com/user-attachments/assets/c288cc4a-9460-4388-a159-77b07e430534" />


---

#### Screenshot 20 — Second Shared-Data Update

Add a browser screenshot showing:

```text
Test Data 2 - New Update
```

Add your full name as a clear caption directly below the screenshot.

<img width="957" height="423" alt="20" src="https://github.com/user-attachments/assets/7fee3d59-494c-4bef-80c7-2b14f8011ae6" />


---

#### Screenshot 21 — Container Removal and Recreation

Add a screenshot of the terminal showing the `frontend` and `backend` containers removed and recreated using the same `shared-data` Docker Volume.

<img width="778" height="372" alt="21" src="https://github.com/user-attachments/assets/0fa71b7a-ad75-4bea-9319-8595740eec52" />


---

#### Screenshot 22 — Data Persists After Recreation

Add a browser screenshot showing:

```text
Test Data 2 - New Update
```

This proves that the `shared-data` Docker Volume outlived both application containers.

Add your full name as a clear caption directly below the screenshot.

<img width="955" height="392" alt="22" src="https://github.com/user-attachments/assets/6447e3d3-2fb3-4cb3-b5d0-03c913d6fd80" />

---

# Storage Persistence Notes

Write a short explanation covering:

- The difference between a Bind Mount and a Docker Volume
- How Task 1 proved Bind Mount persistence
- How Task 2 proved Docker Volume persistence
- Why Docker Volumes are commonly used for application data

## Docker Volumes and Bind Mounts

### 1. Introduction

This assignment demonstrates how Docker bind mounts and Docker volumes provide persistent storage for containerised applications. It covers two practical tasks: storing Nginx logs on the host machine using a bind mount, and sharing application data between a frontend and backend using a Docker volume.

### 2. Task 1 — Persistent Nginx Logs Using a Bind Mount

I deployed an Nginx container named `myweb` using the `nginx:alpine` image. I mapped port 80 on the EC2 host to port 80 inside the container and mounted the host directory `~/nginx-logs` to `/var/log/nginx` inside the container.

The bind mount allowed Nginx to write its logs to files stored on the EC2 host. After accessing the application through the EC2 public IP, I verified that `access.log` contained a browser request and that the log files remained available after I stopped and removed the `myweb` container.

**Key learning:** A bind mount connects a specific host directory to a directory inside a container. This is useful when files need to remain accessible directly on the host, including application logs and development files.

### 3. Task 2 — Sharing Persistent Data Using Docker Volumes

I created a project named `two-tier-app`, with separate `backend` and `frontend` directories. Each service has its own Dockerfile and Node.js application.

I created a custom Docker network named `mynetwork` and a named Docker volume called `shared-data`.

The backend container uses the `backend-app:latest` image and mounts `shared-data` at `/data`. Its `/write` endpoint writes `Hello from Backend!` to `/data/message.txt`.

The frontend container uses the `frontend-app:latest` image and mounts the same volume at `/data`. It reads the message file and displays its current contents in a browser. I published the frontend on port 80, while the backend remained accessible through the Docker network without publishing its port to the host.

### 4. Testing Data Sharing

I tested the application by updating the shared file and refreshing the frontend through the EC2 public IP.

| Test | Expected frontend output |
|---|---|
| Initial backend write | `Hello from Backend!` |
| First data update | `Test Data 1` |
| Second data update | `Test Data 2 - New Update` |
| After container recreation | `Test Data 2 - New Update` |

These tests demonstrated that the frontend could read data written by the backend and display subsequent changes. After removing and recreating both containers with the same `shared-data` volume, the latest message remained available.

### 5. Bind Mounts Versus Docker Volumes

A **bind mount** maps a specific path on the host machine into a container. In this assignment, the `nginx-logs` directory stored Nginx log files outside the container.

A **Docker volume** is managed by Docker and exists independently of the containers that use it. In this assignment, `shared-data` was mounted into both the frontend and backend containers, allowing them to share the same message file.

The main difference is that bind mounts use a host path selected by the user, while named volumes are managed by Docker. Both can preserve data beyond a container's lifecycle, but named volumes are particularly useful for application data shared across services.

### 6. Conclusion

This assignment provided practical experience with Docker images, containers, bind mounts, named volumes, custom networks, port mapping, and persistent application data.

The Nginx task demonstrated that host-mounted log files remain available after a container is removed. The two-tier application demonstrated that separate frontend and backend containers can share a Docker volume and retain their data even after both containers are removed and recreated.

The exercise reinforced the importance of separating application containers from persistent storage so that container replacement does not automatically destroy required data.

### 7. Application and Evidence

**Application URL:** [Insert the EC2 public application URL]

**LinkedIn post URL:** [Insert the published LinkedIn post URL]

**Evidence:** Attach the numbered screenshots for the assignment, including the public application displaying the shared data and the final persistence test.


---

# Public Application URL

**Application URL:** http://16.171.171.231/

---

# LinkedIn Requirement

## Goal

Create a LinkedIn post about Docker Volumes and Bind Mounts, including one difference between them, how you verified persistent storage, and your key learning outcomes.

### Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/e4Hkuu8A

---

#### LinkedIn Post Screenshot

<img width="475" height="766" alt="linkedin post" src="https://github.com/user-attachments/assets/01532735-d907-466d-9c66-8e6603aef781" />


---

# Submission Instructions

- Complete all tasks in sequence.
- Include Screenshots 1–22 exactly as specified.
- Include the Storage Persistence Notes section.
- Include the public application URL.
- Include the LinkedIn post URL and screenshot.
- Ensure that your full name is visible in all terminal screenshots.
- Add your full name as a clear caption below every browser screenshot.
- Do not expose private keys, passwords, access keys, tokens, account IDs, or other sensitive information.

---

# Completion Checklist

- [ ] Nginx image pulled successfully
- [ ] Host log directory created
- [ ] Bind Mount configured successfully
- [ ] Nginx logs remain after container removal
- [ ] Custom Docker network created
- [ ] Docker Volume created
- [ ] Backend Dockerfile and image created
- [ ] Frontend Dockerfile and image created
- [ ] Both containers mount `shared-data`
- [ ] Backend writes data to the Docker Volume
- [ ] Frontend reads the same data from the Docker Volume
- [ ] Updated data appears after browser refresh
- [ ] Data remains after frontend and backend containers are removed and recreated
- [ ] All required screenshots included
- [ ] Storage Persistence Notes completed
- [ ] Public application URL included
- [ ] LinkedIn post URL and screenshot included
- [ ] Full name visible in terminal screenshots
- [ ] Browser screenshots have full-name captions
- [ ] No sensitive information exposed

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
