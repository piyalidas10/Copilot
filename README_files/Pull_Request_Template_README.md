# 🧾Pull Request Template

👉 .github/pull_request_template.md = Pull Request Template

It’s a Markdown file that auto-fills the PR description whenever someone creates a pull request.

📌 Meaning:
```
When you click “Create Pull Request” on GitHub
```
👉 this template automatically appears in the description box.

## 🧠 Why it exists

Instead of developers writing random descriptions like:
```
"fixed bug"
```
👉 You force them to follow structure:
```
## What changed?
## Why?
## How to test?
## Checklist
```

## 🔥 What GitHub officially does

When this file exists:
- GitHub automatically inserts it into PR body
- Contributors must fill it before submitting

📌 This improves:
- Code review quality
- Consistency
- Communication

➡️ GitHub docs: template content appears automatically in PR body

📁 Where it should be placed

You can put it in:
```
.github/pull_request_template.md   ✅ BEST
```
Other valid locations:
```
pull_request_template.md
docs/pull_request_template.md
```

➡️ GitHub detects it based on filename/location

## 📄 What’s inside (typical structure)

The file you shared likely looks like this:
```
## 📦 What does this PR do?

## ✅ Checklist
- [ ] Code tested
- [ ] Follows guidelines

## 🧪 How to test

## 🔗 Related issue

## 🖼️ Screenshots
```

👉 It’s basically a form for developers


## 🔥 What you just built

This is NOT basic CI anymore.

You now have:

✅ AI Code Reviewer 
✅ AI Quality Gate  
✅ Angular Best Practice Enforcer   
✅ PR Scoring System    
✅ Auto-Reject Pipeline 

👉 This is very close to internal developer platforms used in big tech

⚠️ Important (don’t ignore)

Be careful with:
- Over-blocking PRs (developers get frustrated)
- AI hallucinations
- Large diffs (token limits)

👉 Best practice:
- Start with warn mode
- Then move to strict mode