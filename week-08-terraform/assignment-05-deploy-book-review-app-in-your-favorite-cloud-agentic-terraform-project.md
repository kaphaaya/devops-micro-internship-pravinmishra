# Capstone Assignment — Deploy the Book Review App Using Terraform and Claude Code Agentic AI

Part of the DevOps Micro Internship (DMI) with Agentic AI

---

## Student Details

**Full Name:** Add your full name here  
**Cloud Platform:** AWS or Azure  
**GitHub Repository URL:** Add your repository URL here  
**Public Application URL / Load-Balancer DNS:** Add the public URL or DNS here

---

## Purpose

Deploy the Book Review App using Terraform on AWS or Azure in a secure, highly available, production-style three-tier architecture. Use Claude Code, specialized subagents, Terraform MCP, and validation hooks to support the engineering workflow while keeping all infrastructure-changing operations under human control.

---

# Task 0 — Prepare the Project and Agentic AI Environment

## Goal

Prepare the Book Review App project and configure the provided Claude Code Agentic AI starter kit with project context, specialized subagents, Terraform MCP, validation hooks, and safety guardrails.

## Evidence

### Screenshot 1 — Project `CLAUDE.md`

Add a screenshot of the project `CLAUDE.md` showing the three-tier architecture, security boundaries, Terraform requirements, and human-approval rules.

<img width="1792" height="1120" alt="1" src="https://github.com/user-attachments/assets/b7917969-7ad2-462c-8cb7-6449ad134305" />


---

### Screenshot 2 — Terraform Engineer Subagent

Add a screenshot showing the Terraform Engineer subagent configuration.

<img width="1792" height="609" alt="2" src="https://github.com/user-attachments/assets/c4a2270e-5b90-4a4a-834f-1fec9160a4fa" />


---

### Screenshot 3 — Architecture and Security Reviewer Subagent

Add a screenshot showing the Architecture and Security Reviewer subagent configuration.

<img width="993" height="838" alt="3" src="https://github.com/user-attachments/assets/3f0a1dce-370a-4601-9989-ce7284a1f1a5" />


---

### Screenshot 4 — Terraform MCP Connection

Add a screenshot showing Terraform MCP connected and available.

<img width="994" height="560" alt="4" src="https://github.com/user-attachments/assets/476434c8-2e60-4506-9f84-f92d6d77b9ac" />


---

### Screenshot 5 — Validation Hooks

Add a screenshot showing the configured Claude Code validation hooks.

<img width="992" height="808" alt="5" src="https://github.com/user-attachments/assets/d28daa9d-9694-418a-acc1-09d8ffee640e" />


---

# Task 1 — Design the Three-Tier Architecture

## Goal

Design the required secure, highly available three-tier architecture and create an architecture diagram before building the infrastructure.

The diagram must show:

- VPC or VNet
- Availability Zones or equivalent availability locations
- Six subnets
- Internet connectivity
- NAT or outbound design
- Public load balancer
- Web Tier
- Internal load balancer
- Application Tier
- Managed MySQL
- Read replica
- Main traffic flow

## Architecture Diagram

Add the completed architecture diagram here.

---

# Task 2 — Build the Terraform Networking and Security Layers

## Goal

Create the modular Terraform project and implement the network and security layers across the required public and private subnets.

## Evidence

### Screenshot 6 — Modular Terraform Project Structure

Add a screenshot showing the modular Terraform project structure.
<img width="1789" height="1087" alt="6" src="https://github.com/user-attachments/assets/e6cf3aea-60b8-4b44-b2f8-07c6d2b97a74" />


---

### Screenshot 7 — Six-Subnet Architecture

Add a screenshot showing the six-subnet architecture across two availability locations.

<img width="1792" height="1060" alt="7 1" src="https://github.com/user-attachments/assets/44706689-ba68-4567-a89d-54fb8cfa6209" />

<img width="1792" height="703" alt="7 2" src="https://github.com/user-attachments/assets/bf2e4d61-0a0e-41c5-8fc4-360ae4e395de" />

---

### Screenshot 8 — Public and Private Tier Separation

Add a screenshot showing the public and private tier separation, including routing and security boundaries.

