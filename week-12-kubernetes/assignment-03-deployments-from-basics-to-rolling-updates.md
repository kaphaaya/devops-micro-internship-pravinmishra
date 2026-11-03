# Assignment 3 — Deployments: From Basics to Rolling Updates

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

Create an NGINX Deployment, configure RollingUpdate, update the container image, roll back to the previous revision, and scale the workload.

---

# Task 0 — Pre-check: Remove the Assignment 02 ReplicaSet

## Goal

Confirm that you are connected to your learning cluster and remove the previous ReplicaSet and its managed Pods before starting this lab.

### Evidence

No screenshots required.

---

# Task 1 — Set Up the Working Directory

## Goal

Create and enter the dedicated Deployment lab directory.

### Evidence

#### Screenshot 01 — Output of `pwd` showing the directory ending in `/k8s-labs/deployments`

<img width="633" height="48" alt="1" src="https://github.com/user-attachments/assets/22581447-2920-425b-bd6d-23bf2366f30a" />

---

# Task 2 — Create the Basic Deployment

## Goal

Create a two-replica NGINX Deployment and verify the automatically managed ReplicaSet and Pods.

### Evidence

#### Screenshot 02 — Completed basic `nginx-deployment.yaml` showing two replicas and the initial NGINX image

<img width="633" height="329" alt="2" src="https://github.com/user-attachments/assets/b1a9e714-14db-4032-90a2-d328d6b90158" />


---

#### Screenshot 03 — Successful apply output and verification output showing the Deployment, its automatically created ReplicaSet, and two Pods with `1/1` under `READY` and `Running` under `STATUS`

<img width="631" height="167" alt="3" src="https://github.com/user-attachments/assets/36699915-5cd4-4ae6-ab09-6649625f1a69" />


# Task 3 — Configure the RollingUpdate Strategy

## Goal

Configure RollingUpdate to maintain the desired available replica count during an image update.

### Evidence

#### Screenshot 04 — Updated YAML showing `RollingUpdate`, `maxSurge: 1`, and `maxUnavailable: 0`

<img width="631" height="403" alt="4" src="https://github.com/user-attachments/assets/3bdc5fae-e963-44cb-ac06-157a9c272376" />


---

#### Screenshot 05 — Successful apply output and Deployment details showing the configured rolling-update strategy

<img width="635" height="123" alt="5" src="https://github.com/user-attachments/assets/562b7f51-3205-4a11-bab7-a3dda2465359" />

---

# Task 4 — Perform and Roll Back an Image Update

## Goal

Update NGINX to 1.23.1, observe the rollout, and return to the previous stable revision.

### Evidence

#### Screenshot 06 — Image-update command and rollout status showing successful completion

<img width="634" height="233" alt="6" src="https://github.com/user-attachments/assets/fb195456-2987-40a3-84fe-402a780c4cbf" />


---

#### Screenshot 07 — ReplicaSet output showing the previous and updated ReplicaSets, and Deployment details showing `nginx:1.23.1`

<img width="625" height="707" alt="7" src="https://github.com/user-attachments/assets/c53f4efd-6845-41b4-98db-b9d681cdf4fb" />


---

#### Screenshot 08 — Rollback command and rollout status showing successful completion

<img width="634" height="108" alt="8" src="https://github.com/user-attachments/assets/f3763edf-529c-4b1a-8fbf-1f41c63aae37" />


---

#### Screenshot 09 — Rollout history and Deployment details showing the restored `nginx:1.21.1` image

<img width="626" height="834" alt="9" src="https://github.com/user-attachments/assets/8a9f6518-66e0-4079-8a7d-a2226a517cf0" />


---

# Task 5 — Scale the Deployment

## Goal

Scale the workload to five replicas and return it to two.

### Evidence

#### Screenshot 10 — Scale-up command and output showing five Pods with `1/1` under `READY` and `Running` under `STATUS`

<img width="629" height="162" alt="10" src="https://github.com/user-attachments/assets/2ce7dad4-60d6-437a-8f60-6d79ef9e6de7" />


