"use client";
import { useState } from "react";

export default function PostForm({ user, onNewPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("搖滾");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
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
        onNewPost(data); // 讓父元件更新貼文列表
        setTitle("");
        setContent("");
        setCategory("搖滾");
        setMessage("發文成功！");
      } else {
        setMessage(data.error || "發文失敗");
      }
    } catch (err) {
      console.error(err);
      setMessage("發文失敗，請稍後再試");
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>發表新貼文</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>標題</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ marginBottom: "10px" }} />
        <label>內容</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required style={{ marginBottom: "10px" }} />
        <label>音樂類型</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginBottom: "10px" }}>
          <option>搖滾</option>
          <option>古典</option>
          <option>KPOP</option>
          <option>JPOP</option>
          <option>國語歌</option>
          <option>台語歌</option>
          <option>英文歌</option>
        </select>
        <button type="submit" style={{ padding: "5px 10px", cursor: "pointer" }}>發文</button>
      </form>
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
