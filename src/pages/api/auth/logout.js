import { logout } from "@/controllers/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return logout(req, res);
  }
}
