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