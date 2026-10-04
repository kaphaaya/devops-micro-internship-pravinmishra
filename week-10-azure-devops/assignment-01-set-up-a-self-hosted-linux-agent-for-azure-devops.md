# Assignment 1 — Configure a Self-Hosted Azure DevOps Agent on Ubuntu

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will provision an Ubuntu VM in AWS or Azure and configure it as a self-hosted Azure Pipelines agent. You will create an agent pool, register the agent using a Personal Access Token (PAT), run it as a Linux system service, and verify it by executing a test pipeline on the VM.

---

# Task 0 — Create or Access Azure DevOps

## Goal

Sign in to Azure DevOps and create or access an organization and project for the assignment.

No submission screenshot is required for this task.

---

# Task 1 — Create a Personal Access Token (PAT)

## Goal

Create and securely store the PAT required to register the self-hosted agent.

No submission screenshot is required for this task.

> Do not include the PAT in this document or in any screenshot.

---

# Task 2 — Create a Self-Hosted Agent Pool

## Goal

Create the Azure DevOps agent pool that will contain the Linux agent.

No submission screenshot is required for this task.

---

# Task 3 — Provision and Connect to the Ubuntu VM

## Goal

Provision an Ubuntu VM in AWS or Azure and verify its operating system, architecture, and outbound connection to Azure DevOps.

## Evidence

### Screenshot 1 — Ubuntu VM Running

Add a screenshot from AWS or Azure showing:

* Ubuntu VM name
* VM status as **Running**
* Public IP address

<img width="881" height="764" alt="1" src="https://github.com/user-attachments/assets/fb21f8b3-0750-4885-bc80-00590af6248d" />


---

### Screenshot 2 — Ubuntu, Architecture, and HTTPS Verification

Add an SSH terminal screenshot showing the output of:

* `cat /etc/os-release`
* `uname -m`
* `curl -I https://dev.azure.com`

The screenshot must confirm a supported Ubuntu version, `x86_64` architecture, and a successful HTTP response from Azure DevOps.

<img width="712" height="915" alt="2" src="https://github.com/user-attachments/assets/3f12724f-906c-4d30-ac50-b02fd916d865" />


---

# Task 4 — Install and Configure the Azure Pipelines Agent

## Goal

Download, configure, and register the Linux Azure Pipelines agent, and run it as a system service.

## Evidence

### Screenshot 3 — Agent Configuration and Service Status

Add a terminal screenshot showing:

* Successful agent configuration
* Agent service installation
* Agent service start
* `sudo ./svc.sh status` reporting that the service is running

<img width="1504" height="750" alt="3" src="https://github.com/user-attachments/assets/35fe2d2f-54c2-4bd2-b303-320b60f87a46" />


> Ensure that the PAT is not visible.

---

# Task 5 — Verify That the Agent Is Online

## Goal

Confirm that the agent service is running and the agent appears online in Azure DevOps.

## Evidence

### Screenshot 4 — Agent Online in Azure DevOps

Add a screenshot of the Azure DevOps Agent Pool **Agents** page showing:

* Selected agent pool
* Selected agent name
* Agent status as **Online**
* Agent enabled and available

<img width="927" height="831" alt="4" src="https://github.com/user-attachments/assets/bc544bcc-8ac4-4699-81e1-52f30242b9ec" />


---

# Task 6 — Create and Run a Test Pipeline

## Goal

Create an Azure DevOps YAML pipeline and verify that its commands execute on the self-hosted Ubuntu VM.

## Evidence

### Screenshot 5 — Azure Pipelines YAML

Add a screenshot of `azure-pipelines.yml` open in the Azure Repos editor showing:

* `trigger: none`
* Selected self-hosted agent pool
* Bash verification step
* Your Full Name
* Linux verification commands

<img width="817" height="861" alt="5" src="https://github.com/user-attachments/assets/8d004d9f-8881-4ee8-8375-5742ea95f04d" />


