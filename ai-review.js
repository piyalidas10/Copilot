import fs from "fs";
import fetch from "node-fetch";

const diff = fs.readFileSync("diff.txt", "utf8");
const instructions = fs.readFileSync(".github/copilot-instructions.md", "utf8");

const prompt = `
You are a senior Angular architect.

Follow these rules:
${instructions}

Review this code diff:
${diff}

Return:
- Issues
- Severity (HIGH/MEDIUM/LOW)
- Fix suggestions
- Improved code snippets
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
fs.writeFileSync("review.md", data.choices[0].message.content);