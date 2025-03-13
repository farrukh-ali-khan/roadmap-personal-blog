import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const dataFilePath = path.join(process.cwd(), "data", "articles.json");

function readArticles(): Article[] {
  if (!fs.existsSync(dataFilePath)) return [];
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
}

function writeArticles(articles: Article[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(articles, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const articles = readArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Article not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json(articles[index]);
  } else if (req.method === "PUT") {
    const { title, content, date } = req.body;
    articles[index] = { id: articles[index].id, title, content, date };
    writeArticles(articles);
    return res.status(200).json(articles[index]);
  } else if (req.method === "DELETE") {
    articles.splice(index, 1);
    writeArticles(articles);
    return res.status(200).json({ message: "Article deleted" });
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
