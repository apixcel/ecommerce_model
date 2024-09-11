"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controler_1 = require("../controllers/user.controler");
const auth_1 = require("../middlewares/user_actions/auth");
const router = (0, express_1.Router)();
router.post("/register", user_controler_1.registerUser);
router.post("/login", user_controler_1.loginUser);
router.get("/logout", user_controler_1.logoutUser);
router.get("/me", auth_1.isAuthenticatedUser, user_controler_1.getUserDetails);
router.post("/password/forgot", user_controler_1.forgotPassword);
router.put("/password/reset/:token", user_controler_1.resetPassword);
router.put("/password/update", auth_1.isAuthenticatedUser, user_controler_1.updatePassword);
router.put("/me/update", auth_1.isAuthenticatedUser, user_controler_1.updateProfile);
router.get("/admin/users", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), user_controler_1.getAllUsers);
router
    .route("/admin/user/:id")
    .get(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), user_controler_1.getSingleUser)
    .put(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), user_controler_1.updateUserRole)
    .delete(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), user_controler_1.deleteUser);
const userRoutes = router;
exports.default = userRoutes;
