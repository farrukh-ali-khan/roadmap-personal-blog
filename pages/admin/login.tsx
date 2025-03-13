// pages/admin/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Header from "../../components/Header";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | My Personal Blog</title>
      </Head>
      {/* Render Header with isAdmin false so that "Login" is shown */}
      <Header isAdmin={false} />
      <main className="container">
        <div className="login-form-wrapper">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} My Personal Blog. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

// Redirect if already logged in
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parse(context.req.headers.cookie || "");
  if (cookies.auth && cookies.auth === "true") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
