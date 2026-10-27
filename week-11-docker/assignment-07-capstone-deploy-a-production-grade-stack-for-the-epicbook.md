# Assignment 7 — Capstone: Deploy a Production-Grade Stack for The EpicBook

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will deploy the EpicBook application as a production-oriented Docker Compose stack on a cloud VM. You will use optimized container images, isolated networks, health checks, persistent MySQL storage, a selected reverse proxy, logging, backup and restore testing, and reliability procedures.

---

# Task 0 — App Discovery and Architecture

## Goal

Review the EpicBook repository and design the intended application architecture.

### Evidence

#### Screenshot 1 — EpicBook Project Structure

Add a terminal screenshot showing the EpicBook project structure after cloning the repository.

<img width="851" height="463" alt="1" src="https://github.com/user-attachments/assets/2519d452-2b57-4b9d-b1da-51fb4b238d57" />


---

#### Screenshot 2 — Architecture Diagram

Add a screenshot of your architecture diagram showing:

- Public user
- Reverse proxy
- Frontend
- Backend
- Database
- Docker networks
- Public and private ports
- Persistent database storage

Add your full name inside the diagram or as a clear caption below it.

<img width="1536" height="1024" alt="2" src="https://github.com/user-attachments/assets/37cbb3d1-e3d6-40f2-9fc5-8520f6606841" />


---

#### Screenshot 3 — Environment Variables and Ports Document

Add a screenshot showing the contents of:

```text
docs/02-env-and-ports.md
```

It must document environment-variable names, internal ports, persistent-data details, and the health-check method. Do not expose real credentials or values.

<img width="704" height="705" alt="3" src="https://github.com/user-attachments/assets/e685e994-8b68-49cb-8a64-dae73700c6d9" />

---

# Task 1 — Create Production Docker Images

## Goal

Create optimized production images for the EpicBook backend and frontend.

### Evidence

#### Screenshot 4 — Backend Dockerfile

Add a screenshot showing `backend/Dockerfile`, including:

- Dependency stage
- Minimal runtime stage
- Production startup command
- Internal backend port
- Non-root user configuration

<img width="889" height="418" alt="4" src="https://github.com/user-attachments/assets/1cdd37ba-8614-4c12-947c-df76318e77b2" />


---

#### Screenshot 5 — Frontend Dockerfile

Add a screenshot showing `frontend/Dockerfile`, including:

- Nginx runtime image
- Static frontend files copied to the Nginx web root

<img width="876" height="110" alt="5" src="https://github.com/user-attachments/assets/13a7939f-ebba-4f1e-968d-8613ce72fee6" />


---

#### Screenshot 6 — Docker Ignore Files

Add a screenshot showing both:

```text
backend/.dockerignore
frontend/.dockerignore
```

<img width="871" height="266" alt="6" src="https://github.com/user-attachments/assets/c1ff8054-8013-438d-b7a1-9719ec79894e" />


---

#### Screenshot 7 — Docker Image Builds and Size Comparison

Add a terminal screenshot showing successful builds of:

- Baseline backend image
- Optimized backend image
- Frontend image

The screenshot must also show the baseline and optimized backend image-size comparison.

<img width="872" height="135" alt="7" src="https://github.com/user-attachments/assets/9a11fbd4-4eef-43f1-bc9d-aec6db2dda6c" />


---

#### Screenshot 8 — Backend Running as Non-Root User

Add a terminal screenshot showing the optimized backend container running as a non-root user.

<img width="873" height="56" alt="8" src="https://github.com/user-attachments/assets/e59396c5-39c0-46aa-99ae-9b0993276160" />


---

### Notes

Write a short note covering:

- Baseline and optimized backend image sizes
- The image-size reduction achieved
- One Docker layer-caching optimization used
- The security benefit of running the backend as a non-root user

### Backend Image Optimization and Security Note

