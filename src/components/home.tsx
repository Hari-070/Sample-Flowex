"use client";

import { useState } from "react";
import Signin from "./oauthSignin";

export default function HomePage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [messageDescription, setMessageDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const send = async () => {
    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/agent/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject,
        intent: messageDescription,
        approved: true,
      }),
    });

    const calRes = await fetch("/api/agent/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent:
          "Schedule a project review tomorrow from 10am to 11am(Feb 2, 2026)",
        approved: true,
      }),
    });
    console.log(calRes.status, calRes);

    const data = await res.json();

    if (data.status === "sent") {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  const fetchContact = async () => {
    const res = await fetch("/api/agent/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "hari",
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  // const runOrchestrator = async () => {
  //   const res = await fetch("/api/orchestrator", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       intent:
  //         "Fix a meeting tomorrow at 12 with Hari Brathosh and mail him the requirements",
  //       approved: true,
  //       context: {
  //         contactName: "Hari Brathosh",
  //         event: {
  //           title: "Meeting with Hari",
  //           description: "Discussion about requirements",
  //           startDateTime: "2026-02-02T12:00:00+05:30",
  //           endDateTime: "2026-02-02T13:00:00+05:30",
  //         },
  //         email: {
  //           subject: "Meeting Requirements",
  //           body: "Please find the requirements for tomorrow’s meeting.",
  //         },
  //       },
  //     }),
  //   });

  //   console.log(await res.json());
  // };
  const runOrchestrator = async () => {
    const res = await fetch("/api/orchestrator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent:
          "Fix a meeting tomorrow at 12 with Arjun and mail him the requirements",
        approved: true,
      }),
    });

    console.log(await res.json());
  };

  return (
    <main className="min-h-screen text-gray-700 bg-gray-100 flex flex-col items-center justify-center p-6">
      <Signin />
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-xl font-semibold">Email Agent</h1>

        {success && (
          <div className="animate-fade-in bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            ✨ Your email has been sent successfully
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Message Description
          </label>
          <textarea
            value={messageDescription}
            onChange={(e) => setMessageDescription(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2 resize-none"
          />
        </div>

        <button
          onClick={() => {
            fetchContact();
          }}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>
      <button
        onClick={runOrchestrator}
        className="px-4 py-3 border rounded m-4 cursor-pointer hover:scale-110 hover:bg-black hover:text-white transition-all"
      >
        Test Orchestrator
      </button>
    </main>
  );
}
