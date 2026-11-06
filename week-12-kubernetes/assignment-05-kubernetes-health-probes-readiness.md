# Assignment 5 — Kubernetes Health Probes (Readiness)

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will configure and test a Kubernetes readiness probe. You will create a baseline NGINX Deployment, add an HTTP readiness probe, intentionally break it, observe a stalled rollout, and restore the working configuration.

You will also demonstrate how readiness probes protect rolling updates.

---

# Task 0 — Prepare the Lab Environment

## Goal

Confirm that you are connected to your learning cluster and remove the previous assignment’s HPA and NGINX Deployment before starting this lab.

No screenshot or written notes are required for this pre-check.

---

# Task 1 — Set Up Your Lab Directory

## Goal

Create and enter a dedicated directory for the readiness-probe lab.

### Evidence

#### Screenshot 1 — Terminal showing that you are working inside `~/k8s-labs/health-probes-readiness`

<img width="861" height="109" alt="1" src="https://github.com/user-attachments/assets/2a9719f3-db29-4d3b-b72b-41b9547227e5" />


---

### Notes

**1. What is the purpose of a readiness probe?**

A readiness probe checks whether a container is ready to accept traffic. Kubernetes uses the result to determine whether a Pod should receive application requests.

**2. Why is a Pod being Running not always enough to confirm it can serve traffic?**

Running only indicates that the container has started. The application may still be initializing or experiencing problems that prevent it from serving requests. A readiness probe checks whether it is actually ready to receive traffic.

---

# Task 2 — Create a Baseline Deployment Without Probes

## Goal

Create a baseline NGINX Deployment with two replicas and no readiness probe.

### Evidence

#### Screenshot 2 — Completed `00-nginx-deploy-baseline.yaml` manifest

<img width="861" height="419" alt="2" src="https://github.com/user-attachments/assets/e73e53d1-805a-4aa0-88b0-515c835ff4fc" />


---

#### Screenshot 3 — Output showing a successful rollout and two running NGINX Pods

<img width="887" height="195" alt="3" src="https://github.com/user-attachments/assets/76a9abb6-1ce7-4b62-a63b-3c9cf496685d" />


---

#### Screenshot 4 — Relevant output from `kubectl describe deployment nginx-deployment`

<img width="877" height="540" alt="4" src="https://github.com/user-attachments/assets/a1f9a96e-c14a-402b-b2f1-d5400074f8cf" />

---

### Notes

**1. How many replicas does this Deployment maintain?**

The Deployment maintains two replicas of the NGINX application.

**2. What does `maxUnavailable: 0` mean during a rolling update?**

It means Kubernetes must not reduce the number of available replicas below the desired number during a rolling update. It waits for a replacement Pod to become available before removing an existing healthy Pod.

**3. Is a readiness probe configured in this baseline Deployment?**

No. The baseline Deployment does not have a readiness probe configured. It uses the default Kubernetes readiness behaviour.

---

# Task 3 — Add a Readiness Probe

## Goal

Add an HTTP readiness probe so Kubernetes checks whether each NGINX container is ready to accept requests.

### Evidence

#### Screenshot 5 — Completed `01-nginx-deploy-readiness.yaml` manifest showing the readiness probe

<img width="879" height="555" alt="5" src="https://github.com/user-attachments/assets/ac6a3b02-af46-42b5-8a14-3ca5271288ae" />


---

#### Screenshot 6 — Output of the successful rollout and ready Pods

<img width="860" height="85" alt="6" src="https://github.com/user-attachments/assets/a4527bde-a09b-4b9a-bd70-c29858304c01" />


---

#### Screenshot 7 — Pod description showing readiness conditions and readiness probe details

<img width="867" height="1057" alt="7" src="https://github.com/user-attachments/assets/fdfec6e7-5dd4-4828-8a86-8ce50cb8a026" />

