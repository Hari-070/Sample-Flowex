import { google } from "googleapis";

export async function createCalendarEvent({
  accessToken,
  title,
  description,
  startDateTime,
  endDateTime,
}: {
  accessToken: string;
  title: string;
  description?: string;
  startDateTime: string | null; // ISO string
  endDateTime: string | null;   // ISO string
}) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  startDateTime = startDateTime ?? "";
  endDateTime = endDateTime ?? "";
  const { startISO, endISO } = resolveEventTimes({
  startDateTime,
  endDateTime,
});

const event = {
  summary: title,
  description,
  start: {
    dateTime: startISO,
    timeZone: "Asia/Kolkata",
  },
  end: {
    dateTime: endISO,
    timeZone: "Asia/Kolkata",
  },
};

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return res.data;
}

export function resolveEventTimes({
  startDateTime,
  endDateTime,
}: {
  startDateTime?: string;
  endDateTime?: string;
}) {
  const now = new Date();

  const start = startDateTime
    ? new Date(startDateTime)
    : new Date(now.getTime() + 15 * 60 * 1000);

  const end = endDateTime
    ? new Date(endDateTime)
    : new Date(start.getTime() + 60 * 60 * 1000);

  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
  };
}