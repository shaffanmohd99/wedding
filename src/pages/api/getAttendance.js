// pages/api/getAttendance.js

import { getAttendance } from "@/controllers/attendance";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAttendance(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}
