import { NextResponse } from "next/server";
import { readData } from "../../../lib/fsUtils.js";

export async function POST(req) {
  const { email, password } = await req.json();
  const users = await readData("users.json");

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }

  return NextResponse.json({ message: "登入成功", user });
}
