import { GetServerSideProps } from "next";
import { parse } from "cookie";
import fs from "fs";
import path from "path";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../../components/Header";

type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type EditArticleProps = {
  article: Article;
};

export default function EditArticle({ article }: EditArticleProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [date, setDate] = useState(article.date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/articles/${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, date }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Error updating article");
    }
  };

  return (
    <>
      <Head>
        <title>Edit Article | My Personal Blog</title>
      </Head>
      <Header isAdmin />
      <div className="container">
        <h2>Edit Article</h2>
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
          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const cookies = parse(context.req.headers.cookie || "");
  if (!cookies.auth || cookies.auth !== "true") {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
  const dataFilePath = path.join(process.cwd(), "data", "articles.json");
  let articles: Article[] = [];
  if (fs.existsSync(dataFilePath)) {
    articles = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  }
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return { notFound: true };
  }
  return { props: { article } };
};
