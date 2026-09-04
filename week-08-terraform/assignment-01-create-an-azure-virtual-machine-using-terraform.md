# Assignment 1 — Create an Azure Virtual Machine using Terraform

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will use Terraform to provision a complete Azure Virtual Machine environment, including a resource group, virtual network, subnet, public IP, network interface, and a Linux-based virtual machine. You will set up and verify the required local tools, define the infrastructure in Terraform, initialize the project, review and apply the plan, verify the running VM through Azure CLI, capture the public IP output, and destroy the resources after testing.

---

# Task 0 — Set Up and Verify the Terraform and Azure CLI Environment

## Goal

Prepare your local environment for Terraform deployment by installing Terraform, Azure CLI, and the HashiCorp Terraform extension in VS Code, signing in to your Azure account, and confirming that all required tools are working correctly.

### Evidence

#### Screenshot 1 — Terminal showing successful `terraform version` output

<img width="1230" height="558" alt="1" src="https://github.com/user-attachments/assets/cac5503d-4048-450e-8c43-36dbb4a8cefb" />


---

#### Screenshot 2 — Terminal showing successful `az version` output

<img width="1203" height="466" alt="2" src="https://github.com/user-attachments/assets/cd069a01-adcf-457f-bb15-ea6af5fcb022" />


---

#### Screenshot 3 — VS Code Extensions panel showing the HashiCorp Terraform extension installed and enabled

<img width="1304" height="1087" alt="3" src="https://github.com/user-attachments/assets/47bb9b29-7d6e-48ab-9011-de5ae53b1647" />

<img width="1304" height="1088" alt="3 1" src="https://github.com/user-attachments/assets/da4f710f-90ec-4a2d-86fe-b6c82319d4c5" />

---

# Task 1 — Create a New Terraform Project and Define the Infrastructure

## Goal

Create a new Terraform project and define the complete Azure Virtual Machine environment in `main.tf` by using the official Terraform Registry documentation.

### Evidence

#### Screenshot 4 — VS Code showing the AzureRM provider configuration and resource group configuration in `main.tf`

<img width="1792" height="1120" alt="4" src="https://github.com/user-attachments/assets/c2e10303-058b-4ee9-a91f-a2d53c82c58e" />

<img width="1792" height="1120" alt="4 1" src="https://github.com/user-attachments/assets/d02ee01c-2259-401e-99af-a846ffa5d5c2" />

---

#### Screenshot 5 — VS Code showing the Linux virtual machine configuration and public IP `output` block in `main.tf`. Ensure that the VM password is hidden or redacted

<img width="1531" height="494" alt="5" src="https://github.com/user-attachments/assets/21d9326a-0310-4d24-94c1-2cbd6c3ea344" />

---

# Task 2 — Initialize Terraform

## Goal

Initialize the Terraform working directory and download the required provider components.

### Evidence

#### Screenshot 6 — Terminal showing the successful `terraform init` output

<img width="1429" height="1090" alt="6" src="https://github.com/user-attachments/assets/5a845a34-7ebc-4eb7-9ad1-59bdf57f5db3" />


---

# Task 3 — Plan and Apply the Configuration

## Goal

Review the Terraform execution plan and provision the Azure resources.

### Evidence

#### Screenshot 7 — Terraform plan summary showing the proposed resources

<img width="1632" height="1022" alt="7" src="https://github.com/user-attachments/assets/472a659b-7382-4aee-9993-da03f51e87c5" />

<img width="1680" height="1053" alt="7 1" src="https://github.com/user-attachments/assets/ac832cab-66e0-44bb-b048-16aa1e644ace" />

---

#### Screenshot 8 — Terraform apply output showing successful completion

<img width="1792" height="1120" alt="8" src="https://github.com/user-attachments/assets/5e4f3fc4-a51a-41bb-9f85-012e623449f9" />

<img width="1445" height="616" alt="8 1" src="https://github.com/user-attachments/assets/a515fb8b-6ca7-4171-b812-3f3c0d67aada" />

---

#### Screenshot 9 — Terraform output showing the public IP address of the VM

<img width="1441" height="182" alt="9" src="https://github.com/user-attachments/assets/54ff4530-7c16-4a65-98ad-cd8e8a595a13" />


### Question

VM Public IP Address: - 20.215.65.145

---

# Task 4 — Verify the Deployment

## Goal

Confirm through Azure CLI that the virtual machine was created successfully and is currently running.

### Evidence

#### Screenshot 10 — Azure CLI output showing the deployed VM name and `VM running` status

<img width="1620" height="436" alt="10" src="https://github.com/user-attachments/assets/e148fafd-5d13-41db-8925-03d2c2ff1e32" />


---

# Task 5 — Destroy the Resources

## Goal

Remove all Azure resources created by Terraform after completing the deployment and verification.

### Evidence

#### Screenshot 11 — Terminal showing successful `terraform destroy` completion

<img width="1239" height="1088" alt="11" src="https://github.com/user-attachments/assets/165e4544-69c5-4c8f-abb7-9cf5ba1a4223" />


---

# Submission Instructions

- Complete all tasks in sequence and include all required screenshots specified in Tasks 0–5.
- Do not expose passwords, keys, account IDs, or other sensitive information in screenshots.

---

# Completion Checklist

- Installed Terraform and verified it using `terraform version`
- Installed Azure CLI and verified it using `az version`
- Signed in to Azure using `az login`
- Confirmed the correct Azure subscription
- Installed and enabled the HashiCorp Terraform extension in VS Code
- Created the `terraform-azure-vm` project directory and `main.tf`
- Added the Terraform and AzureRM provider configuration
- Defined the resource group, virtual network, subnet, public IP, and network interface
- Defined the Linux virtual machine with username and password-based authentication
- Added the Terraform output for the VM public IP address
- Completed `terraform init` successfully
- Reviewed the Terraform execution plan using `terraform plan`
- Completed `terraform apply` successfully
- Captured and recorded the VM public IP using `terraform output`
- Verified that the VM is running using Azure CLI
- Completed `terraform destroy` successfully
- Captured all required screenshots
- Checked that no passwords, keys, account IDs, or other sensitive information are visible in the screenshots

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

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
