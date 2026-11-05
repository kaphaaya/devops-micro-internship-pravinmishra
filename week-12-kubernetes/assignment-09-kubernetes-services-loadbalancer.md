# Assignment 09 — Kubernetes Services: LoadBalancer on AKS

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

Deploy a healthy NGINX application to Azure Kubernetes Service (AKS), expose it publicly using a LoadBalancer Service, observe readiness behavior, and scale the application behind the same public endpoint.

---

# Task 1 — Create or Connect to an AKS Cluster

## Goal

Create a small AKS cluster for this lab, or connect to an existing approved AKS lab cluster.

### Evidence

#### Screenshot 1 — Output of `kubectl get nodes` showing ready AKS node(s)

<img width="792" height="98" alt="1" src="https://github.com/user-attachments/assets/84ad09c8-2c03-47b3-9969-91f5757e818f" />

### Notes

**1. Why does this lab use a cloud-capable Kubernetes environment such as AKS for the LoadBalancer Service?**

A cloud-capable Kubernetes environment integrates Kubernetes with a cloud provider's infrastructure. When a Service is configured with type: LoadBalancer, Kubernetes can request an external load balancer from the cloud provider.

In our lab, Amazon EKS integrated with AWS to provision an Elastic Load Balancing resource and expose the NGINX application publicly. A local Kind cluster does not automatically provide this cloud integration.

**2. What Azure resources can Kubernetes provision when a LoadBalancer Service is created?**

On AWS EKS, creating a LoadBalancer Service can trigger AWS to provision:
- An Elastic Load Balancer.
- A public DNS hostname.
- A listener to accept incoming traffic.
- Target registration and health checks.
- Supporting network configuration and security rules.

**3. Why is it important to delete unused AKS resources after the lab?**

Cloud resources can continue generating charges even when they are no longer being used. Deleting unused resources prevents unnecessary costs, avoids leaving exposed infrastructure running and keeps the cloud account organised.
---

# Task 2 — Set Up Your Lab Directory

## Goal

Create and enter a dedicated directory for the LoadBalancer Service manifests.

### Evidence

#### Screenshot 2 — Terminal showing the output of `pwd` confirming that you are working inside `~/k8s-labs/services/loadbalancer`

<img width="793" height="86" alt="2" src="https://github.com/user-attachments/assets/0819583b-ae06-4d4a-bc5f-742bc6b491f5" />

### Notes

**1. Why is it useful to keep Kubernetes manifests organized in dedicated directories?**

A dedicated directory keeps related configuration files together, makes them easier to locate and manage, prevents confusion between assignments and simplifies applying manifests.

It also makes the project easier to maintain and submit.

**2. What are the names of the main Deployment and LoadBalancer Service YAML files you will create in this assignment?**

The numeric prefixes establish an application order:
- 00-nginx-deploy.yaml defines the NGINX Deployment.
- 01-nginx-svc-loadbalancer.yaml defines the Service that exposes the Deployment.
The Deployment should exist first so that the Service can select its Pods using matching labels.

---

# Task 3 — Deploy a Healthy NGINX Application

## Goal

Create a healthy NGINX Deployment with readiness and liveness probes.

### Evidence

#### Screenshot 3 — Completed `00-nginx-deploy.yaml` manifest

<img width="980" height="855" alt="3" src="https://github.com/user-attachments/assets/6cd772f1-dc95-4181-a50f-17fc9e705f00" />

---

#### Screenshot 4 — Output showing successful rollout and two ready NGINX Pods

<img width="788" height="132" alt="4" src="https://github.com/user-attachments/assets/4b54e535-91d9-41e8-aa9e-aa9bae3d4eff" />


### Notes

**1. Why must Pods be ready before they should receive public traffic?**

Pods must be ready to receive traffic before the application is considered healthy. Kubernetes uses readiness information to determine which Pods should receive Service traffic.

If a Pod is running but not ready, it should not receive normal application traffic.

**2. What is the role of the readiness probe in this Deployment?**

A readiness probe determines whether a container is ready to accept requests.

In our deployment, Kubernetes checks the NGINX web server through an HTTP request to port 80 at /. When the check succeeds, the Pod is marked ready and becomes eligible to receive traffic.

**3. What is the role of the liveness probe in this Deployment?**

A liveness probe determines whether a container is still healthy and functioning.

If the liveness probe repeatedly fails, Kubernetes restarts the unhealthy container. This helps recover from situations where an application is running but has become unresponsive.

