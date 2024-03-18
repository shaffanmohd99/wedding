import { login } from "@/controllers/auth";
import connectToMongoDB from "@/lib/mongoose";
import User from "@/models/user";
import { compare } from "bcrypt";
import { SignJWT } from "jose";

// need to put the controller here, not sure why but if import it will cause a 405 method not allowed error
export default async function handler(req, res) {
  //create token
  const createToken = async (id) => {
    const key_env = process.env.SECRET_KEY;
    const key = new TextEncoder().encode(key_env);
    const jwt = await new SignJWT({ id })
      .setProtectedHeader({ alg: "HS256" }) // algorithm
      .setExpirationTime("30days")
      .sign(key);
    return jwt;
  };

  if (req.method === "POST") {
    try {
      await connectToMongoDB();
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        const isPasswordValid = await compare(password, user.password);
        if (isPasswordValid) {
          const token = await createToken(user._id);
          res.status(200).json({
            message: "successful login",
            data: {
              id: user.id,
              email: user.email,
              token,
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