- **Baseline backend image size:** 2.17 GB.
- **Optimized backend image size:** 95.1 MB.
- **Image-size reduction:** Approximately 95.62%, reducing the image by about 2.07 GB.
- **Docker layer-caching optimization:** Dependency installation can be placed in a separate layer by copying the package manifest and lockfile before the application source code. This allows Docker to reuse the dependency layer when application code changes without requiring dependencies to be reinstalled, provided the dependency files remain unchanged.
- **Non-root security benefit:** Running the backend as a non-root user follows the principle of least privilege. If the application or a dependency is compromised, the attacker's permissions are limited compared with running the process as root, reducing the potential impact on the container.

---

# Task 2 — Create the Docker Compose Stack and Networks

## Goal

Create one Docker Compose stack containing the reverse proxy, frontend, backend, and MySQL database.

### Evidence

#### Screenshot 9 — Docker Compose Services

Add a screenshot showing `docker-compose.yml` with all four services:

```text
reverse-proxy
frontend
backend
database
```

<img width="872" height="441" alt="9" src="https://github.com/user-attachments/assets/b72c9706-7c29-4345-9919-0d3fd5964cd9" />


---

#### Screenshot 10 — Networks and Named Volume

Add a screenshot showing:

- `front-tier` network
- `back-tier` network
- `db_data` named volume

<img width="1366" height="1053" alt="10" src="https://github.com/user-attachments/assets/efb644e7-8d5d-4014-9193-820d8583f7be" />

---

#### Screenshot 11 — Docker Compose Validation

Add a terminal screenshot showing successful Docker Compose validation without exposing environment-variable values or secrets.

<img width="661" height="72" alt="11" src="https://github.com/user-attachments/assets/3e8f837b-c2ef-42e2-a95f-93663d035a10" />


---

# Task 3 — Configure Health Checks and Startup Dependencies

## Goal

Configure health checks and ensure services start only after their dependencies are healthy.

### Evidence

#### Screenshot 12 — Backend Health Endpoint

Add a screenshot showing the backend application configuration for the `/health` endpoint.

<img width="657" height="71" alt="12" src="https://github.com/user-attachments/assets/c10c9cfc-6fd3-4988-a781-7718d4165a1d" />


---

#### Screenshot 13 — MySQL and Backend Health Checks

Add a screenshot showing `docker-compose.yml` with health checks for MySQL and the backend.

<img width="658" height="281" alt="13" src="https://github.com/user-attachments/assets/026f1b92-afae-4b4f-8a8f-1a4f0787ebd3" />


---

#### Screenshot 14 — Frontend and Reverse-Proxy Health Checks

Add a screenshot showing:

- Frontend health check
- Reverse-proxy health check
- `depends_on` conditions using `service_healthy`

<img width="1090" height="597" alt="14" src="https://github.com/user-attachments/assets/04a3a5db-dd67-4406-bfbd-bdfc4254644e" />



---

#### Screenshot 15 — Running Healthy Services

Add a terminal screenshot showing Docker Compose service status. The database, backend, frontend, and reverse proxy must be running successfully.

<img width="1090" height="122" alt="15" src="https://github.com/user-attachments/assets/bd5ae7dd-cd0f-46ff-8e47-7d8402be2733" />



---

#### Screenshot 16 — Public Health Endpoint

Add a terminal screenshot showing a successful response from the public application health endpoint through the reverse proxy.

<img width="1092" height="159" alt="16" src="https://github.com/user-attachments/assets/6777a5b2-40be-4b22-a51a-8375e577f138" />



---

#### Screenshot 17 — Health-Check and Startup-Order Document

Add a screenshot showing the contents of:

```text
docs/03-healthchecks-and-depends-on.md
```

Explain the health-check method for each service and the startup dependency order.

<img width="1096" height="554" alt="17" src="https://github.com/user-attachments/assets/38600c52-db6e-4083-93f6-d8f9d445542c" />


---

# Task 4 — Configure the Reverse Proxy and Same-Origin Routing

## Goal

Use either Nginx or Traefik as the only public entry point for the EpicBook application.

### Evidence

#### Screenshot 18 — Selected Reverse-Proxy Configuration

Add a screenshot showing the configuration for your selected reverse proxy.

It must show routes for:

