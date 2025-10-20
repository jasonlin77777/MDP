import { NextResponse } from "next/server";
import { readData, writeData } from "../../../lib/fsUtils.js";

export async function POST(req) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "所有欄位皆必填" }, { status: 400 });
  }

  const users = await readData("users.json");

  if (users.find((u) => u.email === email)) {
    return NextResponse.json({ error: "帳號已存在" }, { status: 400 });
  }

  const newUser = { id: users.length + 1, email, password, name };
  users.push(newUser);
  await writeData("users.json", users);

  return NextResponse.json({ message: "註冊成功", user: newUser });
}