---

### Screenshot 6 — Successful Test Pipeline

Add a screenshot of the successful Azure DevOps pipeline run showing:

* Overall status as **Succeeded**
* Expanded **Verify self-hosted Ubuntu agent** step
* `Submitted by: <your-full-name>`
* Agent name
* Machine name
* Output from `uname -a`
* Output from `whoami`
* Output from `df -h`
* Output from `pwd`

<img width="1296" height="912" alt="6" src="https://github.com/user-attachments/assets/80bd9e8b-cb3f-4e30-806e-ed3f78e00b9d" />


---

## Completed azure-pipelines.yml

Paste the contents of your completed `azure-pipelines.yml` file below.

```yaml
trigger: none

pool:
  name: SelfHostedPool

steps:
  - bash: |
      echo "Submitted by: Kafayat Olaide Aziz"
      echo "Agent name: $AGENT_NAME"
      echo "Machine name: $(hostname)"
      echo "Linux verification:"
      echo "uname -a:"
      uname -a
      echo "whoami:"
      whoami
      echo "df -h:"
      df -h
      echo "pwd:"
      pwd
    displayName: "Verify self-hosted Ubuntu agent"
```

> Do not include your PAT, SSH private key, password, or cloud credentials in the YAML file.

---

# Assignment Summary

Write a short summary of what you configured.

In this assignment, I configured a self-hosted Azure DevOps agent on an Ubuntu 24.04 AWS EC2 instance. I created an Azure DevOps agent pool, provisioned and connected to the Ubuntu VM through SSH, verified the Linux environment and its connection to Azure DevOps, and registered the VM as a self-hosted agent using a Personal Access Token.
 
I then configured the Azure DevOps agent to run as a system service and confirmed that it was online and available in the SelfHostedPool. Finally, I created an azure-pipelines.yml file and ran a test pipeline using the self-hosted agent. 

The pipeline successfully executed Linux commands such as uname -a, whoami, df -h, and pwd directly on the AWS EC2 instance. This helped me understand how AWS infrastructure, Linux, Azure DevOps, agent pools, system services, authentication, and CI/CD pipelines connect together to execute automated workloads on infrastructure I control.

---

# LinkedIn Requirement (If Applicable)

## Screenshot 7 — LinkedInisor填Token Belle

Add a screenshot of your LinkedIn post showing:

* What you configured
* Why organizations use self-hosted agents
* Three to five lines explaining your experience
* A screenshot of the successful pipeline run with no secrets visible

<img width="558" height="794" alt="linkedinpost" src="https://github.com/user-attachments/assets/786aee2b-3265-4aaf-93bc-55f9db518be6" />


**LinkedIn Post URL:** https://lnkd.in/p/eZRjzwGd

---

# Submission Instructions

* Include the short assignment summary.
* Include Screenshots 1–6.
* Include the contents of your completed `azure-pipelines.yml` file.
* Include Screenshot 7 and the LinkedIn post URL if the LinkedIn requirement applies.
* Do not expose a PAT, SSH private key, password, account details, or another secret.

---

# Completion Checklist

* Azure DevOps organization and project are ready
* A supported Ubuntu LTS VM is running and accessible through SSH
* SSH access is restricted to your public IP address
* Outbound HTTPS connectivity is working
* PAT was created with the required scopes and stored securely
* A self-hosted agent pool was created
* The same pool name was used during registration and in the pipeline YAML
* The agent service is running
* The agent appears **Online** in Azure DevOps
* The pipeline targets the selected agent pool
* The pipeline run completed with **Succeeded** status
* The pipeline output displays your Full Name
* Screenshots 1–6 are included and readable
* Screenshot 7 and the LinkedIn post URL are included if applicable
* The completed `azure-pipelines.yml` content is included
* No PAT, SSH private key, password, or other secret is visible

---

*This submission is part of the DevOps Micro Internship (DMI) — Agentic AI Track.*
