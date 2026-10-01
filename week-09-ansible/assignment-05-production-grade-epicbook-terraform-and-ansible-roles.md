# Assignment — Deploy EpicBook with Terraform and Ansible Roles

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Purpose

In this assignment, you will deploy the EpicBook web application using Terraform and Ansible roles.

Terraform provisions the cloud infrastructure, including one Ubuntu VM and one managed MySQL database. Ansible roles configure the VM, install required software, deploy the EpicBook application, configure Nginx, connect the app to the managed MySQL database, and verify the deployment.

---

# Task 1 — Set Up the Project Folder Layout

## Goal

Create the project folder structure for Terraform and Ansible roles.

Terraform will be used to provision the cloud infrastructure. Ansible roles will be used to configure the VM and deploy the EpicBook application.

### Evidence

#### Screenshot 1 — Terminal showing the completed `epicbook-prod` project structure

<img width="645" height="476" alt="1" src="https://github.com/user-attachments/assets/3ddb4b32-df64-468c-930a-7ee533c02b92" />


---

### Notes

Answer the following in your own words:

**1. Which cloud provider did you choose for this assignment?**

I used AWS for this assignment. I used an EC2 Ubuntu VM for the application server and an RDS MySQL database for the managed database.

---

**2. Why is it useful to keep Terraform files and Ansible files in separate folders?**

Terraform and Ansible do different jobs. Terraform is responsible for creating the infrastructure, while Ansible is responsible for configuring the server and deploying the application.
Keeping them separate makes the project easier to understand, maintain and troubleshoot.

---

**3. What is the purpose of the `roles` directory in Ansible?**

The roles directory contains reusable pieces of Ansible configuration. Instead of putting everything in one large playbook, I separated the work into roles such as common, nginx and epicbook.
This makes the deployment more organised and reusable.    Pasted text(9)

---

# Task 2 — Provision the Infrastructure with Terraform

## Goal

Run Terraform to provision the cloud infrastructure for the EpicBook deployment.

Terraform will create the VM, managed MySQL database, networking, security rules, and required outputs.

### Evidence

#### Screenshot 2 — `terraform apply` completed successfully

<img width="645" height="612" alt="2" src="https://github.com/user-attachments/assets/7ac0b7ad-d4b4-4073-99f9-3aeb43ed60d4" />


---

#### Screenshot 3 — Output of `terraform output`

<img width="646" height="250" alt="3" src="https://github.com/user-attachments/assets/c7314f70-c666-405c-b70a-c2b297619f4d" />


---

#### Screenshot 4 — Azure Portal or AWS Console showing the VM running

<img width="965" height="741" alt="4" src="https://github.com/user-attachments/assets/f3d90e2c-018a-4f33-944c-dafb44d7ad53" />


---

#### Screenshot 5 — Azure Portal or AWS Console showing the managed MySQL database created

<img width="985" height="278" alt="5" src="https://github.com/user-attachments/assets/793b0d9b-b37a-4171-8ab0-deeb08f64e60" />


---

### Notes

Answer the following in your own words:

**1. What resources did Terraform create for this assignment?**

Terraform created the AWS infrastructure needed for the deployment, including:
- An Ubuntu EC2 VM
- An RDS MySQL database
- Networking
- Security rules
- Required access configuration
- Terraform outputs for the VM and database
The EC2 instance became the application server while RDS handled the MySQL database.    Pasted text(9)

---

**2. Why should you review `terraform plan` before running `terraform apply`?**

terraform plan shows what Terraform is about to create, change or destroy.
Reviewing it before apply helps me catch mistakes before they affect my AWS resources. It also helps me understand exactly what Terraform is going to do.
3. Why should database passwords not be shown in Terraform output?
Database passwords are sensitive credentials. If they appear in terminal output, screenshots, GitHub or logs, someone could use them to access the database.
Secrets should be protected and should not be exposed in assignment screenshots or public repositories.

---

**3. Why should database passwords not be shown in Terraform output?**

Database passwords are sensitive credentials. If they appear in terminal output, screenshots, GitHub or logs, someone could use them to access the database.
Secrets should be protected and should not be exposed in assignment screenshots or public repositories.

---

# Task 3 — Verify SSH Key-Based Access

