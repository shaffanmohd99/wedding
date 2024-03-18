import { signUp } from "@/controllers/auth";

export default async function handler(req, res) {
  return signUp(req, res);
}
