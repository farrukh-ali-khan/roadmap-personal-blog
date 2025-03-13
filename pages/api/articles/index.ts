import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataDir, "articles.json");

function readArticles(): Article[] {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading articles:", error);
    return [];
  }
}

function writeArticles(articles: Article[]) {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error("Error writing articles:", error);
    throw error;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const articles = readArticles();
      return res.status(200).json(articles);
    } else if (req.method === "POST") {
      const { title, content, date } = req.body;

      // Check that required fields are provided
      if (!title || !content || !date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const articles = readArticles();
      // Simple slugify: convert title to lowercase and replace spaces with dashes.
      const id = title.toLowerCase().replace(/\s+/g, "-");

      // Check for duplicate ID
      if (articles.some((article) => article.id === id)) {
        return res
          .status(409)
          .json({ message: "Article with this title already exists" });
      }

      const newArticle: Article = { id, title, content, date };
      articles.push(newArticle);
      writeArticles(articles);
      return res.status(201).json(newArticle);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
