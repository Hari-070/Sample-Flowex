import { google } from "googleapis";

export async function findContactByName({
  accessToken,
  name,
}: {
  accessToken: string;
  name: string;
}) {
  if (!accessToken) {
    throw new Error("Missing access token for People API");
  }
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const people = google.people({ version: "v1", auth });

  const res = await people.people.searchContacts({
    query: name,
    readMask: "names,emailAddresses,phoneNumbers",
    pageSize: 5,
  });

  const contacts = res.data.results;

  if (!contacts || contacts.length === 0) return null;
  // console.log(JSON.stringify(contacts, null, 2));

  const person = contacts[0].person;

  return {
    name: person?.names?.[0]?.displayName,
    email: person?.emailAddresses?.[0]?.value,
    phno: person?.phoneNumbers?.[0]?.canonicalForm,
  };
}
