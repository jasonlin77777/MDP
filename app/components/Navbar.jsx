"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ onNewPost }) {
  const [user, setUser] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("搖滾");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const categories = ["搖滾", "古典", "KPOP", "JPOP", "國語歌", "台語歌", "英文歌"];

  // 取得使用者
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, user }),
      });
      const data = await res.json();
      if (data.id) {
        onNewPost(data);
        setTitle("");
        setContent("");
        setCategory("搖滾");
        setMessage("發文成功！");
        setShowPostForm(false);
      } else {
        setMessage(data.error || "發文失敗");
      }
    } catch (err) {
      console.error(err);
      setMessage("發文失敗，請稍後再試");
    }
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* 左側導航 */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link href="/"><span style={{ cursor: "pointer", color: "#fff" }}>首頁</span></Link>
        {user && <Link href="/profile/edit"><span style={{ cursor: "pointer", color: "#fff" }}>修改個人資料</span></Link>}
      </div>

      {/* 右側區塊 */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
        {user && (
          <>
            <span>{user.name}</span>
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              style={{ padding: "5px 10px", cursor: "pointer" }}
            >
              發文
            </button>
            {showPostForm && (
              <div style={{
                position: "absolute",
                top: "50px",
                right: "0",
                backgroundColor: "#fff",
                color: "#000",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                zIndex: 1000,
                width: "300px"
              }}>
                <h4>發表新貼文</h4>
                <form onSubmit={handlePostSubmit} style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="標題"
                    required
                    style={{ marginBottom: "10px" }}
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="內容"
                    required
                    style={{ marginBottom: "10px" }}
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ marginBottom: "10px" }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button type="submit" style={{ padding: "5px 10px", cursor: "pointer" }}>發文</button>
                  {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
                </form>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{ backgroundColor: "#f00", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}
            >
              登出
            </button>
          </>
        )}
        {!user && (
          <>
            <Link href="/login"><button style={{ padding: "5px 10px", cursor: "pointer" }}>登入</button></Link>
            <Link href="/register"><button style={{ padding: "5px 10px", cursor: "pointer" }}>註冊</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
