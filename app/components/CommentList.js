"use client";
import styles from "../styles/CommentList.module.css";

export default function CommentList({ comments }) {
  const reportComment = async (id) => {
    await fetch("/api/reports", { method: "POST", body: JSON.stringify({ type: "comment", targetId: id, reason: "不當留言", reporter: "TestUser" }), headers: { "Content-Type": "application/json" } });
    alert("已檢舉留言");
  };

  return (
    <div className={styles.container}>
      {comments.map(c => (
        <div key={c.id} className={styles.comment}>
          <b>{c.author}:</b> {c.content}
          <button onClick={() => reportComment(c.id)} style={{ marginLeft: "10px" }}>檢舉</button>
        </div>
      ))}
    </div>
  );
}
