import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import connectDB from "./lib/connectDB";
import corsOptions from "./lib/corsOptions";
// import userRouter from './routes/userRouter'

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true}));

app.get("/", (req, res) => {
  res.json({message: "API Working!"});
});

// app.use('/api/v1', userRouter)

mongoose.connection.once("open", () => {
  console.log("Database connection successful!");

  app.listen(PORT, () => {
    console.log(`Application running on http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
