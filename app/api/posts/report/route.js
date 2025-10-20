import { NextResponse } from "next/server";
import { readData, writeData } from "../../../lib/fsUtils.js";

export async function POST(req) {
  const { postId } = await req.json();
  const posts = await readData("posts.json");

  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return NextResponse.json({ error: "找不到貼文" }, { status: 404 });

  posts[index].reported = true;
  await writeData("posts.json", posts);

  return NextResponse.json({ message: "已檢舉該貼文" });
}
