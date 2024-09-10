import { Router } from "express";
import { specialContent } from "../controllers/premium.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
import { validSubscriptionHolder } from "../middlewares/checkSubscription";
const router = Router();
router.get(
  "/basic",
  isAuthenticatedUser,
  validSubscriptionHolder("Basic Plan"),
  specialContent
);

const premiumRoutes = router;

export default premiumRoutes;
