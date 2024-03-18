import { login } from "@/controllers/auth";
import connectToMongoDB from "@/lib/mongoose";
import User from "@/models/user";
import { compare } from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToMongoDB();
      const { email, password } = req.body;
      console.log("🚀 ~ login ~ email:", req.body);

      const user = await User.findOne({ email });
      console.log("🚀 ~ login ~ user:", user);

      if (user) {
        const isPasswordValid = await compare(password, user.password);
        if (isPasswordValid) {
          // const token = await createToken(user._id);
          res.status(200).json({
            message: "successful login",
            data: {
              id: user.id,
              email: user.email,
              // token,
            },
          });
        }
        throw error("Incorrect password/email");
      }
      throw error("Incorrect password/email");
    } catch (err) {
      const errors = handleError(err);
      res.status(500).json({ errors });
    }
  }
}
