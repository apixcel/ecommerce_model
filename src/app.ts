import cors from "cors";
import express, { Application } from "express";
import http from "http";
// import morgan from "morgan";
import connectDB from "./config/db";

import Stripe from "stripe";
import { SubscriptionSeed } from "./helper/subscription";
import errorMiddleware from "./middlewares/error";
import { notFound } from "./middlewares/not-found";
import User from "./models/user.model";
import routes from "./routes/index";
export const stripe = new Stripe(process.env.STRIPE_KEY as string);
const app: Application = express();

app.use(
  cors({
    origin: "*",
  })
);
// app.use(morgan("dev"));

// Connect to Database
connectDB();
SubscriptionSeed();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
app.get("/", async (req, res) => {
  const user = await User.findOne({
    auth: "66d2b848c8b59b16c5ee89dd",
  }).populate({
    path: "subscription",
    populate: {
      path: "plan",
      model: "Plan",
    },
  });

  res.json(user);
});

app.use("/api/v1/", routes);

// Middleware for Errors
app.use(errorMiddleware);

//handle not found
app.use(notFound);

const port: any = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `App is running on port: ${port}. Run with http://localhost:${port}`
  );
});
