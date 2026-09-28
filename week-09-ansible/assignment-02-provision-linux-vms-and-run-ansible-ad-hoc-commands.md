# Assignment 02 — Provision Linux VMs with Terraform and Run Ansible Ad-Hoc Commands

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will use Terraform to provision three or four Ubuntu Linux Virtual Machines on either Microsoft Azure or Amazon Web Services.

You will configure SSH key-based authentication, organize the servers using a custom Ansible inventory, and run Ansible ad-hoc commands across individual hosts and inventory groups.

---

# Task 1 — Create the Multi-Host Lab Structure

## Goal

Create a separate project directory for the multi-host lab and prepare the Terraform, Ansible, and documentation files.

This project will use the Git repository and Ansible controller prepared in Assignment 01.

### Evidence

#### Screenshot 1 — Terminal showing the complete `ansible-adhoc-lab` project structure

<img width="1063" height="387" alt="1" src="https://github.com/user-attachments/assets/482d1309-2779-4324-8b0c-05ab2bcf372b" />


---

#### Screenshot 2 — Terminal showing `git status --short` with the new project files and updated `.gitignore`

<img width="1071" height="381" alt="2" src="https://github.com/user-attachments/assets/65168958-2c6a-417e-af2d-a9cb7d891d59" />


---

### Notes

I created a separate ansible-adhoc-lab project for this assignment so that the Terraform infrastructure, Ansible configuration, inventory, and documentation could be kept together.

The project contains the Terraform files (main.tf, variables.tf, and outputs.tf) for creating the AWS infrastructure, as well as the Ansible configuration and inventory files.

I also configured .gitignore to prevent files such as Terraform state, the .terraform directory, and the Python virtual environment from being committed to Git.

The main idea I learned from this task is that a DevOps project should be organised so that infrastructure and configuration can be managed as code rather than relying on manual steps.

---

# Task 2 — Create the Terraform Configuration

## Goal

Create the Terraform configuration required to provision three or four Ubuntu Linux VMs on your selected cloud platform.

Complete only one option:

- Option A — Microsoft Azure
- Option B — Amazon Web Services

Do not configure both providers for this assignment.

### Evidence

#### Screenshot 3 — Terraform configuration showing the three or four server roles and the `for_each` or `count` implementation

<img width="1068" height="143" alt="3" src="https://github.com/user-attachments/assets/a3ec67d0-1338-41e1-b053-e10ec4be3c8f" />

---

#### Screenshot 4 — Terraform configuration showing SSH restricted to the controller IP and HTTP allowed only for web hosts

<img width="1070" height="432" alt="4" src="https://github.com/user-attachments/assets/b568dbe2-0657-4461-bb5f-56e560ef69e8" />


---

#### Screenshot 5 — Terraform output configuration showing how public IP addresses are associated with the server roles

<img width="1075" height="727" alt="5" src="https://github.com/user-attachments/assets/6adc7c00-5c9e-44bc-98e7-b6ac85432d60" />


---

### Notes

For this assignment, I selected Amazon Web Services (AWS) as my cloud provider.

I used Terraform to define the infrastructure required for the lab, including the VPC, subnet, internet gateway, route table, security group, SSH key pair, and EC2 instances.

I used a for_each approach with server roles such as web1, web2, app1, and db1. This allowed me to create multiple EC2 instances from the same Terraform resource instead of copying and pasting the same configuration for every server.

I also configured the web servers to receive public IP addresses while the application and database servers were kept private.

For security, SSH access was restricted to my controller's public IP address instead of allowing SSH from every IP address. This helped me understand the principle of reducing unnecessary exposure.

The configuration also used role-based rules so that web servers could be treated differently from application and database servers.


---

# Task 3 — Provision the Infrastructure with Terraform

## Goal

Initialize and validate the Terraform configuration, review the execution plan, provision the selected three or four VMs, and retrieve their public IP addresses.

### Evidence

#### Screenshot 6 — Final `terraform apply` output showing `Apply complete`

<img width="1074" height="733" alt="6" src="https://github.com/user-attachments/assets/7801d379-237e-4ce3-88df-ec87a3fb45d5" />


---

#### Screenshot 7 — `terraform output public_ips` showing the role-to-IP mapping for all three or four VMs

<img width="1072" height="735" alt="7" src="https://github.com/user-attachments/assets/fbbc250f-17e1-4d40-8b9f-58f1f09da7c4" />


---