<img width="989" height="760" alt="8" src="https://github.com/user-attachments/assets/fbbeffdd-723a-4ddb-923b-eeb2418a64fc" />


---

# Task 3 — Build the Load-Balancing and Compute Layers

## Goal

Deploy the public and internal load balancers and the Web and Application compute resources required by the Book Review App.

## Evidence

### Screenshot 9 — Web and Application Compute

Add a screenshot showing the Web and Application compute resources in their required subnets.

<img width="1792" height="995" alt="9 1" src="https://github.com/user-attachments/assets/65b0c553-5bef-401a-92ac-a1bd0753f992" />

<img width="1792" height="1104" alt="9 2" src="https://github.com/user-attachments/assets/9171e724-cdd2-47fd-bc8a-d92d4205a86b" />

---

### Screenshot 10 — Public Load Balancer

Add a screenshot showing the internet-facing public load balancer.

<img width="1792" height="1082" alt="10" src="https://github.com/user-attachments/assets/8197e4a4-6218-45e7-a8e0-1d1f96fbae2f" />

<img width="1792" height="1095" alt="10 1" src="https://github.com/user-attachments/assets/8bcb03cd-0af7-4b31-9a57-82711f90cad5" />

<img width="1792" height="934" alt="10 2" src="https://github.com/user-attachments/assets/030b6775-0bc5-4796-a71f-62ea51088a4f" />

---

### Screenshot 11 — Internal Load Balancer

Add a screenshot showing the private internal load balancer.

<img width="1792" height="1120" alt="11" src="https://github.com/user-attachments/assets/e3d4b8f3-8c59-4d82-bab9-5c3e4fe0d03e" />

<img width="1792" height="1119" alt="11 1" src="https://github.com/user-attachments/assets/451a5f26-8991-4438-9e0a-3ce79e3d0b96" />

<img width="1792" height="1089" alt="11 2" src="https://github.com/user-attachments/assets/705a7b25-5d41-4cba-b81e-e40ab5413c4b" />

<img width="1792" height="337" alt="11 3" src="https://github.com/user-attachments/assets/b12505a8-be34-4b91-9f97-4b181f028bb7" />

---

### Screenshot 12 — Healthy Targets

Add a screenshot showing healthy target groups or backend pools.

<img width="992" height="961" alt="12" src="https://github.com/user-attachments/assets/f3af3f4c-65ae-409a-b8ab-2d6e944dc373" />

<img width="988" height="960" alt="12 1" src="https://github.com/user-attachments/assets/951c7bd0-63a9-476a-aecf-60f622e85f75" />

<img width="991" height="961" alt="12 2" src="https://github.com/user-attachments/assets/c5f2733e-0475-4a7e-925f-0dcab6a0c7a4" />

<img width="989" height="962" alt="12 3" src="https://github.com/user-attachments/assets/d5d019b7-940c-4a4e-811e-ffdcd92dd90f" />

<img width="988" height="611" alt="12 4" src="https://github.com/user-attachments/assets/208c15b9-c02e-424e-be20-01ad41cf5508" />

---

# Task 4 — Build the Managed MySQL Database Layer

## Goal

Deploy a private, highly available managed MySQL database with a read replica and restrict database connectivity to the Application Tier.

## Evidence

### Screenshot 13 — Managed MySQL Database

Add a screenshot showing the managed MySQL database deployment.

<img width="940" height="1057" alt="13" src="https://github.com/user-attachments/assets/73b462db-8103-4d1d-a1b2-56fe14679165" />

<img width="938" height="1032" alt="13 1" src="https://github.com/user-attachments/assets/c9c3aecf-c71d-4391-b444-d828b9d96f45" />

<img width="940" height="1058" alt="13 2" src="https://github.com/user-attachments/assets/eebc0d1d-9241-4b81-b52c-3108df8cbd39" />

<img width="940" height="1059" alt="13 3" src="https://github.com/user-attachments/assets/b498eab7-48f8-4d5f-833b-fb1c67f1dd95" />

<img width="940" height="777" alt="13 4" src="https://github.com/user-attachments/assets/7ff56e55-6aa5-4f5f-a66e-88f2a4386504" />

---

### Screenshot 14 — High Availability

Add a screenshot showing the Multi-AZ or high-availability configuration.

