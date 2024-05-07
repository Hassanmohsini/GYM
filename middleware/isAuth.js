import asyncHandler from "../config/asyncHandler.js";
import colors from "colors";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;
const isAuth = asyncHandler(async (req, res, next) => {
  // extract the token from the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401);
    throw new Error("Not Authenticated");
  }

  const token = authHeader.split(" ")[1];
  //   console.log("token", token.red);
  if (token) {
    try {
      // verify the token
      const payload = jwt.verify(token, JWT_SECRET);
      console.log("payload", payload);
      // how to send the userId in the payload into the next middleware?
      // next(payload.userId) is wrong...
      req.user = { userId: payload.userId, role: payload.role };

      // if successful we go to the next middleware
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});
export { isAuth };