---

# Task 4 — Create and Test the LoadBalancer Service

## Goal

Create a public LoadBalancer Service and verify that the NGINX application is reachable from the internet.

### Evidence

#### Screenshot 5 — Completed `01-nginx-svc-loadbalancer.yaml` manifest

<img width="957" height="400" alt="5" src="https://github.com/user-attachments/assets/1a7d8c99-504a-4d0d-a031-68a92b736f67" />


---

#### Screenshot 6 — Output showing the Service with an assigned EXTERNAL-IP

<img width="790" height="128" alt="6" src="https://github.com/user-attachments/assets/d50c0e83-94c4-458f-ade7-36de0dae8175" />


---

#### Screenshot 7 — Successful curl output from the public IP

<img width="789" height="428" alt="7" src="https://github.com/user-attachments/assets/2b9d607c-80c5-451d-a3b2-efc1b0de8a42" />


### Notes

**1. What does `type: LoadBalancer` instruct AKS to do?**

It requests an externally accessible load balancer through the cloud provider. In our EKS environment, AWS provisions an Elastic Load Balancer and assigns it a public DNS hostname.

**2. What public IP was assigned to your Service?**

It is the public entry point through which external clients access the NGINX application.

Our assigned hostname was:
ae96e60f0161d4627bda1c51810a9da6-1251397368.us-east-1.elb.amazonaws.com


AWS provides a DNS hostname rather than the direct public IP address in this setup.

**3. How does the public request eventually reach the NGINX Pods?**

The request follows this path:

<img width="2172" height="724" alt="Kubernetes LoadBalancer Request Flow" src="https://github.com/user-attachments/assets/2eb2d77c-9f27-40d6-8b65-d9337a7221e5" />


The NGINX Pod processes the request and returns the response through the network path to the client.
**4. Why should you wait for EXTERNAL-IP before testing the Service?**

AWS needs time to provision the load balancer, configure its listener, register targets and complete health checks.

While this process is ongoing, the Service may show EXTERNAL-IP as pending. Testing before provisioning and DNS resolution are complete can result in connection failures or timeouts.

Our test eventually returned HTTP/1.1 200 OK, confirming successful public access.

---

# Task 5 — Observe How Readiness Protects Public Traffic

## Goal

Intentionally break readiness and observe how Kubernetes excludes unready Pods from ready Service backends while existing healthy Pods continue serving public traffic.

### Evidence

#### Screenshot 8 — Completed `02-readiness-broken.yaml` patch file

<img width="794" height="102" alt="8" src="https://github.com/user-attachments/assets/d03806fa-2c05-495d-b48d-b04cef1fb6ed" />

---

#### Screenshot 9 — Output showing the expected incomplete rollout or readiness failure

<img width="792" height="89" alt="9" src="https://github.com/user-attachments/assets/b99ed243-5b9b-4a74-8308-77c0996fd0ff" />


---

#### Screenshot 10 — EndpointSlice output showing ready healthy backends and the effect of the readiness failure

<img width="788" height="84" alt="10" src="https://github.com/user-attachments/assets/acafa98a-41e8-4ecd-b61a-152ee9d53160" />

---

#### Screenshot 11 — Successful public curl response after recovery

<img width="789" height="322" alt="11" src="https://github.com/user-attachments/assets/debc699a-a227-43e5-a32b-f11ff1b269c9" />

### Notes

**1. Why did the rollout not complete?**

We deliberately changed the readiness probe URL from / to a nonexistent page.

NGINX returned HTTP 404 for the new probe URL. Kubernetes interpreted this as a failed readiness check, so the newly created Pod remained unready.

The rolling update could not complete because Kubernetes was waiting for the replacement Pod to become ready.

**2. Why can the public endpoint still work while new Pods fail readiness?**

The two original NGINX Pods were still healthy and ready to receive traffic.

Our Deployment used a rolling update strategy with maxUnavailable: 0, meaning Kubernetes could not remove the existing healthy Pods before replacement Pods became ready.

The Service therefore continued routing traffic to the healthy endpoints while excluding the unready Pod.

**3. What would happen if Kubernetes routed traffic to Pods before they were ready?**

If traffic is sent to an application before it is ready, users may experience:
- Failed requests.
- HTTP errors.
- Incomplete responses.
- Application timeouts.
- Unreliable application behaviour.
Readiness probes help prevent these problems by controlling when Pods become eligible to receive traffic.