## Goal

Verify that the cloud VM can be accessed from the Ansible controller using SSH key-based authentication.

### Evidence

#### Screenshot 6 — Successful SSH hostname check from the Ansible controller

<img width="648" height="633" alt="6" src="https://github.com/user-attachments/assets/d89a0f3e-08ca-4a5d-9b11-5ba48b2eae64" />


---

### Notes

Answer the following in your own words:

**1. What command did you use to verify SSH access?**

I used SSH with my EC2 private key:

ssh -i "/path/to/epicbook-key.pem" ubuntu@<public_ip>

---

**2. What proves that SSH key-based access worked successfully?**

The fact that I was able to connect to the Ubuntu server without entering a password proves that the SSH key authentication worked.
I was able to get the Ubuntu terminal prompt:
ubuntu@ip-10-0-1-166:~$

---

**3. What would you check if SSH returned `Permission denied (publickey)`?**

I would check:
- That I am using the correct .pem key
- That the key has the correct permissions, such as chmod 400
- That I am using the correct username, which is ubuntu
- That the IP address is correct
- That the EC2 security group allows SSH on port 22
- That the key belongs to the EC2 instance

---

# Task 4 — Create the Ansible Inventory and Configuration

## Goal

Create the Ansible inventory file and local Ansible configuration for the EpicBook VM.

The inventory tells Ansible which VM to manage and which SSH user to use.

### Evidence

#### Screenshot 7 — `inventory.ini` showing the VM under the `web` group

<img width="646" height="149" alt="7" src="https://github.com/user-attachments/assets/f0b5dbb2-8370-4b31-a55b-3d8629c778cf" />


---

#### Screenshot 8 — Output of `ansible-inventory -i inventory.ini --graph`

<img width="543" height="660" alt="8" src="https://github.com/user-attachments/assets/602cf714-e747-434d-93fd-bb1f24677830" />


---

#### Screenshot 9 — Output of `ansible web -i inventory.ini -m ping`

<img width="543" height="542" alt="9" src="https://github.com/user-attachments/assets/5ebf102c-3e96-4311-bfd3-df2375d55a97" />


---

### Notes

Answer the following in your own words:

**1. What is the purpose of `inventory.ini`?**

inventory.ini tells Ansible which servers it should manage and how to connect to them.
In this project, the EC2 server was placed under the web group.

---

**2. What does `ansible_host` store?**

It tells Ansible which SSH private key to use when connecting to the EC2 server.

---

**3. What does `ansible_ssh_private_key_file` tell Ansible?**

It tells Ansible which SSH private key to use when connecting to the EC2 server.

---

**4. Why is `host_key_checking = False` used only for this temporary lab?**

It makes the lab easier by preventing Ansible from stopping because of SSH host key verification.
However, I would not use this approach blindly in a real production environment because SSH host verification provides an important security check.

---

# Task 5 — Create the Main Ansible Playbook

## Goal

Create the main Ansible playbook that runs the required roles in the correct order.

The `site.yml` file will call the `common`, `nginx`, and `epicbook` roles.

### Evidence

#### Screenshot 10 — `site.yml` showing the roles in the correct order

<img width="538" height="548" alt="10" src="https://github.com/user-attachments/assets/367316b5-0ed3-41d3-beca-01cc8e0d8ca8" />


---

#### Screenshot 11 — Output of `ansible-playbook -i inventory.ini site.yml --syntax-check`

<img width="541" height="391" alt="11" src="https://github.com/user-attachments/assets/0fd3b400-d3a5-450a-958f-55fe7a4a1ff4" />


---

### Notes

Answer the following in your own words:

**1. What is the purpose of `site.yml`?**

site.yml is the main Ansible playbook. It brings the different roles together and controls the order in which they run.

---

**2. Why should the roles run in the order `common`, `nginx`, and `epicbook`?**

The common role prepares the server first.
Then nginx installs and configures the web server.
Finally, the epicbook role deploys the actual application.
This order makes sense because each stage prepares something needed by the next stage.

---

**3. What does `become: true` allow Ansible to do?**

become: true allows Ansible to perform tasks with elevated privileges, normally using sudo.
This is needed for tasks such as installing packages, configuring Nginx and managing system services.

