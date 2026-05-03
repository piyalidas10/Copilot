import fs from "fs";
import fetch from "node-fetch";

const diff = fs.readFileSync("diff.txt", "utf8");
const instructions = fs.readFileSync(".github/copilot-instructions.md", "utf8");

const prompt = `
You are a senior Angular architect and code reviewer.

Follow rules:
${instructions}

Review this PR diff:
${diff}

Also validate:
- PR checklist completeness
- Angular best practices
- Performance issues
- Security risks

Return STRICT JSON:
{
  "score": number (0-100),
  "verdict": "PASS" | "FAIL",
  "issues": [
    {
      "severity": "HIGH|MEDIUM|LOW",
      "message": "",
      "fix": ""
    }
  ],
  "summary": ""
}
`;

const response = await fetch(process.env.AZURE_OPENAI_ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.AZURE_OPENAI_API_KEY
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  })
});

const data = await response.json();
const result = JSON.parse(data.choices[0].message.content);

fs.writeFileSync("review.json", JSON.stringify(result, null, 2));

// Generate markdown
let md = `## 🤖 AI Review Report\n\n`;
md += `### 📊 Score: ${result.score}/100\n`;
md += `### 🚦 Verdict: ${result.verdict}\n\n`;

result.issues.forEach(i => {
  md += `- **${i.severity}**: ${i.message}\n`;
  md += `  👉 Fix: ${i.fix}\n\n`;
});

md += `\n### 📝 Summary\n${result.summary}`;

fs.writeFileSync("review.md", md);