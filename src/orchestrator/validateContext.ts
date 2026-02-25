export function validateContext({
  plan,
  context,
  state,
}: {
  plan: string[];
  context: any;
  state: any;
}) {
  const issues: { field: string; message: string }[] = [];

  if (plan.includes("find_contact")) {
    if (!context.contactName) {
      issues.push({
        field: "contactName",
        message: "Contact name is missing",
      });
    }
  }

  if (plan.includes("send_email")) {
    if (!state?.context?.email?.to) {
      issues.push({
        field: "email.to",
        message: "Contact does not have an email address",
      });
    }

    if (!context.email?.subject) {
      issues.push({
        field: "email.subject",
        message: "Email subject is missing",
      });
    }

    if (!context.email?.body) {
      issues.push({
        field: "email.body",
        message: "Email body is missing",
      });
    }
  }

  if (plan.includes("create_calendar_event")) {
    if (!context.event?.startDateTime && !context.event?.endDateTime) {
      issues.push({
        field: "event.time",
        message: "Event start and end time is missing",
      });
    }
  }

  return issues;
}
