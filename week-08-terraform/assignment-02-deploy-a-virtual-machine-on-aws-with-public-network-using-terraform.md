# Assignment 2 — Create an AWS EC2 Virtual Machine Using Terraform

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will use Terraform to provision a complete AWS environment consisting of a custom VPC, public and private subnets, an Internet Gateway, a public route table, a security group, and an EC2 instance deployed inside the public subnet.

You will configure SSH and HTTP access, install Nginx, capture the EC2 instance’s public IP address, verify the deployment using AWS CLI and a web browser, and destroy all Terraform-managed resources after testing.

---

# Task 0 — Set Up and Verify the Terraform and AWS CLI Environment

## Goal

Prepare your local environment for Terraform deployment by installing Terraform, AWS CLI, and the HashiCorp Terraform extension in VS Code, configuring AWS CLI with your AWS account, and confirming that all required tools are working correctly.

### Evidence

#### Screenshot 1 — Terminal showing successful `aws --version` output

Ensure that your full name is visible and that no AWS credentials, account IDs, or other sensitive information are exposed.

<img width="1228" height="697" alt="1" src="https://github.com/user-attachments/assets/16c9464a-f87c-42f8-85df-7ae9591b2add" />


---

# Task 1 — Create a New Terraform Project and Define the Infrastructure

## Goal

Create a new Terraform project and define the complete AWS EC2 environment in `main.tf` by using the official Terraform Registry documentation.

The configuration must include:

* Terraform and AWS provider configuration
* Custom VPC using the CIDR block `10.0.0.0/16`
* Public subnet using the CIDR block `10.0.1.0/24`
* Private subnet using the CIDR block `10.0.2.0/24`
* Internet Gateway
* Public route table with a route to `0.0.0.0/0`
* Public subnet route table association
* Security group allowing SSH on port `22`
* Security group allowing HTTP on port `80`
* EC2 instance deployed inside the public subnet
* SSH authentication configuration
* Public IP address association
* Public IP output block

### Evidence

#### Screenshot 2 — VS Code showing the AWS provider configuration and VPC configuration in `main.tf`

<img width="1792" height="1120" alt="2" src="https://github.com/user-attachments/assets/b53e55eb-cfb6-4fce-ac65-da1f0cc15e58" />

<img width="1792" height="1120" alt="2 1" src="https://github.com/user-attachments/assets/112cb7e4-943a-478c-96ad-a41530c9ea81" />

<img width="1792" height="1120" alt="2 2" src="https://github.com/user-attachments/assets/2411ca7a-5d55-4bc0-a149-f21a227777d1" />

<img width="1792" height="1120" alt="2 3" src="https://github.com/user-attachments/assets/3b3cfd01-d61d-42b8-a5f4-cba477cf782d" />

---

#### Screenshot 3 — VS Code showing the EC2 instance configuration and public IP `output` block in `main.tf`

Ensure that no AWS credentials, private keys, account IDs, or other sensitive information are visible.

<img width="1396" height="1005" alt="3" src="https://github.com/user-attachments/assets/2af6e22d-3b9e-44e4-afb4-6c77209b5dfd" />


---

# Task 2 — Initialize Terraform

## Goal

Initialize the Terraform working directory and download the required provider components.

### Evidence

#### Screenshot 4 — Terminal showing the successful `terraform init` output

<img width="1086" height="946" alt="4" src="https://github.com/user-attachments/assets/985b263c-fae3-4412-af0c-58598280b098" />


---

# Task 3 — Plan and Apply the Configuration

## Goal

Review the Terraform execution plan, provision the AWS resources, and record the EC2 instance’s public IP address from the Terraform output.

### Evidence

#### Screenshot 5 — Terraform plan summary showing the proposed resources

<img width="1395" height="986" alt="5" src="https://github.com/user-attachments/assets/93257cad-bd6c-4130-984a-bdbfc2f44394" />


---

#### Screenshot 6 — Terraform apply output showing successful completion

<img width="1397" height="1009" alt="6" src="https://github.com/user-attachments/assets/5585d28d-f106-4d43-8629-3916269abbe6" />

<img width="1399" height="1006" alt="6 1" src="https://github.com/user-attachments/assets/84f697a3-15d6-4fd9-beb4-289315c9d5ab" />

<img width="1399" height="1006" alt="6 2" src="https://github.com/user-attachments/assets/d2e3a3f1-dbb1-4d7d-96f4-b518954162f9" />

<img width="1395" height="1009" alt="6 3" src="https://github.com/user-attachments/assets/2548a1b2-0196-480e-9dad-ae57ae09e55a" />

<img width="1792" height="535" alt="7" src="https://github.com/user-attachments/assets/ee4af6c4-cd33-4d97-9df0-3b76fc42a427" />

