import { logout } from "@/controllers/auth";

export default async function handler(req, res) {
  return logout(req, res);
}