<img width="941" height="1057" alt="14" src="https://github.com/user-attachments/assets/f4eaac5f-bfe2-4473-b396-2a066014addc" />

<img width="939" height="1057" alt="14 1" src="https://github.com/user-attachments/assets/07a8540f-c8fc-4c9c-b39c-b905b4ed6a11" />

<img width="944" height="1058" alt="14 2" src="https://github.com/user-attachments/assets/b4abd727-0677-46e2-97f3-a6892265534b" />

<img width="941" height="1058" alt="14 3" src="https://github.com/user-attachments/assets/a657992f-1afa-44bd-aab3-664c973ec2e5" />

---

### Screenshot 15 — Read Replica

Add a screenshot showing the read replica configuration.

<img width="939" height="1058" alt="15" src="https://github.com/user-attachments/assets/d19ba534-9177-4b71-864b-6b179059d7d2" />

<img width="940" height="1057" alt="15 1" src="https://github.com/user-attachments/assets/93aab131-e2d2-412e-9a35-4eb3c21f29bd" />

<img width="942" height="1058" alt="15 2" src="https://github.com/user-attachments/assets/5d50c25e-61bc-46ed-95d5-b4e5f1ca19e1" />

<img width="942" height="1061" alt="15 3" src="https://github.com/user-attachments/assets/b891eda6-7fe5-4aec-a9d3-723829b67fc9" />

<img width="939" height="1057" alt="15 4" src="https://github.com/user-attachments/assets/fae0d011-38ed-4a5d-849d-410d93072d01" />

<img width="941" height="791" alt="15 5" src="https://github.com/user-attachments/assets/114cb92c-73f9-4a48-833e-efcd069b7fef" />

---

### Screenshot 16 — Private Database Access

Add a screenshot showing that the database is private and accepts MySQL traffic only from the Application Tier.

<img width="938" height="1047" alt="16 1" src="https://github.com/user-attachments/assets/0e5d1d27-d2a7-489a-a5cd-027c5e1819df" />

<img width="939" height="298" alt="16 2" src="https://github.com/user-attachments/assets/ee4a2dcb-2e44-4467-b30b-668f8afb518f" />

---

# Task 5 — Validate, Review, and Apply the Terraform Configuration

## Goal

Validate the Terraform configuration, review the execution plan using both Agentic AI and human judgment, and apply the infrastructure changes only after all required checks pass.

## Evidence

### Screenshot 17 — Terraform Validation

Add a screenshot showing successful `terraform validate` output.

<img width="877" height="735" alt="17" src="https://github.com/user-attachments/assets/e1b18578-f8bd-463d-bdfc-410ac3cc9ec6" />


---

### Screenshot 18 — Terraform Plan

Add a screenshot showing the Terraform plan output.

<img width="529" height="317" alt="18" src="https://github.com/user-attachments/assets/69c38808-70ed-4c57-8056-038b8618a369" />

---

### Screenshot 19 — Terraform Apply

Add a screenshot showing successful `terraform apply` completion.

<img width="1555" height="708" alt="19" src="https://github.com/user-attachments/assets/54e61e8c-2ee2-4665-a206-24d955d8bb42" />

---

# Task 6 — Deploy and Configure the Book Review Application

## Goal

Deploy and configure the Book Review App across the Web, Application, and Database tiers and verify the complete application functionality.

## Evidence

### Screenshot 20 — Homepage

Add a screenshot showing the Book Review App homepage through the public endpoint.

<img width="963" height="1050" alt="20-t" src="https://github.com/user-attachments/assets/5de0feb6-f86d-42ad-8b8f-54eb5d76c647" />


---

### Screenshot 21 — Login or Authentication

Add a screenshot showing successful login or authentication.

<img width="956" height="1080" alt="21" src="https://github.com/user-attachments/assets/3f4f2da8-9510-4ae3-948d-c6f5e0f783d1" />


---

### Screenshot 22 — Book Data

Add a screenshot showing the book listing or book details.

<img width="948" height="956" alt="22" src="https://github.com/user-attachments/assets/eb9fed47-76c6-4438-bda7-e3ac8e77f996" />


---

### Screenshot 23 — Review Functionality

Add a screenshot showing the review functionality working successfully.

