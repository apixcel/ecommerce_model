import cookieParser from "cookie-parser"; // Import cookie-parser
import cors from "cors";
import express, { Application } from "express";
import http from "http";
import Stripe from "stripe";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/error";
import routes from "./routes/index";

export const stripe = new Stripe(process.env.STRIPE_KEY as string);

const app: Application = express();

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// Connect to Database
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/", routes);
app.use(errorMiddleware);

// Create server
const server = http.createServer(app);

// Start server
const port: any = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(
    `App is running on port: ${port}. Run with http://localhost:${port}`
  );
});
