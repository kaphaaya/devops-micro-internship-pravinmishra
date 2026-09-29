# Assignment 04 — Deploy Mini Finance on Azure Using Terraform and Ansible

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will provision Azure infrastructure using Terraform and deploy the Mini Finance website using an Ansible multi-play playbook.

Terraform will create the Azure Virtual Machine and networking resources. Ansible will install Nginx, clone the Mini Finance repository, deploy the website, and verify the deployment.

---

# Task 1 — Create the Project Structure

## Goal

Create separate directories and files for the Terraform infrastructure and Ansible configuration.

### Evidence

#### Screenshot 1 — Terminal or VS Code showing the complete `mini-finance` project structure

<img width="944" height="1084" alt="1" src="https://github.com/user-attachments/assets/9ce716c5-1e4c-4cff-be84-cf8338927511" />


---

### Notes

For this task, I created the project structure for the Mini Finance deployment. I separated the Terraform files from the Ansible files because they have different responsibilities.
Terraform is responsible for creating the Azure infrastructure, while Ansible will be responsible for configuring the server and deploying the website.
I think of it as building a house. Terraform builds the house and creates the basic structure, while Ansible comes in afterwards to set everything up and make it ready to use.
The main directories I created were:
mini-finance/
├── terraform/
└── ansible/

This separation also makes the project easier to understand, maintain and troubleshoot.

---

# Task 2 — Create the Azure Infrastructure Using Terraform

## Goal

Use Terraform to provision an Ubuntu Virtual Machine with the required Azure networking and security resources.

### Evidence

#### Screenshot 2 — Terraform code showing the `Allow-SSH` rule for port `22` and the `Allow-HTTP` rule for port `80`

<img width="881" height="509" alt="2" src="https://github.com/user-attachments/assets/aad0a445-6f87-49ee-866e-ed60076bdc4e" />

### Notes

For this task, I created the Azure networking and security configuration using Terraform.
I configured the Network Security Group with two important rules. SSH traffic was allowed through port 22, while HTTP traffic was allowed through port 80.
Port 22 is used for SSH, which I need for securely connecting to and managing the Azure VM. I restricted this access to my public IP because there is no reason for everyone on the internet to be able to attempt an SSH connection.
Port 80 was opened because the Mini Finance website needs to be publicly accessible through a browser.
I also associated the nsg-mini-finance Network Security Group with the nic-mini-finance network interface so that the security rules would actually apply to the VM's network connection.
---

#### Screenshot 3 — Terraform code showing the association between `nsg-mini-finance` and `nic-mini-finance`

<img width="574" height="90" alt="3" src="https://github.com/user-attachments/assets/c7e3d48e-75d1-4b3f-998f-9748434d7207" />


---

# Task 3 — Initialize and Apply the Terraform Configuration

## Goal

Format and validate the Terraform configuration, review the execution plan, and provision the Azure infrastructure.

### Evidence

#### Screenshot 4 — End of the `terraform apply` output showing `Apply complete!` with no errors

<img width="660" height="510" alt="4" src="https://github.com/user-attachments/assets/fc5bfa04-1b79-4775-89b5-a69d5fb1ba8d" />


---

#### Screenshot 5 — Output of `terraform output public_ip` showing the VM’s public IP address

<img width="660" height="68" alt="5" src="https://github.com/user-attachments/assets/63e1de97-9c2a-4838-a46d-c583567d895d" />


---

### Notes

For this task, I initialized, formatted, validated and applied the Terraform configuration.
I used Terraform to create the Azure resources required for the project. During this stage, I encountered an Azure subscription issue because the first subscription was disabled and marked as read-only. I had to configure Terraform and Azure CLI to use the new active Azure subscription.
I also encountered a VM capacity issue because the Standard_B1s VM size was not available in the South India region at that time. I changed the VM size to Standard_D2s_v5, and the VM was successfully created.
After Terraform completed successfully, I used:
terraform output public_ip

to get the public IP address of the VM.
This showed me how Terraform can automate the creation of the entire cloud infrastructure instead of manually creating each resource through the Azure portal.

---

# Task 4 — Verify Passwordless SSH Access

## Goal

Confirm that the Ansible controller can connect to the Terraform-provisioned Azure VM using SSH key authentication.

### Evidence

#### Screenshot 6 — Passwordless SSH command and the returned `mini-finance` hostname

