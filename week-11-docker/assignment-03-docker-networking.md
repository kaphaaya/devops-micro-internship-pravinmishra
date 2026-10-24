# Assignment 3 — Docker Networking

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will explore Docker networking by using default bridge, custom bridge, multiple bridge, and host network modes. You will verify container communication, service discovery, network isolation, public access, and host networking on a Linux VM or EC2 instance.

---

# Task 1 — Deploy a Standalone Application Using the Default Bridge Network

## Goal

Deploy an Nginx web server using Docker’s default bridge network and access it through the VM public IP address.

### Evidence

#### Screenshot 1 — Available Docker Networks

Add a screenshot of the terminal showing:

```bash
docker network ls
```

The output must include the default `bridge`, `host`, and `none` networks.

<img width="754" height="468" alt="1" src="https://github.com/user-attachments/assets/0667acb4-a349-4f12-85d1-96e8f9008e5e" />


---

#### Screenshot 2 — Nginx Image Pull

Add a screenshot of the terminal showing successful completion of:

```bash
docker pull nginx:alpine
```

<img width="774" height="197" alt="2" src="https://github.com/user-attachments/assets/62bfc97b-465e-44a6-9ad8-2c4fc81aee7f" />


---

#### Screenshot 3 — Running `myweb` Container

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show the running `myweb` container with:

```text
0.0.0.0:80->80/tcp
```

<img width="765" height="192" alt="3" src="https://github.com/user-attachments/assets/7bfd0a76-dcdd-432b-a3fe-a8d7931b27d1" />


---

#### Screenshot 4 — Nginx Welcome Page

Add a browser screenshot showing the Nginx Welcome Page at:

```text
http://<YOUR-VM-PUBLIC-IP>
```

Ensure that the VM public IP is visible in the address bar. Add your full name as a clear caption directly below the screenshot.

<img width="990" height="1049" alt="4" src="https://github.com/user-attachments/assets/1a06757f-a50a-4743-9b4a-0b84c9d33afd" />


---

# Task 2 — Connect Containers Using a Custom Bridge Network

## Goal

Create a custom bridge network and verify that containers can communicate using container names rather than IP addresses.

### Evidence

#### Screenshot 5 — Custom Bridge Network Created

Add a screenshot of the terminal showing `mynetwork` in:

```bash
docker network ls
```

<img width="773" height="162" alt="5" src="https://github.com/user-attachments/assets/5dca5c9b-ffc7-4e84-b154-6df30dd8a805" />


---

#### Screenshot 6 — Running `web` and `client` Containers

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show both `web` and `client` containers running without published host ports.

<img width="923" height="87" alt="6" src="https://github.com/user-attachments/assets/a7e3a7d2-321e-459f-b95a-eaf4d3da45ed" />


---

#### Screenshot 7 — Service Discovery by Container Name

Add a screenshot of the terminal showing successful output from:

```bash
docker exec client wget -qO- http://web
```

The output must display the Nginx Welcome Page HTML.

<img width="926" height="446" alt="7" src="https://github.com/user-attachments/assets/2cfe5c66-944e-4679-8b4c-6903f65fdd9d" />


---

#### Screenshot 8 — Custom Network Inspection

Add a screenshot of the terminal showing:

```bash
docker network inspect mynetwork
```

The output must show both `web` and `client` connected to `mynetwork`.

<img width="990" height="773" alt="8" src="https://github.com/user-attachments/assets/af3c3e4d-3bfc-4610-a71d-cec19533675c" />


---

# Task 3 — Demonstrate Multi-Network Isolation

## Goal

Deploy frontend, backend, and database containers across two separate Docker networks. Verify allowed communication and confirm that the frontend cannot directly reach the database.

### Evidence

#### Screenshot 9 — Two Docker Networks

Add a screenshot of the terminal showing:

```bash
docker network ls
```

The output must include both `frontend-network` and `backend-network`.

<img width="985" height="190" alt="9" src="https://github.com/user-attachments/assets/fbccc13c-3443-4e3b-a225-c3c4bcbf3622" />


---

#### Screenshot 10 — Running Multi-Network Containers

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show:

- `frontend` with the published port mapping `0.0.0.0:80->80/tcp`
- `backend` without a published host port
- `db` without a published host port

<img width="762" height="158" alt="10" src="https://github.com/user-attachments/assets/1c40a935-5f2f-4ebd-b206-d2c38e96ad13" />

---

#### Screenshot 11 — Frontend Network Inspection

Add a screenshot of the terminal showing:

```bash
docker network inspect frontend-network
```

The output must show `frontend` and `backend`.

<img width="768" height="783" alt="11" src="https://github.com/user-attachments/assets/4492c563-229d-4a55-92fe-9f0c3ba13593" />


