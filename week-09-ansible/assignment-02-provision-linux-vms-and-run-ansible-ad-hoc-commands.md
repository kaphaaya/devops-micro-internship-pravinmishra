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

Add your screenshot here.

---

#### Screenshot 2 — Terminal showing `git status --short` with the new project files and updated `.gitignore`

Add your screenshot here.

---

### Notes

Add your task notes here.

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

Add your screenshot here.

---

#### Screenshot 4 — Terraform configuration showing SSH restricted to the controller IP and HTTP allowed only for web hosts

Add your screenshot here.

---

#### Screenshot 5 — Terraform output configuration showing how public IP addresses are associated with the server roles

Add your screenshot here.

---

### Notes

Add your task notes here.

---

# Task 3 — Provision the Infrastructure with Terraform

## Goal

Initialize and validate the Terraform configuration, review the execution plan, provision the selected three or four VMs, and retrieve their public IP addresses.

### Evidence

#### Screenshot 6 — Final `terraform apply` output showing `Apply complete`

Add your screenshot here.

---

#### Screenshot 7 — `terraform output public_ips` showing the role-to-IP mapping for all three or four VMs

Add your screenshot here.

---

#### Screenshot 8 — Azure Portal or AWS Management Console showing all three or four VMs in the `Running` state, with their role-based names visible

Add your screenshot here.

---

### Notes

Add your task notes here.

---

# Task 4 — Verify SSH Key-Based Access

## Goal

Verify that each managed VM can be accessed from the Ansible controller using SSH key-based authentication.

### Evidence

#### Screenshot 9 — Terminal showing successful SSH hostname output from all VMs

Add your screenshot here.

---

### Notes

Add your task notes here.

---

# Task 5 — Create the Custom Ansible Inventory

## Goal

Create an Ansible inventory file that groups the managed VMs by role.

The inventory allows Ansible to run commands against all servers, or only specific groups such as `web`, `app`, or `db`.

### Evidence

#### Screenshot 10 — `inventory.ini` showing the `web`, `app`, and `db` groups

Add your screenshot here.

---

#### Screenshot 11 — Output of `ansible-inventory -i inventory.ini --graph`

Add your screenshot here.

---

### Notes

Add your task notes here.

---

# Task 6 — Run Ansible Ad-Hoc Commands

## Goal

Run Ansible ad-hoc commands from the controller to verify connectivity, check server information, and manage packages and services across inventory groups.

This task proves that the inventory is working and that Ansible can control multiple managed VMs without writing a playbook.

### Evidence

#### Screenshot 12 — Output of `ansible all -i inventory.ini -m ping`

Add your screenshot here.

---

#### Screenshot 13 — Output of `ansible all -i inventory.ini -m command -a "uptime"`

Add your screenshot here.

---

#### Screenshot 14 — Output of `ansible web -i inventory.ini -m apt -a "name=nginx state=present update_cache=yes" --become`

Add your screenshot here.

---

#### Screenshot 15 — Output of `ansible web -i inventory.ini -m service -a "name=nginx state=started enabled=yes" --become`

Add your screenshot here.

---

#### Screenshot 16 — Output of `ansible all -i inventory.ini -m apt -a "name=htop state=present update_cache=yes" --become`

Add your screenshot here.

---

#### Screenshot 17 — Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx"`

Add your screenshot here.

---

### Notes

## Task Notes

In this assignment, I learned how Terraform and Ansible can work together to provision and manage Linux servers.

I first used Terraform to create the AWS infrastructure. This included a VPC, subnet, internet gateway, route table, security group, SSH key pair, and four Ubuntu EC2 instances with the roles `web1`, `web2`, `app1`, and `db1`.

I used Terraform's `for_each` to create the four servers from a list of roles instead of writing the same EC2 configuration four different times. I also configured `web1` and `web2` with public IP addresses while `app1` and `db1` remained private.

One important thing I learned was how SSH security works. Initially, SSH was open to `0.0.0.0/0`, which means any IP could attempt to connect. I changed this to my controller IP using `/32`, which restricted SSH access to my current public IP.

After Terraform created the infrastructure, I manually tested SSH access to `web1` using my Terraform-generated SSH key. This helped me understand that Terraform creates the infrastructure, while SSH provides a way to access the server.

I then installed Ansible inside a Python virtual environment so that the Ansible installation stayed isolated from my other Python projects.

Next, I created an Ansible inventory and configured Ansible to use it. I tested the connection using the Ansible `ping` module and received `pong` from both web servers.

I then used Ansible ad-hoc commands to check server uptime, install Nginx, start and enable the Nginx service, install `htop`, and verify that Nginx was active.

The biggest lesson for me was understanding the difference between provisioning and configuration management. Terraform was responsible for building the infrastructure, while Ansible was responsible for connecting to the servers and managing what was installed and running on them.


---

# LinkedIn Post Required

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/eVuhmBh4

---

#### Screenshot — Published LinkedIn post

Add your screenshot here.

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
