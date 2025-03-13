import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function NewArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, date }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Error creating article");
    }
  };

  return (
    <>
      <Head>
        <title>New Article | My Personal Blog</title>
      </Head>
      <Header isAdmin />
      <div className="container">
        <h2>New Article</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Article Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Publishing Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
          <button type="submit">Publish</button>
        </form>
      </div>
    </>
  );
}
