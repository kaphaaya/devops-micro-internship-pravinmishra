# Assignment 03 — Deploy a Static Website to Multiple Servers Using a Multi-Play Ansible Playbook

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Student Details

**Full Name:** Aziz Olaide Kafayat
**Cloud Platform Used:** AWS 
**Server 1 URL:** http://54.91.48.124/
**Server 2 URL:** http://54.161.15.214/

---

## Purpose

In this assignment, you will create a multi-play Ansible playbook to install Nginx, deploy a static website to two Ubuntu servers, and verify that the website is accessible from both servers.

You may use either AWS EC2 instances or Azure Virtual Machines as your managed servers.

---

# Task 1 — Create the Project Structure

## Goal

Create the required folders and files for the Ansible project.

## Evidence

### Screenshot 1 — Terminal or VS Code showing the complete `static-web` project structure

<img width="597" height="379" alt="1" src="https://github.com/user-attachments/assets/708c3a09-61b6-4f0c-a0f3-350b810afdad" />


---

# Task 2 — Configure the Ansible Inventory

## Goal

Add both Ubuntu servers to the Ansible inventory.

## Evidence

### Screenshot 2 — Output of `ansible-inventory -i inventory.ini --graph` showing `web1` and `web2`

<img width="673" height="134" alt="2" src="https://github.com/user-attachments/assets/2f4b2a8c-b8f5-41db-af07-0179a1c487ed" />


---

## Configuration File

Copy and paste the complete contents of your `inventory.ini` file below:

```ini
[web]
web1 ansible_host=54.91.48.124
web2 ansible_host=54.161.15.214

[web:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/terraform-aws-vm-key

```

---

# Task 3 — Verify Ansible Connectivity

## Goal

Confirm that the Ansible controller can connect to both servers.

## Evidence

### Screenshot 3 — Ansible ping output showing `SUCCESS` and `pong` for both servers

<img width="828" height="341" alt="3" src="https://github.com/user-attachments/assets/572cfb09-8faf-4071-8979-b3292a02adc1" />


---

# Task 4 — Download and Personalize the Static Website

## Goal

Download `index.html` to the Ansible controller and personalize the website with your full name.

## Evidence

### Screenshot 4 — Edited `files/index.html` showing the footer line with your full name

<img width="829" height="78" alt="4" src="https://github.com/user-attachments/assets/73394c1b-6cb4-4646-9d25-4bc557d9e9f5" />


---

# Task 5 — Create the Multi-Play Ansible Playbook

## Goal

Create a single Ansible playbook containing separate plays for installation, deployment, and verification.

## Configuration File

Copy and paste the complete contents of your `site.yml` file below:

```yaml
---
- name: Install and configure Nginx
  hosts: web
  become: true
  tasks:
    - name: Update the APT package cache
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

    - name: Install Nginx
      ansible.builtin.apt:
        name: nginx
        state: present

    - name: Start and enable Nginx
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

- name: Deploy the static website
  hosts: web
  become: true
  tasks:
    - name: Copy index.html to the web root
      ansible.builtin.copy:
        src: files/index.html
        dest: /var/www/html/index.html
        owner: www-data
        group: www-data
        mode: "0644"
      notify: Reload nginx

  handlers:
    - name: Reload nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded

- name: Verify both websites from the controller
  hosts: localhost
  connection: local
  gather_facts: false
  become: false
  tasks:
    - name: Send an HTTP GET request to each web server
      ansible.builtin.uri:
        url: "http://{{ hostvars[item].ansible_host }}"
        status_code: 200
      loop: "{{ groups['web'] }}"
      register: website_checks

    - name: Confirm each server returned HTTP 200
      ansible.builtin.assert:
        that:
          - item.status == 200
        success_msg: "{{ item.item }} returned HTTP {{ item.status }}"
      loop: "{{ website_checks.results }}"

```

---

# Task 6 — Validate the Playbook Syntax

## Goal

Check the playbook for YAML or Ansible syntax errors before running it.

## Evidence