<img width="658" height="149" alt="6" src="https://github.com/user-attachments/assets/0d16d6a7-86e0-4aba-9c75-05fdc051f152" />


---

### Notes

For this task, I tested SSH access to the Azure VM using my SSH private key.
I used:
ssh -i ~/.ssh/id_ed25519 azureuser@20.235.158.159 "hostname"

The VM returned:
vm-mini-finance

This confirmed that the VM was running, the public IP was reachable, SSH was correctly configured, and my SSH key authentication was working.
This was important because Ansible would also need SSH access to the VM. If SSH did not work, Ansible would not be able to configure the server.

---

# Task 5 — Create the Ansible Inventory and Verify Connectivity

## Goal

Add the Terraform-provisioned Azure VM to the Ansible inventory and confirm that Ansible can connect to it.

### Evidence

#### Screenshot 7 — Ansible ping output showing `SUCCESS` and `pong` from the Azure VM

<img width="660" height="508" alt="7" src="https://github.com/user-attachments/assets/d08448c5-f194-4a26-9272-68c57bb279a4" />


---

### Configuration File

Copy and paste the complete contents of your `ansible/inventory.ini` file below:

```ini
[web]
mini-finance ansible_host=20.235.158.159

[web:vars]
ansible_user=azureuser
ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

---

# Task 6 — Create the Multi-Play Ansible Playbook

## Goal

Create one Ansible playbook containing separate plays to install Nginx, deploy the Mini Finance website, and verify the deployment.

### Evidence

#### Screenshot 8 — `site.yml` showing Play 1 and the beginning of Play 2

Screenshot must show:

- Play 1 targeting the `web` group
- Installation of `nginx`, `git`, and `rsync`
- Nginx service configured as started and enabled
- Beginning of Play 2 with the Git repository URL and synchronization task

<img width="661" height="1052" alt="8" src="https://github.com/user-attachments/assets/60893a07-0714-404d-808e-290b56c907ac" />


---

#### Screenshot 9 — `site.yml` showing the deployment destination, handler, and Play 3 verification

Screenshot must show:

- Website destination `/var/www/html/`
- Ownership set to `www-data:www-data`
- Nginx reload handler
- Play 3 targeting `localhost`
- The `uri` verification and `assert` condition

<img width="660" height="876" alt="9" src="https://github.com/user-attachments/assets/93f8076a-5b79-44d2-a73f-0b70a696e457" />
<img width="661" height="570" alt="9 1" src="https://github.com/user-attachments/assets/1af8632c-1248-4919-82cc-f55e55b9b385" />


---

### Configuration File

Copy and paste the complete contents of your `ansible/site.yml` file below:

```yaml
---
# Play 1: Install and configure Nginx

- name: Install and configure Nginx
  hosts: web
  become: true

  tasks:

    - name: Install nginx, git and rsync
      ansible.builtin.apt:
        name:
          - nginx
          - git
          - rsync
        state: present
        update_cache: true

    - name: Ensure Nginx is started and enabled
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true


# Play 2: Deploy Mini Finance website

- name: Deploy Mini Finance website
  hosts: web
  become: true

  vars:
    repo_url: "https://github.com/pravinmishraaws/mini_finance.git"
    repo_path: "/tmp/mini_finance"
    web_root: "/var/www/html/"

  tasks:

    - name: Clone Mini Finance repository
      ansible.builtin.git:
        repo: "{{ repo_url }}"
        dest: "{{ repo_path }}"
        version: main
        force: true

    - name: Synchronize website files
      ansible.posix.synchronize:
        src: "{{ repo_path }}/"
        dest: "{{ web_root }}"
        delete: true
        rsync_opts:
          - "--exclude=.git"
      delegate_to: "{{ inventory_hostname }}"

    - name: Set website ownership
      ansible.builtin.file:
        path: "{{ web_root }}"
        owner: www-data
        group: www-data
        recurse: true

  handlers:

    - name: Reload Nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded


# Play 3: Verify deployment

- name: Verify Mini Finance deployment
  hosts: localhost
  connection: local
  gather_facts: false

  vars:
    website_url: "http://20.235.158.159"

  tasks:

    - name: Verify Mini Finance website
      ansible.builtin.uri:
        url: "{{ website_url }}"
        status_code: 200
        return_content: true

    - name: Assert website is reachable
      ansible.builtin.assert:
        that:
          - website_url is defined
        success_msg: "Mini Finance website is reachable."
        fail_msg: "Mini Finance website verification failed."
