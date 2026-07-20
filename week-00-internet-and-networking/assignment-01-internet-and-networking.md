# Week 00 - Internet and Networking

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

# 🧑‍💻 Task 1: Using ChatGPT as Your Learning Assistant

## Scenario

You're new to DevOps and will frequently encounter technical questions. ChatGPT can be your learning companion.

## Your Task

Write a clear ChatGPT prompt to help you understand:

> "What is a protocol in networking? Explain with a simple real-life example."

Take a screenshot of your interaction showing:

* Your detailed prompt (with clear expectations)
* ChatGPT's simplified response with an example

## Screenshot

Save your screenshot in the `screenshots` folder and update the file name below.

<img width="1788" height="974" alt="task-1-chatgpt" src="https://github.com/user-attachments/assets/6b122fab-ad45-4701-bbf4-7f8eea437cde" />

Replace `task-1-chatgpt.png` with your actual screenshot file name.

---

## What I Learned (2–3 lines)

- The biggest thing I realized is that how you ask a question matters just as much as the question itself. When I was vague with ChatGPT, I got vague answers. But when I was specific about what I wanted to understand and what level of detail I needed, the responses got way more useful. ChatGPT is a tool, and like any tool, you have to know how to use it properly.

---

# 🌐 Task 2: Internet and Networking

## Scenario

Your friend is launching an online bookstore named **EpicReads**.

He asked you to explain how users globally can access his website hosted in Finland.

## Your Task

Write a short explanation (**100–150 words**) that includes:

* Packet Switching
* IP Address
* TCP/IP
* HTTP/HTTPS

💡 **Tip:** You may use ChatGPT (as demonstrated in Task 1) to refine your explanation.

## Answer

- When you send data over the internet, it doesn't travel as one whole thing. It gets broken into smaller pieces called packets and each one finds its own way to get to where it's going - that's packet switching.

- Every device on a network has its own unique identifier called an IP address - think of it like your home address, that's how the network knows where to send stuff.
  
- TCP/IP is basically the rulebook that makes all of this work - TCP makes sure all the packets actually show up and in the right order, and IP handles where they're going and how they get there.

- And then when you're opening a website, your browser uses HTTP - or HTTPS if it's the secure version - to ask for and load web pages. The HTTPS one means your data is encrypted so nobody can snoop on what you're doing.


---

# 🏗️ Task 3: Application Architecture & Stack

## Scenario

EpicReads bookstore has two application versions:

### Two-Tier Application

* Frontend
* Database

### Three-Tier Application

* Frontend
* Backend
* Database

## Your Task

* Draw simple diagrams (hand-drawn or tool-based such as draw.io)
* Label each layer clearly
* List at least two common technologies or tools used for each layer
* Submit a screenshot or photo clearly showing your own drawing

## Diagram Screenshot / Photo

Save your diagram image in the `screenshots` folder and update the file name below.

![Application Architecture Diagram]

<img width="954" height="488" alt="task-3-diagram" src="https://github.com/user-attachments/assets/2f44466c-e9d6-41be-8905-58c3357df0e4" />

<img width="314" height="481" alt="task-3-two-tier-diagram" src="https://github.com/user-attachments/assets/46e9a5fc-ff73-4602-9b1d-e0677fcea329" />


---

## Technologies Used

### Frontend

1. React or Vue.js (for building interactive user interfaces)
2. HTML, CSS, and JavaScript (the foundation of web pages)

### Backend

1. Node.js or Python (for running server logic)
2. Express.js or Django (frameworks that handle requests and responses)

### Database

1. PostgreSQL or MySQL (relational databases for storing structured data)
2. MongoDB (NoSQL database for flexible data storage)

---

# 🌍 Task 4: Domain Name & DNS (Basic Concepts)

## Scenario

Your friend's bookstore **EpicReads** is currently accessible through:

```text
52.172.142.222:3000
```

He purchased the domain:

```text
epicreads.com
```

## Your Task

In **50–100 words**, explain in your own words:

1. What is DNS (Domain Name System)?
2. Which DNS record type should be used to connect the domain to the given IP, and why?

## Answer

- So nobody is going to type 52.172.142.222:3000 into their browser to find a bookstore. That's just not happening. So DNS is basically the internet's contact list - the same way you save "Mum" on your phone instead of memorizing her number, DNS lets you type epicreads.com and it already knows the number (IP) to call behind the scenes.

-Now to actually link that domain to the IP your friend has, he needs an A record. Why? Because an A record is the one that directly maps a domain name to an IPv4 address - and 52.172.142.222 is an IPv4 address. Simple as that.


---

# 💻 Task 5: Visual Studio Code Setup (Hands-on)

## Your Task

Install Visual Studio Code (if not already installed).

Take a screenshot of your VS Code environment showing:

* Terminal open inside VS Code
* Running a basic command:

### Windows

```powershell
dir
```

### Linux / macOS

```bash
pwd
ls
```

* Your selected VS Code theme clearly visible

⚠️ **Important:** The screenshot must show your username or another identifiable detail to confirm it is your environment.

## Screenshot

Save your screenshot in the `screenshots` folder and update the file name below.

