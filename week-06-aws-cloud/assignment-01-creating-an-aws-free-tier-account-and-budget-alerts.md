# Assignment 1 — Creating an AWS Free Tier Account & Setting Up Budget Management and Alerts

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will create your own AWS Free Tier account and configure budget management with cost alerts. This is an important first step: it lets you follow along with the rest of the course, and the alerts help ensure you do not exceed your budget.

---

# Task 1 — Sign Up for AWS and Access the Console

## Goal

Create your AWS Free Tier account, select the Basic Support Plan (Free), and log in to the AWS Management Console.

> No screenshot required for this task. Completion is verified through Task 2.

---

# Task 2 — Create a Monthly Cost Budget with Alerts

## Goal

In the Billing Dashboard, create a monthly Cost Budget with a name, amount, and start month, then configure alert thresholds (e.g. 50%, 80%, 100%) and a notification email address.

### Evidence

#### Screenshot 1 — AWS Budget setup page showing the budget name, budget amount, and alert thresholds

<img width="1782" height="964" alt="Screenshot 1" src="https://github.com/user-attachments/assets/8b3c93b0-5a7d-4cfc-a757-b37f6db76586" />

<img width="1792" height="725" alt="Screenshot 1 0" src="https://github.com/user-attachments/assets/19115945-11a7-462b-ad79-8f724bcbaa4f" />

---

### Notes

Answer the following in your own words:

**1. Why is it important to set up budget alerts when using an AWS account?**

Write your answer here.

- Budget alerts are crucial for my AWS account because costs can escalate without warning. AWS charges me for every resource I use, and if I'm not careful, I could accidentally leave instances running or misconfigure services without realizing it until I get a surprise bill.

For example, when I was learning about EC2 instances at the start of my Cloud Engineering journey, I once forgot to terminate a t2.large instance over a weekend for an assignment. That simple oversight cost me more than I expected. With budget alerts in place, I would have been notified immediately and could have shut it down before the charges accumulated.

Another scenario is data transfer costs. I didn't realize initially that transferring large amounts of data out of AWS incurs charges. If I'm working on a project and need to move data between regions or out of AWS entirely, those costs add up quickly. Budget alerts would alert me if I'm approaching unexpected spending in that area.

I also use AWS to experiment and learn new services as part of my cloud engineering studies. Without budget alerts, I could spin up multiple resources to test things and forget about them. The alerts give me a safety net—they notify me when I'm approaching my spending limit so I can review what's running and make decisions about what to keep or terminate.

Essentially, budget alerts protect me from financial surprises and help me stay in control of my AWS spending while I'm actively learning and building.

---

# Submission Instructions

- Add the required screenshot in your submission
- Do not expose sensitive billing, card, identity, or account information

---

# Completion Checklist

- [✅] AWS Free Tier account created and Basic Support Plan (Free) selected
- [✅ ] Logged in to the AWS Management Console
- [✅ ] Monthly Cost Budget created with name, amount, and start month
- [✅ ] Budget alert thresholds and notification email configured
- [✅ ] Screenshot captured showing budget name, amount, and thresholds (Screenshot 1)
- [✅ ] Notes question answered
- [✅ ] No sensitive billing or account information exposed

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory) focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## 📌 Resources

- 🌐 DMI Official Website: https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme  
- 🎓 University: https://university.pravinmishra.com?utm_source=github&utm_medium=readme  
- 💬 Discord Community: https://discord.pravinmishra.com?utm_source=github&utm_medium=readme  
- 📝 Blog: https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme  
- ▶️ YouTube Playlist: https://www.youtube.com/playlist?list=PLFeSNDtI4Cho  
- 🔗 Pravin Mishra (LinkedIn): https://www.linkedin.com/in/pravin-mishra-aws-trainer/  
- 🏢 CloudAdvisory (LinkedIn): https://www.linkedin.com/company/thecloudadvisory/

---

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track.*
