import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import { findContactByName } from "@/src/lib/tools/peopleTool";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!(session as any)?.accessToken) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { name } = await req.json();

  const contact = await findContactByName({
    accessToken: (session as any).accessToken,
    name,
  });

  if (!contact) {
    return NextResponse.json({
      status: "not_found",
      message: "No contact found",
    });
  }

  return NextResponse.json({
    status: "found",
    contact,
  });
}
