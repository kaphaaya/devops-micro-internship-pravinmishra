# Assignment 8 — Kubernetes Services (NodePort)

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

Create a healthy NGINX Deployment, expose it through a NodePort Service, test access using a node IP and NodePort, and observe how the Service behaves when a backend Pod is replaced.

---

# Task 1 — Set Up Your Lab Directory

## Goal

Create and enter a dedicated directory for the NodePort Service lab.

### Evidence

#### Screenshot 1 — Terminal showing that you are working inside `~/k8s-labs/services/nodeport`

<img width="835" height="116" alt="1" src="https://github.com/user-attachments/assets/d5c3469b-6014-411e-8a60-29cd8198de27" />


### Notes

**1. What is the difference between ClusterIP and NodePort?**

ClusterIP exposes a Service internally within the Kubernetes cluster, making it accessible only to workloads inside the cluster by default. NodePort exposes the Service through a port on each cluster node, allowing access through the node's IP address and assigned port.

**2. What does a NodePort Service allow users to do?**

It allows users to access an application from outside the Kubernetes cluster using the node's IP address and the assigned NodePort, provided the network allows access.

---

# Task 2 — Create a Healthy NGINX Deployment

## Goal

Create a healthy NGINX Deployment that can act as the backend for the NodePort Service.

### Evidence

#### Screenshot 2 — Completed `00-nginx-deploy.yaml` manifest

<img width="842" height="743" alt="2" src="https://github.com/user-attachments/assets/5f42c9d8-bd3d-4288-8f92-50d8fe6d7c97" />


---

#### Screenshot 3 — Output showing successful rollout and two ready NGINX Pods

<img width="837" height="223" alt="3" src="https://github.com/user-attachments/assets/61f2fe85-3e3b-476c-884b-77941e7b5816" />

### Notes

**1. Which label will the NodePort Service use to find the NGINX Pods?**

app: nginx

**2. Why must the Pods be ready before they can receive Service traffic?**

A Pod must pass its readiness probe before it is considered ready to receive traffic. This prevents Kubernetes from sending requests to Pods that are not yet prepared to serve the application.
**3. What port does the NGINX container listen on?**

Port 80 (HTTP).

---

# Task 3 — Create the NodePort Service

## Goal

Create a NodePort Service that exposes the NGINX application through a port on every cluster node.

### Evidence

#### Screenshot 4 — Completed `01-nginx-svc-nodeport.yaml` manifest

<img width="842" height="245" alt="4" src="https://github.com/user-attachments/assets/c1129664-9814-4219-88e7-724550bd39e1" />


---

#### Screenshot 5 — Output showing the NodePort Service and its endpoints or EndpointSlices

<img width="842" height="74" alt="5" src="https://github.com/user-attachments/assets/8da1bf4f-0ee1-478c-991d-871ea9c5d054" />

### Notes

**1. What is the purpose of `type: NodePort`?**

It exposes the Service on a port on every cluster node, allowing clients to access the application through a node IP address and the assigned NodePort.

**2. What is the difference between `port`, `targetPort`, and `nodePort`?**

port: The port exposed by the Kubernetes Service.

targetPort: The port on the backend Pod where application traffic is forwarded.

nodePort: The port opened on the cluster nodes for external access.

**3. What NodePort was assigned or selected in your environment?**

30323

**4. Why do Service endpoints need ready Pods?**

Ready Pods are healthy and prepared to handle application requests. Kubernetes uses ready endpoints to ensure that Service traffic is directed to Pods capable of serving requests.

---

# Task 4 — Find a Node IP and Test the NodePort

## Goal

Find a reachable node IP and access the NodePort Service.

### Evidence

#### Screenshot 6 — Output of `kubectl get nodes -o wide`

<img width="842" height="76" alt="6" src="https://github.com/user-attachments/assets/420951e0-3f27-4cd2-9176-80bbfca9784a" />


---

#### Screenshot 7 — Output showing the `tester` Pod running
<img width="840" height="101" alt="7" src="https://github.com/user-attachments/assets/917a05e9-5faf-4800-8ca1-fe554897cfe0" />


---

#### Screenshot 8 — Successful NodePort response from the laptop or the `tester` Pod

If neither route is supported by your environment, include the failed request output and ready endpoint evidence, and explain the limitation in your Notes.

<img width="839" height="204" alt="8" src="https://github.com/user-attachments/assets/40d35484-ccb4-4083-9250-40678925e2eb" />

### Notes

**1. Which node IP and NodePort did you test?**

Node IP: 172.26.0.2

NodePort: 30323

URL tested: http://172.26.0.2:30323

**2. Was your laptop able to reach the NodePort directly? Explain your result.**

No. The direct request from my Mac terminal timed out after five seconds. This happened because my Kind cluster runs its Kubernetes node inside a Docker container on a private network. The node's internal IP was not directly reachable from my Mac.

However, I successfully accessed the NGINX application using a BusyBox tester Pod inside the cluster. The request returned the NGINX welcome page, confirming that the NodePort Service was working correctly.

**3. Why can external NodePort access behave differently in Minikube, kind, Docker Desktop, and cloud clusters?**

These environments use different networking configurations.

Kind runs Kubernetes nodes inside Docker containers, so their internal IP addresses may not be directly reachable from the host machine. Minikube uses different drivers and networking configurations, while Docker Desktop manages Kubernetes networking through its own virtualised environment. Cloud clusters use network interfaces, routing rules, firewalls, and security groups that determine external access.

Therefore, NodePort connectivity depends not only on Kubernetes configuration but also on the underlying network environment.

---