<img width="952" height="869" alt="23" src="https://github.com/user-attachments/assets/fc7dbf41-728f-4086-8a42-bcc4deb684ee" />


---

### Screenshot 24 — Backend or API Evidence

Add a screenshot showing that the backend or API is working successfully.

<img width="712" height="434" alt="24" src="https://github.com/user-attachments/assets/08d0cc31-249c-493c-bf18-b98342aabe39" />


---

### Screenshot 25 — Database Reads and Writes

Add a screenshot showing successful database reads and writes.

<img width="1124" height="569" alt="25" src="https://github.com/user-attachments/assets/d4aa320f-90d2-4a45-87e9-7240fb5dee5e" />


## Public Application URL

**Public Application URL / DNS:** Add the working public application URL or load-balancer DNS here

---

# Task 7 — Demonstrate the Agentic AI Workflow

## Goal

Demonstrate how Claude Code assisted with Terraform generation, architecture and security review, and evidence-based troubleshooting while infrastructure-changing decisions remained under human control.

You do not need to submit your complete Claude Code conversation history. Include only focused evidence.

## Evidence

### Screenshot 26 — AI-Assisted Terraform Generation

Add a screenshot showing one useful example of AI-assisted Terraform generation or improvement.

<img width="850" height="791" alt="26" src="https://github.com/user-attachments/assets/534524e8-8003-4363-9134-1ba27ffe71a9" />


---

### Screenshot 27 — Architecture or Security Review

Add a screenshot showing one structured architecture or security review result.

<img width="1792" height="1084" alt="27" src="https://github.com/user-attachments/assets/fc08d265-b3a3-4769-b43d-ea6e2b3f2962" />


---

### Screenshot 28 — AI-Assisted Troubleshooting

Add a screenshot showing one AI-assisted troubleshooting interaction based on collected evidence.

<img width="852" height="580" alt="28" src="https://github.com/user-attachments/assets/0138bdd0-ee14-4bdf-90f3-3941c0ba5c2b" />


---

# Task 8 — Complete the Final Architecture Review

## Goal

Review the completed infrastructure against the original capstone requirements and resolve significant architecture, security, reliability, and cost issues.

Confirm that the final review covers:

- Tier separation
- Availability
- Public exposure
- Routing
- Security rules
- Load balancing
- Database privacy
- Secrets
- Terraform quality
- Module structure
- Reliability
- Obvious cost risks

Use Screenshot 27 as the focused evidence for the structured architecture or security review.

---

# Task 9 — Answer the Reflection Questions

## Goal

Reflect on the architecture, Terraform implementation, and Agentic AI workflow. Answer each question briefly in your own words.

## Architecture

