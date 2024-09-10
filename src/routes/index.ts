import express from "express";
import authRoute from "./auth.route";
import planRoute from "./plan.route";
import premiumRoutes from "./premium.route";
import subscriptionRoute from "./subscription.route";
import userRoute from "./user.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/subscription",
    route: subscriptionRoute,
  },
  {
    path: "/premium",
    route: premiumRoutes,
  },

  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/plan",
    route: planRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
