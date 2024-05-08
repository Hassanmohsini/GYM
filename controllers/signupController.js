import User from "../models/user.model.js";
import asyncHandler from "../config/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import VerificationToken from "../models/verificationToken.js";

const { JWT_SECRET } = process.env;
const { PORT } = process.env;

const signup = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create a verification token
    const token = crypto.randomUUID();
    const verificationToken = await VerificationToken.create({
      userId: newUser._id,
      token,
    });

    // Send a verification email
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["danialikhani@gmail.com"],
      subject: "Please verify your account",
      html: `<h1>Hello ${username}</h1>
      <p>Click on the following link to verify your account: 
      <a href="http://localhost:${PORT}/verify/${token}">http://localhost:${PORT}/verify/${token}</a>
      </p>`,
    });

    // Send the response
    res
      .status(200)
      .json({
        message: "Signup successful. Please check your email for verification.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const verifyToken = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    // Find the verification token in the database
    const verificationToken = await VerificationToken.findOne({ token });
    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    console.log(verificationToken)

    // Mark the user as verified
    await User.findByIdAndUpdate(verificationToken.userId, {
      $set: { verified: true },
    });

    // Delete the verification token from the database
    await VerificationToken.findByIdAndDelete(verificationToken._id);

    // Send the response
    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// const login = asyncHandler(async (req, res) => {
//   // handle the req.body username and password
//   const { username, email, password } = req.body;
//   console.log(req.body);
//   // check if the user document exists
//   const user = await User.findOne({ username, email });
//   console.log(user);
//   // check/verify that the password provided is correct, by comparing it with the hashed one
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (user && isPasswordValid) {
//     // create jwt signature
//     const accessToken = jwt.sign(
//       {
//         userId: user._id,
//         role: user.role,
//       },
//       JWT_SECRET
//     );
//     // send a response with jwt and message "login successful"
//     res.status(200).json({ message: "login successful.", accessToken });
//   } else {
//     // res.status(401).json({message: "login failed"})
//     res.status(401);
//     throw new Error("login failed");
//   }
// });

const login = asyncHandler(async (req, res) => {
  // handle the req.body username and password
  const { username, email, password } = req.body;
  console.log(req.body);

  // check if the user document exists
  const user = await User.findOne({ username, email });
  console.log(user);

  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  // check/verify that the password provided is correct, by comparing it with the hashed one
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    // create jwt signature
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Optional: Set token expiry as needed
    );

    // Set token as a cookie
    res.cookie("token", accessToken, {
      httpOnly: true, // The cookie cannot be accessed by client-side JS
      secure: process.env.NODE_ENV === "production", // On production, set cookies over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // cookie will be removed after 24 hours
    });

    // send a response with jwt and message "login successful"
    res.status(200).json({ message: "Login successful.", accessToken });
  } else {
    // If login fails
    res.status(401);
    throw new Error("Login failed due to invalid credentials");
  }
});

const getProtected = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  // search for a user with the userId
  const user = await User.findById(userId);
  // send response (200) with the user info
  res.status(200).json({ data: user });
});

export { signup, login, verifyToken, getProtected };
