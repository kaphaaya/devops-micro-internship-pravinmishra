# Assignment 02 — ReplicaSets: Keeping Your Pods Alive

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will create three NGINX Pods using a ReplicaSet, test auto-healing by deleting one Pod, and scale the ReplicaSet from three to five Pods.

---

# Task 0 — Pre-check: Remove the Pod from Assignment 01

## Goal

Confirm that you are connected to your learning cluster and remove the previous standalone Pod to prevent the ReplicaSet from adopting it.

### Evidence

No screenshots required.

---

# Task 1 — Set Up Your Working Directory

## Goal

Create and enter a dedicated directory for this ReplicaSet lab.

### Evidence

#### Screenshot 01 — Output of `pwd` showing the working directory ending in `/k8s-labs/replicasets`

<img width="598" height="353" alt="1" src="https://github.com/user-attachments/assets/815dcf85-6a41-4839-83fe-c869c649406b" />


---

### Notes

**1. Why is it useful to keep Kubernetes manifests in organized directories?**

It keeps related configuration files together, makes projects easier to navigate and reduces confusion between assignments.
---

**2. What file will you create in this directory for this assignment?**

nginx-replicaset.yaml

---

# Task 2 — Create and Apply the NGINX ReplicaSet

## Goal

Create a ReplicaSet that maintains three NGINX Pods.

### Evidence

#### Screenshot 02 — Completed `nginx-replicaset.yaml` manifest showing `replicas: 3`

<img width="597" height="350" alt="2" src="https://github.com/user-attachments/assets/6a944198-9ab4-4c01-bc00-e4b473b1229c" />


---

#### Screenshot 03 — Output of `kubectl apply -f nginx-replicaset.yaml`

<img width="595" height="410" alt="3" src="https://github.com/user-attachments/assets/6065797a-2955-4f93-b2ed-f1c5e80872cb" />


---

#### Screenshot 04 — Output of `kubectl get pods` showing three NGINX Pods with `1/1` under `READY` and `Running` under `STATUS`

<img width="595" height="138" alt="4" src="https://github.com/user-attachments/assets/facbf365-014a-4a3f-b7f7-45e37ccf8447" />

---

### Notes

**1. What does `replicas: 3` mean in this manifest?**

It means the ReplicaSet is configured to maintain three identical NGINX Pods at all times. If one Pod is deleted or fails, Kubernetes automatically creates a replacement to maintain the desired number of three.

---

**2. Why must `selector.matchLabels` match `template.metadata.labels`?**

The selector tells the ReplicaSet which Pods it should manage, while the template defines the labels assigned to the Pods it creates. They must match so that the ReplicaSet can identify and manage its Pods correctly.

In our assignment, both use app: nginx.

---

**3. What image and image tag are used for the NGINX container?**

The image is nginx and the image tag is 1.21.1.

The complete image reference is:

nginx:1.21.1

---

# Task 3 — Test ReplicaSet Auto-Healing

## Goal

Delete one Pod managed by the ReplicaSet and observe Kubernetes automatically create a replacement.

### Evidence

#### Screenshot 05 — Output of the command deleting one ReplicaSet-managed Pod

<img width="629" height="70" alt="5" src="https://github.com/user-attachments/assets/b3ec61f7-9d84-4063-adb4-3555feb7899d" />


---

#### Screenshot 06 — Output of `kubectl get pods` showing the replacement Pod with a different name from the deleted Pod

<img width="629" height="133" alt="6" src="https://github.com/user-attachments/assets/d1769f34-d226-4955-89f1-24d14767e5b0" />

---

#### Screenshot 07 — Output showing three NGINX Pods with `1/1` under `READY` and `Running` under `STATUS` again

<img width="628" height="97" alt="7" src="https://github.com/user-attachments/assets/2fe45295-ef8f-46b6-a39a-10050af3ba22" />


---

### Notes

**1. What happened after you deleted one Pod?**

After I deleted one of the three NGINX Pods, the ReplicaSet detected that only two Pods remained and automatically created a replacement Pod. The replacement had a different name from the deleted Pod, restoring the total number to three.

---

**2. How does the ReplicaSet know that a replacement Pod is needed?**

The ReplicaSet continuously compares the desired number of Pods defined by replicas: 3 with the actual number of running Pods matching its selector. When the actual number drops below three, it creates another Pod using its Pod template.

