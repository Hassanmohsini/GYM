import asyncHandler from "../config/asyncHandler.js";

export const isTrainer = asyncHandler((req, res, next) => {
  if (req.user.role !== "trainer") {
    res.status(403);
    throw new Error("access denied");
  }
  next();
});