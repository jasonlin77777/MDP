import { NextResponse } from "next/server";
import { readData, writeData } from "../../../lib/fsUtils.js";

export async function PUT(req) {
  const { name, bio, avatar } = await req.json();

  const users = await readData("users.json");

  // 假設目前登入的是第一個使用者
  const user = users[0];
  if (!user) return NextResponse.json({ error: "尚未登入" }, { status: 401 });

  const index = users.findIndex(u => u.email === user.email);
  users[index] = { ...users[index], name, bio, avatar };
  await writeData("users.json", users);

  return NextResponse.json({ message: "更新成功", user: users[index] });
}
