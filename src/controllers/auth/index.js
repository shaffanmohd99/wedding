import connectToMongoDB from "@/lib/mongoose";
import User from "@/models/user";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import mongoose from "mongoose";

const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //duplication error code
  if (err.code === 11000) {
    errors.email = "Email has been registered";
  }

  //   validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//create token
const maxAge = 7 * 24 * 60 * 60;

const createToken = async (id) => {
  const key = new TextEncoder().encode("yebaebdbaue");
  const jwt = await new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" }) // algorithm
    .setExpirationTime("30days")
    .sign(key);
  return jwt;
};

export const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectToMongoDB();
    const user = await User.create({ email, password });
    const token = await createToken(user._id);
    res.status(200).json({
      message: "successful signup",
      data: {
        id: user.id,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    const errors = handleError(err);
    res.status(500).json({ errors });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await connectToMongoDB();
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
};
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      message: "successful logout",
    });
  } catch (err) {
    const errors = handleError(err);
    res.status(500).json({ errors });
  }
};
