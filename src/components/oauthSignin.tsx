"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Signin() {
  const { data: session } = useSession();

  return (
    <main className="p-10 space-y-4">
      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Connect Gmail
        </button>
      ) : (
        <>
          <p>Connected as {session.user?.email}</p>

          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