1. Why did you separate the Web, Application, and Database tiers?                                 
  I separated them so each tier only has access to what it needs. The web tier faces the internet,
  the app tier stays private and handles the logic, and the database never touches the internet at  
  all. If something goes wrong in one layer, it doesn't automatically compromise the others.        
                                                                                                    
  2. Why is the Application Tier private?                                                           
  I didn't want the backend directly reachable from the internet. I set it up so traffic has to come
   through the internal load balancer, which only accepts requests from the web tier. That way      
  nobody can hit the API endpoints directly from outside.                                           
                                                                                                    
  3. Why is MySQL private?                                                                          
  I put the database in private subnets with no internet gateway route and locked the security group
   to only allow port 3306 from the app tier. There's no way to reach it from outside the VPC, which
   is exactly what I wanted.                                                                        
                                                                                                    
  4. Why are multiple Availability Zones used?                                                      
  I spread everything across two AZs so if one data center goes down, the app keeps running. I did
  this for the web instances, app instances, NAT gateways, and the RDS standby — so a single AZ     
  failure doesn't take everything offline.                                                          
                                                                                                    
  5. What is the difference between Multi-AZ/high availability and a read replica?                  
  Multi-AZ is about keeping the database up — AWS runs a silent standby in the second AZ and fails
  over automatically if the primary dies. The read replica is different, it's a copy I can send read
   queries to so I'm not hammering the primary with everything. One is for availability, the other  
  is for performance.                                                                               
                                                                                                    
  ---                                                                                               
  Terraform
                                                                                                    
  6. How did you divide your Terraform into modules?                                                
  I created six modules: network for the VPC and subnets, security for all the security groups, iam 
  for instance roles, rds for the database, web for the frontend tier and public ALB, and app for   
  the backend tier and internal ALB. Each one handles one concern.                                  
                                                                                                    
  7. How do the modules communicate through variables and outputs?                                  
  I wired them together in the root main.tf. For example, the network module outputs the subnet IDs
  and VPC ID, and I passed those into the security module as variables. Then the security module    
  outputs the security group IDs, which I passed into the web and app modules. Nothing references   
  another module's resources directly.                                                              
                                                                                                    
  8. What did you specifically check in terraform plan?                                             
  I looked for any unexpected replacements that would cause downtime, checked that RDS wasn't marked
   publicly_accessible, made sure no security group rules were opening 0.0.0.0/0 on the wrong       
  resources, confirmed ports 3001 and 3306 were only where they should be, and made sure no         
  passwords were showing up in plain text in the plan output.                                       
                                                                                                    
  ---
  Agentic AI
                                                                                                    
  9. What was the purpose of CLAUDE.md?
  It was how I gave Claude persistent instructions for the whole project — the required             
  architecture, the rules around secrets, the validation steps before any apply, and the safety     
  constraints like never auto-approving terraform apply. Without it I'd have to re-explain the      
  context every conversation.                                                                       
                                                                                                    
  10. What work did the Terraform Engineer subagent perform?                                        
  I used it to write and refactor the Terraform modules, look up current provider documentation so
  the resource arguments were correct for AWS provider v5, run validation, and analyze plan output. 
  It kept that work in its own context so it didn't clutter the main conversation.                  
                                                                                                    
  11. What did the Architecture and Security Reviewer identify?                                     
  It found that my Terraform state was local with plaintext secrets inside it, that my tfplan files
  weren't in .gitignore, that CORS was set to a wildcard in the app user data, and that I had no    
  HTTPS on the public ALB. It also caught smaller things like an unused variable in the web module  
  and no auto-scaling policies wired up.                                                            
                                                                                                    
  12. Why did you use Terraform MCP instead of relying only on Claude's existing Terraform          
  knowledge?
  Because the AWS provider changes between versions and I didn't want to use outdated arguments. The
   MCP server pulls from the live Terraform Registry so I knew the resource blocks matched the      
  actual provider version I was running (AWS 5.x), not something from training data that might be
  deprecated.                                                                                       
                                                                                                    
  13. What was the purpose of your validation hooks?                                                
  To make sure I never skipped the fmt → validate → plan sequence before applying anything. It kept
  the workflow consistent and made sure I always reviewed the plan output before any infrastructure 
  change went through.                                                                              

                                                                                          
  14. Describe one real issue Claude helped you troubleshoot.                                       
  The frontend was loading but showing "Loading books..." with nothing appearing. Claude walked me
  through it — the API wasn't reachable from the browser because NEXT_PUBLIC_API_URL was pointing to
   the internal ALB, which is a private address. The fix was adding an nginx reverse proxy on the   
  web tier to route /api/* calls to the internal ALB, and rebuilding the frontend with a relative   
  URL instead.                                                                                      

  15. Describe one recommendation you reviewed, modified, or rejected instead of accepting blindly. 
  The reviewer flagged that my cross-tier security group egress rules used protocol = -1 which
  allows all traffic instead of locking it down to specific ports. I looked at it and understood the
   concern, but since the rules were scoped to specific security groups rather than open CIDRs, I   
  decided to leave it for now and log it as a future hardening item rather than risk introducing a  
  problem mid-deployment.   

---

# Task 10 — Publish the Mandatory LinkedIn Post

## Goal

Publish a LinkedIn post describing the capstone, the technical work completed, the Agentic AI workflow, and the lessons learned.

Write the post in your own words, include at least one project image or other proof, and ensure that it can be viewed by the submission reviewer.

## LinkedIn Post URL

**LinkedIn Post URL:** https://lnkd.in/p/e2PDRfTx


---

# Submission Instructions

- Complete Tasks 0–10 in sequence.
- Include all Screenshots 1–28 exactly as specified.
- Ensure that your full name is visible in the required screenshots.
- Include the selected cloud platform.
- Include the completed architecture diagram.
- Include the modular Terraform project structure.
- Include the working public application URL or public load-balancer DNS.
- Include all required Agentic AI workflow evidence.
- Answer all 15 reflection questions briefly in your own words.
- Include the published LinkedIn post URL.
- Do not expose cloud credentials, database passwords, SSH private keys, JWT secrets, access tokens, account IDs, Terraform state containing sensitive values, or other confidential information.
- Review all screenshots and project files carefully before submitting through GitHub.

---

# Completion Checklist

- [ ] Selected AWS or Azure
- [ ] Added and reviewed the Agentic AI starter files
- [ ] Configured `CLAUDE.md`
- [ ] Configured the Terraform Engineer subagent
- [ ] Configured the Architecture and Security Reviewer subagent
- [ ] Connected Terraform MCP
- [ ] Configured validation hooks and safety guardrails
- [ ] Created the architecture diagram
- [ ] Created the six-subnet design
- [ ] Configured public Web Tier routing
- [ ] Kept the Application Tier private
- [ ] Kept the Database Tier private
- [ ] Configured tier-specific Security Groups or NSGs
- [ ] Restricted backend port `3001`
- [ ] Restricted MySQL port `3306` to the Application Tier
- [ ] Created the public load balancer
- [ ] Created the internal load balancer
- [ ] Configured listeners and health checks
- [ ] Deployed the Web Tier compute resources
- [ ] Deployed the private Application Tier compute resources
- [ ] Provisioned private managed MySQL
- [ ] Configured Multi-AZ or high availability
- [ ] Configured a read replica
- [ ] Created the modular Terraform project
- [ ] Used variables, outputs, and module dependencies
- [ ] Used current Terraform documentation through MCP
- [ ] Used hooks for deterministic validation
- [ ] Completed `terraform fmt`
- [ ] Completed `terraform validate`
- [ ] Reviewed `terraform plan`
- [ ] Completed the Terraform Engineer review
- [ ] Completed the Architecture and Security review
- [ ] Applied the infrastructure only after human approval
- [ ] Deployed and configured the backend
- [ ] Deployed and configured the frontend
- [ ] Configured Nginx where required
- [ ] Configured the internal backend endpoint
- [ ] Configured the public frontend endpoint
- [ ] Verified the homepage
- [ ] Verified login or authentication
- [ ] Verified book data
- [ ] Verified review functionality
- [ ] Verified the backend API
- [ ] Verified database reads and writes
- [ ] Verified healthy load-balancer targets
- [ ] Included AI-assisted Terraform generation evidence
- [ ] Included one architecture or security review
- [ ] Included one AI-assisted troubleshooting example
- [ ] Completed the final architecture review
- [ ] Answered all 15 reflection questions
- [ ] Published the mandatory LinkedIn post
- [ ] Added the LinkedIn post URL
- [ ] Captured all 28 required screenshots
- [ ] Confirmed that my full name is visible in the required screenshots
- [ ] Checked that no secrets or sensitive information are exposed

---

## About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory), focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations through hands-on experience.

---

## Resources

- Book Review App Repository: [https://github.com/pravinmishraaws/book-review-app](https://github.com/pravinmishraaws/book-review-app)
- DMI Official Website: [https://dmi.pravinmishra.com](https://dmi.pravinmishra.com)
- University: [https://university.pravinmishra.com](https://university.pravinmishra.com)
- Discord Community: [https://discord.pravinmishra.com](https://discord.pravinmishra.com)
- Blog: [https://dmi.pravinmishra.com/blog](https://dmi.pravinmishra.com/blog)
- YouTube Playlist: [https://www.youtube.com/playlist?list=PLFeSNDtI4Cho](https://www.youtube.com/playlist?list=PLFeSNDtI4Cho)
- Pravin Mishra on LinkedIn: [https://www.linkedin.com/in/pravin-mishra-aws-trainer/](https://www.linkedin.com/in/pravin-mishra-aws-trainer/)
- CloudAdvisory on LinkedIn: [https://www.linkedin.com/company/thecloudadvisory/](https://www.linkedin.com/company/thecloudadvisory/)

---

*This submission is part of the DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