#### Screenshot 8 — Azure Portal or AWS Management Console showing all three or four VMs in the `Running` state, with their role-based names visible

<img width="1074" height="233" alt="8" src="https://github.com/user-attachments/assets/27f9b021-3623-470d-986c-dd7fe64c2eab" />


---

### Notes

I initialized and validated the Terraform configuration before creating the infrastructure.

Running terraform validate confirmed that the Terraform configuration was valid, while terraform apply was used to actually provision the AWS resources.

Terraform successfully created the lab infrastructure, including the four EC2 instances:

web1

web2

app1

db1

The Terraform outputs provided the instance IDs, private IP addresses, and public IP addresses where applicable.

This task helped me understand the difference between writing infrastructure configuration and actually provisioning that infrastructure. Terraform allows the infrastructure to be described as code and then creates the required AWS resources from that configuration.

---

# Task 4 — Verify SSH Key-Based Access

## Goal

Verify that each managed VM can be accessed from the Ansible controller using SSH key-based authentication.

### Evidence

#### Screenshot 9 — Terminal showing successful SSH hostname output from all VMs

<img width="1074" height="662" alt="9" src="https://github.com/user-attachments/assets/de911871-d79e-4f3e-bb60-03e3bc7b8358" />


---

### Notes

I verified SSH key-based access from my Mac, which was acting as the Ansible controller, to the AWS Ubuntu servers.

I used the Terraform-generated private SSH key to connect to the web server. After connecting, I ran commands such as hostname and whoami to confirm that I was connected to the correct machine and that the expected ubuntu user was being used.

This step was important because Ansible relies on SSH to communicate with Linux servers. Therefore, I needed to confirm that SSH access worked before troubleshooting Ansible itself.

The main lesson I learned was to troubleshoot infrastructure in layers. If SSH does not work, there is no point trying to troubleshoot Ansible yet.

---

# Task 5 — Create the Custom Ansible Inventory

## Goal

Create an Ansible inventory file that groups the managed VMs by role.

The inventory allows Ansible to run commands against all servers, or only specific groups such as `web`, `app`, or `db`.

### Evidence

#### Screenshot 10 — `inventory.ini` showing the `web`, `app`, and `db` groups

<img width="1072" height="217" alt="10" src="https://github.com/user-attachments/assets/66b10ee4-bce1-4dc9-8679-bd6d14b819cb" />


---

#### Screenshot 11 — Output of `ansible-inventory -i inventory.ini --graph`

<img width="1071" height="109" alt="11" src="https://github.com/user-attachments/assets/4074376e-97ec-4b5a-9ecf-1614f523a23c" />


---

### Notes

I created a custom inventory.ini file to tell Ansible which servers it should manage and how the servers are organised.

The inventory uses role-based groups such as web, app, and db. This makes it possible to target servers according to their purpose instead of having to specify every server individually.

For example, the web group represents the servers responsible for web-related services, while the app and db groups represent application and database servers.

I also used ansible-inventory -i inventory.ini --graph to verify that Ansible could correctly read the inventory and understand the group structure.

This helped me understand that the inventory acts like an address book for Ansible. It tells Ansible which machines exist, how they are grouped, and how it should connect to them.

---

# Task 6 — Run Ansible Ad-Hoc Commands

## Goal

Run Ansible ad-hoc commands from the controller to verify connectivity, check server information, and manage packages and services across inventory groups.

This task proves that the inventory is working and that Ansible can control multiple managed VMs without writing a playbook.

### Evidence

#### Screenshot 12 — Output of `ansible all -i inventory.ini -m ping`

<img width="1075" height="235" alt="12" src="https://github.com/user-attachments/assets/b93be63a-b541-44d3-aefc-506132b8ba4c" />


---

#### Screenshot 13 — Output of `ansible all -i inventory.ini -m command -a "uptime"`

<img width="1070" height="91" alt="13" src="https://github.com/user-attachments/assets/30276ce2-9189-4807-947b-7f49923348e7" />


---

#### Screenshot 14 — Output of `ansible web -i inventory.ini -m apt -a "name=nginx state=present update_cache=yes" --become`

<img width="1792" height="1120" alt="14" src="https://github.com/user-attachments/assets/c8bd8138-d4fd-4c3e-8019-80f9c93d9d18" />


---

#### Screenshot 15 — Output of `ansible web -i inventory.ini -m service -a "name=nginx state=started enabled=yes" --become`

<img width="1073" height="738" alt="15 1" src="https://github.com/user-attachments/assets/4d069abf-03bf-408b-8267-27a3100c58e0" />

