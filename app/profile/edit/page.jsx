"use client";
import { useState, useEffect } from "react";

export default function ProfileEditPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // 取得目前登入使用者
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setBio(data.user.bio);
        }
      } catch (err) {
        console.error("取得使用者資料失敗", err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // 使用 JSON 傳送，不再傳 FormData
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setMessage("更新成功！");
      } else if (data.error) {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("更新失敗，請稍後再試");
    }
  };

  if (!user) return <p>載入中...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>編輯個人資料</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>暱稱</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: "10px" }}
        />
        <label>簡介</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "5px 10px", cursor: "pointer" }}
        >
          更新
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