---

# Task 6 — Create the `common` Role

## Goal

Create the `common` role to prepare the Ubuntu VM with the basic packages required for the EpicBook deployment.

This role handles the common server setup before Nginx and the application are configured.

### Evidence

#### Screenshot 12 — `roles/common/tasks/main.yml` showing the common setup tasks

<img width="539" height="302" alt="12" src="https://github.com/user-attachments/assets/1231584b-e2c2-4584-b225-d58654194a4d" />


---

### Notes

Answer the following in your own words:

**1. What is the responsibility of the `common` role?**

The common role prepares the Ubuntu server with the basic packages and configuration needed before deploying Nginx and EpicBook.
---

**2. Why should Nginx installation not be placed inside the `common` role?**

Because Nginx has its own responsibility. Keeping it in a separate role makes the project modular and easier to maintain.
The common role should handle general server preparation, while the nginx role handles web server configuration.

---

**3. Why is `mysql-client` useful in this deployment?**

mysql-client allows the server to connect to the managed RDS MySQL database from the EC2 instance.
It was also useful for checking the database and handling the database initialization process.

---

# Task 7 — Create the `nginx` Role

## Goal

Create the `nginx` role to install Nginx and configure it as a reverse proxy for the EpicBook application.

Nginx will receive browser traffic on port `80` and forward it to the EpicBook Node.js application running on the VM.

### Evidence

#### Screenshot 13 — `roles/nginx/tasks/main.yml` showing Nginx installation and site configuration tasks

<img width="543" height="581" alt="13" src="https://github.com/user-attachments/assets/796fa239-7b17-42c9-95d9-c44a8067e9fe" />


---

#### Screenshot 14 — `roles/nginx/templates/epicbook.conf.j2` showing the reverse proxy configuration

<img width="540" height="262" alt="14" src="https://github.com/user-attachments/assets/2e0be2cb-17b4-4bfe-b29d-a4fb7a6faf26" />


---

### Notes

Answer the following in your own words:

**1. What is the responsibility of the `nginx` role?**

The nginx role installs Nginx, configures the EpicBook site, enables the site, disables the default site and makes sure Nginx is running.

---

**2. Why is Nginx configured as a reverse proxy in this deployment?**

Nginx receives requests from users on port 80 and forwards them to the EpicBook Node.js application running locally on port 8080.
The flow is basically:
Browser
   ↓
Nginx :80
   ↓
Node.js :8080

This means users do not need to access the Node.js application directly. Week 9_ASSIGNMENT _05

---

**3. Why should the application port come from `group_vars/web.yml` instead of being hard-coded?**

Using a variable makes the configuration reusable.
If I change the application port from 8080 to another port, I can update the variable instead of changing several files.

---

# Task 8 — Create the `epicbook` Role

## Goal

Create the `epicbook` role to deploy the EpicBook application, connect it to the managed MySQL database, and run the application on port `8080` using PM2.

### Evidence

#### Screenshot 15 — `roles/epicbook/tasks/main.yml` showing application deployment tasks

<img width="637" height="792" alt="15" src="https://github.com/user-attachments/assets/5dd317be-30f9-4ef5-bbbe-ee4ac2599b89" />


---

#### Screenshot 16 — Task or file showing how the database connection is configured, with secrets hidden

<img width="643" height="420" alt="16" src="https://github.com/user-attachments/assets/245c768a-6b5a-4448-a999-65ccf0400d24" />


---

#### Screenshot 17 — Task or output showing the EpicBook application managed by PM2

<img width="895" height="135" alt="17" src="https://github.com/user-attachments/assets/d7c2cb0b-b5ee-4efa-8829-775f07b6dcba" />


---

### Notes

Answer the following in your own words:

**1. What is the responsibility of the `epicbook` role?**

The epicbook role deploys the EpicBook application.
It:
- Verifies Node.js and npm
- Installs PM2
- Creates the application directory
- Clones the application
- Installs dependencies
- Creates the .env file
- Connects the application to the database
- Starts the application with PM2

---

**2. Why is PM2 used for the EpicBook Node.js application?**

PM2 is a process manager for Node.js applications.
It keeps the application running, allows me to check its status and can restart the application if it crashes.

---

