import { readData, writeData } from "../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await readData("posts.json");
    return NextResponse.json(posts || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const { title, content, category, user } = await req.json();

    if (!user) return NextResponse.json({ error: "尚未登入" }, { status: 401 });

    const posts = await readData("posts.json");
    const newPost = {
      id: Date.now(),
      title,
      content,
      category,
      user,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    posts.push(newPost);
    await writeData("posts.json", posts);

    return NextResponse.json(newPost);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "發文失敗" }, { status: 500 });
  }
}
