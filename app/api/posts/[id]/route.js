import { readData, writeData } from "../../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const posts = await readData("posts.json");
    // 從 URL 取得 id
    const urlParts = req.nextUrl.pathname.split("/");
    const id = urlParts[urlParts.length - 1];

    const post = posts.find((p) => p.id.toString() === id.toString());
    if (!post) return NextResponse.json({ error: "找不到貼文" }, { status: 404 });

    return NextResponse.json(post);
  } catch (err) {
    console.error("取得貼文失敗:", err);
    return NextResponse.json({ error: "取得貼文失敗" }, { status: 500 });
  }
}

// 新增留言
export async function POST(req) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const id = urlParts[urlParts.length - 1];

    const { user, content } = await req.json();
    if (!user) return NextResponse.json({ error: "尚未登入" }, { status: 401 });

    const posts = await readData("posts.json");
    const postIndex = posts.findIndex((p) => p.id.toString() === id.toString());
    if (postIndex === -1) return NextResponse.json({ error: "貼文不存在" }, { status: 404 });

    const comment = {
      id: Date.now(),
      user,
      content,
      createdAt: new Date().toISOString(),
    };

    posts[postIndex].comments.push(comment);
    await writeData("posts.json", posts);

    return NextResponse.json(comment);
  } catch (err) {
    console.error("新增留言失敗:", err);
    return NextResponse.json({ error: "新增留言失敗" }, { status: 500 });
  }
}
