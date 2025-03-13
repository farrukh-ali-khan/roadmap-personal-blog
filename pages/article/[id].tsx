import { GetServerSideProps } from "next";
import fs from "fs";
import path from "path";
import Head from "next/head";
import Header from "../../components/Header";

type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type ArticleProps = {
  article: Article | null;
};

export default function ArticlePage({ article }: ArticleProps) {
  if (!article) {
    return (
      <>
        <Head>
          <title>Article Not Found | My Personal Blog</title>
        </Head>
        <Header />
        <main className="container">
          <h1>Article Not Found</h1>
          <p>The article you are looking for does not exist.</p>
          <button
            className="read-more"
            onClick={() => window.location.assign("/")}
          >
            ← Back to Home
          </button>
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

  return (
    <>
      <Head>
        <title>{article.title} | My Personal Blog</title>
        <meta name="description" content={article.content.slice(0, 150)} />
      </Head>
      <Header />
      <main className="container article-container">
        <article>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-date">
            Published on: {new Date(article.date).toLocaleDateString()}
          </p>
          <div className="article-content">
            {article.content.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </article>
        <button
          className="read-more"
          onClick={() => window.location.assign("/")}
        >
          ← Back to Home
        </button>
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
  const { id } = context.params!;
  const dataFilePath = path.join(process.cwd(), "data", "articles.json");
  let articles: Article[] = [];
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, "utf8");
    articles = JSON.parse(data);
  }
  const article = articles.find((a) => a.id === id) || null;
  return {
    props: { article },
  };
};
