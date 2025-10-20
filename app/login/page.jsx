"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.user) router.push("/");
    else setError(data.error);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>登入</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: "10px" }} />
        <label>密碼</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: "10px" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "5px 10px", cursor: "pointer" }}>登入</button>
      </form>
    </div>
  );
}