- Static frontend assets
- Application pages
- API requests
- Health endpoint

<img width="1097" height="782" alt="18" src="https://github.com/user-attachments/assets/a8a8b7bf-ecd5-4ac5-9b47-dfff68f508b8" />


---

#### Screenshot 19 — Only Reverse Proxy Publishes Port 80

Add a screenshot of `docker-compose.yml` showing that only the `reverse-proxy` service publishes port 80.

<img width="1792" height="1120" alt="19" src="https://github.com/user-attachments/assets/6b85b6f9-5505-432d-8d7d-3d1f858b13d4" />

<img width="1792" height="430" alt="19 1" src="https://github.com/user-attachments/assets/80ed835d-9f05-4bd2-a96b-253b92a33698" />

---

#### Screenshot 20 — Reverse-Proxy Route Testing

Add a terminal screenshot showing successful requests through the selected reverse proxy to:

- Application page
- One API endpoint
- One static asset
- Health endpoint

<img width="1064" height="334" alt="20" src="https://github.com/user-attachments/assets/eb2538e4-bdee-41f9-af6b-176ee68ab6f6" />


---

#### Screenshot 21 — EpicBook Application Through Public IP

Add a browser screenshot showing the EpicBook application loaded through the VM public IP address.

Add your full name as a clear caption below the screenshot.

<img width="1792" height="1080" alt="21" src="https://github.com/user-attachments/assets/dc9520f1-fb53-406e-8bb3-09a84b8bd6e3" />

---

#### Screenshot 22 — Proxy Routing and CORS Document

Add a screenshot showing the contents of:

```text
docs/04-proxy-routing-and-cors.md
```

Explain the proxy routes and state whether CORS was required and why.

<img width="1087" height="416" alt="22" src="https://github.com/user-attachments/assets/1dcc1d72-d301-4c33-84d0-a1b48ff91ede" />


---

# Task 5 — Prove Data Persistence, Backup, and Restore

## Goal

Verify MySQL persistence and perform a controlled backup and restore drill.

### Evidence

#### Screenshot 23 — MySQL Volume Configuration

Add a terminal screenshot showing the `db_data` named volume and its MySQL mount configuration.

<img width="1086" height="353" alt="23" src="https://github.com/user-attachments/assets/6bd49e95-0227-44ce-a4bd-b2b2b80de4a3" />


---

#### Screenshot 24 — Test Data Before Backup

Add a terminal screenshot showing the selected test data before the backup and restore drill.

<img width="1084" height="223" alt="24" src="https://github.com/user-attachments/assets/f49b7f9f-6dc6-4c43-bf1c-212ad49be8b0" />



---

#### Screenshot 25 — Successful Backup Creation

Add a terminal screenshot showing successful backup creation and the backup file stored in the host backup directory.

<img width="1080" height="125" alt="25" src="https://github.com/user-attachments/assets/85e750a2-988f-4d6b-ac79-89fb33ea8b1a" />


---

#### Screenshot 26 — Controlled Data-Loss Test

Add a terminal screenshot showing that the selected test record was removed during the controlled data-loss test.

<img width="1088" height="136" alt="26" src="https://github.com/user-attachments/assets/75e7426c-0ec2-49c4-bb9e-cfa378c152aa" />



---

#### Screenshot 27 — Restore Verification

Add a terminal screenshot showing successful restore and verification that the deleted test record is available again.

<img width="543" height="185" alt="27" src="https://github.com/user-attachments/assets/3d846508-c50a-4ebe-9e8f-48ac8fccaa85" />


---

#### Screenshot 28 — Persistence After Down/Up Cycle

Add a terminal screenshot showing that database data remains available after a non-destructive Docker Compose down/up cycle.

Do not use `docker compose down -v`.

<img width="1083" height="251" alt="28" src="https://github.com/user-attachments/assets/3487391a-1bd5-4cbc-b3b4-6bbd2be78fa5" />



---

#### Screenshot 29 — Persistence and Backup Document

Add a screenshot showing the contents of:

```text
docs/05-persistence-and-backup.md
```

