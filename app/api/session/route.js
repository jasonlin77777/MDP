import { readData } from "../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await readData("session.json");
    if (session.length > 0) return NextResponse.json({ user: session[0] });
    return NextResponse.json({ user: null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