```

---

# Task 7 — Validate and Run the Ansible Playbook

## Goal

Validate the syntax of the multi-play Ansible playbook and run it to install Nginx, deploy the Mini Finance website, and verify the deployment.

### Evidence

#### Screenshot 10 — Successful playbook syntax check showing `playbook: site.yml`

<img width="659" height="208" alt="10" src="https://github.com/user-attachments/assets/90ce663d-7999-4074-8e7a-5b3db584b9a6" />


---

#### Screenshot 11 — Play 3 output showing the successful HTTP verification and assertion

<img width="657" height="157" alt="11" src="https://github.com/user-attachments/assets/060ff7e1-8859-4918-94e8-708eb3328afd" />


---

#### Screenshot 12 — Final `PLAY RECAP` showing `failed=0` and `unreachable=0`

<img width="657" height="131" alt="12" src="https://github.com/user-attachments/assets/0dc975bb-c76e-40a1-a502-195dff702129" />


---

### Notes

For this task, I first checked the syntax of the Ansible playbook using:
ansible-playbook --syntax-check site.yml

I initially had a YAML indentation problem, which caused the syntax check to fail.
After correcting the indentation, the syntax check returned:
playbook: site.yml

I then ran the complete playbook using:
ansible-playbook -i inventory.ini site.yml

The playbook successfully installed the required packages, deployed the website and verified that the website was reachable.
The final recap showed:
failed=0
unreachable=0

This confirmed that the deployment completed successfully.

---

# Task 8 — Test the Mini Finance Website in a Browser

## Goal

Confirm that the Mini Finance website is publicly accessible through the Azure VM’s public IP address.

### Evidence

#### Screenshot 13 — Mini Finance website successfully loading in the browser, with the Azure VM’s public IP address visible in the address bar

<img width="1578" height="1051" alt="13" src="https://github.com/user-attachments/assets/641591fd-8b13-4ef3-9fb7-4a06b5b6e269" />


---

### Website URL

Add your deployed website URL below:

```text
http://20.235.158.159/
```

---

# Task 9 — Create the Project README

## Goal

Create a `README.md` file to document the Mini Finance infrastructure and deployment project.

### Evidence

#### Screenshot 14 — Completed `README.md` displayed in the VS Code Markdown preview or terminal

<img width="1526" height="514" alt="14" src="https://github.com/user-attachments/assets/2bca98ee-7237-4c7a-8539-59a74b188f07" />
<img width="1526" height="813" alt="14 1" src="https://github.com/user-attachments/assets/9c306122-60d6-43dc-a722-da247a0d1918" />


---

### README Content

Copy and paste the complete contents of your `README.md` file below:

```markdown
## DevOps Micro Internship (DMI) Cohort 3

This project demonstrates how Terraform and Ansible can be used together to provision Azure infrastructure and deploy a website automatically.

The Mini Finance website is deployed to an Ubuntu Azure Virtual Machine running Nginx.

---

## Project Overview

The deployment uses:

- Terraform for Azure infrastructure provisioning
- Ansible for server configuration and application deployment
- Azure Virtual Machine running Ubuntu
- Nginx as the web server
- Git for retrieving the Mini Finance website
- Rsync for synchronizing website files
- SSH for secure server access

---

## Architecture

The deployment follows this workflow:

```text
Developer
    |
    | Terraform
    v
Azure
    |
    +-------------------------+
    | Resource Group          |
    |                         |
    | Virtual Network         |
    | Subnet                  |
    | Network Security Group |
    | Network Interface       |
    | Public IP               |
    | Ubuntu VM               |
    +-------------------------+
                |
                | SSH
                v
           Ansible
                |
                +----------------------+
                |                      |
                v                      v
             Nginx                 Mini Finance
             Git                   Website Files
             Rsync
                |
                v
        /var/www/html/
                |
                v
          Public Website
```

---

# LinkedIn Post Required

## Evidence

#### Screenshot 15 — Published LinkedIn post showing the text and at least one deployment screenshot

<img width="551" height="838" alt="linkedinpost" src="https://github.com/user-attachments/assets/5e9015b1-20e7-4a5c-8b99-673a5fb32f6d" />


---

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/eHs7FkC5

---

### LinkedIn Submission Notes

**One challenge you faced and how you fixed it:**

