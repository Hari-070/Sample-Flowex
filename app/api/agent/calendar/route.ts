import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import { gemini } from "@/src/lib/gemini";
import { createCalendarEvent } from "@/src/lib/tools/calendarTool";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!(session as any)?.accessToken) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { intent, approved } = await req.json();

  if (!approved) {
    return NextResponse.json({ status: "needs_approval" });
  }

  // Agent reasoning
//   const result = await gemini.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: `
// Extract calendar event details from this intent.
// Return JSON with:
// title, description, startDateTime, endDateTime.

// Intent:
// ${intent}
// `,
//   });
//   console.log("this is the extracted event from gemini,", JSON.stringify(result,null,2))

//   const eventData = result.text ? JSON.parse(result.text): "";
const eventData = {
  "title": "Project Review Meeting",
  "description": "Project review meeting with the development team.",
  "startDateTime": "2026-02-02T10:00:00+05:30",
  "endDateTime": "2026-02-02T11:00:00+05:30"
}


  // Tool execution
  const event = await createCalendarEvent({
    accessToken: (session as any).accessToken,
    ...eventData,
  });

  return NextResponse.json({
    status: "created",
    event,
  });
}
