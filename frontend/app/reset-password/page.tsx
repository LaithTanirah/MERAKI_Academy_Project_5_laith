"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      setMsg("Please enter the password and confirm it");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }
    if (!token) {
      setMsg("The link is invalid or has expired.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Password has been successfully reset. You will be redirected to the login page.");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setMsg(data.error || "An error occurred!");
      }
    } catch (err) {
      setMsg("An error occurred while resetting the password");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <button disabled={loading} style={{ width: "100%" }}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {msg && <div style={{ marginTop: 12, color: "red" }}>{msg}</div>}
    </div>
  );
}
