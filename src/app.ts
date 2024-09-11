import cors from "cors";
import express, { Application } from "express";
import http from "http";
// import morgan from "morgan";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/error";
import routes from "./routes/index";
const app: Application = express();

app.use(
  cors({
    origin: "*",
  })
);
// app.use(morgan("dev"));

// Connect to Database
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use("/api/v1/", routes);

// Middleware for Errors
app.use(errorMiddleware);

//handle not found

const port: any = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `App is running on port: ${port}. Run with http://localhost:${port}`
  );
});
