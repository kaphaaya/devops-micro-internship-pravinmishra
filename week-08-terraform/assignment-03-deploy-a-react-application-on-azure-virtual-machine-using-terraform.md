# Assignment 3 — Deploy a React Application on Azure Using Terraform

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will use Terraform to provision the required Azure infrastructure and automatically deploy the `my-react-app` React application on an Azure Linux virtual machine using a `cloud-init.sh` deployment script passed to the VM through `custom_data`.

You will verify the automated deployment through SSH, confirm that Nginx is running, access the React application through the VM public IP, and destroy the Terraform-managed resources after testing.

---

# Task 0 — Set Up and Verify the Terraform and Azure CLI Environment

## Goal

Prepare your local environment for Terraform deployment by installing Terraform, Azure CLI, and the HashiCorp Terraform extension in VS Code, signing in to your Azure account, and confirming that all required tools are working correctly.

## Evidence

### Screenshot 1 — Terraform Version

Add a screenshot of the terminal showing successful `terraform version` output.

<img width="1392" height="1043" alt="1" src="https://github.com/user-attachments/assets/04f0759d-2d63-4d89-a01a-81a7bb8f1dda" />


---

### Screenshot 2 — Azure CLI Version

Add a screenshot of the terminal showing successful `az version` output.

<img width="1399" height="1037" alt="2" src="https://github.com/user-attachments/assets/c67d89d1-77d0-46d2-bf52-a5edfe736e85" />


---

### Screenshot 3 — HashiCorp Terraform Extension

Add a screenshot of the VS Code Extensions panel showing the HashiCorp Terraform extension installed and enabled.

<img width="1394" height="1044" alt="3" src="https://github.com/user-attachments/assets/374ddae9-404c-4c81-82d4-5a48de6c7ee9" />



---

# Task 1 — Create a New Terraform Project and Define the Infrastructure

## Goal

Create a new Terraform project and define the complete Azure infrastructure required to host the React application using the official Terraform Registry documentation.

The `terraform-react-azure` project must contain:

```text
terraform-react-azure/
├── main.tf
└── cloud-init.sh
```

The Terraform configuration must include:

- Terraform and AzureRM provider configuration
- Resource group
- Virtual network and subnet
- Network Security Group
- SSH rule for TCP port `22`
- HTTP rule for TCP port `80`
- Public IP address
- Network interface
- Linux virtual machine
- `custom_data` configuration referencing `cloud-init.sh`
- Public IP output

The `cloud-init.sh` file must contain the complete automated React application deployment workflow based on the repository instructions.

## Evidence

### Screenshot 4 — Provider, Resource Group, and Network Security Group

Add a screenshot of VS Code showing the AzureRM provider, resource group, and Network Security Group configuration in `main.tf`.

<img width="1591" height="856" alt="4" src="https://github.com/user-attachments/assets/89814633-b08f-4cb3-9a98-639f0177a945" />

<img width="1588" height="1043" alt="4 1" src="https://github.com/user-attachments/assets/fa7c60ab-ac37-4b9b-a3fb-067f63fb5c38" />

<img width="1587" height="755" alt="4 2" src="https://github.com/user-attachments/assets/6d88d95e-3b3a-441e-8064-298fe3770b5c" />


<img width="1315" height="756" alt="4 4" src="https://github.com/user-attachments/assets/74c607dd-7803-4785-af1e-8e8a6b1f383d" />

---

### Screenshot 5 — Linux Virtual Machine and `custom_data`

Add a screenshot of VS Code showing the Linux virtual machine configuration, including the `custom_data` configuration, in `main.tf`.

Ensure that passwords, private keys, account IDs, access tokens, and other sensitive information are hidden.

<img width="1319" height="677" alt="5" src="https://github.com/user-attachments/assets/38ad68b5-8f17-4ea0-9b57-4b47e4bca773" />


---

### Screenshot 6 — Completed `cloud-init.sh`

Add a screenshot of VS Code showing the completed `cloud-init.sh` deployment script.

