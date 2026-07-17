# Assignment 5 — Bash Script Automation Drill (OPS Checklist)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will practice Bash scripting by building a series of small automation scripts covering environment setup, variables, arrays, loops, file conditionals, if-else logic, and functions. These scripts form the foundation of real-world Linux automation used in DevOps, cloud, and production support environments.

---

# Task 1 — Bash Environment & Workspace Setup

## Goal

Verify that Bash is available on your system and create a clean workspace for this assignment.

### Evidence

#### Screenshot 1 — Output of `echo $SHELL` and `bash --version`

Add your screenshot here.

---

#### Screenshot 2 — Output of `pwd` and `ls -lah` showing the scripts directory

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is Bash?**

- Bash is a command-line interpreter, or a program that lets you type commands directly into your computer and have it execute them. The name stands for "Bourne Again Shell." Think of it as a text-based way to communicate with your operating system, either by typing commands one at a time or by running them in batches through scripts. It's extremely popular on Linux systems.

---

**2. What is the difference between shell and Bash?**

- A shell is the broader category, or any program that acts as a middleman between you and your operating system's core. Bash is just one example of a shell. There are others like sh, zsh, ksh, and fish. They all do essentially the same job: they interpret your commands and relay them to the OS. However, each one has its own syntax, features, and configuration style.
---

**3. Why is it important to confirm the Bash version before writing scripts?**

- Different versions of Bash support different features and syntax. By confirming which version is installed, you make sure that the code you write will actually work on that system. You don't want to write a script using a feature that only exists in Bash 5 if the server you're deploying to only has Bash 3.

---

# Task 2 — Your First Bash Script

## Goal

Create your first Bash script, make it executable, and run it from the terminal.

### Evidence

#### Screenshot 1 — Content of `first-script.sh`

Add your screenshot here.

---

#### Screenshot 2 — Output of `./first-script.sh`

Add your screenshot here.

---

#### Screenshot 3 — Output of `ls -l first-script.sh` showing executable permission

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is the purpose of `#!/bin/bash`?**

- I use that shebang line to tell my operating system which program to use to read and run my script. Without it, the system wouldn't know whether to use Bash or something else. So when I write #!/bin/bash at the top, I'm basically saying "run this with Bash."

---

**2. Why do we use `chmod +x` before running a script?**

- When I create a new script, it doesn't have permission to execute by default. I need to add that permission first. When I use chmod +x, I'm giving the script executable permissions so I can actually run it directly with ./script.sh instead of needing someone else to run it for me.

---

**3. What is the difference between running a script using `./script.sh` and `bash script.sh`?**

- When I use ./script.sh, I'm running the file directly. The system looks at my shebang to figure out which interpreter to use, and I need execute permissions for this to work.
When I use bash script.sh, I'm directly telling Bash to run my script. It doesn't matter if the file has execute permissions or what my shebang says because I'm explicitly saying "Bash, do this." Bash just runs it regardless.

---

# Task 3 — Variables: User Information Script

## Goal

Use variables to store and display user-related information.

### Evidence

#### Screenshot 1 — Content of `user-info.sh`

Add your screenshot here.

---

#### Screenshot 2 — Output of `./user-info.sh`

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is a variable in Bash?**

- A variable is basically a container where I store a value that I can use later in my script. Instead of typing out the same information over and over, I can save it in a variable with a name I choose. For example, I can store someone's name in a variable and then use it whenever I need to display that name.

---

**2. Why should we avoid spaces around the `=` sign when creating variables?**

- Bash is picky about spaces around the equals sign. If I put spaces there, Bash gets confused and thinks I'm trying to run a command instead of creating a variable. So I have to write it like this: course_name="Linux and Bash Scripting" without any spaces around the equals sign. If I write course_name = "Linux and Bash Scripting" with spaces, Bash will try to execute course_name as a command and treat the rest as arguments, which is not what I want.

---

**3. How do you access the value stored inside a Bash variable?**

- I put the $ symbol before the variable name to get the value out. So if I write echo "$course_name", Bash will read whatever I stored inside that variable and print it out. The $ tells Bash "give me what's inside this variable."

---

# Task 4 — Arrays & Loops: Tools Checklist Script

## Goal

Use arrays and loops to print a checklist of tools used in Bash scripting.

### Evidence

#### Screenshot 1 — Content of `tools-checklist.sh`

Add your screenshot here.

---

#### Screenshot 2 — Output of `./tools-checklist.sh`

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is an array in Bash?**

- An array is how I store multiple values under one variable name. Instead of creating separate variables for each item, I can put them all together in an array. For example, if I want to store a list of Linux tools, I can do it like this: tools=("bash" "nano" "chmod" "echo" "ls" "pwd"). All those tools are now in one place.

---

**2. Why are arrays useful in scripts?**

- Arrays help me keep related values organized together. If I have a bunch of tools to work with, I don't want to create ten different variables. I put them all in one array and then use a loop to process them. This way my script is shorter and when I need to add or change something, I only have to do it in one place.

---

**3. What does `"${tools[@]}"` mean?**