<img width="864" height="716" alt="7 1" src="https://github.com/user-attachments/assets/265be382-34ee-48ca-ad57-e6d5d1976a3f" />



---

### Notes

**1. What path and port does the readiness probe check?**

It checks the HTTP path / on port 80 of the NGINX container.

**2. What does `initialDelaySeconds: 2` do?**

It tells Kubernetes to wait two seconds after the container starts before performing the first readiness probe.

**3. What does `periodSeconds: 5` do?**

It tells Kubernetes to perform the readiness check every five seconds.

**4. What must happen before Kubernetes considers this Pod ready?**

The HTTP readiness probe must successfully receive a response from the configured endpoint. Once the check succeeds, Kubernetes can mark the Pod as Ready and include it among the available backends for traffic.

---

# Task 4 — Break and Restore Readiness

## Goal

Intentionally fail the readiness probe, observe the NotReady behavior, and then restore the working probe configuration.

### Evidence

#### Screenshot 8 — `02-nginx-readiness-broken.yaml` showing `/does-not-exist`

<img width="855" height="549" alt="8" src="https://github.com/user-attachments/assets/b2d2c2a4-d87b-47c4-9385-aa1b00957357" />


---

#### Screenshot 9 — Output showing the rollout timeout or incomplete rollout

<img width="862" height="113" alt="9" src="https://github.com/user-attachments/assets/fc951b6b-221d-4624-a4e8-418e79af1fea" />


---

#### Screenshot 10 — Pod details showing `Ready: False` or readiness-probe failure events

<img width="853" height="911" alt="10" src="https://github.com/user-attachments/assets/be4d89d9-5367-4c9c-b2aa-0d382697471c" />


---

#### Screenshot 11 — Output showing successful rollout and ready Pods after the fix

<img width="857" height="161" alt="11" src="https://github.com/user-attachments/assets/66dfd34e-8cea-4c08-825d-d8b6c305a34d" />


---

### Notes

**1. Why did the readiness probe fail?**

The readiness probe failed because its HTTP path was changed from / to /does-not-exist. NGINX returned HTTP 404 Not Found because the requested resource did not exist.

**2. What happened to the Pod readiness status?**

The affected new Pod remained in the Running state but its readiness status became 0/1. Kubernetes marked it as NotReady because it failed the readiness checks.

**3. Why did the rollout fail to complete?**

The rollout could not complete because the new Pod failed its readiness probe and never became Ready. With maxUnavailable: 0, Kubernetes could not remove the existing healthy Pods while waiting for a ready replacement.

**4. How did you restore the Deployment successfully?**

I reapplied the working readiness configuration using the correct HTTP path /. Kubernetes then detected that the Pods were ready and successfully completed the rollout.

---

# Task 5 — See How Readiness Protects Rolling Updates

## Goal

Observe how readiness prevents a bad new Pod from replacing healthy Pods during a rolling update.

### Evidence

#### Screenshot 12 — Successful update command and rollout status

<img width="860" height="190" alt="12" src="https://github.com/user-attachments/assets/4b91c122-9053-4419-ab7a-4f0da7c43ba5" />


---

#### Screenshot 13 — ReplicaSets and Pods after the successful rolling update

<img width="862" height="236" alt="13" src="https://github.com/user-attachments/assets/68822f95-0472-4a73-855c-b8528a0dd68d" />


---

#### Screenshot 14 — Completed `04-readiness-broken-patch.yaml`

<img width="860" height="247" alt="14" src="https://github.com/user-attachments/assets/5f9663bb-8b1d-4863-b219-dfa0c1ad36ad" />


---

#### Screenshot 15 — Output showing the expected stalled rollout or timeout

<img width="858" height="132" alt="15" src="https://github.com/user-attachments/assets/4e465aea-a427-4776-95bd-2c2b817fd39b" />


---

#### Screenshot 16 — Deployment or Pod output showing the effect of the broken readiness probe