---

#### Screenshot 7 — Terraform output showing the public IP address of the EC2 instance

<img width="1792" height="535" alt="7" src="https://github.com/user-attachments/assets/e1bb1f13-49b1-474f-81a1-6a8364603fce" />


---

### EC2 Public IP Address

Record the public IP address displayed by `terraform output`.

**EC2 Public IP Address:** 52.48.220.114

---

# Task 4 — Verify the Deployment

## Goal

Confirm through AWS CLI that the EC2 instance was created successfully and is running, and verify HTTP access through the instance public IP.

Confirm that:

* The EC2 instance appears in the AWS CLI output.
* The EC2 instance state shows `running`.
* The public IP shown by AWS matches the public IP recorded from Terraform.
* Nginx is installed and running.
* The Nginx page is accessible through the EC2 instance’s public IP.

### Evidence

#### Screenshot 8 — AWS CLI output showing the EC2 instance ID, `running` state, and public IP address

<img width="1396" height="612" alt="8" src="https://github.com/user-attachments/assets/bc061b6a-7bff-417f-8bf2-3cb0f195b928" />


---

#### Screenshot 9 — Browser showing the Nginx page successfully loaded using the EC2 instance public IP

<img width="1792" height="1049" alt="9 0" src="https://github.com/user-attachments/assets/c0d15f42-5657-41ff-a255-f461d1f902df" />


---

# Task 5 — Destroy the Resources

## Goal

Remove all AWS resources created by Terraform after completing the deployment and verification.

### Evidence

#### Screenshot 10 — Terminal showing successful `terraform destroy` completion

<img width="1393" height="1007" alt="10" src="https://github.com/user-attachments/assets/11e2629b-efe8-4c24-98a0-897673d84154" />


---

# Submission Instructions

* Complete all tasks in sequence.
* Include all required screenshots specified in Tasks 0–5.
* Ensure that your full name is visible in the required screenshots.
* Record the EC2 public IP address in Task 3.
* Follow the screenshot requirements exactly as specified.
* Ensure that the submitted evidence clearly matches the required task outputs.
* Do not expose AWS access keys, secret keys, private keys, passwords, account IDs, or other sensitive information.
* Do not upload your private key file (`.pem`) to your GitHub repository.
* Review your submission carefully before submitting it through GitHub.

---

# Completion Checklist

* [✔] Installed Terraform and verified it using `terraform version`
* [✔] Installed AWS CLI and verified it using `aws --version`
* [✔] Configured AWS CLI and verified account access
* [✔] Confirmed the correct AWS Region
* [✔] Installed and enabled the HashiCorp Terraform extension in VS Code
* [✔] Created the `terraform-aws-vm` project directory and `main.tf`
* [✔] Added the Terraform and AWS provider configuration
* [✔] Defined the custom VPC, public subnet, and private subnet
* [✔] Configured the Internet Gateway and public route table
* [✔] Associated the public route table with the public subnet
* [✔] Defined the security group for SSH and HTTP access
* [✔] Restricted SSH access to my public IP whenever possible
* [✔] Defined the EC2 instance inside the public subnet
* [✔] Configured SSH authentication without exposing the private key
* [✔] Added the Terraform output for the EC2 public IP address
* [✔] Completed `terraform init` successfully
* [✔] Reviewed the Terraform execution plan using `terraform plan`
* [✔] Completed `terraform apply` successfully
* [✔] Captured and recorded the EC2 public IP using `terraform output`
* [✔] Verified that the EC2 instance is running using AWS CLI
* [✔] Verified that the AWS public IP matches the Terraform output
* [✔] Verified Nginx access through the EC2 public IP
* [✔] Completed `terraform destroy` successfully
* [✔] Captured all 10 required screenshots
* [✔] Confirmed that my full name is visible in the required screenshots
* [✔] Checked that no AWS credentials, private keys, passwords, account IDs, or other sensitive information are visible
* [✔] Confirmed that no `.pem` private key file has been uploaded to the GitHub repository

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory), focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations through hands-on experience.

---

## 📌 Resources

* 🌐 DMI Official Website: https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme
* 🎓 University: https://university.pravinmishra.com?utm_source=github&utm_medium=readme
* 💬 Discord Community: https://discord.pravinmishra.com?utm_source=github&utm_medium=readme
* 📝 Blog: https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme
* ▶️ YouTube Playlist: https://www.youtube.com/playlist?list=PLFeSNDtI4Cho
* 🔗 Pravin Mishra (LinkedIn): https://www.linkedin.com/in/pravin-mishra-aws-trainer/
* 🏢 CloudAdvisory (LinkedIn): https://www.linkedin.com/company/thecloudadvisory/

---

*This submission is part of the DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
