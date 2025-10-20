import { writeData } from "../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function POST() {
  await writeData("session.json", []);
  return NextResponse.json({ message: "已登出" });
}
