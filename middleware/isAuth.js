import asyncHandler from "../config/asyncHandler.js";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const isAuth = asyncHandler(async (req, res, next) => {
  // Extract the token from the cookie
  const token = req.cookies.token;  

  if (!token) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  try {
    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("payload", payload);

    // Attach user details to the request object
    req.user = { userId: payload.userId, role: payload.role };

    // Proceed to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: "Not Authorized, invalid token" });
  }
});

export { isAuth };
