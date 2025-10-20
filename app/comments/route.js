import { NextResponse } from "next/server";
import { readData, writeData } from "../../lib/fsUtils.js";

export async function GET() {
  try {
    const comments = await readData("comments.json");
    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req) {
  const { postId, content } = await req.json();
  if (!postId || !content) return NextResponse.json({ error: "欄位不足" }, { status: 400 });

  const users = await readData("users.json");
  const comments = await readData("comments.json");
  const user = users[0]; // 假設第一個登入者
  if (!user) return NextResponse.json({ error: "尚未登入" }, { status: 401 });

  const newComment = {
    id: comments.length + 1,
    postId,
    content,
    author: user.name,
    createdAt: new Date().toISOString(),
    reported: false
  };
  comments.push(newComment);
  await writeData("comments.json", comments);
  return NextResponse.json({ comment: newComment });
}