### Screenshot 5 — Successful syntax-check output showing `playbook: site.yml`

<img width="827" height="77" alt="5" src="https://github.com/user-attachments/assets/a1b75008-3fbf-4862-9347-b52573a3b14c" />


---

# Task 7 — Run the Multi-Play Playbook

## Goal

Install Nginx, deploy the website, and verify both servers in one playbook run.

## Evidence

### Screenshot 6 — Play 3 verification showing HTTP `200` for both servers

<img width="1016" height="906" alt="6" src="https://github.com/user-attachments/assets/e20d779c-2a45-497f-8fc9-a1bdc7b99994" />


---

### Screenshot 7 — Final play recap showing `unreachable=0` and `failed=0` for `web1`, `web2`, and `localhost`

<img width="1014" height="117" alt="7" src="https://github.com/user-attachments/assets/61274cf4-cd72-419a-a9d7-793c34aa9452" />


---

# Task 8 — Verify Idempotency

## Goal

Run the playbook again and confirm that it does not make unnecessary changes.

## Evidence

### Screenshot 8 — Second playbook run showing the play recap with `changed=0`, `unreachable=0`, and `failed=0` for both web servers

<img width="891" height="112" alt="8" src="https://github.com/user-attachments/assets/d4cad8b7-a8f8-41d4-978c-311fb3084718" />


---

# Task 9 — Test Both Websites Manually

## Goal

Confirm that the static website is accessible from both public IP addresses.

## Evidence

### Screenshot 9 — `curl -I` output showing HTTP `200 OK` from both servers

<img width="669" height="580" alt="9" src="https://github.com/user-attachments/assets/b8aa2c69-930f-482b-9a72-9ce304d522bf" />


---

### Screenshot 10 — Browser showing the website from Server 1 with the public IP and your full name visible

<img width="792" height="1035" alt="10" src="https://github.com/user-attachments/assets/e8d30714-c0b8-4c77-8fe9-8f1fa7e4ebe9" />


---

### Screenshot 11 — Browser showing the website from Server 2 with the public IP and your full name visible

<img width="792" height="1024" alt="11" src="https://github.com/user-attachments/assets/79f36cf3-c64a-4a7a-bff7-668329f4fe47" />


---

## Website URLs

Add both deployed website URLs below:

```text
Server 1: http://54.91.48.124/
Server 2: http://54.161.15.214/
```

---

# Task 10 — Complete the Project README

## Goal

Document how the project works and record what you learned.

## README Content

Copy and paste the complete contents of your `README.md` file below:

```markdown
# Assignment 03: Deploy a Static Website to Multiple Servers Using Ansible

Part of the **DevOps Micro Internship (DMI) Cohort 3 with Agentic AI**

## Student Details

**Full Name:** Kafayat Olaide Aziz  
**Cloud Platform Used:** AWS  
**Server 1:** `http://54.91.48.124`  
**Server 2:** `http://54.161.15.214`

---

## Project Overview

This project demonstrates how Ansible can be used to automate the deployment of a static website to multiple Ubuntu servers.

For this assignment, I used two AWS EC2 instances as web servers. I created an Ansible inventory containing both servers and used a multi-play Ansible playbook to:

1. Install Nginx on both servers.
2. Start and enable the Nginx service.
3. Deploy a personalized static website to both servers.
4. Reload Nginx after deployment.
5. Verify that both websites return HTTP 200.
6. Test idempotency by running the playbook again.

The main goal was to understand how Ansible can automate the same configuration and deployment process across multiple servers.

---

## Architecture

```text
                    Ansible Controller
                       My MacBook
                           |
                           |
                       Ansible SSH
                           |
              +------------+------------+
              |                         |
              v                         v
        AWS EC2 web1              AWS EC2 web2
        54.91.48.124             54.161.15.214
              |                         |
           Nginx                     Nginx
              |                         |
        index.html                 index.html
              |                         |
              +------------+------------+
                           |
                     HTTP 200 OK
```

---

## Project Structure