**3. Why should database passwords not be hard-coded in public files?**

Because anyone who can see the file could potentially get access to the database.
Instead, the password was handled through Ansible Vault and passed into the application environment securely.

---

**4. What does it mean for the application to run on port `8080` while Nginx listens on port `80`?**

It means the Node.js application listens internally on port 8080, while Nginx accepts normal web traffic on port 80.
Nginx then forwards the request from port 80 to port 8080.
So users can simply visit:
http://<public-ip>

instead of:
http://<public-ip>:8080

The assignment specifically describes this reverse proxy flow. Week 9_ASSIGNMENT _05

---

# Task 9 — Create Group Variables

## Goal

Create reusable variables for the EpicBook deployment.

The `group_vars/web.yml` file stores values that can be reused across the Ansible roles.

### Evidence

#### Screenshot 18 — `group_vars/web.yml` showing the application, PM2, and database variables, with passwords hidden or masked

<img width="642" height="447" alt="18" src="https://github.com/user-attachments/assets/9ffea531-8e38-4b86-b234-35a2d31524c1" />

---

### Notes

Answer the following in your own words:

**1. What is the purpose of `group_vars/web.yml`?**

It stores the variables used by the web group and allows the Ansible roles to reuse the same values.
This keeps configuration separate from the actual tasks.

---

**2. Which values did you store in `group_vars/web.yml`?**

I stored values such as:
- Application repository
- Application directory
- Application user
- Application port
- PM2 application name
- Server name
- Database host
- Database name
- Database username
- Database password variable

---

**3. How did you handle the database password securely?**

I used Ansible Vault instead of putting the actual database password directly into the normal variables file.
The password was referenced through a Vault variable and the Vault file was encrypted. The assignment also explains why the variables and Vault were placed under the web group structure so Ansible could load them correctly.

---

# Task 10 — Run the Ansible Playbook

## Goal

Run the Ansible playbook to configure the VM and deploy the EpicBook application.

The playbook should run the roles in this order:

1. `common`
2. `nginx`
3. `epicbook`

### Evidence

#### Screenshot 19 — Ansible playbook output showing the roles running

<img width="896" height="755" alt="19" src="https://github.com/user-attachments/assets/650a37ca-d60a-4341-8b42-3f0e7654acce" />


---

#### Screenshot 20 — Final Ansible recap showing `failed=0`

<img width="895" height="88" alt="20" src="https://github.com/user-attachments/assets/505a1607-0ad9-46c6-b18f-1372948f718b" />


---

#### Screenshot 21 — Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx" --become`

<img width="899" height="183" alt="21" src="https://github.com/user-attachments/assets/81c53c36-4b1e-47f0-9de7-f7e526aa8755" />


---

#### Screenshot 22 — Output of `ansible web -i inventory.ini -m command -a "pm2 status"`

<img width="899" height="395" alt="22" src="https://github.com/user-attachments/assets/7db6ca99-17dd-4580-b298-6c86bc53e9c8" />


---

#### Screenshot 23 — Output of `ansible web -i inventory.ini -m command -a "curl -I http://localhost:8080"`

<img width="897" height="345" alt="23" src="https://github.com/user-attachments/assets/5ef3b8c6-6cba-4e3c-8895-4dd6200c8ff8" />


---

### Notes

Answer the following in your own words:

**1. What command did you run to execute the Ansible playbook?**

The main command was:
ansible-playbook -i inventory.ini site.yml --ask-vault-pass

This ran the playbook using the inventory and asked for the Ansible Vault password.

---

**2. How do you know all roles completed successfully?**

I checked the final Ansible recap.
The important part is:
failed=0

This means Ansible completed without any failed tasks.
The roles were executed in this order:
common
nginx
epicbook

---

**3. What proves that Nginx is active?**

The command:
ansible web -i inventory.ini -m command -a "systemctl is-active nginx" --become

returned:
active

That proves the Nginx service is running.

---

**4. What proves that PM2 is managing the EpicBook application?**

The PM2 status showed:
epicbook
online

This proves PM2 is managing the EpicBook process.

---

**5. What proves that the EpicBook application responds on port `8080`?**

The command:
ansible web -i inventory.ini -m command -a "curl -I http://localhost:8080"

