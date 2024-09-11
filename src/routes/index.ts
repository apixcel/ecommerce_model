import { Router } from "express";
import userRoutes from "./user.route";

const router = Router();

const moduleRoute = [
  {
    path: "/user",
    route: userRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
