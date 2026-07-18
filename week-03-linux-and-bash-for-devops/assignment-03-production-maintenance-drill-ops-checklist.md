# Assignment 3 — Production Maintenance Drill (OPS Checklist)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will treat your already deployed React application (on Ubuntu VM with Nginx) as a live production system. You will perform structured operational checks covering network validation, service health, log analysis, resource monitoring, configuration verification, and incident simulation with recovery — mirroring real on-call DevOps responsibilities.

---

# Task 1 — Server Access & Networking Validation

## Goal

Verify that the deployed React application is reachable from the browser and confirm basic network connectivity of the Ubuntu VM.

### Evidence

#### Screenshot 1 — Browser showing the React app with your Full Name visible on the UI

<img width="1789" height="533" alt="Screenshot 1" src="https://github.com/user-attachments/assets/42f6738f-f148-4ce8-9a22-38092243466d" />


---

#### Screenshot 2 — Output of `ip a`

<img width="779" height="340" alt="Screenshot 2" src="https://github.com/user-attachments/assets/d7a1e2bb-831f-4a89-b3ed-19abed92ac15" />


---

#### Screenshot 3 — Output of `sudo ss -tulpen`

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/7148a114-2f79-4398-95bb-1bb5877cfe6b" />


---

#### Screenshot 4 — Output of `sudo ufw status`

<img width="770" height="422" alt="Screenshot 4" src="https://github.com/user-attachments/assets/e5a18920-e3cd-4656-9dc3-2b849f398a32" />


---

### Notes

Answer the following in your own words:

