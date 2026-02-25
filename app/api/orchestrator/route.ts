import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import { orchestrate } from "@/src/orchestrator";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!(session as any)?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  console.log("SESSION TOKEN:", (session as any)?.accessToken);

  const response = await orchestrate({
    ...body,
    accessToken: (session as any).accessToken,
  });

  return NextResponse.json(response);
}
