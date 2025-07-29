const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    const token = authService.generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const token = authService.generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.requestPasswordReset = async (req, res) => {
  try {
    await authService.sendResetCode(req.body.email);
    res.status(200).json({ message: "Reset code sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send reset code", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetCode, newPassword } = req.body;
    await authService.resetUserPassword(resetCode, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ valid: false, message: "No token in cookie" });

    const user = await authService.validateToken(token);
    res.status(200).json({
      valid: true,
      user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(401).json({ valid: false, message: error.message });
  }
};
