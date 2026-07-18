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

<img width="547" height="52" alt="Screenshot 1" src="https://github.com/user-attachments/assets/40aadb9c-23f3-474f-850a-d528ad4c0236" />

<img width="554" height="143" alt="Screenshot 1a" src="https://github.com/user-attachments/assets/74ff1777-0a48-4f8c-a36f-efddd08e1ca6" />


---

#### Screenshot 2 — Output of `pwd` and `ls -lah` showing the scripts directory

<img width="576" height="374" alt="Screenshot 2" src="https://github.com/user-attachments/assets/77b1c4c2-692b-4757-9dba-32757791a03b" />


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

<img width="582" height="379" alt="Screenshot 1" src="https://github.com/user-attachments/assets/1b8d0948-b900-4627-9ace-428773ea8029" />


---

#### Screenshot 2 — Output of `./first-script.sh`

<img width="582" height="379" alt="Screenshot 2" src="https://github.com/user-attachments/assets/499887c6-e672-4805-b772-26695820ac86" />


---

#### Screenshot 3 — Output of `ls -l first-script.sh` showing executable permission

<img width="575" height="138" alt="Screenshot 3" src="https://github.com/user-attachments/assets/b6d89f84-b7be-4720-be34-15018e8eeba6" />


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

<img width="909" height="333" alt="Screenshot 1" src="https://github.com/user-attachments/assets/b858ea45-f25d-4970-b777-efb36d19aaef" />


---

#### Screenshot 2 — Output of `./user-info.sh`

<img width="905" height="353" alt="Screenshot 2" src="https://github.com/user-attachments/assets/8b237b22-21bd-4e8a-94ad-6262dbf81289" />


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

<img width="917" height="317" alt="Screenshot 1" src="https://github.com/user-attachments/assets/cd48b3f3-93d1-456d-bc3f-dcc82c3b153e" />

---

#### Screenshot 2 — Output of `./tools-checklist.sh`

<img width="813" height="244" alt="Screenshot 2" src="https://github.com/user-attachments/assets/e3f7d144-98dc-440c-b9be-db0960f09c97" />


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

<img width="919" height="376" alt="Screenshot 1" src="https://github.com/user-attachments/assets/60114d0c-ba89-462e-9b5b-96c691a2d117" />


---

#### Screenshot 2 — Output of `./counter.sh`

<img width="901" height="282" alt="Screenshot 2" src="https://github.com/user-attachments/assets/7699b7ff-d39f-4765-9623-d7fc3ff139a6" />


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

<img width="922" height="227" alt="Screenshot  1" src="https://github.com/user-attachments/assets/dbfa57d0-920e-4fca-9234-52453150807c" />


---

#### Screenshot 2 — Content of `file-check.sh`

<img width="917" height="216" alt="Screenshot 2" src="https://github.com/user-attachments/assets/f1c1b6ac-a955-4ec4-a052-fb057fb75742" />


---

#### Screenshot 3 — Output of `./file-check.sh`

<img width="736" height="28" alt="Screenshot 3" src="https://github.com/user-attachments/assets/09b52d34-be41-4675-b3b9-c2f2b954d864" />


---

### Notes

Answer the following in your own words:

**1. What does `-d` check in Bash?**

- The -d option lets me check if a path exists and whether it's a directory. If the directory is actually there, then the condition is true and I can do something with it.

---

**2. What does `-f` check in Bash?**

- The -f option lets me check if a path exists and whether it's a regular file. If the file is there, then the condition is true and I can work with it.

---

**3. Why should file and directory paths be stored in variables?**

- Storing paths in variables makes my script way cleaner and easier to update. If I hardcode the path in multiple places and then need to change it later, I'd have to go find and fix every single instance. But if I put it in a variable, I only change it one time and it updates everywhere in my script.

---

**4. What happens if the file does not exist?**

- If the file isn't there, the -f check fails and becomes false. When that happens, the commands in my else section will run instead. So I could display a message like "File does not exist: ../test-folder/student-info.txt" to let the user know what went wrong.

---

# Task 7 — Conditionals: Pass or Retry Script

## Goal

Use if-else conditionals to make decisions based on a variable value.

### Evidence

#### Screenshot 1 — Content of `score-check.sh` with `score=85`