```text
static-web/
├── inventory.ini
├── site.yml
├── README.md
└── files/
    └── index.html
```

### File Description

- `inventory.ini` contains the details of the two managed servers.
- `site.yml` contains the multi-play Ansible playbook.
- `files/index.html` contains the static website that is deployed.
- `README.md` documents the project and what I learned.

---

# Ansible Inventory

The inventory defines the two Ubuntu servers that Ansible manages.

```ini
[web]
web1 ansible_host=54.91.48.124
web2 ansible_host=54.161.15.214

[web:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/terraform-aws-vm-key
```

The servers are grouped under `[web]`, which allows the playbook to target both servers together.

---

# Multi-Play Ansible Playbook

The `site.yml` playbook contains three separate plays.

### Play 1: Install and Configure Nginx

The first play targets the `web` group.

It:

- Updates the APT package cache.
- Installs Nginx.
- Starts Nginx.
- Enables Nginx so it starts automatically.

### Play 2: Deploy the Website

The second play copies `files/index.html` from the Ansible controller to:

```text
/var/www/html/index.html
```

The file is owned by `www-data` and uses permissions of `0644`.

The play also uses a handler to reload Nginx when the website file changes.

### Play 3: Verify the Website

The third play runs on the Ansible controller.

It uses the Ansible `uri` module to send HTTP requests to both servers and checks that they return:

```text
HTTP 200
```

This confirms that the websites are accessible.

---

# Deployment Process

## 1. Configure the Inventory

The two AWS EC2 instances were added to `inventory.ini` as:

```text
web1
web2
```

I verified the inventory using:

```bash
ansible-inventory -i inventory.ini --graph
```

---

## 2. Test Server Connectivity

I tested the connection to both servers using:

```bash
ansible web -i inventory.ini -m ping
```

Both servers returned:

```text
SUCCESS
```

and:

```text
"ping": "pong"
```

This confirmed that Ansible could communicate with both servers.

---

## 3. Install and Configure Nginx

The first play of the playbook installed Nginx and ensured that the service was running and enabled.

---

## 4. Deploy the Website

The personalized `index.html` file was copied to both servers using the Ansible `copy` module.

The website was personalized with my full name:

**Kafayat Olaide Aziz**

---

## 5. Verify the Deployment

The third play used the `uri` module to check both servers.

The expected HTTP response was:

```text
HTTP 200
```

A successful HTTP 200 response confirmed that the website was being served correctly.

---

# Idempotency

I also tested the playbook by running it a second time.

Idempotency means that Ansible should not repeatedly make changes when the servers are already in the desired state.

During the first run, Nginx was installed and the website was deployed, so changes were made.

During the second run, Ansible checked the existing configuration and files. Tasks that were already in the desired state did not need to be changed.

This demonstrates one of the important benefits of configuration management with Ansible.

---

# Issue Encountered

One of the main issues I encountered was an SSH connection timeout when Ansible tried to connect to the EC2 servers.

The AWS security group was allowing SSH access from an old IP address:

```text
102.88.167.200/32
```

However, my current public IP address was:

```text
102.216.11.5
```

Because the current IP was not allowed, the SSH connection timed out.

I checked the AWS security group and updated the SSH rule to allow my current IP address.

After that, I encountered an SSH host key verification issue. I resolved this for the Ansible connectivity test by disabling host key checking for the command.

After these changes, Ansible successfully connected to both servers and returned `SUCCESS` and `pong`.

---

# What I Learned

This assignment helped me understand how Ansible can automate server management and deployment.

I learned how to:

- Create an Ansible inventory.
- Manage multiple servers using an Ansible group.
- Test connectivity using the `ping` module.
- Create a multi-play Ansible playbook.
- Install packages using Ansible.
- Manage services using Ansible.
- Deploy files using the `copy` module.
- Use handlers to reload services after changes.
- Use the `uri` module to test HTTP responses.
- Understand Ansible idempotency.
- Troubleshoot SSH and AWS security group connectivity issues.

---

# Why Multi-Play Automation Is Useful

