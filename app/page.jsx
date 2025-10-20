"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("全部");

  const categories = ["全部", "搖滾", "古典", "KPOP", "JPOP", "國語歌", "台語歌", "英文歌"];

  // 讀取貼文
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data || []);
      } catch (err) {
        console.error("取得貼文失敗", err);
      }
    };
    fetchPosts();
  }, []);

  // 過濾貼文
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filterCategory === "全部" || post.category === filterCategory;
    const matchesSearch =
      post.title.includes(search) ||
      post.content.includes(search) ||
      post.user.name.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      {/* 搜尋 & 分類 */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="搜尋關鍵字..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: "5px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 貼文列表 */}
      <h2>貼文列表</h2>
      {filteredPosts.length === 0 ? (
        <p>沒有符合條件的貼文</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>
              <Link href={`/posts/${post.id}`} style={{ color: "#0070f3", textDecoration: "underline" }}>
                {post.title}
              </Link>
            </h3>
            <p><strong>類型：</strong>{post.category}</p>
            <p>{post.content}</p>
            <p style={{ fontSize: "12px", color: "#666" }}>
              作者：{post.user.name} | {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
