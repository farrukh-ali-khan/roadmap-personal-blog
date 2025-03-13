import Head from "next/head";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Header from "../components/Header";

type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type HomeProps = {
  articles: Article[];
  message?: string;
  loggedIn: boolean;
};

export default function Home({ articles, message, loggedIn }: HomeProps) {
  return (
    <>
      <Head>
        <title>My Personal Blog</title>
        <meta name="description" content="Welcome to my personal blog." />
      </Head>
      {/* Pass the loggedIn prop to the Header */}
      <Header isAdmin={loggedIn} />
      <main className="container">
        {message && (
          <p style={{ textAlign: "center", color: "green" }}>{message}</p>
        )}
        <section className="articles-list">
          {articles.length ? (
            articles.map((article) => (
              <article key={article.id} className="article-card">
                <h2>{article.title}</h2>
                <p className="article-date">
                  {new Date(article.date).toLocaleDateString()}
                </p>
                <p className="article-excerpt">
                  {article.content.length > 100
                    ? article.content.slice(0, 100) + "..."
                    : article.content}
                </p>
                <button
                  className="read-more"
                  onClick={() =>
                    window.location.assign(`/article/${article.id}`)
                  }
                >
                  Read More
                </button>
              </article>
            ))
          ) : (
            <p>No articles published yet.</p>
          )}
        </section>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const dataFilePath = path.join(process.cwd(), "data", "articles.json");
  let articles: Article[] = [];
  if (fs.existsSync(dataFilePath)) {
    articles = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  }
  // Parse cookies from the request header
  const cookies = parse(context.req.headers.cookie || "");
  const loggedIn = cookies.auth === "true";

  // Pass any message from the query (e.g., from logout redirection)
  const { message } = context.query;
  return {
    props: {
      articles,
      message: message ? String(message) : null,
      loggedIn,
    },
  };
};
