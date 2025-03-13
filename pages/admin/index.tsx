import Head from "next/head";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import fs from "fs";
import path from "path";
import { useRouter } from "next/router";
import Header from "../../components/Header";

type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type AdminProps = {
  articles: Article[];
};

export default function AdminDashboard({ articles }: AdminProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.reload();
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard | My Personal Blog</title>
      </Head>
      <Header isAdmin />
      <div className="admin-container">
        <div className="admin-sidebar">
          <h2>Articles</h2>
          <ul className="admin-article-list">
            {articles.map((article) => (
              <li key={article.id}>
                {article.title} ({article.date})
                <div className="action-links">
                  <button
                    onClick={() => router.push(`/admin/edit/${article.id}`)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(article.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-content">
          <h2>Dashboard</h2>
          <button
            className="add-button"
            onClick={() => router.push("/admin/new")}
          >
            + Add
          </button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
  return { props: { articles } };
};
