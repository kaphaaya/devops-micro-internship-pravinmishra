# Assignment 4 — Building Your AI Team

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build and configure a set of specialized AI subagents inside your project. You will learn how different models and tool permissions define agent behavior, and you will trigger two real agent delegations to analyze security and cost aspects of your Terraform infrastructure.

---

# Task 1 — Create the Agents Folder and Add Files

## Goal

Create the `.claude/agents/` directory and add all required agent files.

### Evidence

#### Screenshot 1 — VS Code sidebar showing `.claude/agents/` with all 3 files

<img width="1792" height="1120" alt="Screenshot 1" src="https://github.com/user-attachments/assets/2b93ce21-c498-4244-99f2-41c81463c023" />


---

# Task 2 — Compare the Agent Configurations

## Goal

Analyze the configuration differences between the three agents and demonstrate understanding of model and tool selection.

### Written Answers

#### 1. Why does the cost optimizer use Haiku instead of Sonnet?

Haiku is cheaper and sufficient for the task. Cost optimization is about analyzing Terraform files and suggesting 
  savings—straightforward pattern matching and numerical analysis. Haiku excels at this because:                    
  - The task doesn't require complex reasoning or edge cases                                                        
  - It reads infrastructure files and reports findings (no complex decision-making)                                 
  - Using a cheaper model for a cost-focused agent demonstrates the principle of efficiency                         
  - Reduces operational cost of the agent itself (meta-optimization) 

---

#### 2. Why does the security auditor NOT have Write in its tools list?

Intentional separation of concerns. The security auditor's job is to audit and report, not to fix. Tools: Read,   
  Grep, Glob only:                                                                                                  
  - Enforces read-only review mode (prevents accidental modifications during audits)                                
  - Findings are reported for human review or passed to a different agent (tf-writer) that has write permissions    
  - Maintains audit integrity—auditing and remediation are separate responsibilities                            
  - Reduces blast radius if the agent misbehaves                                                                    
---

#### 3. Why does the tf-writer use `inherit` instead of a specific model?

Flexibility for code generation complexity. model: inherit means tf-writer uses the parent's model choice:
  - If spawned with Claude Opus, it runs as Opus (maximum reasoning for complex infrastructure)                     
  - If spawned with Claude Sonnet, it runs as Sonnet (balanced capability)                                          
  - Allows caller to match the model to the task complexity at invocation time                                      
  - Tf-writer is generative (writes production code) unlike cost-optimizer (analysis only), so it may need stronger 
  reasoning depending on requirements                                                                               
  - inherit gives flexibility without forcing one model choice 

---

### Evidence

#### Screenshot 2 — `security-auditor.md` frontmatter showing model and tools configuration

<img width="1792" height="1120" alt="Screenshot 2" src="https://github.com/user-attachments/assets/4c59dc24-0517-4b46-97b3-b3350b1f67c8" />

---

#### Screenshot 3 — `cost-optimizer.md` frontmatter showing the model and tools configuration

<img width="1792" height="1120" alt="Screenshot 3" src="https://github.com/user-attachments/assets/1b4bb775-8640-4cd4-8e51-fba88231cae0" />

---

# Task 3 — Run the Security Auditor

## Goal

Trigger the security auditor agent and analyze the generated security report for your Terraform infrastructure.

### Evidence

#### Screenshot 4 — The delegation message showing Claude launched the security-auditor

<img width="1792" height="1120" alt="Screenshot 4" src="https://github.com/user-attachments/assets/525e91d1-eb14-4674-b02e-a491a4a72cb5" />

---

#### Screenshot 5 — Security audit report output

<img width="1792" height="1120" alt="Screenshot 5" src="https://github.com/user-attachments/assets/ba7c3eb5-8417-4533-b165-9de6f26a5085" />

---

# Task 4 — Run the Cost Optimizer

## Goal

Trigger the cost optimizer agent and review the generated cost optimization report.

### Evidence

#### Screenshot 6 — The full cost optimization report

<img width="1792" height="1120" alt="Screenshot 6" src="https://github.com/user-attachments/assets/928ce2ff-f508-46a0-a42e-e790d64ea72c" />

---

# Submission Instructions

- Ensure all agent files are committed in `.claude/agents/`
- Complete all written answers in your GitHub Repo
- Push final changes to your forked GitHub repository

---

## GitHub Repository URL

Paste your forked repository URL here:

https://github.com/kaphaaya/devops-micro-internship-pravinmishra/edit/main/week-02-agentic-ai/solution-assignment-04-subagents.md

---

# Completion Checklist

- [ ] `.claude/agents/` folder contains all 3 agent files
- [ ] Screenshot 2 shows correct `security-auditor.md` configuration
- [ ] Screenshot 3 shows correct `cost-optimizer.md` configuration
- [ ] All 3 written answers completed 
- [ ] Security auditor executed successfully
- [ ] Cost optimizer executed successfully
- [ ] Security report is visible with findings
- [ ] Cost report is visible with recommendations
- [ ] All required screenshots added
- [ ] GitHub repo updated with agents

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