# Task 5 — Optional: Test the Label-Selector Contract

## Goal

Break the Service selector, observe that usable endpoints disappear, and restore the correct selector.

Complete the Evidence and Notes below only if you attempted this optional task.

### Evidence

#### Screenshot 9 — `02-nginx-svc-selector-broken.yaml` showing the incorrect selector

<img width="839" height="72" alt="9" src="https://github.com/user-attachments/assets/4e3d601d-c065-4bfc-bbe8-55502ac9a1db" />


---

#### Screenshot 10 — Empty endpoints or EndpointSlice output after applying the broken selector

<img width="841" height="57" alt="10" src="https://github.com/user-attachments/assets/3c3fabe7-39d7-4bb7-8b9e-ee004e3a5b02" />


---

#### Screenshot 11 — Restored endpoints or EndpointSlices after applying the original Service manifest

<img width="840" height="117" alt="11" src="https://github.com/user-attachments/assets/a18e95a0-128e-40b7-9cdd-c2ebeb34e525" />


### Notes

**1. Why did the Service endpoints become empty?**

The endpoints became empty because I changed the Service selector from app: nginx to app: does-not-match. The NGINX Pods still had the label app: nginx, so the Service could no longer identify matching backend Pods. Consequently, the EndpointSlice contained no usable endpoints.

**2. Why is NodePort only useful when matching ready Pods exist?**

NodePort provides an access point on the cluster nodes, but the Service still needs matching, ready backend Pods to receive and process requests. Without available endpoints, traffic cannot reach the application even though the NodePort remains configured.

**3. How did you restore the backend connectivity?**

I restored the original Service configuration by running:

kubectl apply -f 01-nginx-svc-nodeport.yaml

This restored the selector to app: nginx. Kubernetes then updated the EndpointSlice with the NGINX Pod IP addresses. I confirmed recovery by sending another request from the tester Pod, which successfully returned the NGINX welcome page.

---

# Task 6 — Observe Resilience During Pod Churn

## Goal

Delete one NGINX Pod and observe its replacement while the Service continues routing traffic to available Pods.

### Evidence

#### Screenshot 12 — Output of the Pod deletion command

<img width="838" height="137" alt="12" src="https://github.com/user-attachments/assets/dfeb88b3-93c3-4e77-9511-e4d4de1df9b0" />


---

#### Screenshot 13 — Output showing the replacement Pod and two running, ready Pods

Add your screenshot here.

### Notes

**1. What happened after you deleted one Pod?**

After deleting one NGINX Pod, the remaining Pod continued running while Kubernetes created a replacement. The replacement Pod eventually reached 1/1 Running, restoring the Deployment to its desired state of two healthy replicas.

The continuous traffic test was running during the replacement process, and the requests were returning OK before and after the replacement.

**2. Which Kubernetes resource created the replacement Pod?**

The ReplicaSet managed by the NGINX Deployment created the replacement Pod. It detected that the number of available Pods had fallen below the desired replica count of two and created another Pod to maintain that count.

**3. Why can the NodePort Service continue working during Pod churn?**

The NodePort Service provides a stable access point and forwards traffic to available, ready backend Pods. When one Pod is deleted, the remaining healthy Pod can continue receiving traffic. Kubernetes then creates a replacement and updates the EndpointSlice once the new Pod passes its readiness probe.

This allows clients to continue using the same NodePort without needing to know or update individual Pod IP addresses.

---

# Task 7 — Share Your NodePort Learning on LinkedIn

## Goal

Share what you learned about NodePort Services, backend Pods, and network access in your Kubernetes environment.

### Evidence

#### Screenshot 14 — Published LinkedIn post about your NodePort Service lab

<img width="389" height="814" alt="linkedin post" src="https://github.com/user-attachments/assets/697fed4d-bbfd-4b42-b68a-c0d271110e4a" />

#### Linkedin post link

https://lnkd.in/p/etfGF5At

---

# Submission Instructions

- Include the completed YAML manifests created during the lab.
- Add all required screenshots: Screenshots 1–8 and 12–14.
- Include Screenshots 9–11 only if you attempted optional Task 5.
- Complete the Notes for Tasks 1–4 and Task 6.
- Complete Task 5 Notes only if you attempted that task.
- Use clear, readable screenshots showing the relevant commands and outputs.
- Ensure your full name is visible in the required screenshots.
- If NodePort access is restricted by your environment, include the failed request output, ready endpoint evidence, and an explanation.
- Do not expose passwords, access tokens, private keys, kubeconfig contents, or account IDs.

---

# Completion Checklist

- [ ] Created and entered `~/k8s-labs/services/nodeport` (Screenshot 1)
- [ ] Created and applied the NGINX Deployment manifest (Screenshot 2)
- [ ] Confirmed successful rollout and two ready NGINX Pods (Screenshot 3)
- [ ] Created the NodePort Service manifest (Screenshot 4)
- [ ] Verified the Service and its endpoints or EndpointSlices (Screenshot 5)
- [ ] Recorded the assigned or selected NodePort
- [ ] Identified a node IP (Screenshot 6)
- [ ] Confirmed that the `tester` Pod is running (Screenshot 7)
- [ ] Tested NodePort access, or documented the environment limitation with evidence (Screenshot 8)
- [ ] Optional: Tested and restored the Service selector (Screenshots 9–11)
- [ ] Deleted one NGINX Pod (Screenshot 12)
- [ ] Confirmed the replacement Pod and two running, ready Pods (Screenshot 13)
- [ ] Completed all required Notes
- [ ] Published the LinkedIn post (Screenshot 14)
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
