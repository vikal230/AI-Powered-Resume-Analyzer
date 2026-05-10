import { GoogleGenAI } from "@google/genai";
import { json, z } from "zod";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import puppeteer from "puppeteer";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Zod Schema sirf us data ke liye jo hum AI se expect kar rahe hain
const interviewReportSchema = z.object({
  title: z
    .string()
    .describe("The job title extracted from the job description."),
  matchScore: z.number().min(0).max(100),
  technicalQuestion: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  behavioralQuestion: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  skillGap: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),
  preprationPlan: z.array(
    z.object({
      day: z.string(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
});

//! generateInterviewReport using by google gemini API Model
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer and career coach.

Generate an interview preparation report based on the candidate data.

INPUT:
Resume: ${resume || "Not Provided"}
Candidate Self Description: ${selfDescription || "Not Provided"}
Job Description: ${jobDescription || "Not Provided"}

========================
STRICT OUTPUT RULES:
========================
1. Return ONLY valid JSON (no text before or after).
2. matchScore must be between 0 and 100.
3. Generate EXACTLY:
   - 6 technicalQuestion
   - 4 behavioralQuestion
   - 3 skillGap
   - 7 preprationPlan

========================
REQUIRED JSON FORMAT:
========================
{
  "title": "Extracted Job Title (e.g., Senior Frontend Developer)",
  "matchScore": 85,
  "technicalQuestion": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestion": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGap": [
    {
      "skill": "string",
      "severity": "low | medium | high"
    }
  ],
  "preprationPlan": [
    {
      "day": "Day 1",
      "focus": "string",
      "tasks": ["task1", "task2"]
    }
  ]
}
`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    const data = JSON.parse(response.text);
    // Zod validation sirf AI data ke liye
    const validatedData = interviewReportSchema.parse(data);
    return validatedData;
  } catch (err) {
    console.error("AI Validation error:", err);
    throw new Error("AI ne galat format bheja, please try again.");
  }
}

//! generate pdf using by the puppeteer library
export const generatePdfFromPuppeteer = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4", margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};

//! generate pdf
export const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  try {
    const resumePdfSchema = z.object({
      html: z
        .string()
        .describe(
          "the html content of the resume which can be converted to PDF using any library like puppeteer or other!",
        ),
    });

    const prompt = `
You are an Expert ATS-Resume Writer and UI/UX Developer. Generate a highly professional, ATS-optimized resume using the details below:

- Current Resume Details: ${resume || "Not Provided"}
- Target Job Description: ${jobDescription || "Not Provided"}
- Candidate's Self Description: ${selfDescription || "Not Provided"}

STRICT INSTRUCTIONS (MUST FOLLOW):
1. OUTPUT FORMAT: Return ONLY a valid JSON object with a single field named "html". Do NOT wrap the output in markdown (e.g., no \`\`\`json ... \`\`\`). The output must be directly parseable by JSON.parse().
2. ATS-FRIENDLY STRUCTURE: 
   - Use a clean, single-column layout. Avoid complex tables or multi-columns.
   - Use standard semantic HTML tags (<h1> for name, <h2> for section headers like "Experience", "Projects", "Skills", <ul> and <li> for bullet points).
3. STYLING & INLINE CSS: 
   - Use a modern, highly readable font family (e.g., 'Segoe UI', Roboto, Helvetica, Arial, sans-serif).
   - Use distinct font sizes (e.g., 24px for Name, 18px for Section Headers, 14px for body text).
   - Add a subtle bottom border to section headers (e.g., border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;).
   - Ensure adequate spacing (margin/padding) between different sections.
4. PDF PAGE-BREAK PREVENTION (CRITICAL): 
   - Every individual job experience, project block, or education block MUST be wrapped in a <div> with this exact inline style: 'style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 15px;"'. This ensures a project doesn't get cut in half across two pages.
5. CONTENT OPTIMIZATION: 
   - Smartly tailor the resume summary and bullet points to match the "Target Job Description" using keywords.
   - Present the content professionally and keep the phrasing action-oriented.
`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonContent = JSON.parse(response.text);
    const validatedData = resumePdfSchema.parse(jsonContent);
    console.log(validatedData);

    const pdfBuffer = await generatePdfFromPuppeteer(validatedData.html);
    return pdfBuffer;

    // const jsonContent = await new Promise((resolve, reject) => {
    //   let data = "";
    //   response.on("data", (chunk) => {
    //     data += chunk;
    //   });
    //   response.on("end", () => {
    //     try {
    //       resolve(JSON.parse(data));
    //     } catch (error) {
    //       reject(error);
    //     }
    //   });
    //   response.on("error", (error) => {
    //     reject(error);
    //   });
    // });

    // const validatedData = resumePdfSchema.parse(jsonContent);
    // return validatedData;
  } catch (error) {
    console.log("error in generateResumePdf", error);
    throw new Error("Failed to generate PDF");
  }
};

export default generateInterviewReport;