Include the backup plan and restore procedure.

<img width="1098" height="929" alt="29" src="https://github.com/user-attachments/assets/d0cc2ebc-8c78-408e-8a5b-b6346e723d31" />

<img width="1102" height="371" alt="29 1" src="https://github.com/user-attachments/assets/e48857ea-3aef-464b-9221-4f7786d9f5b2" />


---

# Task 6 — Configure Logging and Observability

## Goal

Configure useful reverse-proxy and backend logs without exposing sensitive information.

### Evidence

#### Screenshot 30 — Logging Configuration

Add a screenshot showing:

- Configuration for the selected reverse proxy
- Proxy log format
- Docker Compose host log-directory bind mount

<img width="1073" height="95" alt="30" src="https://github.com/user-attachments/assets/516e4571-a214-4e83-bcd2-63f0a73e88da" />


---

#### Screenshot 31 — Persistent Proxy Logs and Backend Logs

Add a terminal screenshot showing:

- Selected reverse-proxy logs available from the host directory after a proxy restart
- Backend logs displayed through Docker Compose

<img width="1082" height="349" alt="31" src="https://github.com/user-attachments/assets/32142399-0053-4be1-a703-ceb1f8ef903b" />


---

### Notes

Write a short note covering:

- The selected reverse proxy
- Host path used for reverse-proxy logs
- How backend logs are viewed
- Whether JSON or standard text logs were used
- Why passwords, tokens, headers, and database connection strings must not appear in logs

### Reverse-Proxy Logging and Security Note

- **Reverse proxy:** Nginx was used to route public HTTP requests to the EpicBook frontend and backend services.
- **Host path for reverse-proxy logs:** The intended host directory is the logging directory mounted into the Nginx container through Docker Compose. The exact configured path should be confirmed in `docker-compose.yml` before submission.
- **Backend logs:** View backend application logs using `docker compose logs --tail=100 backend` from `~/epicbook-production`.
- **Log format:** Standard text output was used for the commands and responses verified during deployment. JSON logging for the reverse proxy was not confirmed.
- **Log security:** Passwords, access tokens, authorization headers, and database connection strings must not appear in logs because logs may be retained, shared, or accessed by people who should not have access to these credentials. Exposing them could enable unauthorized access to the application, database, or other services. Logs should capture operational information while redacting sensitive values.

---

# Task 7 — Deploy and Verify the Stack on a Cloud VM

## Goal

Deploy the completed Docker Compose stack on an AWS or Azure VM and verify public access.

### Evidence

#### Screenshot 32 — VM Public IP and Inbound Rules

Add a cloud-console screenshot showing:

- VM public IP address
- SSH port 22 restricted to your IP address
- HTTP port 80 allowed from Anywhere

<img width="803" height="113" alt="32" src="https://github.com/user-attachments/assets/2f1c0038-5a44-4580-9cb6-25f76ec5a799" />

<img width="1529" height="535" alt="32 1" src="https://github.com/user-attachments/assets/8cd55cfd-5c6d-427c-bdb8-c5e1d916dda5" />

<img width="1552" height="913" alt="32 2" src="https://github.com/user-attachments/assets/f107697f-658f-4ffd-b5a9-8516360bb11c" />

---

#### Screenshot 33 — Cloud VM Stack Verification

Add a VM terminal screenshot showing:

- Docker Compose service status
- Successful public health or API response
- No published database, frontend, or backend ports

<img width="1084" height="263" alt="33" src="https://github.com/user-attachments/assets/6bf2e432-e1c3-4c83-9fed-58dcb4ef8035" />

---

#### Screenshot 34 — EpicBook Application on Cloud VM

Add a browser screenshot showing the EpicBook application loaded through the VM public IP address.

Add your full name as a clear caption below the screenshot.

<img width="1792" height="1080" alt="34" src="https://github.com/user-attachments/assets/9e338d80-a396-4f58-9d62-ae178580020a" />


---

### Notes

Write a short note covering:

- Cloud provider used
- VM operating system
- Public port exposed
- Security rules configured
- Confirmation that the application and backend API worked through the reverse proxy

