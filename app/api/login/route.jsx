import { readData, writeData } from "../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();
  const users = await readData("users.json");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await writeData("session.json", [user]);
  return NextResponse.json({ user });
}
