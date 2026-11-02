# Assignment 1 — Creating Your First Pod in Kubernetes

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will create an NGINX Pod using both imperative and declarative methods. You will practice creating, checking, deleting, describing, viewing logs from, and opening a shell inside a Pod.

---

# Task 1 — Set Up Your Lab Folder

## Goal

Create a clean working directory for all Pod-related files used in this lab.

### Evidence

#### Screenshot 01 — Output of `pwd` showing the current directory ending in `/k8s-labs/pods`

<img width="819" height="79" alt="1" src="https://github.com/user-attachments/assets/00123554-235d-41f2-b595-d73818acddc1" />


---

# Task 2 — Create a Pod Imperatively

## Goal

Create an NGINX Pod directly from the command line, verify that it is running, and delete it before continuing to the declarative method.

### Evidence

#### Screenshot 02 — Output of `kubectl run nginx-pod --image=nginx` showing the creation message, and `kubectl get pods` showing `nginx-pod` with `1/1` under `READY` and `Running` under `STATUS`, before deletion

<img width="819" height="138" alt="2" src="https://github.com/user-attachments/assets/8a2e8906-011e-48ef-a782-5a6e655723c6" />


---

#### Screenshot 03 — Output of `kubectl delete pod nginx-pod` showing the successful deletion message

<img width="814" height="120" alt="3" src="https://github.com/user-attachments/assets/1c5b20fc-eebc-4bae-adbc-1af0640df725" />


---

# Task 3 — Create a Pod Declaratively Using YAML

## Goal

Define the NGINX Pod in a YAML file, apply the manifest, and verify the resulting Pod.

### Evidence

#### Screenshot 04 — The filename `nginx-pod.yaml` and the complete YAML manifest with clear, readable indentation

<img width="822" height="205" alt="4" src="https://github.com/user-attachments/assets/d34be686-1ae9-4b43-890f-1e7f7520da97" />


---

#### Screenshot 05 — Output of `kubectl apply -f nginx-pod.yaml` showing the successful creation message

<img width="817" height="57" alt="5" src="https://github.com/user-attachments/assets/00183e34-0e84-4d50-afa9-b20a893723bb" />


---

#### Screenshot 06 — Output of `kubectl get pods` showing the declarative `nginx-pod` with `1/1` under `READY` and `Running` under `STATUS`

<img width="814" height="63" alt="6" src="https://github.com/user-attachments/assets/b4a56e4b-c486-4ad9-ab8e-1635af879462" />


---

### Notes

**1. What is the difference between imperative and declarative Pod creation?**

- Imperative: We use direct commands such as kubectl run to tell Kubernetes what action to perform immediately.
- Declarative: We define the desired state in a YAML manifest and use kubectl apply to make Kubernetes implement that configuration.
Declarative configuration is easier to maintain, reuse, document and manage consistently.

---

# Task 4 — Inspect and Access the Pod

## Goal

Inspect the running Pod, view its logs, and open a shell inside the NGINX container.

### Evidence

#### Screenshot 07 — Output of `kubectl describe pod nginx-pod` showing the Pod name, `app=nginx` label, `Running` status, container name, and NGINX image

<img width="850" height="783" alt="7" src="https://github.com/user-attachments/assets/390ff06c-b307-444f-9784-bb7dc2074755" />


---

#### Screenshot 08 — Output of `kFilename: `08-pod-logs.png`

<img width="851" height="414" alt="8" src="https://github.com/user-attachments/assets/0876b2ad-690f-4600-86ef-00a114d826a3" />


If no logs appear, add a caption stating that the command completed without output.

---

#### Screenshot 09 — Container shell opened using `kubectl exec -it nginx-pod -- /bin/bash`, showing `cd /usr/share/nginx/html`, `pwd`, and `ls -la`, with the directory path and default NGINX files visible before exiting

<img width="846" height="166" alt="9" src="https://github.com/user-attachments/assets/46cb8239-eb99-4cb9-95a7-23788ea02b7c" />


---

### Task 5 — Share Your First Kubernetes Pod on WhatsApp Status

**Goal**

Share your Kubernetes learning progress on WhatsApp Status, including your generated DMI leaderboard progress link.

**Steps**

1. Go to the DMI Leaderboard.
2. Find your name and select **Share your progress**.
3. Click the **WhatsApp icon**.
4. Copy the automatically generated leaderboard message containing your rank and progress link.
5. Open WhatsApp and go to **Updates**.
6. Create a new text Status.
7. Copy and paste the message below.
8. Add the generated leaderboard message in the indicated place.
9. Review and publish your Status.

**WhatsApp Status Message**

I created my first Kubernetes Pod as part of my DevOps learning journey! 🚀

Today, I deployed an NGINX Pod using both imperative kubectl commands and a declarative YAML manifest.

I also checked its status, inspected its details, viewed its logs, and accessed the container shell.

https://api.whatsapp.com/send/?text=I+just+completed+11%2F14+weeks+of+the+DevOps+Micro+Internship+%E2%80%94+Cohort+3+%C2%B7+Live%21+%EF%BF%BD+https%3A%2F%2Fdmi.pravinmishra.com%2Fs%2Fkaphaaya.html%3Futm_source%3Ddmi%26utm_medium%3Dshare%26utm_campaign%3Dbadge-share-hero-whatsapp&type=custom_url&app_absent=0

#DMIByPravinMishra #DevOps #Kubernetes

**Screenshots Required**

- **Screenshot 10 — `10-whatsapp-status.png`:** Published WhatsApp Status showing your Kubernetes Pod message and generated DMI leaderboard progress link.

<img width="1790" height="1022" alt="10 1" src="https://github.com/user-attachments/assets/bf830df7-922b-4a0d-b86e-688a29ba835a" />

<img width="1199" height="1312" alt="d68b5bf1-18cc-4a8a-bb14-a891a930ea8d" src="https://github.com/user-attachments/assets/82e0d301-b2e8-472d-a416-c8fade8810f4" />

---

# Submission Instructions

- Add all required screenshots to this submission template.
- Use the specified screenshot numbers and filenames.
- Ensure all screenshots are clear and readable.
- Submit the completed `nginx-pod.yaml` manifest as a separate file.
- Explain the difference between imperative and declarative Pod creation in your own words.
- Do not expose passwords, access tokens, or private keys.

---

# Completion Checklist

- [ ] Created `~/k8s-labs/pods` (Screenshot 01)
- [ ] Created `nginx-pod` imperatively and confirmed it reached the `Running` state (Screenshot 02)
- [ ] Deleted the imperative Pod (Screenshot 03)
- [ ] Created `nginx-pod.yaml` with the required manifest (Screenshot 04)
- [ ] Applied the YAML manifest (Screenshot 05)
- [ ] Confirmed the declarative Pod reached the `Running` state (Screenshot 06)
- [ ] Inspected the Pod using `kubectl describe` (Screenshot 07)
- [ ] Viewed container logs using `kubectl logs` (Screenshot 08)
- [ ] Accessed the container shell and inspected the NGINX files (Screenshot 09)
- [ ] Exited the container shell
- [ ] Published the WhatsApp status (Screenshot 10)
- [ ] Added Screenshot 10b if the caption was published separately
- [ ] Submitted all required screenshots with the correct filenames
- [ ] Submitted the `nginx-pod.yaml` file
- [ ] Explained the difference between imperative and declarative methods
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
