import fs from "fs";

// ✅ Read inputs safely
const diff = fs.readFileSync("diff.txt", "utf8") || "";
const rules =
  fs.readFileSync(".github/copilot-instructions.md", "utf8") || "";

// 🔥 Limit size (prevents silent failures)
const trimmedDiff = diff.slice(0, 12000);
const trimmedRules = rules.slice(0, 3000);

// 🔥 Strong prompt
const prompt = `
You are a senior Angular reviewer.

Follow these rules strictly:
${trimmedRules}

Review this git diff:
${trimmedDiff}

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

// ✅ Get available model dynamically
async function getModel() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await res.json();

    const names = data.models?.map((m) => m.name) || [];

    console.log("🔍 Available models:", names);

    if (names.includes("models/gemini-1.5-flash")) {
      return "gemini-1.5-flash";
    }

    return "gemini-1.0-pro"; // fallback
  } catch (e) {
    console.error("⚠️ Failed to fetch models, using fallback");
    return "gemini-1.0-pro";
  }
}

async function run() {
  try {
    const model = await getModel();

    console.log("🚀 Using model:", model);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await response.json();

    console.log("🔍 FULL GEMINI RESPONSE:\n", JSON.stringify(data, null, 2));

    // ❌ API error handling
    if (data.error) {
      console.error("❌ Gemini API error:", data.error.message);
      fs.writeFileSync("comments.json", "[]");
      return;
    }

    // 🔍 Extract text safely
    let rawText = "";

    if (data.candidates?.length > 0) {
      const parts = data.candidates[0]?.content?.parts;
      if (parts?.length > 0) {
        rawText = parts.map((p) => p.text || "").join("\n");
      }
    } else if (data.promptFeedback) {
      console.error("⚠️ Gemini blocked response:", data.promptFeedback);
    }

    if (!rawText) {
      console.error("❌ Empty Gemini response");
      fs.writeFileSync("comments.json", "[]");
      return;
    }

    // 🧹 Clean markdown
    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let comments = [];

    try {
      comments = JSON.parse(cleanText);
    } catch (err) {
      console.error("❌ JSON parse failed");
      console.log("🔍 Raw response:\n", rawText);
      fs.writeFileSync("comments.json", "[]");
      return;
    }

    // ✅ Validate comments
    comments = comments.filter(
      (c) =>
        c &&
        typeof c.file === "string" &&
        c.file.length > 0 &&
        Number.isInteger(c.line) &&
        c.line > 0
    );

    // 🧠 Normalize severity
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
    console.error("❌ Fatal error:", error.message);
    fs.writeFileSync("comments.json", "[]");
  }
}

run();