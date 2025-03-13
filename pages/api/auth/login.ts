import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In production, use a proper JWT or session management
      res.setHeader(
        "Set-Cookie",
        serialize("auth", "true", {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day
        })
      );
      return res.status(200).json({ message: "Logged in" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
