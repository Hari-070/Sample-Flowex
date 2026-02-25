export function mergeContext(context: any, userInput?: any) {
  if (!userInput) return context;

  const updated = { ...context };

  for (const key in userInput) {
    const parts = key.split(".");
    let ref = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      ref[parts[i]] = ref[parts[i]] || {};
      ref = ref[parts[i]];
    }

    ref[parts[parts.length - 1]] = userInput[key];
  }

  return updated;
}



const context = {
  contactName: "praveen",
  event: {
    title: "Meeting with praveen",
    description: "Meeting scheduled with praveen",
    startDateTime: "2026-02-26T12:00:00+05:30",
    endDateTime: null
  },
  email: {
    subject: "Meeting Tomorrow",
    body: "he should be available before 10 in the office",
  }
}