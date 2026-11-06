# Assignment 6 — Deploy the Book Review App with Docker Compose

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will deploy the Book Review Application with Docker Compose using MySQL, a backend API, and a frontend user interface. You will configure health-gated startup, browser-facing API access, CORS, and persistent MySQL storage.

---

# Task 1 — Prepare the Project

## Goal

Prepare your fork of the Book Review App repository for Docker Compose deployment.

### Evidence

#### Screenshot 1 — Project Structure

Add a screenshot showing the project structure containing:

```text
frontend/
backend/
.env.example
.gitignore
docker-compose.yml
```

<img width="779" height="285" alt="1" src="https://github.com/user-attachments/assets/97a130fc-aa93-4ee6-bba0-2e94dcab3f67" />


---

#### Screenshot 2 — Environment and Docker Ignore Files

Add a screenshot showing the contents of:

```text
.env.example
.gitignore
frontend/.dockerignore
backend/.dockerignore
```

Ensure that no real passwords, tokens, or secrets are visible.

<img width="778" height="640" alt="2" src="https://github.com/user-attachments/assets/43790c6e-aa06-4fcc-90d8-2ccc6306ea8e" />

---

# Task 2 — Create or Confirm Application Dockerfiles

## Goal

Prepare Dockerfiles for the frontend and backend services and build both services through Docker Compose.

### Evidence

#### Screenshot 3 — Frontend Dockerfile

Add a screenshot showing the completed `frontend/Dockerfile`.

<img width="780" height="443" alt="3" src="https://github.com/user-attachments/assets/9fdd3858-7baa-422c-8262-81ec755ed8be" />


---

#### Screenshot 4 — Backend Dockerfile

Add a screenshot showing the completed `backend/Dockerfile`.

<img width="778" height="234" alt="4" src="https://github.com/user-attachments/assets/75630255-3096-4412-be0f-7442462b5fda" />


---

#### Screenshot 5 — Docker Compose Build

Add a screenshot of the terminal showing successful completion of:

```bash
docker compose build
```

<img width="779" height="678" alt="5" src="https://github.com/user-attachments/assets/caae302f-04a9-4927-bdfa-3966f80a6c83" />

---

# Task 3 — Create the Docker Compose Stack

## Goal

Create one `docker-compose.yml` file that builds and runs MySQL, backend, and frontend services.

### Evidence

#### Screenshot 6 — MySQL Service, Health Check, and Volume Mount

Add a screenshot showing the MySQL service in `docker-compose.yml`, including:

- MySQL image
- Environment variables
- MySQL health check
- `mysql_data` volume mount
- No published MySQL port

<img width="780" height="344" alt="6" src="https://github.com/user-attachments/assets/e6b9b2b9-b4e3-42e8-a3b9-82b822a59a39" />


---

#### Screenshot 7 — Backend Configuration

Add a screenshot showing the backend service configuration, including:

- `depends_on` with `condition: service_healthy`
- Database host set to `mysql`
- Browser frontend origin configured for CORS
- Published backend port

<img width="778" height="332" alt="7" src="https://github.com/user-attachments/assets/07fc9532-1b5c-4054-8f5a-4c506f233747" />

---

#### Screenshot 8 — Frontend Configuration

Add a screenshot showing the frontend service configuration, including:

- Published frontend port
- `depends_on` for the backend service
- Browser-facing `NEXT_PUBLIC_API_URL`

<img width="779" height="253" alt="8" src="https://github.com/user-attachments/assets/6d73b0ff-9d7a-4d85-803e-834639481b5b" />


---

#### Screenshot 9 — Named Volume Definition

Add a screenshot showing the `mysql_data` volume definition in `docker-compose.yml`.

<img width="780" height="115" alt="9" src="https://github.com/user-attachments/assets/2da9c4ba-0ca0-4e4e-a3c7-d7eacdd604c5" />


---

# Task 4 — Start and Verify the Stack

## Goal

Build and start all services through one Docker Compose workflow.

### Evidence

#### Screenshot 10 — Docker Compose Service Status

Add a screenshot of the terminal showing:

```bash
docker compose ps
```

The output must show the MySQL, backend, and frontend services running. MySQL must show as healthy.

<img width="780" height="166" alt="10" src="https://github.com/user-attachments/assets/7c1f1270-b82a-4d64-8267-f93840195c11" />


---

#### Screenshot 11 — MySQL and Backend Logs

Add a screenshot of the terminal showing:

```bash
docker compose logs mysql backend --tail=50
```

The logs must show MySQL readiness and successful backend database connection.

<img width="774" height="1037" alt="11" src="https://github.com/user-attachments/assets/8b9bb589-765e-4e31-a92e-009d52616da7" />


---

# Task 5 — Test End-to-End Application Functionality

## Goal

Verify that the Book Review App works through the browser.

### Evidence

#### Screenshot 12 — Successful Registration or Login

