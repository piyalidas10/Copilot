# Help me build an AI reviewer that comments per file like a human reviewer
We’ll build a real AI reviewer that comments on specific files/lines, so it feels like a human code review.

Below is a working, production-ready pattern you can drop into your repo.

## 🧠 What you’re building
```
PR opened/updated
   ↓
GitHub Action
   ↓
Collect diff (per file + line)
   ↓
Send to AI (with your Angular rules)
   ↓
AI returns structured comments
   ↓
Post inline review comments on PR
```

## AI reviewer using Open-ai model

You now have:

✅ Inline AI reviewer (like senior dev) 
✅ Angular-aware feedback   
✅ File-level comments  
✅ Auto PR blocking 

⚙️ 1. Workflow file
---------------------------------------------------------------
**📁 .github/workflows/ai-inline-review.yml**
```
name: AI Inline PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Get PR diff
        run: |
          git fetch origin main
          git diff origin/main > diff.txt

      - name: Install deps
        run: npm install node-fetch

      - name: Run AI reviewer
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: node ai-inline-review.js
```

🧠 2. AI Inline Reviewer Script
---------------------------------------------------------------
📁 ai-inline-review.js

This is the core intelligence 👇
```
import fs from "fs";
import fetch from "node-fetch";

const diff = fs.readFileSync("diff.txt", "utf8");
const rules = fs.readFileSync(".github/copilot-instructions.md", "utf8");

// 🔥 Prompt engineered for inline comments
const prompt = `
You are a senior Angular code reviewer.

Follow these rules strictly:
${rules}

Analyze this git diff:
${diff}

Return ONLY JSON in this format:

[
  {
    "file": "path/to/file.ts",
    "line": 10,
    "severity": "HIGH|MEDIUM|LOW",
    "comment": "Explain issue like a human reviewer",
    "suggestion": "Improved code or fix"
  }
]

Focus on:
- Angular best practices (OnPush, Signals)
- TypeScript strict typing
- Performance issues
- Clean architecture
`;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  })
});

const data = await response.json();

// ⚠️ AI must return JSON
let comments = [];
try {
  comments = JSON.parse(data.choices[0].message.content);
} catch (e) {
  console.error("AI response parsing failed");
  process.exit(0);
}

// Save for next step
fs.writeFileSync("comments.json", JSON.stringify(comments, null, 2));
```

💬 3. Post Inline Comments
---------------------------------------------------------------
Add this step to your workflow:
```
- name: Post inline comments
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

      if (!comments.length) {
        console.log("No issues found");
        return;
      }

      await github.rest.pulls.createReview({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number,
        event: "REQUEST_CHANGES",
        comments: comments.map(c => ({
          path: c.file,
          line: c.line,
          body: `**${c.severity}**: ${c.comment}\n\n👉 Fix:\n${c.suggestion}`
        }))
      });
```

## AI reviewer using Phi-4 model
Phi-4 is lightweight and works well for CI if you host it correctly.

**GitHub Actions cannot directly call Phi-4 like OpenAI API unless: 👉 You expose it via an API endpoint**

So you have 2 valid ways:

🚀 Option A (Recommended): Use Azure AI / hosted endpoint
-----------------------------------------------------------------------------
If you deploy Phi-4 via Azure AI / server API, your workflow becomes simple.

**✅ Workflow using Phi-4 API**

📁 .github/workflows/ai-review.yml
```
name: AI Review with Phi-4

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Get diff
        run: |
          git fetch origin main
          git diff origin/main > diff.txt

      - name: Install deps
        run: npm install node-fetch

      - name: Run Phi-4 review
        env:
          PHI_API_KEY: ${{ secrets.PHI_API_KEY }}
          PHI_API_URL: ${{ secrets.PHI_API_URL }}
        run: node phi-review.js

      - name: Post comments
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

            if (!comments.length) return;

            await github.rest.pulls.createReview({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              event: "REQUEST_CHANGES",
              comments: comments.map(c => ({
                path: c.file,
                line: c.line,
                body: `**${c.severity}**: ${c.comment}\n\n👉 ${c.suggestion}`
              }))
            });
```