returned a successful HTTP response.
That proves the Node.js application is listening and responding on port 8080.
The assignment specifically uses these three checks as the evidence for Task 10.

---

# Task 11 — Verify the EpicBook Deployment

## Goal

Verify that the EpicBook application is running, accessible in the browser, and connected to the managed MySQL database.

### Evidence

#### Screenshot 24 — Output of `curl -I http://<public_ip>`

<img width="900" height="177" alt="24" src="https://github.com/user-attachments/assets/67237ba7-800c-4cba-bcd0-e74abf024c18" />


---

#### Screenshot 25 — Output of the cart API test command

<img width="900" height="251" alt="25" src="https://github.com/user-attachments/assets/19e89019-1752-49f3-b941-8a80c6ade6b1" />


---

#### Screenshot 26 — Output of the `/cart` HTTP status check

<img width="898" height="114" alt="26" src="https://github.com/user-attachments/assets/fdead1fe-12b7-436b-bbf4-99f0dd8ce019" />


---

#### Screenshot 27 — Browser showing the EpicBook application loaded from `http://<public_ip>`

<img width="1040" height="1047" alt="27" src="https://github.com/user-attachments/assets/185b067e-2153-480c-a471-4c2e32581bda" />


---

### Notes

Answer the following in your own words:

**1. What HTTP response did you receive from the public application URL?**

I received:
HTTP/1.1 200 OK

This showed that the public application was reachable through the EC2 public IP.

---

**2. What did the cart API test prove?**

The Cart API returned:
{"cart":[],"book":null}

with:
HTTP/1.1 200 OK

This proved that the request successfully reached the application through Nginx and the Express application responded.
The cart was simply empty at the time of testing.

---

**3. What did the `/cart` status check return?**

It returned:
200

This showed that the /cart endpoint was accessible and responding successfully.

---

**4. What issue did you face during verification, and how did you fix it?**

I faced a few issues during deployment.
The EC2 public IP changed because the instance was using a dynamic public IP. The old IP 108.130.21.100 was no longer reachable, so I checked AWS and found the new IP was 54.78.155.244.
I updated inventory.ini with the new IP and reran the Ansible deployment.
I also had issues with the Ansible Vault, the missing community.general collection, the Nginx handler and Node/npm package installation. I fixed these by correcting the Vault setup, installing/using the required Ansible collection, moving the Nginx reload handler into the correct handlers file and using the already working Node.js/npm installation on the server.
After fixing these issues, the playbook completed successfully and PM2 showed EpicBook as online.

---

# LinkedIn Post Required

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/err2uJhA

---

#### Screenshot — Published LinkedIn post

<img width="555" height="696" alt="linkedin" src="https://github.com/user-attachments/assets/2017186a-4bc7-4714-868e-64575856d120" />


---

# Assignment Questions

Answer the following in your own words:

**1. Why is Terraform used for infrastructure provisioning?**

Terraform is used to create and manage infrastructure as code.
Instead of manually creating resources in AWS, I can define the infrastructure in Terraform files and use commands like terraform plan and terraform apply to create it.
This makes the infrastructure repeatable and easier to manage.

---

**2. Why are Ansible roles useful for production-style deployments?**

Ansible roles break a deployment into smaller reusable sections.
For this project, I had separate roles for:
common
nginx
epicbook

This makes the playbook cleaner and makes each part of the deployment easier to maintain and troubleshoot.

---

**3. What is the purpose of `group_vars/web.yml`?**

It stores variables for the web group.
Instead of hard-coding things like the application port, repository, database host and application name inside different tasks, the values are stored in one place and reused by the roles.


---

**4. Why should database passwords not be committed to GitHub?**

Database passwords are sensitive credentials.
If they are committed to GitHub, especially in a public repository, someone could potentially use them to access the database.
That is why I used Ansible Vault to protect the database password.

---

**5. What is the purpose of Nginx in this deployment?**

Nginx acts as a reverse proxy.
It accepts traffic on port 80 and forwards it to the EpicBook Node.js application on port 8080.
Internet
   ↓
Nginx :80
   ↓
EpicBook :8080

---

**6. Why should the managed MySQL database not be publicly accessible?**