Ensure that no passwords, Azure credentials, access tokens, SSH private keys, or other sensitive information are visible.

<img width="1792" height="942" alt="6" src="https://github.com/user-attachments/assets/d77dd379-a048-4249-aae6-9680a0cb497a" />

<img width="1792" height="943" alt="6 1" src="https://github.com/user-attachments/assets/1abda096-e7bc-4b83-85d1-c8f0bbcfe1c3" />

---

### Screenshot 7 — Public IP Output Block

Add a screenshot of VS Code showing the public IP `output` block in `main.tf`.

<img width="1205" height="525" alt="7" src="https://github.com/user-attachments/assets/62c9c330-9bd0-405c-920c-95d198978416" />


---

# Task 2 — Initialize Terraform

## Goal

Initialize the Terraform working directory and download the required provider components.

## Evidence

### Screenshot 8 — Terraform Initialization

Add a screenshot of the terminal showing successful `terraform init` output.


<img width="1429" height="1090" alt="6" src="https://github.com/user-attachments/assets/f41134a4-d806-43e8-ba39-070e134503da" />


---

# Task 3 — Plan and Apply the Configuration

## Goal

Review the Terraform execution plan and provision the Azure infrastructure.

## Evidence

### Screenshot 9 — Terraform Plan

Add a screenshot showing the Terraform plan summary and the proposed resources.

<img width="854" height="760" alt="9" src="https://github.com/user-attachments/assets/f747ca30-c1df-4122-9342-47fa21790e8a" />

<img width="849" height="637" alt="9 1" src="https://github.com/user-attachments/assets/bee531f1-2315-4930-a503-7a42f6b73c3b" />

---

### Screenshot 10 — Terraform Apply

Add a screenshot showing successful `terraform apply` completion.

<img width="966" height="697" alt="10" src="https://github.com/user-attachments/assets/2c67e9f1-67e1-47d6-b236-f97234a22275" />

<img width="966" height="780" alt="10 1" src="https://github.com/user-attachments/assets/20af7e5b-c611-4a63-899a-1e6795a40ff7" />


<img width="964" height="779" alt="10 2" src="https://github.com/user-attachments/assets/9b06eccb-4c3a-414e-96d2-18539a990ac1" />


---

### Screenshot 11 — VM Public IP Output

Add a screenshot showing the VM public IP address returned by `terraform output`.

<img width="961" height="150" alt="11" src="https://github.com/user-attachments/assets/8bafa64a-012f-4eb6-a23d-92c7b5c731a8" />


## VM Public IP Address

Record the public IP address displayed by `terraform output`.

**VM Public IP Address:** 74.248.33.51

---

# Task 4 — Verify the Automated Deployment

## Goal

Connect to the Azure Linux virtual machine and confirm that the cloud-init/user data deployment script completed successfully.

## Evidence

### Screenshot 12 — SSH Connection and Completed React Deployment

Add a screenshot of the SSH terminal showing a successful connection to the Azure VM and evidence that the React application deployment completed.

<img width="1282" height="690" alt="12" src="https://github.com/user-attachments/assets/310fbae1-3a83-4b0f-b3e5-f13d498832a2" />


---

### Screenshot 13 — Nginx Service Status

Add a screenshot of the terminal showing that the Nginx service is running successfully.

<img width="1285" height="688" alt="13" src="https://github.com/user-attachments/assets/f468aaba-491a-4975-b24d-2728b8d4b047" />


---

# Task 5 — Verify the React Application Deployment

## Goal

Confirm that the automatically deployed React application is publicly accessible and functioning correctly.

## Evidence

### Screenshot 14 — React Application in the Browser

Add a screenshot of the browser showing the deployed React application successfully loaded using the Azure VM public IP.

Ensure that the Azure VM public IP is visible in the browser address bar.

<img width="1200" height="1090" alt="14" src="https://github.com/user-attachments/assets/eba9e2f6-4c84-4621-988f-501d4ba40caf" />


---

# Task 6 — Destroy the Resources

## Goal

Remove all Azure resources created by Terraform after completing the application deployment and verification.