**1. What proves Nginx is listening on 0.0.0.0:80?**
- The primary proof that Nginx is listening on 0.0.0.0:80 is found in the output of the sudo ss -tulpen command.
                       [ " ino:8667 sk:5 cgroup:/system.slice/chrony.service v6only:1 <->                                            
tcp        LISTEN      0           511                       0.0.0.0:80                  0.0.0.0:* "]

-This address [0.0.0.0] signifies that Nginx is bound to all network interfaces, not just the localhost. This allows the server to accept HTTP connections from any IP address, including external traffic from the internet.

-The presence of the process name 'nginx' alongside the port in the output specifically confirms that Nginx is the service holding that port open.

---

**2. What proves SSH is active on port 22?**
-Port 22 is found in the output of the sudo ss -tulpen command
["tcp        LISTEN      0           4096                      0.0.0.0:22                  0.0.0.0:*          users:(("sshd",pid=18655,fd=3),("systemd",pid=1,fd=122)) "]  

-The presence of sshd (the SSH daemon) alongside the port number confirms that the SSH service is the specific process holding the port open.

-The address 0.0.0.0 signifies that the service is listening across all network interfaces, which allows for remote login to the server (for example, via ssh ubuntu@<public-ip>).

---

**3. Did you find any unexpected open ports? Explain briefly.**

No unexpected ports were found. Everything running on this server directly aligns with the deployment stack I executed.

-Port 80 (0.0.0.0:80): This is the Nginx web server listening for incoming HTTP connections on all network interfaces.

-Port 22 (0.0.0.0:22 and [::]:22): This is the SSH daemon (sshd) listening on both IPv4 and IPv6.

-Port 323 (UDP): This is chronyd managing Network Time Protocol (NTP) synchronization to keep your server's clock accurate. This was new to me but I realised it checks the time and its locally bound so it will always be there.

---

# Task 2 — Service Health & Systemd Validation (Nginx)

## Goal

Verify that Nginx is properly installed, running, enabled at boot, and safely configured.

### Evidence

#### Screenshot 1 — Output of `systemctl status nginx --no-pager`

<img width="772" height="414" alt="Screenshot 1png" src="https://github.com/user-attachments/assets/6882acb8-c922-454d-8ede-914e927f08c5" />


---

#### Screenshot 2 — Output of `sudo nginx -t`

<img width="765" height="423" alt="Screenshot 2" src="https://github.com/user-attachments/assets/5225bfde-1135-4e66-80c6-9c2c7152d6ce" />


---

#### Screenshot 3 — Output of `sudo ss -lptn '( sport = :80 )'`

<img width="771" height="426" alt="Screenshot 3" src="https://github.com/user-attachments/assets/c9de7114-373e-4931-8b5a-3f55d59f4e2c" />

---

### Notes

Answer the following in your own words:

**1. What happens if Nginx fails to restart in production?**

Because Nginx is the only process serving HTTP traffic on port 80 in this setup, its failure means:

-Any user attempting to visit the site would receive a connection error or a timeout since nothing would be listening on that port anymore

-If the failure occurs during a manual deployment or a configuration change, the site could remain down indefinitely until an engineer manually intervenes to diagnose and fix the issue

-These failures are often caused by config syntax errors, such as a missing semicolon, which prevents Nginx from successfully loading its new configuration files

---

**2. What's your basic rollback plan?**

A basic rollback plan is essential for maintaining production uptime and ensuring that a server can be quickly restored if a configuration change or deployment fails.

-Before making any configuration change, I will run sudo nginx -t first. This command validates the configuration syntax and catches most errors before they can affect the live service during a restart.

-If a restart is attempted and fails, the first step is to identify the exact cause by checking the service status and system logs using:
1. systemctl status nginx --no-pager
2. sudo journalctl -u nginx --no-pager -n 50

-If the failure is due to a bad configuration change, the fix is to revert the config file back to its last known-good version. This is ideally handled through a backup copy or version control (like Git)

-The simplest safeguard is to keep a backup copy of the working configuration before making any changes. This allows for an immediate rollback without the need to debug complex issues under the pressure of a production outage.
---

# Task 3 — Logs & Request Trace

## Goal

Verify real traffic flow and analyze logs to understand system behavior and errors.

### Evidence

#### Screenshot 1 — Output of `sudo tail -n 30 /var/log/nginx/access.log`

<img width="1792" height="1120" alt="Screenshot 1" src="https://github.com/user-attachments/assets/1cb8d140-b47b-4618-8c69-cc21f80526a8" />


---

#### Screenshot 2 — Output of `sudo tail -n 30 /var/log/nginx/error.log`

<img width="1792" height="1120" alt="Screenshot 2" src="https://github.com/user-attachments/assets/202c8ba2-0130-4536-8a8e-a7a5b220995c" />


---

#### Screenshot 3 — Output of `sudo journalctl -u nginx --no-pager -n 50`

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/c512f105-2249-4e7f-9ff8-59a1d4622e79" />


---

### Notes

Answer the following in your own words:

**1. Were there any errors in the logs?**

- If yes, mention 1–2 example error lines from the logs and explain what each one means in simple terms.
- If no, explain what it means if the error log is empty or shows no recent errors during your check.

-No. The only recorded entry is a standard system event, not a failure.
[[notice] 28366#28366: using inherited sockets from "5;6;"]

I learnt that it is a routine diagnostic notice triggered during a restart. Nginx is simply passing active network sockets to newly spawned worker processes. This is how Nginx guarantees zero downtime for active connections when you reload the service.

---

**2. If there were no errors, what does that indicate about the system?**

-A clean error log is the baseline for healthy infrastructure. It confirms three crucial operational facts:

Syntax is perfect: Your Nginx configuration files are valid and executing correctly.

Workers are stable: The core Nginx processes are running smoothly without crashing or hitting memory limits.

No internal roadblocks: Your server is not encountering backend failures or throwing fatal 500-level internal server errors.

---

**3. Based on the access logs, were your curl requests visible in the log entries? What does that prove about traffic flow?**

[ 16.171.38.215 - - [17/Jul/2026:13:17:00 +0000] "GET / HTTP/1.1" 200 644 "-" "curl/8.18.0" ]
[ 16.171.38.215 - - [17/Jul/2026:13:19:19 +0000] "GET / HTTP/1.1" 200 644 "-" "curl/8.18.0" ]
[ 16.171.38.215 - - [17/Jul/2026:13:19:59 +0000] "HEAD / HTTP/1.1" 200 0 "-" "curl/8.18.0" ]

Yes the curl requests were visible in the log entries.

- Traffic is successfully traveling from my terminal, out to the public internet, passing through any cloud firewalls/security groups, and hitting my Nginx web server.

- The final log entry explicitly shows a HEAD request with a size of 0 bytes at 13:19:59. This perfectly matches the exact timestamp and behavior of my curl -I command, which only requests headers and drops the body content.

- Nginx actively caught the incoming packets, processed them via its worker pool, returned a standard 200 OK HTTP success code, and wrote the transaction to disk in real time.

---

# Task 4 — System Resource Health Check (Capacity Red Flags)

## Goal

Assess server capacity and detect potential performance or failure risks.

### Evidence

#### Screenshot 1 — Output of `uptime`

<img width="602" height="391" alt="Screenshot 1" src="https://github.com/user-attachments/assets/dd15c56a-5540-47d3-8c2b-543f2f8ed40e" />


---

#### Screenshot 2 — Output of `free -h`

<img width="590" height="314" alt="Screenshot 2" src="https://github.com/user-attachments/assets/6db7c497-aba3-4681-af94-fa429f483155" />


---

#### Screenshot 3 — Output of `df -h`

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/7fe2e953-c0ab-4fbc-8c9a-351916871a1c" />


---

#### Screenshot 4 — Output of `sudo du -sh /var/* | sort -h`

<img width="1792" height="1120" alt="Screenshot 4" src="https://github.com/user-attachments/assets/9fb48bbe-a4be-4a6c-ab1a-a37e7d55159a" />


---

### Notes

Answer the following in your own words:

**1. Which resource looks most critical right now? (CPU/load, memory, or disk) Explain why.**

- The disk is definitely the one to watch here. My CPU load is flatlined at zero, so the processor isn't doing any heavy lifting at all. Memory is okay for now—I've got a small 1GB RAM footprint, but over half of it is still available. The issue is the root disk. It is already sitting at 60% capacity with only 2.7GB of free space left. On a tiny 7GB drive, that remaining space can evaporate in a heartbeat if logs start piling up or my apps in /var/lib start expanding. It's the only metric that's creeping into the warning zone.

---

**2. What happens if disk becomes 100% full in a production server?**

- If the disk hits 100%, the whole server goes down hard. Nginx will stop accepting traffic or start throwing 500 errors because it can't write to the access logs anymore. Databases like MySQL will instantly crash and potentially corrupt data because they can't save transactions or create temporary tables. To make it worse, the OS won't even be able to write basic system logs or process IDs, which usually means SSH locks up and I'll get completely booted out of my own server. It's a total operational brick until I force a restart or expand the volume from the cloud console.

---

# Task 5 — Configuration & Deployment Verification

## Goal

Ensure the correct React build is deployed and Nginx is serving it properly.

### Evidence

#### Screenshot 1 — Output of `ls -lah /var/www/html | head -n 20`

<img width="1792" height="1120" alt="Screenshot 1" src="https://github.com/user-attachments/assets/cf7defd8-37d8-4410-9b69-25624c106e42" />


---

#### Screenshot 2 — Output of `grep -R "Deployed by" -n /var/www/html 2>/dev/null | head`

<img width="1792" height="1120" alt="Screenshot 2" src="https://github.com/user-attachments/assets/113edab9-6ff9-4d8f-a176-75c37651292e" />

---

#### Screenshot 3 — Output of `grep -n "try_files" /etc/nginx/sites-available/default`

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/00b26ea2-84a4-4e95-b146-13890fcf5288" />


---

### Notes

Answer the following in your own words:

**1. How do you confirm that the correct version of the application is deployed?**
To confirm the correct deployment, I didn't rely on a single check; I used a layered verification process:

First, running ls -lah /var/www/html proved a genuine Create React App production build was present. I verified the index.html, the static/ folder with compiled JS/CSS bundles, and standard CRA metadata files were all correctly owned by www-data—the exact user Nginx's worker processes run as.

Second, I used grep -R "Deployed by" to scan the files. This confirmed that our specific custom tracking text was actively compiled into the live JavaScript bundle and matched the original source via the source map. This proves this exact build is live, rather than a stale or generic version.

Third, running grep -n "try_files" verified that the Nginx configuration correctly falls back to index.html for unmatched paths. This ensures the SPA routes handle page refreshes correctly across the entire app, not just on the main homepage.

Finally, I cross-checked this against the earlier curl test. The live server actually returned this exact index.html content over HTTP, perfectly tying the files sitting on the disk to what is actively being served to real users.

---

# Task 6 — Nginx Configuration Failure Simulation

## Goal

Simulate a real-world Nginx misconfiguration and recover the service safely.

### Evidence

#### Screenshot 1 — Output of `sudo nginx -t` showing the syntax error (broken config)

<img width="870" height="384" alt="Screenshot 1" src="https://github.com/user-attachments/assets/52b1bd9e-be0d-418d-afcc-0fa415953806" />

---

#### Screenshot 2 — Output of `sudo nginx -t` showing syntax ok (fixed config)

<img width="871" height="390" alt="Screenshot 2" src="https://github.com/user-attachments/assets/3846d5b1-78b0-4bd8-8f03-c5ad7a72ba3d" />


---

#### Screenshot 3 — Output of `curl -I http://<public-ip>` confirming recovery (200 OK)

<img width="860" height="387" alt="Screenshot 3" src="https://github.com/user-attachments/assets/7c19db05-f55a-4387-82a2-7796cdeddcd7" />


---

### Notes

Answer the following in your own words:

**1. What caused the configuration failure?**

I edited the nginx config file and removed two semicolons. One removal was intentional (I was following the instructions). Nginx couldn't parse the server block anymore because the syntax was broken.
---

**2. How did you fix the issue?**

I went back into nano editing file and added the semicolon back where it belonged on the try_files $uri /index.html. Then I ran sudo nginx -t to validate the config before touching anything else. Once it said "syntax is ok," I restarted nginx with systemctl restart nginx and tested the live site with curl to make sure it was actually working again.

---

**3. How can you avoid this kind of issue in real production systems?**

I will never push a config change to production without testing it first. I will always run nginx -t immediately after editing with no exceptions. I will make sure to keep all your config files in git so if something breaks, I can instantly revert instead of trying to remember what I changed. To always use a staging environment that mirrors production so I can catch mistakes before they go liv
---

# Task 7 — Web Application Failure Simulation

## Goal

Simulate missing deployment content and recover the application safely.

### Evidence

#### Screenshot 1 — Output of `curl -I http://<public-ip>` showing failure (non-200 response)

<img width="864" height="385" alt="Screenshot 1" src="https://github.com/user-attachments/assets/6f8e9784-9d53-487b-82de-362997b4c216" />


---

#### Screenshot 2 — Output of `curl -I http://<public-ip>` confirming recovery (200 OK)

<img width="865" height="387" alt="Screenshot 2" src="https://github.com/user-attachments/assets/1ab6fa7c-d924-4641-8d01-4c750f34190c" />


---

### Notes

Answer the following in your own words:

**1. What caused the application to break in this scenario?**

The app broke because the document root directory was completely emptied out. Moving the working files to a backup directory (/var/www/html_backup) and replacing /var/www/html with an empty folder meant Nginx suddenly had absolutely nothing to serve. When I hit the server with curl, Nginx looked for the core files, couldn't find an index.html or any fallback files to process, and threw a 500 Internal Server Error because the required application infrastructure was completely missing from the path.
---

**2. How did you fix the issue and restore the application?**

I fixed it by reverting the directory structure and restarting the web engine. First, I deleted the empty, useless /var/www/html directory using rm -rf. Then, I restored the original build by renaming the backup folder back to its proper home (mv /var/www/html_backup /var/www/html). Finally, I ran systemctl restart nginx to reset the server state. Testing it immediately after with curl -I confirmed everything was back online with a clean 200 OK status code.
---

**3. What steps would you take to prevent this kind of issue in real production systems?**

To make sure a directory mistake doesn't kill a live app again, here is exactly what I would do:

- I will stop messing with live folders directly. Instead, I'll dump new builds into separate, timestamped version folders. Once a new build is ready, I'll just flip a symbolic link (ln -s) to point Nginx to it. If the new version blows up, rolling back is instant—I just point the symlink right back to the old working folder.

- I will automate the build and deploy process completely. The deployment pipeline needs to build the assets, run sanity checks to confirm index.html actually exists, and verify file permissions before anything touches the production environment.

- I will configure a monitoring tool or load balancer to ping the server constantly. If a deploy goes out and the server starts spitting out 500 errors, the system should automatically pull the plug on the bad deploy and roll back to the last stable state without waiting for me to log in and fix it manually.
---

# Task 8 — Security & Reliability Review

## Goal

Review and reflect on the security and reliability practices applied during this assignment.

### Security & Reliability Notes

Answer the following in your own words:

**1. Why is SSH key-based authentication more secure than sharing passwords?**

- Passwords are a massive liability because bots can brute-force them, people reuse them, and they can be fished easily. SSH keys use a cryptographic pair (a public key on the server and a private key on my laptop). The private key never leaves my machine and can't be guessed or brute-forced. No password travels over the wire, so there is nothing for an attacker to intercept.

---

**2. Why should only required ports be open on a production server?**

- Every open port is a potential entryway for an attacker. If I leave unnecessary ports wide open, I'm trusting that whatever service is listening on them has zero security flaws. By closing everything except what's absolutely mandatory—like 80/443 for web traffic and a locked-down port for SSH—I minimize my attack surface and give hackers almost nowhere to probe.

---

**3. Why is it important for Nginx to be enabled on boot?**

- If the server crashes, reboots for a cloud provider update, or undergoes a forced restart, Nginx needs to come back online automatically. If it isn't enabled on boot, the app stays dead after a restart until I manually log in to run the start command. Enabling it ensures the system self-heals and minimizes downtime without me needing to babysit it.

---

**4. What are the risks of sharing secrets, keys, or credentials publicly?**

- If the server crashes, reboots for a cloud provider update, or undergoes a forced restart, Nginx needs to come back online automatically. If it isn't enabled on boot, the app stays dead after a restart until I manually log in to run the start command. Enabling it ensures the system self-heals and minimizes downtime without me needing to babysit it.

---

**5. Why should cloud resources be stopped or terminated when they are no longer needed?**

- Leaving zombie instances running is the fastest way to burn money and invite security risks. Cloud providers bill by the hour for compute and storage, so idle servers directly bleed cash for no reason. Plus, an unmonitored server stops getting security patches, making it an easy, forgotten target for hackers over time.

---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/aziz-kafayat_devops-cloudengineering-nginx-activity-7483905491161628672-8Hau?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU`

---

#### Screenshot — Published LinkedIn post

<img width="809" height="776" alt="Linkedin Screenshot" src="https://github.com/user-attachments/assets/f37960a5-2eae-42d5-a266-3bc2ba948d74" />


---

# Submission Instructions

- Add all required screenshots in your submission
- Full name must be visible in required screenshots
- Do not expose sensitive information (keys, passwords, account IDs)

---

# Completion Checklist

- [ ] Task 1: Screenshots (browser, ip a, ss -tulpen, ufw status) + Notes answered
- [ ] Task 2: Screenshots (nginx status, nginx -t, ss port 80) + Notes answered
- [ ] Task 3: Screenshots (access log, error log, journalctl) + Notes answered
- [ ] Task 4: Screenshots (uptime, free -h, df -h, du -sh) + Notes answered
- [ ] Task 5: Screenshots (ls html, grep deployed by, grep try_files) + Notes answered
- [ ] Task 6: Screenshots (nginx -t fail, nginx -t pass, curl recovery) + Notes answered
- [ ] Task 7: Screenshots (curl failure, curl recovery) + Notes answered
- [ ] Task 8: Security & Reliability Notes answered
- [ ] LinkedIn post published and URL submitted
- [ ] Full Name visible in all required screenshots
- [ ] No sensitive data exposed

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory) focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## 📌 Resources

- 🌐 DMI Official Website: https://pravinmishra.com/dmi  
- 🎓 DevOps for Beginners (Udemy): https://www.udemy.com/course/devops-for-beginners-docker-k8s-cloud-cicd-4-projects/  
- 🎓 Agentic AI DevOps with Claude Code: https://www.udemy.com/course/ultimate-agentic-ai-devops-with-claude-code/  
- 🎓 DevOps with Claude Code: Terraform, EKS, ArgoCD & Helm: https://www.udemy.com/course/devops-with-claude-code-terraform-eks-argocd-helm/  
- ▶️ YouTube Playlist: https://www.youtube.com/playlist?list=PLFeSNDtI4Cho  
- 🔗 Pravin Mishra (LinkedIn): https://www.linkedin.com/in/pravin-mishra-aws-trainer/  
- 🏢 CloudAdvisory (LinkedIn): https://www.linkedin.com/company/thecloudadvisory/

---

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
