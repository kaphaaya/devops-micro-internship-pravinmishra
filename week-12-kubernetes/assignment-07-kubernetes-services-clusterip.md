# Assignment 7 — Kubernetes Services (ClusterIP)

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will create and test a Kubernetes ClusterIP Service. You will connect it to a healthy NGINX Deployment, access it using DNS and its ClusterIP, break and restore its selector, and observe how readiness affects Service routing.

---

# Task 0 — Prepare the Lab Environment

## Goal

Confirm your learning-cluster context and remove previous lab resources where applicable before starting this assignment.

No screenshot or written notes are required for this pre-check.

---

# Task 1 — Set Up Your Lab Directory

## Goal

Create and enter a dedicated directory for the ClusterIP Service lab.

### Evidence

#### Screenshot 1 — Terminal showing that you are working inside `~/k8s-labs/services/clusterip`

<img width="857" height="222" alt="1" src="https://github.com/user-attachments/assets/122a4752-e615-4155-b734-a5b10d80b25f" />


---

### Notes

**1. Why is it not reliable to communicate with an application using a Pod IP address?**

Pod IP addresses are temporary and can change whenever a Pod is deleted, recreated or replaced. Therefore, applications should not rely on individual Pod IP addresses for communication.

**2. What Kubernetes resource provides a stable internal address for a group of Pods?**

A Kubernetes Service provides a stable internal IP address and DNS name for accessing a group of Pods.

---

# Task 2 — Create a Healthy NGINX Deployment

## Goal

Create an NGINX Deployment with labels, readiness probes, and liveness probes that can act as the backend for a Service.

### Evidence

#### Screenshot 2 — Completed `00-nginx-deploy.yaml` manifest

<img width="863" height="742" alt="2" src="https://github.com/user-attachments/assets/eb32676c-1f24-405c-83f3-b7b5f132c370" />


---

#### Screenshot 3 — Output showing successful rollout and two ready NGINX Pods

<img width="860" height="225" alt="3" src="https://github.com/user-attachments/assets/3e2bb0f3-8a2a-4261-af98-28b88833acf1" />


---

### Notes

**1. Which label will the Service use to find these Pods?**

The label used is app: nginx.

**2. Why is readiness important before connecting Pods to a Service?**

The readiness probe determines whether a Pod is ready to receive traffic. Kubernetes only sends normal Service traffic to Pods that pass their readiness checks.

**3. What port does the NGINX container listen on?**

NGINX listens on port 80.

---

# Task 3 — Create a ClusterIP Service

## Goal

Create a stable internal Service that routes traffic to the NGINX Pods.

### Evidence

#### Screenshot 4 — Completed `01-nginx-svc-clusterip.yaml` manifest

<img width="870" height="212" alt="4" src="https://github.com/user-attachments/assets/7357aaee-5c85-412b-8d26-9381c5fe9e58" />


---

#### Screenshot 5 — Output showing the ClusterIP Service, endpoints, or EndpointSlices

<img width="861" height="323" alt="5" src="https://github.com/user-attachments/assets/53db229a-0499-4c92-9777-143a07369429" />

---

### Notes

**1. What is the purpose of a ClusterIP Service?**

A ClusterIP Service provides a stable internal IP address and DNS name that allows applications within the Kubernetes cluster to communicate with a group of Pods.

**2. What is the difference between `port` and `targetPort`?**

port is the port exposed by the Service that clients use to access it.

targetPort is the port on the backend container where the application receives traffic.

**3. Why must the Service selector match the Pod labels?**

The Service selector must match the labels assigned to the Pods so Kubernetes can identify and connect the correct Pods as Service backends.

**4. What information do EndpointSlices contain?**

An EndpointSlice stores information about the backend endpoints associated with a Service, including their IP addresses, ports and readiness conditions.

---

# Task 4 — Access the Service from Inside the Cluster

## Goal

