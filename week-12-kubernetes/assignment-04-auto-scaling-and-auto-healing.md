# Assignment 4 — Auto-Scaling & Auto-Healing: Let Kubernetes React for You

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

Create Deployments, test Pod auto-healing, configure CPU requests and limits, verify Metrics Server, and create a Horizontal Pod Autoscaler.

Optionally generate CPU load to observe how the HPA responds.

---

# Task 0 — Check the Existing Cluster Resources

## Goal

Confirm that you are connected to your learning cluster and inspect existing Deployments and HPAs.

### Evidence

No screenshots required.

---

# Task 1 — Set Up Your Lab Directory

## Goal

Create and enter a dedicated directory for the auto-scaling lab.

### Evidence

#### Screenshot 1 — Terminal showing that you are working inside `~/k8s-labs/autoscaling`

<img width="630" height="118" alt="1" src="https://github.com/user-attachments/assets/5da0694f-4ff1-460d-b570-7d00a742b741" />


---

### Notes

**1. What is the difference between auto-healing and auto-scaling?**

Auto-healing: Automatically detects and replaces failed or unhealthy Pods to maintain the desired number of running replicas.

---

**2. Which Kubernetes feature will you use for CPU-based auto-scaling?**

The Horizontal Pod Autoscaler (HPA). It automatically adjusts the number of Pod replicas based on CPU utilisation or other configured metrics.

---

# Task 2 — Test Auto-Healing with a Deployment

## Goal

Create a Deployment with two replicas, delete one Pod, and observe Kubernetes create a replacement Pod.

### Evidence

#### Screenshot 2 — Completed `autohealing-deployment.yaml` manifest

<img width="620" height="763" alt="2" src="https://github.com/user-attachments/assets/e2cd8adc-b741-4971-b409-7118936170b8" />

---

#### Screenshot 3 — Output of `kubectl get pods` showing two running Pods before deletion

<img width="635" height="109" alt="3" src="https://github.com/user-attachments/assets/34d682a8-cfd6-4520-9910-fb1e8bae4f6b" />

---

#### Screenshot 4 — Output of the `kubectl delete pod` command

<img width="629" height="66" alt="4" src="https://github.com/user-attachments/assets/70f6f527-d36a-4a2a-a129-f110dd489d63" />

---

#### Screenshot 5 — Output of `kubectl get pods` showing the replacement Pod and two running Pods

<img width="628" height="106" alt="5" src="https://github.com/user-attachments/assets/ce8222e5-77a0-4978-b86e-7fad15802588" />


---

### Notes

**1. What happened after you deleted one Pod?**

Kubernetes automatically detected that one Pod was missing and created a replacement Pod to maintain the desired replica count of two.

---

**2. What Kubernetes resource maintains the desired replica count for this Deployment?**

The Deployment, through its managed ReplicaSet, maintains the desired number of Pods. The ReplicaSet ensures that the specified number of replicas are running.

---

**3. What proves that auto-healing worked?**

The deleted Pod was replaced by a new Pod with a different name, and kubectl get pods showed that two Pods were running again. This confirms that Kubernetes automatically restored the desired replica count.

---

# Task 3 — Create a Deployment for HPA

## Goal

Create a Deployment with CPU resource requests and limits so that HPA can calculate CPU utilization.

### Evidence

#### Screenshot 6 — Completed `hpa-deployment.yaml` manifest showing CPU requests and limits

<img width="634" height="472" alt="6" src="https://github.com/user-attachments/assets/b96e842d-0864-43de-bc73-bca1fd934ade" />


---

#### Screenshot 7 — Output showing `nginx-deployment` and its running Pods

<img width="618" height="164" alt="7" src="https://github.com/user-attachments/assets/00b02559-07f2-4a76-9c07-5c9cc3f5d872" />


---

### Notes

**1. What does `cpu: "100m"` mean?**

It means the container requests 100 millicores of CPU, which is equivalent to 0.1 of a CPU core (10% of one core).

---

**2. What is the difference between a CPU request and a CPU limit?**

CPU request: The amount of CPU Kubernetes reserves for a container when scheduling it on a node.



CPU limit: The maximum CPU time the container is allowed to use. If it tries to exceed this limit, Kubernetes throttles its CPU usage.

---

**3. Why does CPU-based HPA require CPU requests?**

Because HPA calculates CPU utilisation as a percentage of the CPU request. Without a CPU request, it cannot accurately calculate the utilisation percentage needed to decide when to scale the Pods.

---

# Task 4 — Enable and Verify Metrics Server

## Goal

Ensure the cluster can collect resource metrics for the HPA.

### Evidence

#### Screenshot 8 — Output showing Metrics Server running, or `kubectl top pods` displaying Pod metrics

<img width="631" height="102" alt="8" src="https://github.com/user-attachments/assets/8ef74b01-fd39-484e-b29a-bd5e0f418a75" />

---

### Notes

**1. Why does HPA need Metrics Server?**

HPA needs Metrics Server to collect CPU and memory usage data from Kubernetes Pods and Nodes. It uses these metrics to decide when to scale the number of Pods up or down.

---

**2. What issue can occur if Metrics Server is not working?**

HPA may not receive the resource usage metrics it needs to make scaling decisions. As a result, automatic scaling may not work correctly, and the HPA may show <unknown> for CPU utilisation.

---

