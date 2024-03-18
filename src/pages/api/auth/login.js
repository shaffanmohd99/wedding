import { login } from "@/controllers/auth";

export default async function handler(req, res) {
  return login(req, res);
}