Create a client Pod and access the NGINX Service using DNS and its ClusterIP.

### Evidence

#### Screenshot 6 — Output showing the `tester` Pod running

<img width="856" height="136" alt="6" src="https://github.com/user-attachments/assets/26cbd872-7dae-4dc8-82d2-e8aa4d5f2f14" />


---

#### Screenshot 7 — Successful Service request using DNS name and ClusterIP

<img width="860" height="807" alt="7" src="https://github.com/user-attachments/assets/d3e63217-0a6e-46d1-89c7-35b12d4e0414" />

---

#### Screenshot 8 — Successful DNS lookup for the Service
<img width="866" height="210" alt="8" src="https://github.com/user-attachments/assets/2adaba8b-6dcc-4275-a129-16e6a8a15ae2" />


---

### Notes

**1. Why should an application use `nginx-svc` instead of a Pod IP address?**

Service DNS names provide stable access to applications even when individual Pods are replaced or their IP addresses change.

**2. What does the DNS name `nginx-svc.default.svc.cluster.local` represent?**

It is the fully qualified DNS name of the nginx-svc Service in the default namespace, using the cluster DNS domain cluster.local.

**3. Why can the client access the Service even if the backend Pod IPs change?**

Kubernetes automatically updates the Service's EndpointSlices when Pods are created, deleted or replaced. Applications can continue using the same Service IP address and DNS name without needing to know the new Pod IP addresses.

---

# Task 5 — Break and Restore the Label-Selector Contract

## Goal

Break the Service selector, observe that usable endpoints disappear, and then restore the correct selector.

### Evidence

#### Screenshot 9 — `02-nginx-svc-selector-broken.yaml` showing the incorrect selector

<img width="857" height="313" alt="9" src="https://github.com/user-attachments/assets/fb281418-fa72-4f88-ac49-ae4d8b55da6a" />

---

#### Screenshot 10 — Empty endpoints or EndpointSlice output after applying the broken selector
<img width="861" height="519" alt="10" src="https://github.com/user-attachments/assets/300c575e-2c10-4307-85a9-251c43feb4e1" />


---

#### Screenshot 11 — Failed request output from the `tester` Pod

<img width="852" height="86" alt="11" src="https://github.com/user-attachments/assets/fab6ea89-4ec1-4e02-b334-a9f30d0697cc" />

---

#### Screenshot 12 — Restored endpoints and successful Service request

<img width="857" height="552" alt="12" src="https://github.com/user-attachments/assets/5ed67408-dea9-4b16-8482-8df1e47244c7" />

---

### Notes

**1. Why did the Service endpoints become empty?**

The Service selector was changed from app: nginx to app: does-not-match. Since no Pods had the new label, Kubernetes could not find matching backend Pods, resulting in an empty endpoint list.

**2. What caused the request from the client Pod to fail?**

The Service still had its ClusterIP and DNS resolution continued to work, but it had no backend endpoints to forward traffic to. Therefore, the request failed.

**3. How did you restore connectivity to the NGINX Pods?**

The original Service manifest was reapplied, restoring the selector to app: nginx. Kubernetes then identified the matching Pods, repopulated the EndpointSlice and restored successful Service connectivity.

---

# Task 6 — Observe How Readiness Affects Service Routing

## Goal

Observe how a new Pod that fails readiness is excluded from ready Service backends while the existing healthy Pod continues serving traffic.

### Evidence

#### Screenshot 13 — Output showing the Deployment scaled to one ready Pod

<img width="856" height="547" alt="13" src="https://github.com/user-attachments/assets/1ff65fca-f9b3-4f6b-bd8f-8f826a06f731" />


---

#### Screenshot 14 — Completed `03-readiness-broken.yaml` patch file

<img width="857" height="169" alt="14" src="https://github.com/user-attachments/assets/a6866bec-1f47-423e-9102-f0a0c270e2dd" />

---

