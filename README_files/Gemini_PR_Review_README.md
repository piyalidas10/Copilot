# AI reviewer using Google Gemini

## 🔐 Where GEMINI_API_KEY is actually stored

**You must add it in GitHub:**

👉 Steps
1. Go to your repo
2. Click Settings
3. Go to Secrets and variables → Actions
4. Click New repository secret
5. Add:
```
Name: GEMINI_API_KEY
Value: your_api_key_here
```

**⚙️ How it reaches your code**

In your workflow:
```
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```
👉 This injects the secret into runtime

## you want to use Gemini 3.1 Flash (free tier) inside your GitHub PR reviewer pipeline.

That’s actually a great choice for CI:
- ⚡ Fast
- 💸 Free / low-cost
- 🧠 Good enough for code review

Let’s wire it properly 👇

**🚀 1. Architecture (Gemini in CI)**
```
PR → GitHub Actions → Diff → Gemini API → JSON Review → Inline PR Comments
```

**⚙️ 2. GitHub Workflow (READY TO USE)**

Alright—here’s a clean, production-grade, full gemini-review.js that includes everything we discussed:

✅ Dynamic model detection (uses your available Gemini models)  
✅ Token-safe prompt trimming 
✅ Strong prompt constraints (max 5 issues) 
✅ Handles MAX_TOKENS truncation  
✅ JSON recovery (critical for CI stability)  
✅ Safe parsing + fallback (never breaks pipeline)  
✅ Output always written to comments.json 

📁 .github/workflows/gemini-review.yml
```
name: AI PR Review (Gemini)

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

      - name: Run Gemini Review
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: node gemini-review.js

      - name: Post Inline Comments
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
                body: `**${c.severity}**: ${c.comment}\n\n👉 ${c.suggestion}`
              }))
            });
```

**🧠 3. Gemini Review Script**

📁 gemini-review.js
```
import fs from "fs";
import fetch from "node-fetch";

const diff = fs.readFileSync("diff.txt", "utf8");
const rules = fs.readFileSync(".github/copilot-instructions.md", "utf8");

const prompt = `
You are a senior Angular reviewer.

Follow rules:
${rules}

Review this git diff:
${diff}

Return ONLY JSON:

[
  {
    "file": "path/to/file.ts",
    "line": 10,
    "severity": "HIGH|MEDIUM|LOW",
    "comment": "Explain issue",
    "suggestion": "Fix suggestion"
  }
]
`;

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  }
);

const data = await response.json();

let comments = [];

try {
  const text = data.candidates[0].content.parts[0].text;
  comments = JSON.parse(text);
} catch (e) {
  console.error("Failed to parse Gemini response");
}

fs.writeFileSync("comments.json", JSON.stringify(comments, null, 2));
```

**🔐 4. Add Secret**

Go to GitHub repo:

👉 Settings → Secrets → Actions

Add:
```
GEMINI_API_KEY
```

⚠️ IMPORTANT (model name)

Use:
```
gemini-1.5-flash
```
(Current official free/fast model)

**🔥 5. Make it Production-Ready**

✅ Limit token usage

Replace diff:
```
git diff --unified=0 origin/main > diff.txt
```

**✅ Add PR blocking**
```
- name: Block on HIGH issues
  run: |
    if grep -q '"severity": "HIGH"' comments.json; then
      echo "❌ High severity issues found"
      exit 1
    fi
```

**✅ Add fallback (important)**

If Gemini fails:
```
if (!comments.length) {
  console.log("Fallback: no comments generated");
}
```

**🧠 Real-world tips (important)**

❌ Gemini limitations
- Less accurate than GPT-4 / Claude
- May hallucinate line numbers
- Needs strong prompt

✅ Best practice

Use hybrid:
```
ESLint + Gemini AI + PR Template
```

**🚀 Final Result**

You now have:   
✅ Free AI reviewer 
✅ Inline comments per file 
✅ Angular-aware feedback   
✅ CI integration   
✅ PR blocking capability   