import { readData, writeData } from "../../lib/fsUtils.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData(); // 支援檔案上傳
    const name = formData.get("name");
    const bio = formData.get("bio");
    const avatarFile = formData.get("avatar"); // File

    // 讀取使用者
    const session = await readData("session.json");
    if (session.length === 0) return NextResponse.json({ error: "尚未登入" }, { status: 401 });

    const user = session[0];

    // 處理 avatar 檔案
    let avatarPath = user.avatar || "";
    if (avatarFile && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const fs = require("fs");
      const uploadPath = `./public/uploads/avatar-${Date.now()}.png`;
      fs.writeFileSync(uploadPath, buffer);
      avatarPath = uploadPath.replace("./public", ""); // 用於前端顯示
    }

    // 更新使用者資料
    const updatedUser = { ...user, name, bio, avatar: avatarPath };

    // 更新 session.json
    await writeData("session.json", [updatedUser]);

    // 同步更新 users.json
    const users = await readData("users.json");
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) users[idx] = updatedUser;
    await writeData("users.json", users);

    return NextResponse.json({ user: updatedUser }); // 一定回 JSON
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
}
