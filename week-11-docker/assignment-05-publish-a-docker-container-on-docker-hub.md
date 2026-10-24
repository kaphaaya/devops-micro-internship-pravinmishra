# Assignment 5 — Publish a Docker Container on Docker Hub

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will publish a Dockerized React application to Docker Hub, remove the local image tags, pull the image again from Docker Hub, and run it to verify that it can be downloaded and deployed from a container registry.

---

# Task 1 — Publish a Docker Image to Docker Hub

## Goal

Tag a locally built React image, publish it to Docker Hub, remove the local copy, pull it again from Docker Hub, and run it successfully.

### Evidence

#### Screenshot 1 — Public Docker Hub Repository

Add a screenshot of Docker Hub showing your newly created public repository:

```text
my-react-app
```

<img width="955" height="209" alt="1" src="https://github.com/user-attachments/assets/65b99f4e-76ef-4ed6-b628-8d9d0aeb4cfe" />


---

#### Screenshot 2 — Successful Docker Login

Add a screenshot of the terminal showing:

```text
Login Succeeded
```

Ensure that your full name is visible and that no password, Personal Access Token, or device code is exposed.

<img width="780" height="223" alt="2" src="https://github.com/user-attachments/assets/5626c1e6-2b18-47fb-b1a9-02ed713864ea" />


---

#### Screenshot 3 — Correctly Tagged Image

Add a screenshot of the terminal showing:

```bash
docker image ls <YOUR_DOCKERHUB_USERNAME>/my-react-app
```

The output must show the `latest` tag.

<img width="780" height="103" alt="3" src="https://github.com/user-attachments/assets/95e36a34-f79f-4bdf-9190-873e51606c41" />


---

#### Screenshot 4 — Successful Docker Push

Add a screenshot of the terminal showing successful completion of:

```bash
docker push <YOUR_DOCKERHUB_USERNAME>/my-react-app:latest
```

The output must include a pushed status or image digest.

<img width="779" height="252" alt="4" src="https://github.com/user-attachments/assets/571711b6-71dc-416c-bc7a-dd331d4364c3" />


---

#### Screenshot 5 — Published `latest` Tag in Docker Hub

Add a screenshot of your Docker Hub repository showing the uploaded `latest` image tag.

<img width="935" height="851" alt="5" src="https://github.com/user-attachments/assets/ee4c36ac-d761-46c7-9fae-248fe73550de" />


---

#### Screenshot 6 — Local Image Removed and Pulled Again

Add a screenshot of the terminal showing:

- The targeted local image tags removed
- Successful `docker pull` output
- `docker image ls` showing the pulled image

<img width="777" height="160" alt="6" src="https://github.com/user-attachments/assets/cf635708-fc34-466e-9bcc-d16e30eb9bf3" />

---

#### Screenshot 7 — Running Pulled Image

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show the running `react-container` with:

```text
0.0.0.0:80->80/tcp
```

<img width="773" height="73" alt="7" src="https://github.com/user-attachments/assets/fdf4d809-588e-4d02-9d69-11005737396c" />


---

#### Screenshot 8 — React Application in Browser

Add a browser screenshot showing the React application at:

```text
http://16.171.171.231
```

Ensure that the VM public IP is visible in the address bar. Add your full name as a clear caption directly below the screenshot.

<img width="956" height="945" alt="8" src="https://github.com/user-attachments/assets/1837cdbb-b9df-48d2-906f-ef3ca51a530d" />


---

# Docker Hub Repository URL

**Repository URL:** https://hub.docker.com/r/kaphaaya/my-react-app

---

# Registry and Image Tagging Notes

Write a short explanation covering:

- Why image tagging is required before pushing to Docker Hub
- Why a container registry is useful in DevOps workflows
- Why production deployments should use versioned image tags instead of relying only on `latest`

1. Why is tagging a Docker image important?

Tagging identifies an image with a repository name and version, making it easier to reference, publish, retrieve, and deploy. For this assignment, kaphaaya/my-react-app:latest identifies the React application image published to Docker Hub.

2. Why is a container registry useful?

A container registry stores and distributes Docker images. Docker Hub allows developers to push images from one machine and pull them onto another, supporting consistent deployment without rebuilding the application on the destination server.

3. Why use versioned tags instead of relying only on latest?

Versioned tags such as v1.0.0 and v1.1.0 make releases easier to identify and reproduce. The latest tag is a convenient label, but it doesn't guarantee that an image is the newest build or a particular release. Versioned tags improve deployment traceability and rollback.

Docker Hub repository: https://hub.docker.com/r/kaphaaya/my-react-app

---

# LinkedIn Requirement

## Goal

Create a LinkedIn post about publishing a Docker container image to Docker Hub.

Include:

- Assignment title: **Publish a Docker Container Image to Docker Hub**
- Your Docker Hub repository URL
- What you published
- How you verified the remote image by pulling and running it
- Key learning outcomes

### Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://www.linkedin.com/posts/aziz-kafayat_docker-dockerhub-devops-share-7519694486214463488-UxeT/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU

---

#### LinkedIn Post Screenshot

<img width="472" height="917" alt="linkedin post" src="https://github.com/user-attachments/assets/0ba054e8-2431-41f2-bf9e-b28b84112321" />


---

# Submission Instructions

- Complete all steps in sequence.
- Include Screenshots 1–8 exactly as specified.
- Include your Docker Hub repository URL.
- Include the Registry and Image Tagging Notes.
- Include the LinkedIn post URL and screenshot.
- Ensure that your full name is visible in all terminal screenshots.
- Add your full name as a clear caption below the browser screenshot.
- Do not expose passwords, Personal Access Tokens, device codes, credentials, or other sensitive information.

---

# Completion Checklist

- [ ] Public `my-react-app` repository created
- [ ] Docker login completed successfully
- [ ] `react-multistage:latest` tagged correctly
- [ ] Image pushed to Docker Hub
- [ ] `latest` tag verified in Docker Hub
- [ ] Targeted local image tags removed
- [ ] Image pulled again from Docker Hub
- [ ] Pulled image runs successfully
- [ ] React application is accessible through the VM public IP
- [ ] Docker Hub repository URL included
- [ ] Registry and image-tagging notes completed
- [ ] LinkedIn post URL and screenshot included
- [ ] All required screenshots included
- [ ] Full name visible in terminal screenshots
- [ ] Browser screenshot has a full-name caption
- [ ] No passwords, tokens, or credentials exposed
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
