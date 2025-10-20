"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [message, setMessage] = useState("");

  // 取得登入使用者
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

  // 取得貼文
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("請先登入");

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, content: commentContent }),
      });
      const data = await res.json();
      if (data.id) {
        setPost({ ...post, comments: [...(post.comments || []), data] });
        setCommentContent("");
        setMessage("留言成功！");
      } else {
        setMessage(data.error || "留言失敗");
      }
    } catch (err) {
      console.error(err);
      setMessage("留言失敗，請稍後再試");
    }
  };

  if (!post) return <p>載入中...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>{post.title}</h2>
      <p><strong>類型：</strong>{post.category || "未知"}</p>
      <p>{post.content}</p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        作者：{post.user && post.user.name ? post.user.name : "匿名"} | {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h3>留言</h3>
      {(post.comments && post.comments.length > 0) ? (
        post.comments.map((c) => (
          <div key={c.id} style={{ borderTop: "1px solid #ccc", padding: "5px 0" }}>
            <p><strong>{c.user && c.user.name ? c.user.name : "匿名"}</strong>：{c.content}</p>
            <p style={{ fontSize: "12px", color: "#666" }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</p>
          </div>
        ))
      ) : (
        <p>尚無留言</p>
      )}

      {user && (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="輸入留言..."
            required
            style={{ marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "5px 10px", cursor: "pointer" }}>送出留言</button>
        </form>
      )}
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