<img width="1072" height="665" alt="15 2" src="https://github.com/user-attachments/assets/2bfb633c-6ddb-4f03-93ea-87ab486b3427" />

---

#### Screenshot 16 — Output of `ansible all -i inventory.ini -m apt -a "name=htop state=present update_cache=yes" --become`

<img width="1068" height="288" alt="16" src="https://github.com/user-attachments/assets/5402b6f8-5abb-4c27-9e4b-72bba9d89555" />


---

#### Screenshot 17 — Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx"`

<img width="1065" height="91" alt="17" src="https://github.com/user-attachments/assets/dceefdbe-9dc5-4ea8-bbbc-18559f3f1b2d" />


---

### Notes

## Task Notes

I used Ansible ad-hoc commands to test connectivity and manage the Linux servers without creating a playbook.

First, I used the ping module to verify that Ansible could successfully connect to the managed hosts. The servers returned pong, confirming that the inventory, SSH configuration, authentication, and Ansible setup were working.

I then used the command module to check the uptime of the servers.

For the web servers, I used the apt module to install Nginx. I used --become because installing system packages requires elevated privileges.

After installing Nginx, I used the service module to start the Nginx service and enable it so that it would start automatically when the server boots.

I also installed htop across the managed servers to practise package management with Ansible.

Finally, I used systemctl is-active nginx to verify that Nginx was actually running.

This task helped me understand the difference between making a change and verifying a change. Instead of assuming that Nginx was working after installation, I explicitly checked its service status.

I also learned when ad-hoc commands are useful. They are convenient for quick checks, one-off tasks, and troubleshooting. For larger, repeatable, multi-step configurations, an Ansible playbook would be more appropriate.


---

# LinkedIn Post Required

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/eVuhmBh4

---

#### Screenshot — Published LinkedIn post
<img width="552" height="918" alt="linkedinshot" src="https://github.com/user-attachments/assets/ca659140-4930-421b-acd6-1b234a9861dc" />


---

# Assignment Questions

Answer the following in your own words:

**1. What is the purpose of an Ansible inventory file?**

An Ansible inventory file is basically Ansible's address book. It tells Ansible which servers it needs to manage and how those servers are organised.

For example, in this assignment I used inventory.ini to tell Ansible where web1 and web2 were located by giving their IP addresses. I also specified the SSH user and the private key Ansible should use.

Without an inventory, Ansible would not know which machines I wanted it to connect to.

---

**2. What is the difference between the `web`, `app`, and `db` groups in your inventory?**

The groups are used to organise servers according to their roles.

The web group represents servers responsible for web-related tasks, such as running Nginx. In my setup, web1 and web2 were the web servers.

The app group represents application servers. These would normally contain servers running the application's backend or application logic, such as app1.

The db group represents database servers. These would normally contain servers responsible for storing and managing application data, such as db1.

The main idea is that groups allow me to target servers based on their job instead of having to manage every server individually. For example, I can run an Nginx installation command against the web group without accidentally installing it on a database server.

---

**3. What does the Ansible `ping` module verify?**

The Ansible ping module verifies that Ansible can successfully connect to a server and execute an Ansible module on it.

It is not the same as the normal network ping command.

In this assignment, I ran:

ansible all -i inventory.ini -m ping

and received pong from both web1 and web2.

This showed me that my inventory, SSH key, SSH connection, remote Python environment, and Ansible configuration were working together correctly.

---

**4. Why do package installation commands require `--become`?**

Package installation normally requires administrator privileges because software is being installed into protected system locations.

The --become option tells Ansible to temporarily use elevated privileges, similar to using sudo on Linux.

For example, when I ran the Nginx installation command with --become, Ansible was able to install Nginx using the server's package manager.

So, in simple terms, --become means:

"Ansible, perform this task with administrator-level permissions."

---

**5. When would you use an ad-hoc command instead of a playbook?**

I would use an ad-hoc command when I need to perform a quick, one-off task and don't need to create a complete reusable automation file.

For example, in this assignment I used ad-hoc commands to:

Check the servers' uptime
Install Nginx
Start and enable Nginx
Install htop
Check whether Nginx was active

An ad-hoc command is useful when I want a quick answer or need to make a simple change.

I would use a playbook when I have several tasks that need to be performed repeatedly, consistently, or in a particular order. A playbook would also be easier to save, share, review, and run again later.