### Cloud Deployment and Verification Note

- **Cloud provider:** Amazon Web Services (AWS).
- **VM operating system:** Ubuntu Linux running on an AWS EC2 `t3.micro` instance.
- **Public port exposed:** TCP port 80 (HTTP), published exclusively by the Nginx reverse proxy. The frontend, backend, and database ports remained internal to the Docker environment.
- **Security rules configured:** SSH (TCP 22) was restricted to my public IP address (`102.216.11.5/32`), while HTTP (TCP 80) was open to `0.0.0.0/0` for public access. Ports 3000 and 3001 were restricted to my IP address.
- **Application and API verification:** EpicBook was accessible through the reverse proxy at `http://13.60.65.111`. The public health endpoint returned HTTP 200 with `{"status":"healthy"}`, and the application loaded successfully through the proxy.

---

# Task 8 — Automate Deployment with CI/CD (Optional)

## Goal

Optionally automate image build, image push, and deployment through GitHub Actions or Azure Pipelines.

### Optional Evidence

#### Optional Screenshot — Successful CI/CD Pipeline Run

Add a screenshot showing a successful pipeline run with build, image push, deployment, and verification stages.

<img width="1536" height="1024" alt="ci:cd architecture" src="https://github.com/user-attachments/assets/9135cac9-7f45-4763-8eac-08f706b13a84" />


---

### Optional Notes

Write a short note covering:

- CI/CD platform used
- Image-tagging method
- Registry used
- Deployment trigger
- Manual approval or secret-handling approach

### CI/CD and Deployment Note

- **CI/CD platform used:** No CI/CD platform was confirmed as implemented for this deployment; the application was packaged and deployed to AWS EC2 using Docker Compose.
- **Image-tagging method:** Docker Compose service image names were used, including `epicbook-production-backend` and `epicbook-production-frontend`. A commit-based or versioned tagging strategy was not verified.
- **Container registry:** No remote container registry was confirmed for the final deployment. The images were built and used on the EC2 instance.
- **Deployment trigger:** Deployment was initiated manually through SSH by transferring the project, building the images, and running `docker compose up -d`.
- **Manual approval and secret handling:** Deployment was manually controlled. Database credentials were stored in the server-side `.env` file with restricted permissions (`chmod 600`), and the environment file was excluded from the deployment archive. Credentials should not be committed to Git or exposed in logs or screenshots.

---

# Task 9 — Perform Reliability Tests and Create an Operations Runbook

## Goal

Test controlled service failures and document safe operating procedures.

### Evidence

#### Screenshot 35 — Backend Failure and Recovery

Add a terminal screenshot showing:

- Backend failure test
- Expected unavailable response through the reverse proxy
- Backend restart
- Successful health-check recovery

<img width="1101" height="290" alt="35" src="https://github.com/user-attachments/assets/38495619-7456-46a3-8449-2c94a9310834" />

---

#### Screenshot 36 — Database Failure and Recovery

Add a terminal screenshot showing:

- Database outage test
- Failed database-dependent request
- Database restart
- Successful application recovery

<img width="1084" height="290" alt="36" src="https://github.com/user-attachments/assets/3701d915-7fc8-4191-b8d2-dcfbd788e99f" />


---

### Notes

Write a short operations runbook covering:

- Safe restart procedure for reverse proxy, frontend, backend, and database
- Backup and restore procedure
- Secret-rotation approach
- Database recovery procedure
- What to check when the application returns an error
- Results of backend and database reliability tests

# EpicBook Production Operations Runbook

## Safe Restart Procedure
Run commands from `~/epicbook-production` on the AWS EC2 instance. Check service status before restarting. Restart the affected service using `docker compose restart proxy`, `docker compose restart frontend`, `docker compose restart backend`, or `docker compose restart database`. For a full stack restart, use `docker compose up -d`, then verify with `docker compose ps` and test the application through the reverse proxy. Avoid `docker compose down -v`, as it can delete persistent database data.