## Evidence

### Screenshot 15 — Terraform Destroy

Add a screenshot of the terminal showing successful `terraform destroy` completion.

<img width="1307" height="1092" alt="15" src="https://github.com/user-attachments/assets/78c2bbad-a557-486c-b454-1371172e2f72" />


<img width="1313" height="1087" alt="15 1" src="https://github.com/user-attachments/assets/f5b6bc39-25e9-4c52-995b-f142887caa07" />


<img width="1317" height="1091" alt="15 2" src="https://github.com/user-attachments/assets/7f475468-972b-4253-8780-712643fa4192" />

---

# Submission Instructions

- Complete Tasks 0–6 in sequence.
- Include all 15 required screenshots exactly as specified.
- Ensure that your full name is visible in the required screenshots.
- Record the VM public IP address under Task 3.
- Ensure that the submitted evidence clearly matches the required task outputs.
- Include `main.tf` and `cloud-init.sh` in your GitHub submission.
- Do not expose passwords, SSH private keys, account IDs, access tokens, Azure credentials, or other sensitive information.
- Do not store secrets inside `cloud-init.sh`.
- Review all screenshots and project files carefully before submitting through GitHub.

---

# Completion Checklist

- [✅] Installed Terraform and verified it using `terraform version`
- [✅] Installed Azure CLI and verified it using `az version`
- [✅] Signed in to Azure and confirmed the correct subscription
- [✅] Installed and enabled the HashiCorp Terraform extension in VS Code
- [✅] Created the `terraform-react-azure` project
- [✅] Created `main.tf`
- [✅] Defined the Terraform and AzureRM provider configuration
- [✅] Defined the resource group
- [✅] Defined the virtual network and subnet
- [✅] Defined the Network Security Group
- [✅] Configured SSH and HTTP rules
- [✅] Defined the public IP and network interface
- [✅] Created `cloud-init.sh`
- [✅] Reviewed the React application repository instructions
- [✅] Created the complete deployment workflow inside `cloud-init.sh`
- [✅] Defined the Linux virtual machine
- [✅] Connected `cloud-init.sh` to the VM using `custom_data`
- [✅] Used `file()` and `base64encode()` correctly
- [✅] Added the Terraform public IP output
- [✅] Completed `terraform init` successfully
- [✅] Reviewed the Terraform execution plan
- [✅] Completed `terraform apply` successfully
- [✅] Recorded the VM public IP
- [✅] Connected to the VM through SSH
- [✅] Verified that the automated deployment completed successfully
- [✅] Verified that Nginx is running
- [✅] Verified the React application through the browser
- [✅] Completed `terraform destroy` successfully
- [✅] Captured all 15 required screenshots
- [✅] Confirmed that my full name is visible in the required screenshots
- [✅] Checked that no passwords, keys, account IDs, access tokens, or other sensitive information are exposed

---

## About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory), focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations through hands-on experience.

---

## Resources

- React Application Repository: [https://github.com/pravinmishraaws/my-react-app](https://github.com/pravinmishraaws/my-react-app)
- DMI Official Website: [https://dmi.pravinmishra.com](https://dmi.pravinmishra.com)
- University: [https://university.pravinmishra.com](https://university.pravinmishra.com)
- Discord Community: [https://discord.pravinmishra.com](https://discord.pravinmishra.com)
- Blog: [https://dmi.pravinmishra.com/blog](https://dmi.pravinmishra.com/blog)
- YouTube Playlist: [https://www.youtube.com/playlist?list=PLFeSNDtI4Cho](https://www.youtube.com/playlist?list=PLFeSNDtI4Cho)
- Pravin Mishra on LinkedIn: [https://www.linkedin.com/in/pravin-mishra-aws-trainer/](https://www.linkedin.com/in/pravin-mishra-aws-trainer/)
- CloudAdvisory on LinkedIn: [https://www.linkedin.com/company/thecloudadvisory/](https://www.linkedin.com/company/thecloudadvisory/)

---

*This submission is part of the DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
