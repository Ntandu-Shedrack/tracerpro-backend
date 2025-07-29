const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Token verification middleware
router.get("/validate-token", authController.validateToken);

// Route for user registration
router.post("/register", authController.register);

// Route for user login
router.post("/login", authController.login);

// Route for user logout
router.post("/logout", authController.logout);

// Route for initiating password reset
router.post("/forgot-password", authController.requestPasswordReset);

// Route for resetting the password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