## Backup and Restore
Create a database backup using `docker exec epicbook-database mysqldump -u epicbook -p bookstore > ~/backups/epicbook-backup.sql`, ensuring the backup directory exists first. Store backups securely outside the database container and verify that the file is non-empty. To restore, import the SQL dump into the intended database using the MySQL client inside the database container. Verify that expected tables and records exist after restoration. Never overwrite production data without confirming the target database and backup.

## Secret Rotation
Keep database credentials and application secrets in the protected `.env` file or a dedicated secrets manager. Restrict file permissions, never commit secrets to Git, and never include credentials in screenshots or logs. To rotate credentials, update the database account and application configuration together, recreate or restart affected services as required, and verify database connectivity and application health.

## Database Recovery
Check database status with `docker compose ps` and inspect logs using `docker compose logs --tail=100 database`. If the database is stopped, start it with `docker compose start database` and wait until it reports healthy. Test a database-dependent application request and verify the expected records remain available. If recovery fails, inspect database logs and restore from a verified backup only when necessary.

## Application Troubleshooting
Check `docker compose ps` first, followed by service logs using `docker compose logs --tail=100 proxy frontend backend database`. Test the public health endpoint at `/health`, inspect reverse-proxy routing, confirm required services are healthy, and check database connectivity. An HTTP 502 or timeout can indicate an unavailable upstream service. Verify that only the reverse proxy publishes public HTTP port 80 and that persistent storage remains attached.

## Reliability Test Results
**Backend failure test:** Stopping the backend caused the health request through the proxy to time out with curl error 28 and no response bytes. After restarting the backend, `/health` returned HTTP 200 with `{"status":"healthy"}`.

**Database failure test:** Stopping the database caused the homepage request through the proxy to return HTTP 502. After restarting the database and confirming it was healthy, the homepage returned HTTP 200.

These tests demonstrated recovery after backend and database interruptions. The backend test produced a timeout rather than an explicit HTTP 502 response.

---

# Final Public Application URL

**EpicBook URL:** http://13.60.65.111

Replace the placeholder with your working public URL.

---

# GitHub Repository URL

**Your Fork or Repository URL:** https://github.com/kaphaaya/theepicbook.git

---

# LinkedIn Requirement

## Goal

Create a professional LinkedIn post of 6–10 lines about your EpicBook capstone deployment.

Your post must include:

- The architectural decision that most improved reliability
- Your biggest image-size reduction, with numbers
- Key production-hardening lessons
- A deployment verification image

### Evidence

**LinkedIn Post URL:** https://lnkd.in/p/eZJ6ks_xl

#### LinkedIn Post Screenshot

Add a screenshot of the published LinkedIn post showing the text body and deployment verification image.

<img width="547" height="744" alt="linekdin" src="https://github.com/user-attachments/assets/feac68eb-2baa-4e92-ad74-c3161ebca85b" />

---

# Submission Checklist

- [ ] EpicBook repository reviewed and architecture diagram created
- [ ] Environment variables, ports, persistence, and health-check details documented
- [ ] Backend and frontend production Dockerfiles created
- [ ] Backend runs as a non-root user
- [ ] Docker image-size comparison completed
- [ ] Docker Compose stack includes reverse proxy, frontend, backend, and database
- [ ] `front-tier` and `back-tier` networks configured
- [ ] `db_data` named volume configured
- [ ] MySQL, backend, frontend, and reverse-proxy health checks configured
- [ ] Startup dependencies use `service_healthy`
- [ ] Nginx or Traefik selected as the only public reverse proxy
- [ ] Only reverse-proxy port 80 is publicly published
- [ ] Same-origin routing configured and CORS used only when required
- [ ] Backup, restore, and persistence testing completed
- [ ] Reverse-proxy and backend logs verified
- [ ] Cloud VM deployment verified through the public IP
- [ ] Backend and database reliability tests completed
- [ ] Screenshots 1–36 included
- [ ] Required notes completed
- [ ] LinkedIn post URL and screenshot included
- [ ] Full name visible in required screenshots or captions
- [ ] No passwords, tokens, private keys, account IDs, or other sensitive information exposed

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
