import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the auth cookie
  res.setHeader(
    "Set-Cookie",
    serialize("auth", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
  );

  // Redirect to the home page with a logout message
  res.writeHead(302, { Location: "/?message=Logged+out" });
  res.end();
}
