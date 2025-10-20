import { readData, writeData } from "../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, password } = await req.json();
  const users = await readData("users.json");

  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: "Email 已存在" }, { status: 400 });
  }

  const newUser = { id: Date.now(), name, email, password, bio: "", avatar: "" };
  users.push(newUser);
  await writeData("users.json", users);
  await writeData("session.json", [newUser]); // 註冊後自動登入
  return NextResponse.json({ user: newUser });
}
