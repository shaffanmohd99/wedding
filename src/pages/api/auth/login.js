import { login } from "@/controllers/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return login(req, res);
  }
}