**4. How did you restore the Deployment successfully?**

We restored the original manifest to return the readiness probe to its working configuration.

This allowed the replacement Pod to pass its readiness check, complete the rollout and become eligible to receive traffic again.

Our public endpoint subsequently returned HTTP 200 OK, confirming recovery.
---

# Task 6 — Scale the Deployment Behind the Load Balancer

## Goal

Scale the NGINX Deployment and confirm that more ready Pods become available behind the same public endpoint.

### Evidence

#### Screenshot 12 — Two ready NGINX Pods verified initially; four ready Pods verified after scaling

<img width="793" height="233" alt="12" src="https://github.com/user-attachments/assets/1747bf1a-3a4c-49ce-98d4-1ea28d754c98" />


---

#### Screenshot 13 — Successful public curl response after scaling

<img width="790" height="433" alt="13" src="https://github.com/user-attachments/assets/21d67496-8015-4a62-a0de-dd03cd1d7b2c" />


### Notes

**1. What changed after scaling the Deployment from two to four replicas?**

The Deployment's desired replica count increased from two to four.

Kubernetes created two additional NGINX Pods, resulting in four running and ready Pods behind the same Service.

The EndpointSlice was also updated automatically to include the additional ready Pod endpoints.

**2. Did the public IP change after scaling? Explain why or why not.**

No. The external address remained the same.

In our AWS environment, the address was a DNS hostname rather than a direct IP address.

**3. Why does scaling behind a LoadBalancer Service not require users to change the URL or IP they use?**

The AWS Load Balancer is associated with the Kubernetes Service, not with individual NGINX Pods.

Scaling changes the number of backend Pods behind the Service, but it does not require a new Service or public load balancer.

Therefore, clients continue using the same public hostname even when the number of backend Pods changes.

---

# Task 7 — Share Your LoadBalancer Lab on LinkedIn

## Goal

Share what you learned about exposing an NGINX application publicly through a LoadBalancer Service on AKS.

### Evidence

#### Screenshot 14 — Published LinkedIn post about your LoadBalancer lab on AKS

<img width="474" height="721" alt="linedkin post" src="https://github.com/user-attachments/assets/faeae77e-b3fc-4930-a0ef-028fe9e9b6f1" />


#### LinkedIn post link

https://lnkd.in/p/eiMPUXf9

---

# Submission Instructions

- Include the completed YAML files:
  - `00-nginx-deploy.yaml`
  - `01-nginx-svc-loadbalancer.yaml`
  - `02-readiness-broken.yaml`
- Add all required screenshots, numbered 1–14, under their corresponding Evidence sections.
- Use clear, readable screenshots showing the relevant commands, configuration, and outputs.
- Ensure your full name is visible in the required screenshots.
- Complete the Notes for Tasks 1–6 in your own words.
- Capture all required evidence before cleaning up Azure resources.
- Plan or complete Azure cleanup according to your lab ownership and reuse arrangements.
- Do not expose passwords, tokens, private keys, cluster credentials, kubeconfig contents, subscription IDs, account IDs, or infrastructure details you are not permitted to share.

---

# Completion Checklist

- [ ] Created or connected to an approved AKS lab cluster
- [ ] Confirmed ready AKS node(s) (Screenshot 1)
- [ ] Created and entered the LoadBalancer lab directory (Screenshot 2)
- [ ] Created the NGINX Deployment manifest (Screenshot 3)
- [ ] Verified successful rollout and two ready NGINX Pods initially (Screenshot 4)
- [ ] Created the LoadBalancer Service manifest (Screenshot 5)
- [ ] Verified the assigned external IP (Screenshot 6)
- [ ] Verified successful public access using curl (Screenshot 7)
- [ ] Created the broken readiness patch (Screenshot 8)
- [ ] Observed the expected incomplete rollout or readiness failure (Screenshot 9)
- [ ] Inspected EndpointSlices during the readiness failure (Screenshot 10)
- [ ] Restored the healthy Deployment and verified public access (Screenshot 11)
- [ ] Scaled the Deployment to four ready Pods and verified updated Service backends (Screenshot 12)
- [ ] Verified public access after scaling (Screenshot 13)
- [ ] Completed the Notes for Tasks 1–6
- [ ] Published the LinkedIn post (Screenshot 14)
- [ ] Included all required YAML files and screenshots
- [ ] Planned or completed Azure cleanup
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