Separating the playbook into installation, deployment, and verification makes the automation easier to understand and troubleshoot.

Each play has a clear responsibility:

```text
Play 1
Install and configure Nginx
        ↓
Play 2
Deploy the website
        ↓
Play 3
Verify the website
```

If a problem occurs, I can identify which stage of the deployment caused it instead of troubleshooting the entire process at once.

---

# Why Use the Ansible Copy Module?

The `copy` module allows the Ansible controller to send the exact website file to each managed server.

This ensures that both servers receive the same version of the website.

It also means that Git does not need to be configured separately on every managed server just to deploy the static file.

---

# Website URLs

**Server 1:**

```text
http://54.91.48.124
```

**Server 2:**

```text
http://54.161.15.214
```

Both servers were tested to confirm that the website was accessible.

---

# Assignment Questions

### 1. What issue did you face while completing this assignment, and how did you fix it?

I initially had an SSH connection timeout because the AWS security group only allowed SSH connections from an old IP address. I checked my current public IP address and updated the security group to allow SSH from my current IP. I then resolved an SSH host key verification issue so that Ansible could successfully connect to both servers.

### 2. What did you learn from this assignment?

I learned how to use Ansible to manage multiple Ubuntu servers from one controller. I learned how to create an inventory, test connectivity, install Nginx, deploy files, verify HTTP responses, and test idempotency.

### 3. Why is it useful to split installation, deployment, and verification into separate plays?

It makes the playbook easier to understand, maintain, and troubleshoot. Each play has one main responsibility, so it is easier to identify where a problem occurs.

### 4. What is one benefit of using the Ansible `copy` module instead of cloning the website directly from Git on every managed server?

The `copy` module allows the controller to deploy the exact tested file to every server. This ensures that both servers receive the same website version without requiring Git to be configured on every server.

### 5. What does idempotency mean in this assignment?

Idempotency means that running the playbook again should not make unnecessary changes when the servers are already correctly configured.

### 6. What does the Ansible `uri` module verify in Play 3?

The `uri` module sends an HTTP request to each server and checks the response status. In this assignment, it verifies that both websites return HTTP status `200`.

---

# Conclusion

This assignment demonstrated how Ansible can be used to automate the deployment of a static website across multiple servers.

Instead of manually installing Nginx and copying the website to each server, I used one Ansible playbook to manage both servers consistently.

The project also gave me practical experience troubleshooting SSH connectivity, working with AWS security groups, deploying applications with Ansible, and verifying that an automated deployment worked correctly.

---

## Required Files

```text
inventory.ini
site.yml
files/index.html
README.md
```

---

## DMI

