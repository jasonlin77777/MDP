import { NextResponse } from "next/server";
import { readData, writeData } from "../../../lib/fsUtils.js";

export async function POST(req) {
  const { commentId } = await req.json();
  const comments = await readData("comments.json");
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) return NextResponse.json({ error: "找不到評論" }, { status: 404 });

  comments[index].reported = true;
  await writeData("comments.json", comments);
  return NextResponse.json({ message: "已檢舉該留言" });
}
