import { gemini } from "@/src/lib/gemini";

export async function createPlan(intent: string) {
  const res = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are a planning agent.

Given a user intent, break it into ordered steps.
Possible steps:
- find_contact
- create_calendar_event
- send_email

Return ONLY JSON array.

Intent:
${intent}
`,
  });
// const res = {
//     status: "success",
//     text: [ 'find_contact', 'create_calendar_event', 'send_email' ]
// }
//   console.log("the response from planning agent", JSON.parse(res.text || ''))
  console.log("the response from planning agent", res.text)

  // return res.text;
  return JSON.parse(res.text || '');
}