![VS Code Setup Screenshot]

<img width="1792" height="1120" alt="task-5-vscode" src="https://github.com/user-attachments/assets/64b0ccec-2054-498d-b613-c6c091919045" />

--

# 🔗 Task 6: Publish Your Assignment as a LinkedIn Post

## Objective

Publishing on LinkedIn helps you:

* Build your professional online presence
* Reinforce your learning
* Document your DevOps journey publicly

## Your Task

Summarize your answers from Tasks 1–5 into a LinkedIn post.

Clearly structure your post into the following sections:

* ChatGPT
* Internet & Networking
* App Architecture
* DNS
* VS Code Setup

Add the following credit note at the end of your post:

> **P.S. This post is part of the DevOps Micro Internship (DMI) with Agentic AI — Cohort 3 — by Pravin Mishra. My graded progress is public: https://dmi.pravinmishra.com/s/YOUR-GITHUB-USERNAME.html · Start your DevOps journey: https://dmi.pravinmishra.com/?utm_source=student&utm_medium=ps-linkedin&utm_campaign=cohort3**

---

## LinkedIn Post URL

Paste your LinkedIn post URL here: https://www.linkedin.com/posts/aziz-kafayat_pravin-mishra-the-cloudadvisory-linkedin-activity-7440368747514753024-EkUc?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU)


---

## LinkedIn Post Backup Copy

Paste the full text of your LinkedIn post here:

Week 1 of my DevOps Micro Internship is done. 👍 

Here's what we covered.
This week was foundational. Stuff I'd come across before but never properly broken down. So here's me breaking it down simply.

🤖 Using ChatGPT as Your Learning Assistant
ChatGPT is a tool and like every tool you have to know how to use it. Prompting is a skill. The more specific you are with it the better it works. Use it as a study partner, a debugger, a mentor. Just don't be sloppy with how you talk to it.

🌐 Internet and Networking
Data doesn't travel as one whole thing. It breaks into smaller pieces called packets and each one finds its own way to the destination. That's packet switching. Every device has an IP address which is basically its home address on the internet. TCP/IP is the rulebook that makes sure everything arrives correctly and in order. HTTP and HTTPS are how your browser loads websites. HTTPS just means it's encrypted and safer.

🏗️ Application Architecture and Stack
Every app has layers. A frontend you see and interact with, a backend doing all the work, and a database storing everything. Once you understand the stack you stop seeing apps as things that just work and start understanding how they work.

🌍 Domain Name and DNS
Nobody is typing a random IP address into their browser to find a website. DNS is basically the internet's contact list. You type a domain name and it looks up the IP behind it. The A record is what connects a domain name directly to an IPv4 address. That's the one doing the actual work.

💻 Visual Studio Code Setup
Got my environment set up and extensions installed. If you haven't set up your code editor yet just start there. It makes everything feel more real.
Week 1 done. On to the next.

P.S. This post is part of the FREE DevOps Micro Internship (DMI) Cohort 3 run by Pravin Mishra. 

You can be part of this learning community too.
JOIN HERE (https://lnkd.in/e_jEk6fj ) 
DMI Cohort 3: https://lnkd.in/eZrwRXhm
Pravin Mishra Profile: https://lnkd.in/ex3cJUBH

---

# Reflection – Week 0

### What did you find easy?

- Understanding the concepts themselves wasn't hard because they're logical. Once someone breaks down what a protocol is or why you need DNS, it makes sense. The challenge wasn't the ideas, it was making sure I could explain them simply to someone else.

---

### What was difficult?

- Staying concise without losing the actual meaning. I kept wanting to add more details and examples, but the task asked for specific word counts. Learning to say just enough without saying too much is harder than I expected.

---

### What will you improve next week?

- I want to get better at using ChatGPT strategically instead of just asking it random questions. I also need to work on my diagrams and visuals. Mine were basic, and I can make them clearer and more professional-looking. And I'll publish my LinkedIn post this week without overthinking it.

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory) focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.


## 📌 Resources

- 🌐 **DMI Official Website:** https://pravinmishra.com/dmi  
- 🎓 **DevOps for Beginners (Udemy):** https://www.udemy.com/course/devops-for-beginners-docker-k8s-cloud-cicd-4-projects/  
- 🎓 **Ultimate Agentic AI DevOps with Clude Code** https://www.udemy.com/course/ultimate-agentic-ai-devops-with-claude-code/?referralCode=448389767BC96284087B
- 🎓 **DevOps with Claude Code: Terraform, EKS, ArgoCD & Helm** https://www.udemy.com/course/devops-with-claude-code-terraform-eks-argocd-helm/?referralCode=1C5B734505D65A010FA3
- ▶️ **YouTube Playlist (DMI Cohort 3):** https://www.youtube.com/playlist?list=PLFeSNDtI4Cho  
- 🔗 **Pravin Mishra (LinkedIn):** https://www.linkedin.com/in/pravin-mishra-aws-trainer/  
- 🏢 **CloudAdvisory (LinkedIn):** https://www.linkedin.com/company/thecloudadvisory/

---

*This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track*
