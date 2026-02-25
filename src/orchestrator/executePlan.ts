import { findContactByName } from "@/src/lib/tools/peopleTool";
import { createCalendarEvent } from "@/src/lib/tools/calendarTool";
import { sendGmail } from "@/src/lib/tools/gmailTool";

export async function executePlan({
  plan,
  accessToken,
  context,
  state,
}: {
  plan: string[];
  accessToken: string;
  context: any;
  state: any;
}) {
  for (const step of plan) {
    if (step === "find_contact" && !state.contact) {
      state.contact = await findContactByName({
        accessToken,
        name: context.contactName,
      });
    }

    if (step === "create_calendar_event" && !state.event) {
      state.event = await createCalendarEvent({
        accessToken,
        ...context.event,
      });
    }

    if (step === "send_email" && !state.emailSent) {
      await sendGmail({
        accessToken,
        to: context.email.to,
        subject: context.email.subject,
        body: context.email.body,
      });

      state.emailSent = true;
    }
  }

  return state;
}
