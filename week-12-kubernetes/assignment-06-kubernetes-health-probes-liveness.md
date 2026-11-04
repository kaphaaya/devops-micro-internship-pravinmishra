# Assignment 6 — Kubernetes Health Probes (Liveness)

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will configure and test a Kubernetes liveness probe. You will create a baseline NGINX Deployment, add an HTTP liveness probe, intentionally make it fail, observe container restarts, and restore the working configuration.

---

# Task 0 — Prepare the Lab Environment

## Goal

Confirm that you are connected to your learning cluster and remove the previous HPA and NGINX Deployment before starting this lab.

No screenshot or written notes are required for this pre-check.

---

# Task 1 — Set Up Your Lab Directory

## Goal

Create and enter a dedicated directory for the liveness-probe lab.

### Evidence

#### Screenshot 1 — Terminal showing that you are working inside `~/k8s-labs/health-probes-liveness`

<img width="689" height="163" alt="1" src="https://github.com/user-attachments/assets/59e865ee-b42c-4f6e-af15-81428571310b" />

---

### Notes

**1. What problem does a liveness probe solve?**

A liveness probe helps Kubernetes determine whether a container is still functioning properly. If the container becomes unresponsive or unhealthy and repeatedly fails its liveness checks, Kubernetes restarts it automatically to recover the application.

**2. What is the key difference between a readiness probe and a liveness probe?**

A readiness probe determines whether a Pod is ready to receive traffic. If it fails, Kubernetes removes the Pod from the available Service endpoints until it becomes ready again.

A liveness probe determines whether a container is healthy enough to continue running. If it repeatedly fails, Kubernetes restarts the container.

In simple terms:
- Readiness: Should this application receive traffic?
- Liveness: Should this container continue running or be restarted?

---

# Task 2 — Create a Baseline Deployment Without Probes

## Goal

Create a baseline NGINX Deployment with two replicas and no health probes.

### Evidence

#### Screenshot 2 — Completed `00-nginx-deploy-baseline.yaml` manifest

<img width="796" height="464" alt="2" src="https://github.com/user-attachments/assets/2a167401-657b-41ce-8186-b5c5968da4be" />

---

#### Screenshot 3 — Output showing a successful rollout and two running NGINX Pods

<img width="866" height="186" alt="3" src="https://github.com/user-attachments/assets/33694a49-5d09-45d2-a2d5-6048fe097fec" />


---

#### Screenshot 4 — Relevant output from `kubectl describe deployment nginx-deployment`

<img width="859" height="538" alt="4" src="https://github.com/user-attachments/assets/a79673f6-7d95-401f-9a7d-6ada77613869" />

---

### Notes

**1. How many replicas does this Deployment maintain?**

Two replicas were configured in the NGINX Deployment.

**2. Are any health probes configured in the baseline Deployment?**

No. The baseline Deployment did not have any readiness or liveness probes configured.

**3. Why is a baseline useful before adding a liveness probe?**

Establishing a baseline provides a working starting point for comparison. It allows us to observe how the Deployment behaves before introducing health checks and understand the impact of adding or breaking a liveness probe.

---

# Task 3 — Add a Liveness Probe

## Goal

Add an HTTP liveness probe so Kubernetes can periodically check whether the NGINX container is still responsive.

### Evidence

#### Screenshot 5 — Completed `01-nginx-deploy-liveness.yaml` manifest showing the liveness probe

<img width="851" height="551" alt="5" src="https://github.com/user-attachments/assets/3a022c54-2e82-4549-9b4e-b29b9e79567a" />


---

#### Screenshot 6 — Output showing successful rollout and running Pods
<img width="855" height="307" alt="6" src="https://github.com/user-attachments/assets/cde4bcb2-e31c-4801-9e91-9e8a27cdcc25" />

---

#### Screenshot 7 — Pod description showing liveness-probe details

<img width="861" height="881" alt="7" src="https://github.com/user-attachments/assets/a4c0375d-ad63-4a96-9bba-f69b810d73ee" />


---

### Notes

**1. What path and port does the liveness probe check?**

The liveness probe used the HTTP path / on port 80.

**2. What does `initialDelaySeconds: 10` do?**

It tells Kubernetes to wait 10 seconds after the container starts before performing the first liveness check.

**3. What does `failureThreshold: 3` mean?**

Kubernetes allows three consecutive probe failures before considering the container unhealthy and restarting it.

**4. Does a successful liveness probe control whether a Pod receives traffic? Explain briefly.**

No. A liveness probe does not control traffic routing. Its purpose is to detect unhealthy containers and trigger restarts. Readiness probes determine whether Pods should receive traffic.

---

# Task 4 — Trigger and Observe a Liveness Restart

## Goal

Intentionally make the liveness probe fail and observe Kubernetes restart the unhealthy container.

### Evidence

#### Screenshot 8 — `02-nginx-liveness-broken.yaml` showing `/does-not-exist`

<img width="860" height="566" alt="8" src="https://github.com/user-attachments/assets/8a8cba51-24d3-4444-9719-db96aeed7ef8" />


---

#### Screenshot 9 — Pod output showing an increased RESTARTS count

<img width="865" height="120" alt="9" src="https://github.com/user-attachments/assets/b1c29c2e-a786-4014-aab9-cc7b50f4fd0c" />

---

#### Screenshot 10 — Pod description showing liveness-probe failure events or restart details

<img width="858" height="223" alt="10" src="https://github.com/user-attachments/assets/4708687b-9f47-48e6-92dd-88ca27f5f5f4" />


