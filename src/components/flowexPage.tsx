"use client";

import { useState } from "react";
import Signin from "./oauthSignin";

type UIState =
  | "ASK_INTENT"
  | "ASK_MISSING"
  | "ASK_APPROVAL"
  | "EXECUTING"
  | "SUCCESS";

export default function FlowexPage() {
  const [uiState, setUIState] = useState<UIState>("ASK_INTENT");
  const [intent, setIntent] = useState("");
  const [issues, setIssues] = useState<any[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [userFixes, setUserFixes] = useState<any>({});

  const [agentState, setAgentState] = useState<any>(null);

  async function callOrchestrator(approved = false) {
    setUIState("EXECUTING");

    const res = await fetch("/api/orchestrator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent,
        approved,
        previousState: agentState,
        userInput: userFixes,
      }),
    });

    const data = await res.json();
    console.log("orchestrator response:", data);
    setResponse(data);

    // VERY IMPORTANT
    setAgentState(data.state || data.result);

    if (data.status === "needs_input") {
      setIssues(data.issues);
      setUIState("ASK_MISSING");
    } else if (data.status === "needs_approval") {
      setUIState("ASK_APPROVAL");
    } else if (data.status === "completed") {
      setUIState("SUCCESS");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">FLOWEX</h1>
            <p className="text-sm text-slate-500">
              Your intelligent workflow orchestrator
            </p>
          </div>
          <Signin />
        </header>

        {/* Agent Card */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Agent Console
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* ASK INTENT */}
            {uiState === "ASK_INTENT" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  What would you like me to do?
                </h3>

                <textarea
                  placeholder="e.g. Schedule a meeting tomorrow at 12 with Arjun and email him the requirements"
                  className="w-full min-h-[120px] rounded-xl border border-slate-300 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => callOrchestrator(false)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ASK MISSING */}
            {uiState === "ASK_MISSING" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    I need a bit more information
                  </h3>
                  <p className="text-sm text-slate-500">
                    Help me fill in the missing details to proceed.
                  </p>
                </div>

                <div className="space-y-4">
                  {issues.map((issue, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">
                        {issue.message}
                      </label>
                      <input
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        onChange={(e) =>
                          setUserFixes((prev: any) => ({
                            ...prev,
                            [issue.field]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      callOrchestrator(false);
                      setIssues([])
                      setUserFixes({});
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ASK APPROVAL */}
            {uiState === "ASK_APPROVAL" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Review & Approve
                  </h3>
                  <p className="text-sm text-slate-500">
                    Here’s what I’m about to do. Please confirm.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 text-slate-100 p-4 text-xs overflow-auto max-h-64">
                  <pre>
                    {response.preview?.context
                      ? JSON.stringify(response.preview.context, null, 2)
                      : ""}
                  </pre>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => callOrchestrator(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                  >
                    Approve & Execute ✓
                  </button>
                </div>
              </div>
            )}

            {/* EXECUTING */}
            {uiState === "EXECUTING" && (
              <div className="flex items-center gap-3 text-slate-600">
                <div className="h-3 w-3 rounded-full bg-indigo-600 animate-pulse" />
                <p className="text-sm italic">Working on it…</p>
              </div>
            )}

            {/* SUCCESS */}
            {uiState === "SUCCESS" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-700">
                  Task completed successfully 🎉
                </h3>

                <div className="rounded-xl bg-slate-100 p-4 text-xs overflow-auto max-h-64">
                  <pre>{JSON.stringify(response.result, null, 2)}</pre>
                </div>

                <p className="text-sm text-slate-500">
                  You can now continue with another task or review the results.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