- That syntax gives me access to all the values inside my tools array. The double quotes are important because they make sure each item in the array stays separate. If one of my array items has spaces in it, the quotes keep it from getting broken apart.


---

**4. What is the purpose of the `for` loop in this script?**

- The for loop lets me go through each item in my array one at a time. Every time the loop runs, it takes the next item from the array, stores it in the tool variable, and then I can do something with it like print it. So on the first run I get bash, then nano, then chmod, and so on until I've gone through everything.

---

# Task 5 — Loops: Number Counter Script

## Goal

Use loops to repeat a task multiple times.

### Evidence

#### Screenshot 1 — Content of `counter.sh`

Add your screenshot here.

---

#### Screenshot 2 — Output of `./counter.sh`

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is a loop?**

- A loop is a way for me to repeat a task multiple times without having to write the same command over and over. I write the command once, put it inside a loop, and the loop handles running it as many times as I need.

---

**2. Why do we use loops in Bash scripting?**


- Loops help me automate things that would be tedious to do manually. Instead of typing the same command ten times, I can write it once and let the loop do the work. It makes my scripts way shorter and saves me a lot of time.

---

**3. How many times did the loop run in your script?**

- The loop ran five times because I gave it five numbers: 1 2 3 4 5. It ran once for each number I listed.

---

**4. What would you change if you wanted the loop to run 10 times?**

- I would just add more numbers to my loop. Instead of stopping at 5, I'd add 6 through 10 like this:
for number in 1 2 3 4 5 6 7 8 9 10
do
echo "Step $number completed"
done
Now the loop would run ten times instead of five, once for each number.

---

# Task 6 — Files & Conditionals: File Validation Script

## Goal

Use file checks and conditionals to verify whether files and directories exist.

### Evidence

#### Screenshot 1 — Output of `ls -lah ../test-folder`

Add your screenshot here.

---

#### Screenshot 2 — Content of `file-check.sh`

Add your screenshot here.

---

#### Screenshot 3 — Output of `./file-check.sh`

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What does `-d` check in Bash?**

Add your answer here.

---

**2. What does `-f` check in Bash?**

Add your answer here.

---

**3. Why should file and directory paths be stored in variables?**

Add your answer here.

---

**4. What happens if the file does not exist?**

Add your answer here.

---

# Task 7 — Conditionals: Pass or Retry Script

## Goal

Use if-else conditionals to make decisions based on a variable value.

### Evidence

#### Screenshot 1 — Content of `score-check.sh` with `score=85`

Add your screenshot here.

---

#### Screenshot 2 — Output showing `Result: Pass`

Add your screenshot here.

---

#### Screenshot 3 — Content of `score-check.sh` with `score=55`

Add your screenshot here.

---

#### Screenshot 4 — Output showing `Result: Retry`

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is the purpose of if-else in Bash?**

Add your answer here.

---

**2. What does `-ge` mean?**

Add your answer here.

---

**3. Why should conditions be tested with different values?**

Add your answer here.

---

**4. How can conditionals help in automation scripts?**

Add your answer here.

---

# Task 8 — Functions: Final Bash Automation Script

## Goal

Create a final Bash script using functions to organize reusable code.

### Evidence

#### Screenshot 1 — Content of `final-automation.sh`

Add your screenshot here.

---

#### Screenshot 2 — Output of `./final-automation.sh`

Add your screenshot here.

---

#### Screenshot 3 — Output of `ls -lah` showing all created scripts

Add your screenshot here.

---

### Notes

Answer the following in your own words:

**1. What is a function in Bash?**

Add your answer here.

---

**2. Why are functions useful in scripts?**

Add your answer here.

---

**3. Which functions did you create in this script?**

Add your answer here.

---

**4. How does this final script combine variables, arrays, loops, conditionals, files, and functions?**

Add your answer here.

---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`__________________________`

---

#### Screenshot — Published LinkedIn post

Add your screenshot here.

---

# Submission Instructions

- Add all required screenshots in your submission
- Full name must be visible in required screenshots
- All script files must be created and run successfully
- Required notes must be answered clearly for every task
- Do not expose sensitive information (keys, passwords, credentials)

---

# Completion Checklist

- [ ] Task 1: Environment setup verified, workspace created (Screenshots 1–2, Notes answered)
- [ ] Task 2: First script created, executed, permissions verified (Screenshots 1–3, Notes answered)
- [ ] Task 3: Variables script created and run (Screenshots 1–2, Notes answered)
- [ ] Task 4: Arrays and loops script created and run (Screenshots 1–2, Notes answered)
- [ ] Task 5: Counter loop script created and run (Screenshots 1–2, Notes answered)
- [ ] Task 6: File validation script created and run (Screenshots 1–3, Notes answered)
- [ ] Task 7: Pass/Retry conditional script tested with both values (Screenshots 1–4, Notes answered)
- [ ] Task 8: Final automation script created and run (Screenshots 1–3, Notes answered)
- [ ] All scripts run without errors
- [ ] Full Name visible in all required screenshots
- [ ] LinkedIn post published and URL submitted
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