<img width="868" height="194" alt="16" src="https://github.com/user-attachments/assets/a4a3e22f-a632-419d-b88b-2a7f1c437c63" />


---

#### Screenshot 17 — Successful rollout status after restoring the fixed configuration

<img width="858" height="388" alt="17" src="https://github.com/user-attachments/assets/a85256e4-7f21-4bba-9aa5-9ca681053e8a" />


---

### Notes

**1. What happened during the successful rolling update?**

I updated the NGINX image from nginx:1.21.1 to nginx:1.23.1. Kubernetes created a new ReplicaSet, started replacement Pods and waited for them to become Ready before scaling down the old ReplicaSet. The rollout completed successfully with two ready Pods.

**2. Why did Kubernetes create a new ReplicaSet?**

Kubernetes created a new ReplicaSet because changing the Deployment's Pod template, including the container image or readiness probe configuration, creates a new revision. The ReplicaSet manages the Pods belonging to that revision.

**3. Why were the new Pods unable to replace the existing healthy Pods after readiness was broken?**

The new Pods failed their readiness checks because the probe requested /does-not-exist, which returned HTTP 404. They remained Running but NotReady, so Kubernetes did not consider them suitable replacements for the existing healthy Pods.

**4. How does `maxUnavailable: 0` protect availability during this rollout?**

It prevents Kubernetes from making existing available replicas unavailable while waiting for replacement Pods to become Ready. This keeps the healthy Pods available to serve traffic even when the new Pods fail their readiness checks.

---

# Task 6 — Share Your Readiness-Probe Learning on LinkedIn

## Goal

Share what you learned about Kubernetes readiness probes and how they protect rolling updates.

### Evidence

#### Screenshot 18 — Published LinkedIn post

<img width="475" height="848" alt="linkedin post " src="https://github.com/user-attachments/assets/c2f5ced3-c96c-402a-adcd-087dfef323b7" />

#### Linkedin post link

https://lnkd.in/p/eFhUqwAR

---

# Submission Instructions

- Add all required screenshots numbered 1–18.
- Ensure your full name is visible in required screenshots.
- Use clear, readable screenshots showing the relevant manifest or output.
- Include the completed baseline and readiness-probe manifests in your repository.
- Answer all Notes questions for Tasks 1–5 in your own words.
- Include evidence of the intentional readiness failure and successful recovery.
- Do not expose tokens, passwords, kubeconfig files, account IDs, or other sensitive information.

---

# Completion Checklist

- [ ] Learning cluster confirmed and previous assignment resources removed where applicable
- [ ] Readiness-probe lab directory created (Screenshot 1)
- [ ] Baseline Deployment created successfully (Screenshot 2)
- [ ] Two baseline Pods running and successful rollout verified (Screenshot 3)
- [ ] Baseline Deployment details reviewed (Screenshot 4)
- [ ] Readiness probe added successfully (Screenshot 5)
- [ ] Successful readiness rollout verified (Screenshot 6)
- [ ] Pod readiness conditions and probe details inspected (Screenshot 7)
- [ ] Broken readiness configuration created (Screenshot 8)
- [ ] Stalled rollout or timeout observed (Screenshot 9)
- [ ] NotReady status or readiness-probe failure events captured (Screenshot 10)
- [ ] Working readiness configuration restored (Screenshot 11)
- [ ] Successful image update completed (Screenshot 12)
- [ ] ReplicaSets and Pods inspected after the update (Screenshot 13)
- [ ] Broken-readiness patch created (Screenshot 14)
- [ ] Stalled rollout observed after the patch (Screenshot 15)
- [ ] Effect of broken readiness captured (Screenshot 16)
- [ ] Final recovery completed (Screenshot 17)
- [ ] LinkedIn post published (Screenshot 18)
- [ ] Notes for Tasks 1–5 completed
- [ ] Required manifests included
- [ ] All screenshots are clear and readable
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
