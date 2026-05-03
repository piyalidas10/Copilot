import fs from "fs";

// ✅ Read inputs safely
const diff = fs.readFileSync("diff.txt", "utf8") || "";
const rules = fs.readFileSync(".github/copilot-instructions.md", "utf8") || "";

// 🔥 Strong prompt (forces clean JSON)
const prompt = `
You are a senior Angular reviewer.

Follow these rules strictly:
${rules}

Review this git diff:
${diff}

IMPORTANT:
- Return ONLY valid JSON
- DO NOT use markdown
- DO NOT wrap in \`\`\`
- DO NOT add explanation

Return format:
[
  {
    "file": "relative/path/file.ts",
    "line": 10,
    "severity": "HIGH|MEDIUM|LOW",
    "comment": "Clear explanation",
    "suggestion": "Concrete fix"
  }
]
`;

async function run() {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    // 🔍 Extract text safely
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      console.error("❌ Empty Gemini response");
      fs.writeFileSync("comments.json", "[]");
      return;
    }

    // 🧹 Clean markdown if Gemini adds it anyway
    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let comments = [];

    try {
      comments = JSON.parse(cleanText);
    } catch (err) {
      console.error("❌ JSON parse failed");
      console.log("🔍 Raw Gemini response:\n", rawText);
      fs.writeFileSync("comments.json", "[]");
      return;
    }

    // ✅ Validate comments (VERY IMPORTANT for GitHub API)
    comments = comments.filter(
      (c) =>
        c &&
        typeof c.file === "string" &&
        c.file.length > 0 &&
        Number.isInteger(c.line) &&
        c.line > 0
    );

    // 🧠 Optional: normalize severity
    comments = comments.map((c) => ({
      ...c,
      severity: (c.severity || "LOW").toUpperCase()
    }));

    console.log(`✅ Generated ${comments.length} review comments`);

    fs.writeFileSync(
      "comments.json",
      JSON.stringify(comments, null, 2)
    );
  } catch (error) {
    console.error("❌ Gemini API call failed:", error.message);
    fs.writeFileSync("comments.json", "[]");
  }
}

run();