One of the main challenges I faced was the Azure VM size being unavailable in the South India region. Terraform returned a SkuNotAvailable error for Standard_B1s.
I fixed this by changing the VM size to Standard_D2s_v5, after which Terraform was able to create the VM successfully.
I also had an Rsync path issue during the Ansible deployment. The website repository existed on the Azure VM, but the synchronization task was initially looking for the directory on my local machine. I corrected the task so the synchronization happened in the right environment.
These issues helped me understand that troubleshooting is a major part of working with cloud and DevOps tools.

---

**One real-world example where you can use this learning:**

One real-world example where you can use this learning
This workflow can be used to deploy websites and applications to cloud servers without manually configuring every server.
For example, a company could use Terraform to create its Azure infrastructure and then use Ansible to automatically install the required software, configure Nginx, deploy an application and verify that the application is working.
This makes deployments more consistent and repeatable, especially when the company needs to manage multiple servers.

---

# Assignment Questions

Answer the following in your own words:

**1. What did you provision using Terraform in this assignment?**

I used Terraform to provision the Azure infrastructure that the Mini Finance website would run on.
Instead of going into the Azure portal and manually creating everything, I described the infrastructure I needed in Terraform and allowed Terraform to create it for me.
The resources included the Azure Resource Group, Virtual Network, Subnet, Network Security Group, Network Interface, Public IP address and Ubuntu Virtual Machine.
The easiest way I understand this is to think of Terraform as the person responsible for building the house. Before I can move into the house or put anything inside it, the house itself needs to exist. Terraform handled that part.
So the flow was:

Terraform
   ↓
Azure Infrastructure
   ↓
Virtual Machine
   ↓
Public IP + Networking
   ↓
Ready for Ansible

---

**2. What did Ansible configure and deploy in this assignment?**

After Terraform created the Azure VM, I used Ansible to configure the server and deploy the Mini Finance website.
Ansible installed:
Nginx
Git
Rsync

It also made sure that Nginx was started and enabled.
After that, Ansible cloned the Mini Finance repository, synchronized the website files into:
/var/www/html/

and changed the ownership to:
www-data:www-data

Finally, Ansible used the uri module and an assert task to confirm that the website was actually reachable.
I think of it this way:
Terraform built the house. Ansible moved in and prepared everything inside the house. Nginx then became the person at the front door serving the website to visitors.
So Terraform and Ansible were not doing the same job. They were connected but responsible for different stages of the deployment.

---

**3. Why is SSH access on port `22` restricted to your public IP address?**

SSH is used to remotely access and manage the server, so allowing everybody on the internet to access port 22 would create unnecessary exposure.
In this project, I needed SSH because both I and Ansible needed to connect to the Azure VM.
However, I did not need every person on the internet to be able to attempt an SSH connection.
That is why the SSH rule was restricted to my public IP address.
A simple way to think about it is a house with a front door.
The website door is open to visitors because the website is supposed to be public. But the door to the control room should not be open to everybody.
In this project:
Port 80
   ↓
Website visitors
   ↓
Public

Port 22
   ↓
Server administration
   ↓
Restricted

Restricting SSH helps reduce the number of external systems that can attempt to access the server.

---

**4. Why is HTTP port `80` open to the internet?**

Port 80 is the standard port used for HTTP traffic.
The whole point of this project is to deploy a website that people can access through a browser.
So if port 80 were blocked, someone could type the VM's public IP address into a browser, but the request would not be able to reach Nginx.
The connection looks like this:
User's Browser
      ↓
Public IP
      ↓
Port 80
      ↓
Nginx
      ↓
/var/www/html/
      ↓
Mini Finance Website

So port 80 needs to be open because the website is meant to be publicly accessible.
The important difference is that HTTP is for website traffic, while SSH is for administration.

---

**5. What is the purpose of the Ansible inventory file?**

The Ansible inventory tells Ansible which machines it should work with and how to connect to them.
Our inventory contained the Mini Finance server and information such as its public IP address, SSH username and private SSH key.
For example:
[web]
mini-finance ansible_host=20.235.158.159

[web:vars]
ansible_user=azureuser
ansible_ssh_private_key_file=~/.ssh/id_ed25519

The [web] section creates a group.
The server is placed inside that group.
Then the connection information tells Ansible:
This is the machine I want you to manage, this is the user you should connect with, and this is the SSH key you should use.