---

**3. What proves that auto-healing worked successfully?**

The kubectl get pods output showed that a new Pod with a different name was created and that all three Pods returned to 1/1 READY and Running status. This confirms that the ReplicaSet successfully maintained the desired number of Pods.

---

# Task 4 — Manually Scale the ReplicaSet

## Goal

Scale the ReplicaSet from three NGINX Pods to five NGINX Pods by changing the YAML manifest.

### Evidence

#### Screenshot 08 — Updated `nginx-replicaset.yaml` showing `replicas: 5`

<img width="631" height="343" alt="8" src="https://github.com/user-attachments/assets/02ba221a-4670-4a0d-a908-44c5b836fc58" />


---

#### Screenshot 09 — Output of `kubectl get pods` showing five NGINX Pods with `1/1` under `READY` and `Running` under `STATUS`

<img width="631" height="154" alt="9" src="https://github.com/user-attachments/assets/640a37cd-a542-4e15-bc53-79401c782541" />


---

### Notes

**1. What change did you make to scale the ReplicaSet?**

I edited the nginx-replicaset.yaml manifest and changed replicas: 3 to replicas: 5. I then ran kubectl apply -f nginx-replicaset.yaml to apply the updated configuration.

---

**2. Did you manually create the additional Pods? Explain why or why not.**

No. Kubernetes automatically created the two additional Pods because the ReplicaSet detected that the desired number had increased from three to five. It used its existing Pod template to create them.

---

**3. What would happen if you changed the replica count from five back to three?**

Kubernetes would automatically remove two Pods until only three remained. The ReplicaSet would continuously reconcile the actual number of Pods with the desired replica count specified in the YAML manifest.
---

# LinkedIn Requirement

Create a LinkedIn post that includes:

- A short explanation of what a Kubernetes ReplicaSet does.
- What happened when you deleted one NGINX Pod.
- How Kubernetes automatically created a replacement Pod to maintain the desired replica count.
- What you learned by changing the replica count from three to five.
- One screenshot showing either:
  - Three Pods running after the auto-healing test, or
  - Five Pods running after scaling the ReplicaSet.

Do not share sensitive information, cluster credentials, tokens, or kubeconfig details in your post.

### Evidence

#### Screenshot 10 — Published LinkedIn post showing your name, the required explanation, and the attached Pod screenshot

<img width="472" height="740" alt="linkedinpost" src="https://github.com/user-attachments/assets/40ac2311-662b-4b0d-ad6e-80972754ac68" />


---

### Post Link

https://lnkd.in/p/eg7YaWsE

---

# Submission Instructions

- Add all required screenshots, numbered 01–10, to this template.
- Full Name must be visible in required screenshots.
- Ensure screenshots are clear and readable.
- Submit the final `nginx-replicaset.yaml` file showing `replicas: 5`. Screenshot 02 provides evidence of the initial manifest with `replicas: 3`.
- Complete the Notes sections in Tasks 1–4 in your own words.
- Include the published LinkedIn post URL.
- Do not expose tokens, passwords, private keys, kubeconfig files, or account IDs.

---

# Completion Checklist

- [ ] Completed Task 0 and confirmed that the previous `nginx-pod` is no longer listed
- [ ] Created and entered the ReplicaSet working directory (Screenshot 01)
- [ ] Created `nginx-replicaset.yaml` with an initial replica count of three (Screenshot 02)
- [ ] Applied the ReplicaSet manifest successfully (Screenshot 03)
- [ ] Confirmed three NGINX Pods are running (Screenshot 04)
- [ ] Deleted one ReplicaSet-managed Pod (Screenshot 05)
- [ ] Observed the automatically created replacement Pod (Screenshot 06)
- [ ] Confirmed three NGINX Pods are running again (Screenshot 07)
- [ ] Changed the replica count from three to five (Screenshot 08)
- [ ] Confirmed five NGINX Pods are running (Screenshot 09)
- [ ] Submitted the final `nginx-replicaset.yaml` file with `replicas: 5`
- [ ] Completed the Notes sections in Tasks 1–4
- [ ] Published the LinkedIn post with the required explanation and Pod screenshot (Screenshot 10)
- [ ] Included the published LinkedIn post URL
- [ ] Included all required screenshots
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
