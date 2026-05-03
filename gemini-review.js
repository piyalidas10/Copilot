import fs from "fs";

// ===============================
// 📥 Read Inputs
// ===============================
const diff = fs.readFileSync("diff.txt", "utf8") || "";
const rules =
  fs.readFileSync(".github/copilot-instructions.md", "utf8") || "";

// 🔥 Trim to avoid token overflow
const trimmedDiff = diff.slice(0, 5000);
const trimmedRules = rules.slice(0, 1200);

// ===============================
// 🧠 Prompt
// ===============================
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
- Return MAXIMUM 5 issues

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

// ===============================
// 🔍 Detect Available Model
// ===============================
async function getModel() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await res.json();

    const names = data.models?.map((m) => m.name) || [];

    console.log("🔍 Available models:", names);

    const preferred = [
      "models/gemini-2.5-flash",
      "models/gemini-2.0-flash",
      "models/gemini-2.0-flash-lite"
    ];

    for (const p of preferred) {
      if (names.includes(p)) {
        return p.replace("models/", "");
      }
    }

    throw new Error("No supported Gemini model available");
  } catch (e) {
    console.error("❌ Model detection failed:", e.message);
    process.exit(1);
  }
}

// ===============================
// 🚀 Main Execution
// ===============================
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
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    console.log(
      "🔍 FULL GEMINI RESPONSE:\n",
      JSON.stringify(data, null, 2)
    );

    // ===============================
    // ❌ API Error Handling
    // ===============================
    if (data.error) {
      console.error("❌ Gemini API error:", data.error.message);
      fs.writeFileSync("comments.json", "[]");
      return;
    }

    // ===============================
    // 📤 Extract Response Text
    // ===============================
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

    console.log("🔍 Raw response:\n", rawText);

    // ===============================
    // 🧹 Clean Markdown (if any)
    // ===============================
    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let comments = [];

    // ===============================
    // 🔥 JSON Parse + Recovery
    // ===============================
    try {
      comments = JSON.parse(cleanText);
    } catch (err) {
      console.error("❌ JSON parse failed — attempting recovery");

      const start = cleanText.indexOf("[");
      const end = cleanText.lastIndexOf("]");

      if (start !== -1 && end !== -1 && end > start) {
        const recovered = cleanText.substring(start, end + 1);

        try {
          comments = JSON.parse(recovered);
          console.log("✅ Partial JSON recovered");
        } catch (e) {
          console.error("❌ Recovery failed");
          fs.writeFileSync("comments.json", "[]");
          return;
        }
      } else {
        console.error("❌ No valid JSON structure found");
        fs.writeFileSync("comments.json", "[]");
        return;
      }
    }

    // ===============================
    // ✅ Validate Comments
    // ===============================
    comments = comments.filter(
      (c) =>
        c &&
        typeof c.file === "string" &&
        c.file.length > 0 &&
        Number.isInteger(c.line) &&
        c.line > 0
    );

    // Normalize severity
    comments = comments.map((c) => ({
      ...c,
      severity: (c.severity || "LOW").toUpperCase()
    }));

    console.log(`✅ Generated ${comments.length} review comments`);

    // ===============================
    // 💾 Save Output
    // ===============================
    fs.writeFileSync(
      "comments.json",
      JSON.stringify(comments, null, 2)
    );
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    fs.writeFileSync("comments.json", "[]");
  }
}

// ===============================
run();