I think of the inventory as Ansible's address book.
Without the address book, Ansible doesn't know which server it is supposed to work on.
This also connects directly to our playbook because we used:
hosts: web

That tells Ansible:
Go to all the servers inside the web group and run these tasks.

---

**6. Why does the playbook use separate plays for install, deploy, and verify?**

The playbook is separated into three plays because each stage has a different responsibility.
Play 1
Install and configure the server.
Install Nginx
Install Git
Install Rsync
Start Nginx
Enable Nginx

Play 2
Deploy the actual website.
Clone repository
        ↓
Synchronize website files
        ↓
Set ownership

Play 3
Verify the deployment.
Send HTTP request
        ↓
Check response
        ↓
Assert website is reachable

This makes the playbook easier to understand and troubleshoot.
For example, if Play 1 fails, I know I have a server configuration problem.
If Play 2 fails, I know the problem is probably related to the website deployment.
If Play 3 fails, the infrastructure and deployment may have completed, but the application may not actually be reachable.
So separating the plays helps me understand where the problem is instead of having one huge block of automation where everything is mixed together.

---

**7. Why is `rsync` useful when deploying website files?**

Rsync is useful because it is designed to synchronize files between locations.
In our project, the website repository was cloned into:
/tmp/mini_finance/

and the website needed to end up in:
/var/www/html/

So Rsync helped us move and synchronize the website files into the directory Nginx uses.
The flow was:
Mini Finance Repository
          ↓
     Git clone
          ↓
/tmp/mini_finance/
          ↓
        Rsync
          ↓
/var/www/html/
          ↓
        Nginx
          ↓
      Website

This is useful because if the website changes later, Rsync can synchronize the changes rather than requiring us to manually copy every file again.
We actually encountered an Rsync problem during this project, which helped me understand it better.
The repository existed on the Azure VM, but the Rsync command was initially looking for the source directory on my Mac.
So it was basically like telling someone:
"Take the files from the room upstairs."

while they were standing in a completely different house.
Once we made sure the synchronization task was running in the correct environment, the deployment worked.

---

**8. What does the Ansible `uri` module verify in this assignment?**

The uri module was used to test the website over HTTP.
Instead of simply assuming that the deployment worked because Ansible completed successfully, we actually sent a request to the website.
The request went to the Azure VM's public IP:
http://20.235.158.159

We expected a successful HTTP response.
The important expected response was:
200

An HTTP 200 response tells us that the server successfully responded to the request.
Then the assert task checked the result and confirmed:
Mini Finance website is reachable.

This is important because deployment success and application success are not always the same thing.
Ansible could finish copying the files successfully, but Nginx could still be misconfigured.
The uri and assert tasks give us another layer of confidence.
So our deployment did not simply say:
"I copied the files."

It also checked:
"Can somebody actually reach the website?"

---

**9. What issue did you face during this assignment, and how did you fix it?**

I faced a few issues during this project, and each one taught me something different.
Azure subscription problem
At first, Terraform failed because the Azure subscription I was using was disabled and marked as read-only.
The error was:
ReadOnlyDisabledSubscription

This meant Terraform was trying to create resources, but Azure was basically saying:
You can view the subscription, but you cannot make changes.

I switched to the new active Azure subscription and configured Azure CLI to use it.
Azure VM capacity problem
After fixing the subscription, the VM creation failed because the Standard_B1s VM size was not available in the South India region due to capacity restrictions.
The error was:
SkuNotAvailable

I changed the VM size to Standard_D2s_v5, after which the VM was successfully created.
This taught me that even when Terraform code is correct, cloud providers can still have capacity restrictions. A VM size being available as a product does not necessarily mean that it is available in every region at that particular time.
Ansible environment problem
When I initially tried to run:
ansible -i inventory.ini web -m ping

I got:
zsh: command not found: ansible

The issue was that the virtual environment containing Ansible was not active.
After activating the correct environment:
source ~/ansible-onboarding/venv/bin/activate

I was able to run Ansible successfully.
Wrong repository
I initially checked my own GitHub repository, but it was empty.
Git even warned:
You appear to have cloned an empty repository.

I then checked the repository provided for the Mini Finance project and confirmed that it contained the actual website files.
This taught me that before automating a deployment, I need to confirm that the source repository actually contains the application I am trying to deploy.
Rsync path problem
The biggest Ansible deployment issue happened with Rsync.
The Git task successfully cloned the repository on the Azure VM, but Rsync initially looked for:
/tmp/mini_finance/