---

#### Screenshot 11 — Scale-down command and output showing the final two Pods with `1/1` under `READY` and `Running` under `STATUS`

<img width="620" height="120" alt="11" src="https://github.com/user-attachments/assets/b93c8c5c-b331-4569-a9d0-a1f8e1b9944b" />


---

# Task 6 — Share Your Kubernetes Deployment Progress on WhatsApp Status

## Goal

Share your Kubernetes Deployment learning progress on WhatsApp Status, including your generated DMI leaderboard progress link.

### Steps

1. Go to the DMI Leaderboard.
2. Find your name and select **Share your progress**.
3. Click the **WhatsApp icon**.
4. Copy the automatically generated leaderboard message containing your rank and progress link.
5. Open WhatsApp and go to **Updates**.
6. Create a new text Status.
7. Copy and paste the message below.
8. Insert the generated leaderboard message in the indicated place.
9. Review and publish your Status.

### WhatsApp Status Message

I practiced Kubernetes Deployments as part of my DevOps learning journey! 🚀

Today, I deployed NGINX, configured rolling updates, updated the container image, and rolled back to the previous version.

I also scaled my Deployment from two Pods to five and back to two!

https://dmi.pravinmishra.com/s/kaphaaya.html?utm

#DMIByPravinMishra #DevOps #Kubernetes

### Evidence

#### Screenshot 12 — Published WhatsApp Status showing your Kubernetes Deployment message and generated DMI leaderboard progress link

<img width="914" height="1082" alt="whatsapp post" src="https://github.com/user-attachments/assets/3d55c0df-52d9-415f-b61f-6fb98f3273a7" />


---

# Lab Summary

Write a short note explaining how Deployments manage ReplicaSets, perform rolling updates and rollbacks, and scale Pods.

A Kubernetes Deployment manages ReplicaSets, which maintain the desired number of Pods. When the Pod template changes, the Deployment creates a new ReplicaSet and performs a rolling update, gradually replacing old Pods with new ones.

The RollingUpdate strategy, configured with `maxSurge: 1` and `maxUnavailable: 0`, allows updates while maintaining the desired available replica count. If an update causes problems, `kubectl rollout undo` restores the previous revision.

Deployments also make scaling easy. Using `kubectl scale`, I increased the workload from two to five Pods and then reduced it back to two.

---

# Submission Instructions

- Include all required screenshots, numbered 01–12.
- Ensure screenshots are clear and readable.
- Submit the final `nginx-deployment.yaml` containing two replicas, the initial NGINX image, and the configured RollingUpdate strategy.
- Complete the Lab Summary in your own words.
- Include evidence of your published WhatsApp Status.
- Do not expose passwords, tokens, private keys, or kubeconfig credentials.

---

# Completion Checklist

- [ ] Completed Task 0
- [ ] Created the deployments directory (Screenshot 01)
- [ ] Created the basic two-replica NGINX Deployment manifest (Screenshot 02)
- [ ] Applied the Deployment and verified its ReplicaSet and two running Pods (Screenshot 03)
- [ ] Added RollingUpdate with `maxSurge: 1` and `maxUnavailable: 0` (Screenshot 04)
- [ ] Applied and verified the rolling-update strategy (Screenshot 05)
- [ ] Updated NGINX to 1.23.1 and confirmed rollout completion (Screenshot 06)
- [ ] Inspected the ReplicaSets and verified the updated image (Screenshot 07)
- [ ] Rolled back the update and confirmed rollout completion (Screenshot 08)
- [ ] Reviewed rollout history and verified the restored image (Screenshot 09)
- [ ] Scaled to five running Pods (Screenshot 10)
- [ ] Scaled back to two running Pods (Screenshot 11)
- [ ] Published the WhatsApp Status with the generated leaderboard progress link (Screenshot 12)
- [ ] Submitted the final `nginx-deployment.yaml`
- [ ] Included screenshots 01–12
- [ ] Completed the Lab Summary
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