---

#### Screenshot 12 — Backend Network Inspection

Add a screenshot of the terminal showing:

```bash
docker network inspect backend-network
```

The output must show `backend` and `db`.

<img width="761" height="188" alt="12" src="https://github.com/user-attachments/assets/89db376b-47f0-4f6d-9be6-7d40ae34280a" />


---

#### Screenshot 13 — Frontend-to-Backend Communication

Add a screenshot of the terminal showing successful output from:

```bash
docker exec frontend wget -qO- http://backend
```

The output must display the Nginx Welcome Page HTML.

<img width="591" height="583" alt="13" src="https://github.com/user-attachments/assets/5b4ab3e8-d2bd-47d4-b267-0e61767be376" />


---

#### Screenshot 14 — Backend-to-Database Communication

Add a screenshot of the terminal showing a successful connection to `db` on port `27017` from the `backend` container.

<img width="748" height="69" alt="14" src="https://github.com/user-attachments/assets/5b610dec-7bde-4cf6-8aeb-5d699675c5b5" />


---

#### Screenshot 15 — Frontend-to-Database Isolation

Add a screenshot of the terminal showing that the `frontend` container cannot reach `db` on port `27017`.

The output must include:

```text
Expected result: frontend cannot reach db
```

<img width="745" height="84" alt="15" src="https://github.com/user-attachments/assets/29b08c5b-9cf1-4d9e-a3cb-6479311d4b63" />


---

#### Screenshot 16 — Public Frontend Access

Add a browser screenshot showing the Nginx Welcome Page from the `frontend` container at:

```text
http://16.171.171.231/
```

Ensure that the VM public IP is visible in the address bar. Add your full name as a clear caption directly below the screenshot.

<img width="924" height="492" alt="16" src="https://github.com/user-attachments/assets/c912b52d-342d-4bd6-9944-ba601c4b5239" />


---

# Task 4 — Deploy an Application Using Docker Host Network Mode

## Goal

Run an Nginx container using Docker host network mode and compare it with bridge networking.

### Evidence

#### Screenshot 17 — Running Host-Networked Container

Add a screenshot of the terminal showing:

```bash
docker ps
```

The output must show the running `fastapp` container.

<img width="990" height="109" alt="17" src="https://github.com/user-attachments/assets/ba1de29b-046f-4ffa-a838-1497a7fd40d3" />


---

#### Screenshot 18 — Host Network Mode Verification

Add a screenshot of the terminal showing output from:

```bash
docker inspect fastapp | grep '"NetworkMode"'
```

The output must confirm:

```text
"NetworkMode": "host"
```

<img width="987" height="63" alt="18" src="https://github.com/user-attachments/assets/209e7ad0-795b-4779-93e1-ca5f63100a2d" />


---

#### Screenshot 19 — Host-Networked Nginx Page

Add a browser screenshot showing the Nginx Welcome Page at:

```text
http://16.171.171.231
```

Ensure that the VM public IP is visible in the address bar. Add your full name as a clear caption directly below the screenshot.

<img width="986" height="634" alt="19" src="https://github.com/user-attachments/assets/28c3ca93-637a-446b-acc0-4fc690291829" />


---

#### Screenshot 20 — Host-Networked Container Cleanup

Add a screenshot of the terminal showing successful completion of:

```bash
docker stop fastapp
docker rm fastapp
```

<img width="989" height="96" alt="20" src="https://github.com/user-attachments/assets/8bafe932-505b-4121-b79b-572c8f011abd" />

---

# Networking Notes

Write a short note explaining:

- Default bridge networking
- Container-name communication on a custom bridge network
- Why the frontend could not access the database in Task 3
- The difference between bridge mode and host network mode

# Docker Networking: What I Did, What I Tested, and What Finally Made Sense

**Name:** Aziz Olaide Kafayat  
**Programme:** DevOps Micro Internship (DMI), Cohort 3  
**Week:** 11 — Assignment 03

## Introduction

Before this assignment, it was easy to think of Docker networking as simply making containers communicate. This practical took that idea further. I had to understand *which* containers could communicate, *how* they found one another, and *why* some connections should work while others should fail.

I worked through four areas: the default bridge network, custom bridge networking, multi-tier network isolation, and host networking.

## 1. Default bridge networking

I started by checking Docker's available networks, pulling the Nginx image, and running a web server named `myweb`.

```bash
docker network ls
docker pull nginx:alpine
docker run -d -p 80:80 --name myweb nginx:alpine
docker ps
```

The important part was `-p 80:80`. It publishes port 80 inside the container on port 80 of the host, allowing a browser to reach the Nginx page through the host.

