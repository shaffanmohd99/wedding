import { login } from "@/controllers/auth";
import connectToMongoDB from "@/lib/mongoose";
import User from "@/models/user";
import { compare } from "bcrypt";

export default async function handler(req, res) {
  return login(req, res);
}