<img width="915" height="374" alt="Screenshot 1" src="https://github.com/user-attachments/assets/60e6a732-9f0b-45b8-b9d1-7ca2499920f8" />


---

#### Screenshot 2 — Output showing `Result: Pass`

<img width="901" height="367" alt="Screenshot 2" src="https://github.com/user-attachments/assets/f479ee77-16ef-4c55-989f-122303bd4df8" />


---

#### Screenshot 3 — Content of `score-check.sh` with `score=55`

<img width="913" height="368" alt="Screenshot 3" src="https://github.com/user-attachments/assets/0bf4f524-021c-43aa-97b8-0545f98941ca" />


---

#### Screenshot 4 — Output showing `Result: Retry`

<img width="913" height="368" alt="Screenshot 4" src="https://github.com/user-attachments/assets/c3d0b23a-1025-483c-ba92-1bcf8b879258" />



---

### Notes

Answer the following in your own words:

**1. What is the purpose of if-else in Bash?**

- An if-else statement lets my script make decisions based on what's happening. If a condition is true, I run one block of commands. If that condition is false, I run a different block of commands instead. It's how I add logic to my scripts.

---

**2. What does `-ge` mean?**

-ge means greater than or equal to. So when I write [ "$score" -ge 70 ], I'm checking whether the score is 70 or higher. If it is, the condition is true.

---

**3. Why should conditions be tested with different values?**

- I need to test my conditions with different values to make sure all the possible outcomes work the way I expect them to. In this case, I'd test with 85 to see if the Pass result works, then test with 55 to see if the Retry result works. I should also test the exact boundary value of 70 to make sure it correctly produces Pass, since that's the cutoff point.

---

**4. How can conditionals help in automation scripts?**

- Conditionals help my automation scripts make smart decisions about what to do next based on what's actually happening. For example, my script could check if a service is running, if a file exists, or if the disk is running out of space. Then based on what it finds, it can take the right action without me having to manually do it.

---

# Task 8 — Functions: Final Bash Automation Script

## Goal

Create a final Bash script using functions to organize reusable code.

### Evidence

#### Screenshot 1 — Content of `final-automation.sh`

<img width="876" height="105" alt="Screenshot 1" src="https://github.com/user-attachments/assets/e3bb2d6c-581c-44da-a6ae-6d82a9514aee" />


---

#### Screenshot 2 — Output of `./final-automation.sh`

<img width="910" height="364" alt="Screenshot 2" src="https://github.com/user-attachments/assets/1e12eda4-abef-4917-8d3d-23f560ac3fb5" />


---

#### Screenshot 3 — Output of `ls -lah` showing all created scripts

<img width="911" height="380" alt="Screenshot 3" src="https://github.com/user-attachments/assets/b171d8bb-51a3-4526-9ce9-96ec87dbaf7e" />


---

### Notes

Answer the following in your own words:

**1. What is a function in Bash?**

- A function is basically a group of commands that I name and organize together to do one specific job. Once I create it, I can just call that function by name whenever I need it to run, instead of rewriting all those commands over and over.

---

**2. Why are functions useful in scripts?**

- Functions help me break down a big script into smaller, manageable pieces. That makes it way easier for me to read what's going on, fix problems, and keep everything organized. Plus if I need to do the same task multiple times, I just call the function again instead of writing it all out again.

---

**3. Which functions did you create in this script?**

I created four functions in my script:

1. print_header prints the assignment header.
2. print_user_details prints my full name and the assignment name.
3. check_files checks whether the required directory and file exist.
4. print_tools uses a loop to print each tool stored in the array.
---

**4. How does this final script combine variables, arrays, loops, conditionals, files, and functions?**

- My script uses variables to store my name, the assignment name, and the paths I need. I use an array to store the tool names and a loop to print them one by one. I use conditionals to check if files and directories exist. And I use functions to organize all these pieces into separate tasks that work together.

---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/aziz-kafayat_just-crushed-a-bash-script-automation-activity-7484027098958045184-ICMf?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAu6SE0BOKqgQlVpcQ8NlGMolDXlxFlEySU`

---

#### Screenshot — Published LinkedIn post

<img width="800" height="632" alt="Linkedin Screenshot" src="https://github.com/user-attachments/assets/ae23cc41-5b38-4e89-91b7-162513a31a66" />


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