#### Screenshot 15 — Output showing the expected incomplete rollout or NotReady Pod

<img width="861" height="175" alt="15" src="https://github.com/user-attachments/assets/f103fdc8-8b96-4e5d-a8a1-10e573350f0f" />


---

#### Screenshot 16 — EndpointSlice output showing the healthy Pod with `ready: true` and the new NotReady Pod with `ready: false`

<img width="861" height="899" alt="16" src="https://github.com/user-attachments/assets/40bc7d4f-e3d8-480c-9ec0-e77a4a752a32" />


---

#### Screenshot 17 — Service EndpointSlice output showing ready backends after restoring the Deployment

<img width="858" height="223" alt="17" src="https://github.com/user-attachments/assets/23b180ee-3de2-46a1-80a2-3bc6259ffcae" />


---

### Notes

**1. Why was the new NotReady Pod excluded from ready Service backends?**

The new Pod failed its readiness probe because the configured HTTP path /does-not-exist did not return a successful response. Kubernetes therefore marked the Pod as NotReady and excluded it from normal Service traffic.

**2. What is the relationship between readiness probes and Service routing?**

A readiness probe determines whether a Pod is ready to receive application traffic. Kubernetes uses this readiness information to determine which Pods should receive traffic through a Service.

**3. Why does this behavior protect users from unhealthy application instances?**

Readiness checking prevents traffic from being sent to application instances that are still starting up or are not functioning correctly. It helps ensure that only healthy, ready Pods receive normal traffic while other healthy instances continue serving requests.
---

# Task 7 — Share Your ClusterIP Service Learning on LinkedIn

## Goal

Share what you learned about ClusterIP Services, Kubernetes DNS, selectors, and readiness-aware Service routing.

### Evidence

#### Screenshot 18 — Published LinkedIn post

<img width="473" height="739" alt="linkedin post" src="https://github.com/user-attachments/assets/566f10a4-623d-4430-bb2a-d6a798fd2c11" />

#### Linkedin post link

https://lnkd.in/p/eiy746jw

---

# Submission Instructions

- Add all required screenshots numbered 1–18.
- Ensure your full name is visible in required screenshots.
- Use clear, readable screenshots showing the relevant manifest or output.
- Include the completed NGINX Deployment and ClusterIP Service manifests in your repository.
- Answer all Notes questions for Tasks 1–6 in your own words.
- Include evidence of the intentional failures and successful recovery.
- Do not expose tokens, passwords, kubeconfig files, account IDs, or other sensitive information.

---

# Completion Checklist

- [ ] Learning-cluster context confirmed and previous lab resources removed where applicable
- [ ] ClusterIP lab directory created (Screenshot 1)
- [ ] Healthy NGINX Deployment manifest completed (Screenshot 2)
- [ ] Successful rollout and two ready NGINX Pods verified (Screenshot 3)
- [ ] ClusterIP Service manifest completed (Screenshot 4)
- [ ] Service and backend endpoints or EndpointSlices verified (Screenshot 5)
- [ ] Client Pod created and running (Screenshot 6)
- [ ] Service accessed using DNS name and ClusterIP (Screenshot 7)
- [ ] Service DNS resolution verified (Screenshot 8)
- [ ] Broken selector manifest created (Screenshot 9)
- [ ] Empty endpoints observed (Screenshot 10)
- [ ] Failed Service request captured (Screenshot 11)
- [ ] Original selector restored and connectivity verified (Screenshot 12)
- [ ] Deployment scaled to one ready Pod (Screenshot 13)
- [ ] Broken readiness patch created (Screenshot 14)
- [ ] Incomplete rollout or NotReady Pod observed (Screenshot 15)
- [ ] Readiness effect on Service backends verified (Screenshot 16)
- [ ] Deployment restored and ready Service backends verified (Screenshot 17)
- [ ] LinkedIn post published (Screenshot 18)
- [ ] Notes for Tasks 1–6 completed
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