This project is part of the **DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track**, focused on practical DevOps skills, automation, systems thinking, and career readiness.
```

---

# LinkedIn Post Required

## Evidence

### LinkedIn Post URL

Paste your LinkedIn post URL here:

https://lnkd.in/p/eUfjDwz2

---

### Screenshot — Published LinkedIn post

<img width="474" height="753" alt="linkedinpost" src="https://github.com/user-attachments/assets/55144988-2cce-4ba4-9846-3e34206a41f3" />


---

# Assignment Questions

Answer the following in your own words:

**1. What issue did you face while completing this assignment, and how did you fix it?**

One issue I faced was that Ansible could not connect to my two EC2 servers through SSH. The AWS security group was only allowing SSH connections from an old IP address, while my current public IP address was different. I checked my current public IP and updated the AWS security group to allow SSH from my current IP address.

After fixing that, I encountered an SSH host key verification error. I resolved this by disabling Ansible host key checking for the connectivity test using ANSIBLE_HOST_KEY_CHECKING=False. After that, Ansible successfully connected to both servers and returned SUCCESS with pong.

This helped me understand that Ansible uses SSH to communicate with Linux servers, so the SSH connection and AWS security group must be configured correctly before Ansible can manage the servers.
---

**2. What did you learn from this assignment?**

I learned how to use Ansible to manage multiple Ubuntu servers from one controller. I created an inventory containing two web servers, tested connectivity using the Ansible ping module, and created a multi-play playbook.

I learned how to use Ansible to install and start Nginx, deploy a static website using the copy module, and verify that the websites were accessible using the uri module.

I also learned about idempotency and why it is important in automation. Instead of repeatedly making the same changes, Ansible checks the current state of the server and only makes changes when they are necessary.



---

**3. Why is it useful to split installation, deployment, and verification into separate plays?**

Splitting the tasks into separate plays makes the playbook easier to understand, manage, and troubleshoot.

The first play is responsible for installing and configuring Nginx. The second play deploys the website files. The third play verifies that the websites are accessible.

This separation also makes it easier to identify where a problem occurs. For example, if Nginx installs correctly but the website does not load, I can focus on the deployment or verification play instead of checking the entire playbook.

---

**4. What is one benefit of using the Ansible `copy` module instead of cloning the website directly from Git on every managed server?**

One benefit is that the Ansible controller can send the exact website file directly to every managed server.

This means I can control the version of the file being deployed and ensure that both servers receive the same tested index.html file. It also avoids having to configure Git and clone the repository separately on every server.

---

**5. What does idempotency mean in this assignment?**

Idempotency means that running the same Ansible playbook multiple times should not cause unnecessary changes when the servers are already in the desired state.

During the first run, Ansible installed Nginx and deployed the website, so changes were made. When the playbook is run again, Ansible checks the existing configuration and files. If everything is already correct, it should report changed=0.

In this assignment, idempotency shows that the playbook can safely be run again without repeatedly changing the servers.


---

**6. What does the Ansible `uri` module verify in Play 3?**

The uri module sends an HTTP request to each web server's public IP address and checks the HTTP response.

In this assignment, the playbook expected a status code of 200. A successful HTTP 200 response confirms that the Nginx web server is responding and that the deployed website is accessible through HTTP.

Therefore, Play 3 provides an automated check that both web servers are serving the website successfully.

---

# Required Files

Confirm that the following files are included in your assignment folder:

- [ ] `inventory.ini`
- [ ] `site.yml`
- [ ] `files/index.html`
- [ ] `README.md`

---

# Submission Instructions

- Add all required screenshots in the correct order.
- Full Name must be visible in required screenshots.
- Include both deployed website URLs.
- Paste `inventory.ini`, `site.yml`, and `README.md` as editable text.
- Answer all assignment questions clearly in your own words.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, passwords, cloud account IDs, or other sensitive information.

---

# Completion Checklist

- [ ] Task 1: `static-web` folder structure is complete
- [ ] Task 2: Both servers are listed under the `[web]` group in `inventory.ini`
- [ ] Task 2: Inventory graph shows `web1` and `web2`
- [ ] Task 3: Ansible ping returns `SUCCESS` and `pong` for both servers
- [ ] Task 4: `files/index.html` contains your full name
- [ ] Task 5: `site.yml` contains three separate plays
- [ ] Task 5: Play 1 installs, starts, and enables Nginx
- [ ] Task 5: Play 2 deploys `index.html` using the `copy` module
- [ ] Task 5: Nginx reload handler is included
- [ ] Task 5: Play 3 verifies both web servers from the controller
- [ ] Task 6: Playbook syntax check passes
- [ ] Task 7: First playbook run completes with `unreachable=0` and `failed=0`
- [ ] Task 7: URI verification returns HTTP `200` for both servers
- [ ] Task 8: Second playbook run demonstrates idempotency
- [ ] Task 8: Second run shows `changed=0` for both web servers
- [ ] Task 9: Both `curl -I` commands return HTTP `200 OK`
- [ ] Task 9: Website loads from Server 1
- [ ] Task 9: Website loads from Server 2
- [ ] Task 9: Full name is visible on both deployed websites
- [ ] Task 10: `README.md` contains all required explanations
- [ ] Screenshots 1–11 are included
- [ ] `inventory.ini`, `site.yml`, and `README.md` are pasted as editable text
- [ ] Both website URLs are included
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

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