on my local Mac.
The directory wasn't there because it existed on the Azure VM.
I fixed the task so the synchronization happened in the correct environment.
After that, the playbook completed successfully with:
failed=0
unreachable=0

This was probably one of the most useful problems because it forced me to understand where each Ansible task is actually running.

---

**10. What did you learn from using Terraform and Ansible together?**

The biggest thing I learned is that Terraform and Ansible are two different parts of the same deployment process.
Before this project, it was easy to think of them as two separate tools.
Now I understand the connection much better.
Terraform handles the infrastructure:
Azure
  ↓
Resource Group
  ↓
Network
  ↓
Security
  ↓
VM
  ↓
Public IP

Then Ansible takes over:
VM
 ↓
Install software
 ↓
Configure Nginx
 ↓
Get website
 ↓
Deploy website
 ↓
Verify website

So the complete workflow becomes:
                 TERRAFORM
                     ↓
          Build Azure infrastructure
                     ↓
                 Azure VM
                     ↓
                    SSH
                     ↓
                  ANSIBLE
                     ↓
             Configure server
                     ↓
              Deploy website
                     ↓
                 NGINX
                     ↓
              Verify with URI
                     ↓
                  Browser
                     ↓
             MINI FINANCE

That connection is what made the project useful for me.
I did not just learn individual Terraform or Ansible commands. I learned how they can work together as part of one DevOps workflow.
Terraform answers:
"What infrastructure do I need?"
Ansible answers:
"How do I configure and deploy to that infrastructure?"
And the verification step answers:
"Did everything actually work?"
That is the part I want to carry forward into future cloud and DevOps projects.

---

# Required Files

Confirm that the following files are included in your assignment folder:

- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `terraform/providers.tf`
- [ ] `terraform/main.tf`
- [ ] `terraform/variables.tf`
- [ ] `terraform/outputs.tf`
- [ ] `ansible/inventory.ini`
- [ ] `ansible/site.yml`

---

# Submission Instructions

- Add all required screenshots in the correct order.
- Full Name must be visible in required screenshots.
- Add the Azure VM public IP address.
- Add the final Mini Finance website URL.
- Paste `inventory.ini`, `site.yml`, and `README.md` as editable text.
- Answer all assignment questions clearly in your own words.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, passwords, Azure credentials, subscription IDs, Terraform state contents, or other sensitive information.
- Submit only one Google Doc link.
- Ensure that anyone with the link can view the document.
- Test the Google Doc link in an incognito or private browser window before submitting.

---

# Completion Checklist

- [ ] Task 1: `mini-finance` project structure created
- [ ] Task 1: `.gitignore` created
- [ ] Task 2: Terraform Azure infrastructure code created
- [ ] Task 2: `Allow-SSH` rule configured for port `22`
- [ ] Task 2: `Allow-HTTP` rule configured for port `80`
- [ ] Task 2: NSG associated with the Network Interface
- [ ] Task 3: `terraform fmt` completed
- [ ] Task 3: `terraform init` completed
- [ ] Task 3: `terraform validate` completed successfully
- [ ] Task 3: `terraform apply` completed successfully
- [ ] Task 3: `terraform output public_ip` displayed the VM public IP
- [ ] Task 4: Passwordless SSH works from the Ansible controller
- [ ] Task 5: `inventory.ini` created
- [ ] Task 5: Ansible ping returns `SUCCESS` and `pong`
- [ ] Task 6: `site.yml` contains three separate plays
- [ ] Task 6: Play 1 installs Nginx, Git, and rsync
- [ ] Task 6: Play 2 clones and deploys the Mini Finance website
- [ ] Task 6: Play 3 verifies HTTP status code `200`
- [ ] Task 7: Playbook syntax check passes
- [ ] Task 7: Ansible playbook completes successfully
- [ ] Task 7: Final recap shows `failed=0` and `unreachable=0`
- [ ] Task 8: Mini Finance website loads in the browser
- [ ] Task 8: Azure VM public IP is visible in the browser screenshot
- [ ] Task 9: `README.md` completed
- [ ] Screenshots 1–15 are included
- [ ] `inventory.ini`, `site.yml`, and `README.md` are pasted as editable text
- [ ] Assignment questions are answered
- [ ] LinkedIn post published with Anyone visibility
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
