import express from "express";
import colors from "colors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const { PORT, NODE_ENV } = process.env;

await connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `:::`.green, `server is listening on`.yellow,
    `http://localhost:${PORT}`.underline.green.bold
  );
});
