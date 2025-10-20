export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const bio = formData.get("bio");
    const avatar = formData.get("avatar");

    if (!name) return NextResponse.json({ error: "暱稱不能為空" }, { status: 400 });

    const users = await readData("users.json");
    const user = users[0]; // 假設第一個登入者
    if (!user) return NextResponse.json({ error: "尚未登入" }, { status: 401 });

    user.name = name;
    user.bio = bio;

    if (avatar && avatar.size > 0) {
      const filename = `/uploads/${Date.now()}-${avatar.name}`;
      await saveFile(avatar, `public${filename}`);
      user.avatar = filename;
    }

    await writeData("users.json", users);
    return NextResponse.json({ user });

  } catch (err) {
    console.error("更新個人資料失敗:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
