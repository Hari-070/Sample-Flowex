"use client";

import { useState } from "react";

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

    const data = await res.json();

    if (data.status === "sent") {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen text-gray-700 bg-gray-100 flex items-center justify-center p-6">
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
          onClick={send}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>
    </main>
  );
}