**🧠 Phi-4 Review Script**

📁 phi-review.js
```
import fs from "fs";
import fetch from "node-fetch";

const diff = fs.readFileSync("diff.txt", "utf8");
const rules = fs.readFileSync(".github/copilot-instructions.md", "utf8");

const prompt = `
You are a senior Angular reviewer.

Rules:
${rules}

Review this diff:
${diff}

Return JSON:
[
 { "file": "", "line": 1, "severity": "HIGH|MEDIUM|LOW", "comment": "", "suggestion": "" }
]
`;

const response = await fetch(process.env.PHI_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.PHI_API_KEY}`
  },
  body: JSON.stringify({
    model: "phi-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  })
});

const data = await response.json();

let comments = [];
try {
  comments = JSON.parse(data.choices[0].message.content);
} catch (e) {
  console.error("Parsing failed");
}

fs.writeFileSync("comments.json", JSON.stringify(comments, null, 2));
```

🧪 Option B: Run Phi-4 locally in GitHub Actions (NOT recommended)
-----------------------------------------------------------------------------------
You can run Phi-4 using:
```
Ollama
llama.cpp
```

But:

❌ Slow (CI timeout risk)   
❌ Heavy (CPU/RAM limits)   
❌ Unstable for PR workflows    

**Example (Ollama)**
```
- name: Install Ollama
  run: curl -fsSL https://ollama.com/install.sh | sh

- name: Pull Phi model
  run: ollama pull phi

- name: Run review
  run: |
    ollama run phi "Review this diff: $(cat diff.txt)"
```
👉 This is experimental only

**🔥 Best Architecture (what you SHOULD do)**
```
GitHub Action
     ↓
Your API (FastAPI / Node)
     ↓
Phi-4 Model (GPU / Azure / VM)
     ↓
Return structured review
```

**⚙️ Example Backend (FastAPI)**
```
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Req(BaseModel):
    prompt: str

@app.post("/review")
def review(req: Req):
    # call Phi-4 model here
    return {
        "choices": [
            {"message": {"content": "[]"}}
        ]
    }
```

**🔐 Secrets to add**

In GitHub:
```
PHI_API_KEY
PHI_API_URL
```

**🧠 Final Recommendation**
| Setup              | Use Case     |
| ------------------ | ------------ |
| Azure-hosted Phi-4 | ✅ Production |
| Custom API + GPU   | ✅ Scalable   |
| Ollama in Actions  | ❌ Demo only  |


## ai-review.yml will automatically run with github workflow ?
Yes, an ai-review.yml file will run automatically, provided it is correctly configured as a GitHub Actions workflow.

### How GitHub Actions Work
For automatic triggering, the file must meet these requirements:

- File Location: Place the file in the .github/workflows/ directory of the repository.
- Trigger Events: Include an on: key in the file to specify when it should run. Most AI review workflows trigger on pull_request events, such as when a PR is opened or synchronized.
- Repository Secrets: Most AI review tools require an API key stored as a GitHub Secret, such as OPENAI_API_KEY, to function.

### Example Trigger
A typical ai-review.yml uses the following section to run every time a pull request is created or updated:

yaml
```
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]
```
To verify that the workflow is active, check the Actions tab in the GitHub repository.

### Common AI Review Actions
Many developers use pre-built actions from the GitHub Marketplace to handle the logic, such as:

- AI Code Review (https://github.com/marketplace/actions/ai-code-review-very-powerfull) for OpenAI-based analysis.
- CodeRabbit (https://github.com/coderabbitai/ai-pr-reviewer) for detailed line-by-line suggestions.
- Gemini Code Review (https://github.com/marketplace/actions/gemini-code-review-github-action) for using Google's models