Add a browser screenshot showing successful user registration or login.

Add your full name as a clear caption directly below the screenshot.

<img width="854" height="969" alt="12" src="https://github.com/user-attachments/assets/a6993218-4ba0-4a50-a9ef-4efd79fae551" />

---

#### Screenshot 13 — Created Book Review

Add a browser screenshot showing a created book review visible in the application.

Add your full name as a clear caption directly below the screenshot.

<img width="869" height="858" alt="13" src="https://github.com/user-attachments/assets/680d8088-46ec-464e-a81b-f42c8cc9b085" />


---

#### Screenshot 14 — CORS Verification

Add a browser developer-tools screenshot with:

- The Network tab showing a successful API request
- The Console drawer showing no CORS error after the API interaction

<img width="1790" height="1078" alt="14" src="https://github.com/user-attachments/assets/c11f0a58-b7af-47d1-8839-e83a7fa2d991" />


---

# Task 6 — Prove MySQL Data Persistence

## Goal

Verify that MySQL data remains after a non-destructive Docker Compose down/up cycle.

### Evidence

#### Screenshot 15 — Data Before Restart

Add a browser screenshot showing the registered user or created review before the down/up cycle.

Add your full name as a clear caption directly below the screenshot.

<img width="867" height="1046" alt="15" src="https://github.com/user-attachments/assets/722bb193-a7d0-4af4-88ec-577513f6e255" />

---

#### Screenshot 16 — Non-Destructive Stack Restart

Add a screenshot of the terminal showing the non-destructive shutdown and restart:

```bash
docker compose down
docker compose up -d
docker compose ps
```

Do not use `docker compose down -v`.

<img width="775" height="344" alt="16" src="https://github.com/user-attachments/assets/31712c10-1909-466b-85b3-476dd31a021c" />


---

#### Screenshot 17 — Data After Restart

Add a browser screenshot showing the same registered user or review after the stack restarts.

Add your full name as a clear caption directly below the screenshot.

<img width="867" height="969" alt="17" src="https://github.com/user-attachments/assets/810b8970-ef46-4d1f-b977-6a2d80d359ce" />


---

# Task 7 — Explain Docker Compose Teardown Modes

## Goal

Explain the difference between preserving data and fully resetting a Docker Compose environment.

### Notes

Write a short explanation of 5–8 lines covering:

- What `docker compose down` removes and preserves
- Why named volumes should be kept when preserving MySQL data
- What happens when named volumes are removed
- When a full reset is useful
- Why a full reset must not be used before persistence evidence is captured

`docker compose down` stops and removes the containers and networks created by Docker Compose, but preserves named volumes by default.\

Named volumes should be kept because MySQL stores its database files there, allowing data to survive container removal and recreation.\

If named volumes are removed using `docker compose down -v`, the stored MySQL data is deleted along with them.\

A full reset is useful when you need a clean environment to troubleshoot issues or start the application from scratch.\

However, removing volumes permanently deletes persisted database data unless it has been backed up.\

A full reset must not be used before capturing persistence evidence because it would destroy the data needed to prove that reviews survive a restart.\

For this assignment, preserve the named volume and verify that the saved review remains after restarting the services.

---

# Final Public Frontend URL

**Frontend URL:** http://16.171.171.231:3000

Replace the placeholder with your working application URL.

---

# GitHub Repository URL

**Your Fork or Repository URL:** https://github.com/kaphaaya/book-review-app

---

# LinkedIn Requirement

## Goal

Create a LinkedIn post about the Book Review App deployment and what you learned from using Docker Compose.

### Evidence

**LinkedIn Post URL:** https://lnkd.in/p/eV4WSRbm

#### LinkedIn Post Screenshot

<img width="551" height="946" alt="linkedin post " src="https://github.com/user-attachments/assets/113f1c3c-e636-4284-a90e-5f0750870a8c" />


---

# Submission Checklist

- [ ] Book Review App repository forked and used
- [ ] `.env` excluded from Git tracking
- [ ] `.env.example` contains only safe placeholder values
- [ ] Frontend and backend Dockerfiles created or confirmed
- [ ] MySQL health check configured
- [ ] Backend waits for healthy MySQL
- [ ] Backend uses `mysql` as the database hostname
- [ ] Frontend API URL uses the VM public IP and backend port
- [ ] Backend CORS origin matches the frontend origin
- [ ] MySQL port 3306 is not publicly exposed
- [ ] Registration and login work
- [ ] Book review creation works
- [ ] Data persists after a non-destructive down/up cycle
- [ ] Screenshots 1–17 included
- [ ] Teardown explanation completed
- [ ] Public frontend URL included
- [ ] GitHub repository URL included
- [ ] LinkedIn post URL and screenshot included
- [ ] Full name visible in required terminal screenshots
- [ ] Browser screenshots include a full-name caption
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