---

#### Screenshot 11 — Output showing stable running Pods after applying the fixed configuration

<img width="862" height="133" alt="11" src="https://github.com/user-attachments/assets/596c223e-733a-430c-8bea-0ac997b0d05f" />


---

### Notes

**1. Why did the liveness probe fail?**

The NGINX server returned HTTP 404 because the requested endpoint did not exist. Since the HTTP probe expected a successful response, Kubernetes registered the check as a failure.

**2. What happened after Kubernetes detected repeated liveness-probe failures?**

After three consecutive failures, Kubernetes considers the container unhealthy and the kubelet restarts it. This allows Kubernetes to attempt automatic recovery without requiring manual intervention.
**3. What does the RESTARTS column prove?**

The RESTARTS column in the kubectl get pods output shows how many times a container has restarted. An increasing number during this exercise demonstrated that Kubernetes was restarting the container after repeated liveness probe failures.

**4. How did you restore the Deployment to a stable state?**

I reapplied the working configuration using:

kubectl apply -f 01-nginx-deploy-liveness.yaml

This restored the HTTP probe path from /does-not-exist to /. I then waited for the Deployment rollout to complete and verified that both NGINX Pods returned to a stable Running state with 1/1 readiness.
---

# Task 5 — Optional: Observe a Restart Loop

## Goal

Observe why overly aggressive or incorrectly configured liveness probes can create restart loops.

Complete this section only if you attempt Task 5. Otherwise, mark it as “Not attempted.”

**Task status:** Attempted

### Evidence

#### Optional Screenshot — Pod output showing the RESTARTS count increasing during the restart-loop observation

<img width="857" height="352" alt="optional task 1" src="https://github.com/user-attachments/assets/50963044-5d40-450c-808d-00e5775e065f" />

<img width="855" height="202" alt="optional task 2" src="https://github.com/user-attachments/assets/1844591c-5bfb-4048-aa9e-ee8ef9de1b26" />


No specific restart count or CrashLoopBackOff status is required.

---

### Notes — Answer Only If Attempted

**1. What is a restart loop?**

A restart loop occurs when a container repeatedly fails and Kubernetes continuously attempts to restart it. During this exercise, both NGINX Pods repeatedly failed their liveness checks because the probe targeted /does-not-exist, which returned HTTP 404. Both Pods entered CrashLoopBackOff, and their restart counts increased.

**2. Why can an aggressive liveness probe be harmful?**

An aggressive liveness probe can cause unnecessary container restarts, even when an application might otherwise be capable of running.

Our configuration used:
- initialDelaySeconds: 0
- periodSeconds: 2
- failureThreshold: 1
This meant Kubernetes started checking immediately, repeated checks every two seconds, and restarted a container after just one failed probe. Such configuration can cause repeated restarts, application downtime and instability.

**3. Why should liveness checks be lightweight and carefully tuned?**

Liveness checks should be lightweight because they run repeatedly and should not consume excessive CPU, memory, or other application resources. They should also be carefully tuned to avoid unnecessary restarts caused by temporary delays or minor performance issues. Poorly configured probes can cause healthy containers to restart repeatedly, resulting in application downtime and instability.

---

# Task 6 — Share Your Liveness-Probe Learning on LinkedIn

## Goal

Share what you learned about Kubernetes liveness probes, container restarts, and the difference between readiness and liveness.

### Evidence

#### Screenshot 12 — Published LinkedIn post

<img width="473" height="789" alt="linkedin post" src="https://github.com/user-attachments/assets/5377b149-d7f7-42c9-92a7-99e94f49bf37" />

#### Linkedin post URL

https://lnkd.in/p/epAfvED9

---

# Submission Instructions

- Add all required screenshots numbered 1–12.
- Include the optional Task 5 screenshot only if you attempt that task.
- Ensure your full name is visible in required screenshots.
- Use clear, readable screenshots showing the relevant manifest or output.
- Include the completed baseline and liveness-probe manifests in your repository.
- Answer all Notes questions for Tasks 1–4 in your own words.
- If you attempt Task 5, complete its Notes and restore the working configuration afterward.
- Do not expose tokens, passwords, kubeconfig files, account IDs, or other sensitive information.

---

# Completion Checklist

- [ ] Learning cluster confirmed and previous assignment resources removed where applicable
- [ ] Liveness-probe lab directory created (Screenshot 1)
- [ ] Baseline Deployment manifest completed (Screenshot 2)
- [ ] Successful rollout and two baseline Pods verified (Screenshot 3)
- [ ] Baseline Deployment details reviewed (Screenshot 4)
- [ ] Liveness probe added successfully (Screenshot 5)
- [ ] Successful liveness-probe rollout verified (Screenshot 6)
- [ ] Liveness-probe details inspected (Screenshot 7)
- [ ] Broken liveness configuration created (Screenshot 8)
- [ ] Increased container restart count observed (Screenshot 9)
- [ ] Liveness-probe failure events or restart details captured (Screenshot 10)
- [ ] Working liveness configuration restored and stable Pods verified (Screenshot 11)
- [ ] Optional Task 5 evidence and Notes completed, if attempted
- [ ] Working configuration restored after Task 5, if attempted
- [ ] LinkedIn post published (Screenshot 12)
- [ ] Notes for Tasks 1–4 completed
- [ ] Required manifests included
- [ ] All required screenshots are clear and readable
- [ ] No sensitive data exposed

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
