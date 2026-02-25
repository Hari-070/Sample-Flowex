import { gemini } from "@/src/lib/gemini";
import { text } from "stream/consumers";

export async function extractContext(intent: string) {
  const res = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are an information extraction agent.

From the user intent, extract structured data.

Return ONLY valid JSON with this schema:
{
  "contactName": string | null,
  "event": {
    "title": string,
    "description": string,
    "startDateTime": string,
    "endDateTime": string
  } | null,
  "email": {
    "subject": string,
    "body": string
  } | null
}

Rules:
- Use ISO 8601 datetime with timezone Asia/Kolkata
- If information is missing, set the field to null
- No explanations, no markdown

For you information: today's date is ${new Date()}

Intent:
${intent}
`,
  });

  return JSON.parse(res.text ?? '');
}