**3. What does `kubectl top pods` help you check?**

It displays the current CPU and memory usage of running Pods. This helps you monitor resource consumption and confirm that Metrics Server is collecting metrics successfully.

---

# Task 5 — Create a Horizontal Pod Autoscaler

## Goal

Create an HPA that keeps at least two Pods running and can scale up to five Pods when average CPU utilization exceeds 50%.

### Evidence

#### Screenshot 9 — The imperative command output OR completed `hpa-nginx.yaml` manifest

<img width="628" height="80" alt="9" src="https://github.com/user-attachments/assets/53b8109b-7e70-47e8-8a8b-0fb0ce7f19a8" />


---

#### Screenshot 10 — Output of `kubectl get hpa` and the relevant `kubectl describe hpa` command

<img width="630" height="412" alt="10" src="https://github.com/user-attachments/assets/0a1485f8-c3c0-4e28-8056-98025352e0cb" />

---

### Notes

**1. What does `minReplicas: 2` mean?**

It means the HPA must maintain at least 2 Pods for the Deployment, even when CPU usage is low. It cannot scale down below 2 replicas.

---

**2. What does `maxReplicas: 5` mean?**

It means the HPA can scale the Deployment up to a maximum of 5 Pods when demand increases. It cannot create more than 5 replicas.

---

**3. What does `averageUtilization: 50` mean?**

It means the HPA uses 50% average CPU utilisation as its target across the Pods, based on their CPU resource requests. If utilisation rises above this target, the HPA can increase the number of replicas.

---

**4. Why should only one HPA manage a Deployment at a time?**

Because multiple HPAs managing the same Deployment can conflict when trying to control its replica count. This can cause unpredictable scaling behaviour and make it difficult to manage the application properly.

---

# Task 6 — Optional: Generate CPU Load and Observe Scaling

## Goal

Generate CPU load in one NGINX Pod and observe how HPA responds.

### Evidence

If you skip this task, write “Not completed — optional” and leave the remaining Task 6 placeholders blank.

Task status: Completed

#### Screenshot 11 — Terminal showing the CPU-load command running inside the selected Pod

<img width="610" height="380" alt="11" src="https://github.com/user-attachments/assets/ab1e2422-f02f-48e7-a9ac-76ab45fa68a7" />

---

#### Screenshot 12 — Output of `kubectl get hpa` and `kubectl get pods` while HPA evaluates or changes the replica count

<img width="623" height="389" alt="12" src="https://github.com/user-attachments/assets/d24d32e8-db4c-488b-8b35-73bf3a813137" />


---

### Notes

Complete these answers only if you perform the optional test.

**1. Did the HPA change the number of Pods? Explain what you observed.**

Yes. When CPU utilisation reached 100%, exceeding the 50% target, the HPA automatically increased the Deployment from two to four replicas.

---

**2. If scaling did not happen, what are two possible reasons?**

Not applicable — scaling occurred.

---

**3. Why is automatic scale-down useful after traffic decreases?**

It reduces unnecessary resource consumption and infrastructure costs when demand decreases, while maintaining the minimum required number of Pods.

---

# LinkedIn Requirement

### Evidence

#### Screenshot 13 — Published LinkedIn post showing your name, the required explanation, and the attached Kubernetes screenshot

<img width="634" height="139" alt="12" src="https://github.com/user-attachments/assets/0a5e54c4-0c2e-4b42-bf0c-10479d20db64" />


#### Linkedin Post Link
https://lnkd.in/p/eVdt4vAK

---

# Submission Instructions

- Include required Screenshots 1–10 and Screenshot 13.
- Include Screenshots 11–12 only if you complete Task 6.
- Full Name must be visible in required screenshots.
- Ensure screenshots are clear and readable.
- Include the completed `autohealing-deployment.yaml` and `hpa-deployment.yaml` files.
- Include `hpa-nginx.yaml` if you selected the declarative HPA method.
- Complete the Notes sections for Tasks 1–5 in your own words.
- Complete Task 6 notes only if you perform the optional test.
- Do not expose passwords, tokens, private keys, kubeconfig files, or account IDs.

---

# Completion Checklist

- [ ] Checked the active context and existing cluster resources
- [ ] Created the autoscaling working directory (Screenshot 1)
- [ ] Created `autohealing-deployment.yaml` (Screenshot 2)
- [ ] Confirmed two auto-healing Pods were running (Screenshot 3)
- [ ] Deleted one managed Pod (Screenshot 4)
- [ ] Confirmed that the Pod was automatically replaced (Screenshot 5)
- [ ] Created `hpa-deployment.yaml` with CPU requests and limits (Screenshot 6)
- [ ] Verified `nginx-deployment` and its running Pods (Screenshot 7)
- [ ] Verified Metrics Server and confirmed Pod metrics are available (Screenshot 8)
- [ ] Created one HPA using the selected method (Screenshot 9)
- [ ] Verified minimum replicas of 2, maximum replicas of 5, and a CPU target of 50% (Screenshot 10)
- [ ] Completed Notes for Tasks 1–5
- [ ] Completed Task 6 evidence and notes, or marked it “Not completed — optional”
- [ ] Stopped the CPU-load command and exited the container shell, if Task 6 was completed
- [ ] Published the LinkedIn post with the required explanation and attached screenshot (Screenshot 13)
- [ ] Included the required manifest files
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