I think of it as the difference between sending someone a quick instruction and writing down a complete procedure that someone can follow again.

---

**6. What is one challenge you faced while setting up SSH or inventory, and how did you fix it?**

One challenge I faced was making sure SSH access was configured correctly between my Mac and the AWS EC2 server.

My Terraform security group initially allowed SSH from 0.0.0.0/0, which meant SSH was open to connections from any IP address. I changed this to my actual public IP with /32 so that SSH was restricted to my controller machine.

I then used the Terraform-created SSH key to connect to web1:

ssh -i ~/.ssh/terraform-aws-vm-key ubuntu@3.89.181.50

The connection worked and I confirmed it by running hostname and whoami.

After that, I used the same SSH configuration in my Ansible inventory. Ansible was then able to connect to both web servers and return pong when I ran the ping module.

This helped me understand that SSH needs to work first because Ansible relies on SSH to communicate with the Linux servers.

---

# Required Files

Confirm that the following files are included in your assignment workspace:

- [ ] `ansible-adhoc-lab/README.md`
- [ ] `ansible-adhoc-lab/terraform/providers.tf`
- [ ] `ansible-adhoc-lab/terraform/main.tf`
- [ ] `ansible-adhoc-lab/terraform/variables.tf`
- [ ] `ansible-adhoc-lab/terraform/outputs.tf`
- [ ] `ansible-adhoc-lab/ansible/inventory.ini`
- [ ] Updated `.gitignore`

---

# Submission Instructions

- Add all required screenshots from the tasks.
- Full Name must be visible in required screenshots.
- Mention whether you used Azure or AWS.
- Mention whether you used the three-VM option or four-VM option.
- Add the public IP addresses of the VMs, redacted if preferred.
- Add your `inventory.ini` proof.
- Add a short explanation of what you learned.
- Answer all assignment questions clearly in your own words.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, Terraform state files, cloud credentials, passwords, access keys, secret keys, account IDs, or subscription IDs.
- Submit only one Google Doc link.

---

# Completion Checklist

- [ ] Task 1: `ansible-adhoc-lab` project structure created
- [ ] Task 1: `.gitignore` updated for Terraform files
- [ ] Task 2: Terraform configuration created
- [ ] Task 2: Server roles defined for either three or four VMs
- [ ] Task 2: `count` or `for_each` used
- [ ] Task 2: SSH restricted to the controller public IP
- [ ] Task 2: HTTP allowed only for web hosts
- [ ] Task 2: Terraform output maps roles to public IPs
- [ ] Task 3: Terraform initialized successfully
- [ ] Task 3: Terraform configuration validated
- [ ] Task 3: Terraform apply completed successfully
- [ ] Task 3: All selected VMs are running
- [ ] Task 4: SSH key-based access works for every VM
- [ ] Task 5: `inventory.ini` contains `web`, `app`, and `db` groups
- [ ] Task 5: `ansible-inventory -i inventory.ini --graph` shows the correct groups
- [ ] Task 6: `ansible all -i inventory.ini -m ping` returns `SUCCESS`
- [ ] Task 6: Ad-hoc commands run successfully
- [ ] Task 6: `--become` was used for package and service tasks
- [ ] Task 6: Nginx is active on the `web` group
- [ ] Screenshots 1–17 are included
- [ ] Assignment questions are answered
- [ ] LinkedIn post published
- [ ] LinkedIn post URL added
- [ ] No sensitive information is exposed
- [ ] Google Doc is accessible

---

## About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra and The CloudAdvisory, focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## Resources

- DMI Official Website: [https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme](https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme)
- University: [https://university.pravinmishra.com?utm_source=github&utm_medium=readme](https://university.pravinmishra.com?utm_source=github&utm_medium=readme)
- Discord Community: [https://discord.pravinmishra.com?utm_source=github&utm_medium=readme](https://discord.pravinmishra.com?utm_source=github&utm_medium=readme)
- Blog: [https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme](https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme)
- YouTube Playlist: [https://www.youtube.com/playlist?list=PLFeSNDtI4Cho](https://www.youtube.com/playlist?list=PLFeSNDtI4Cho)
- Pravin Mishra LinkedIn: [https://www.linkedin.com/in/pravin-mishra-aws-trainer/](https://www.linkedin.com/in/pravin-mishra-aws-trainer/)
- CloudAdvisory LinkedIn: [https://www.linkedin.com/company/thecloudadvisory/](https://www.linkedin.com/company/thecloudadvisory/)

---

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
