import { Router } from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserRole,
} from "../controllers/user.controler";

import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../middlewares/user_actions/auth";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/me", isAuthenticatedUser, getUserDetails);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

router.put("/password/update", isAuthenticatedUser, updatePassword);

router.put("/me/update", isAuthenticatedUser, updateProfile);

router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

const userRoutes = router;

export default userRoutes;
