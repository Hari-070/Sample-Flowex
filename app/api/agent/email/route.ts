import { gemini } from "@/src/lib/gemini";
import { sendEmail } from "@/src/lib/tools/emailTool";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { to, subject, intent, approved } = await req.json();

  // Safety check (human-in-the-loop)
  if (!approved) {
    return NextResponse.json({
      status: "needs_approval",
      message: "Email content generated, waiting for approval",
    });
  }

  // 1. Generate email
  const prompt = `
You are an Email Agent.

Write a professional email.
Sender name: Hari
Today's date: 30 Jan 2026
Do not use placeholders.

Intent: ${intent}
Subject: ${subject}
Recipient: ${to}

STRICT OUTPUT RULES:
- Return ONLY raw JSON
- Do NOT wrap the JSON in quotes
- Do NOT escape characters
- Do NOT include newline escape sequences (\\n)
- Do NOT add any text before or after
- Output must start with { and end with }

Return exactly this format:
{
  "subject": "string",
  "body": "string (valid HTML)"
}

If you violate any rule, the output is invalid.
`;


  let result: any;
  try {
    result = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    console.log("response from gemini has been generated");
  } catch (error) {
    console.log("error generating response from gemini");
  }

  const emailText = result.text || "";

  let jsonResult;
  try {
    jsonResult = JSON.parse(emailText)
  } catch (error) {
    jsonResult = JSON.parse(JSON.parse(emailText))
  }

  // 2. Tool execution
  await sendEmail({
    to,
    subject: jsonResult.subject ?? subject,
    text: jsonResult.body ?? emailText,
  });

  return NextResponse.json({
    status: "sent",
    email: emailText,
  });
}

// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";
// import { sendGmail } from "@/src/lib/tools/gmailTool";
// import { authOptions } from "@/src/lib/auth";
// import { gemini } from "@/src/lib/gemini";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!(session as any)?.accessToken) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   const { to, subject, intent, approved } = await req.json();

//   if (!approved) {
//     return NextResponse.json({ status: "needs_approval" });
//   }

//   // Generate email
// //   const result = await gemini.models.generateContent({
// //     model: "gemini-3-flash-preview",
// //     contents: `
// // Write a professional email.
// // Intent: ${intent}
// // `,
// //   });

//   const emailText = "hey this is a test email"; //result.text

//   // Tool execution
//   await sendGmail({
//     accessToken: (session as any).accessToken,
//     to,
//     subject,
//     body: emailText || "",
//   });

//   return NextResponse.json({
//     status: "sent",
//     email: emailText,
//   });
// }