The database should only be accessible by the application server that needs it.
Keeping MySQL private reduces the attack surface and prevents people on the internet from directly trying to connect to the database.
The EC2 server can communicate with RDS without exposing MySQL publicly.

---

**7. Why is PM2 used for the EpicBook Node.js application?**

PM2 manages the Node.js process.
It keeps track of the application, shows whether it is online and can restart it if necessary.
In this project, PM2 showed:
epicbook    online

---

**8. What does idempotency mean in Ansible?**

Idempotency means that running the same Ansible playbook multiple times should not unnecessarily change things that are already in the correct state.
For example, if Nginx is already installed, Ansible should recognise that instead of reinstalling it every time.
This is one reason Ansible modules are preferred over simply running shell commands. The assignment also explains this concept when discussing the Git and npm tasks.

---

**9. What issue did you face during the deployment, and how did you fix it?**

The biggest issues I faced were the EC2 public IP changing, Ansible Vault configuration, the missing community.general collection, the Nginx handler error and the Node/npm package dependency issue.
I checked each error, corrected the configuration and reran the deployment until the playbook completed with:
failed=0

I also updated the Ansible inventory when the EC2 public IP changed.

---

**10. What security improvement would you make before using this setup in production?**

I would improve the security by:
- Restricting SSH access to trusted IP addresses
- Keeping RDS private
- Using stronger secret management
- Avoiding sensitive information in logs
- Using HTTPS with an SSL certificate
- Using a domain name instead of the raw IP
- Reviewing security group rules
- Using IAM permissions based on least privilege
- Rotating credentials regularly

---

# Required Files

Confirm that the following files are included in your GitHub repository or assignment folder:

- [ ] `README.md`
- [ ] Terraform files under either `terraform/azure/` or `terraform/aws/`
- [ ] `ansible/ansible.cfg`
- [ ] `ansible/inventory.ini`
- [ ] `ansible/site.yml`
- [ ] `ansible/group_vars/web.yml`
- [ ] `ansible/roles/common/tasks/main.yml`
- [ ] `ansible/roles/nginx/tasks/main.yml`
- [ ] `ansible/roles/nginx/templates/epicbook.conf.j2`
- [ ] `ansible/roles/epicbook/tasks/main.yml`

---

# Submission Instructions

- Add all required screenshots in your submission.
- Full Name must be visible in required screenshots.
- Mention the cloud provider used: Azure or AWS.
- Add the VM public IP address.
- Add the final application URL.
- Add Terraform output proof.
- Add Ansible role tree proof.
- Add all required notes and assignment question answers.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, passwords, cloud credentials, database credentials, Terraform state files, subscription IDs, or account IDs.

---

# Completion Checklist

- [ ] Task 1: Project folder layout created
- [ ] Task 2: Terraform infrastructure provisioned
- [ ] Task 3: SSH key-based access verified
- [ ] Task 4: Ansible inventory and configuration created
- [ ] Task 5: Main Ansible playbook created
- [ ] Task 6: `common` role created
- [ ] Task 7: `nginx` role created
- [ ] Task 8: `epicbook` role created
- [ ] Task 9: Group variables created
- [ ] Task 10: Ansible playbook run completed
- [ ] Task 11: EpicBook deployment verified
- [ ] Terraform files created under only one cloud provider folder
- [ ] One Ubuntu VM was created
- [ ] One managed MySQL database was created
- [ ] SSH port `22` is restricted to the controller public IP
- [ ] HTTP port `80` is accessible
- [ ] MySQL port `3306` is not publicly open
- [ ] `ansible web -i inventory.ini -m ping` returns `SUCCESS`
- [ ] `site.yml` calls the roles in the correct order
- [ ] Database secrets are hidden or handled securely
- [ ] Nginx is active
- [ ] PM2 shows the EpicBook application running
- [ ] EpicBook responds on port `8080`
- [ ] Public URL loads in the browser
- [ ] Cart API verification works
- [ ] Playbook completes with `failed=0`
- [ ] Screenshots 1–27 are included
- [ ] Assignment questions are answered
- [ ] LinkedIn post published
- [ ] LinkedIn post URL added
- [ ] No sensitive information is exposed

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

*This submission is part of DevOps Micro Internship (DMI) — Agentic AI Track.*