**What I learned:** A running container is not automatically accessible from a browser. Port publishing creates the host-to-container access path.

## 2. Custom bridge networking

Next, I created a custom bridge network called `mynetwork` and connected two containers, `web` and `client`, to it.

```bash
docker network create mynetwork
```

I tested communication from the client container to the web container:

```bash
docker exec client wget -qO- http://web
```

Using `web` as the destination demonstrated Docker's service-name resolution on a user-defined bridge network.

**What I learned:** Containers on a user-defined bridge network can communicate using container names, rather than requiring me to hard-code container IP addresses.

## 3. Multi-tier networking and isolation

This was the part that connected networking to security for me.

I worked with three services:

- **Frontend:** The user-facing application.
- **Backend:** The service that handles application logic.
- **Database:** The service that stores application data.

The network design used two custom networks:

- `frontend-network` connected the frontend and backend.
- `backend-network` connected the backend and database.

The backend belonged to both networks, while the frontend and database did not share a direct network.

The intended communication rules were:

| Connection | Expected result |
|---|---|
| Frontend → Backend | Allowed |
| Backend → Database on port 27017 | Allowed |
| Frontend → Database | Blocked |

I verified these paths with container-level connectivity tests and network inspection.

**What I learned:** Network membership can help enforce boundaries between application layers. The frontend does not need direct database access simply because both services are part of the same application.

Network isolation is useful, but it should be combined with authentication, firewall rules where appropriate, and other security controls. Being on a private Docker network does not replace database access controls.

## 4. Host networking on AWS EC2

For the final task, I used an Ubuntu instance on AWS EC2 to run Nginx with Docker's host network mode.

```bash
docker run -d --network host --name fastapp nginx:alpine
docker inspect fastapp
```

I checked the container's network configuration and verified that the reported network mode was `host`. I then completed the required cleanup:

```bash
docker stop fastapp
docker rm fastapp
```

Unlike bridge networking, host networking shares the host's network namespace. On Linux, this means the application uses the host's networking directly, rather than relying on Docker's usual bridge-and-port-publishing arrangement.

**What I learned:** Host networking behaves differently from bridge networking. Testing it on a native Linux host also helped me appreciate why results on macOS with Docker Desktop can differ from results on an Ubuntu EC2 instance.

## Key takeaways

1. **Port publishing controls access from outside the container.** The `-p` flag maps a host port to a container port.
2. **Custom bridge networks support name-based communication.** This makes container-to-container communication easier to manage.
3. **Network design affects security.** Separating application layers can reduce unnecessary direct access.
4. **Network inspection matters.** Commands such as `docker network inspect` and `docker inspect` help verify the actual configuration instead of relying on assumptions.
5. **The environment matters.** Docker Desktop on macOS and Docker running natively on Linux do not behave identically in every networking scenario.

## Final reflection

The biggest lesson from this assignment was that getting a container to run is only one part of the job. I also need to understand how it communicates, what it can reach, what should remain inaccessible, and how to prove that the configuration behaves as intended.

That is the difference between simply running containers and beginning to understand how to operate them properly.


---

# LinkedIn Requirement

## Goal

Create a LinkedIn post about the Docker networking modes explored, one key lesson about container isolation, and the learning outcomes from this assignment.

### Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/e--dP3xA

---

#### LinkedIn Post Screenshot

<img width="550" height="946" alt="LINKEDINPOST" src="https://github.com/user-attachments/assets/6e79441d-94d1-433f-9542-e6a6d68a56cc" />


---

# Submission Instructions

- Complete all tasks in sequence.
- Include Screenshots 1–20 exactly as specified.
- Include the Networking Notes section.
- Include the LinkedIn post URL and screenshot.
- Ensure that your full name is visible in all terminal screenshots.
- Add your full name as a caption below each browser screenshot that shows the standard Nginx page.
- Do not expose private keys, passwords, access keys, tokens, account IDs, or other sensitive information.

---

# Completion Checklist

- [ ] Completed on a Linux VM or EC2 instance
- [ ] Docker Engine is running
- [ ] HTTP port 80 is allowed in the VM firewall or cloud security rules
- [ ] Default bridge networking verified
- [ ] Custom bridge network created
- [ ] Container-name communication verified
- [ ] `frontend-network` and `backend-network` created
- [ ] Frontend-to-backend communication verified
- [ ] Backend-to-database communication verified
- [ ] Frontend-to-database isolation verified
- [ ] Only the frontend published port 80 in Task 3
- [ ] Host network mode verified
- [ ] All required screenshots included
- [ ] Networking Notes completed
- [ ] LinkedIn post URL and screenshot included
- [ ] Full name visible in terminal screenshots
- [ ] Browser screenshots include full-name captions
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
