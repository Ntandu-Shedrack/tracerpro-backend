const { User, PasswordReset } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

const registerUser = async (userData) => {
  const { email } = userData;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  return await User.create(userData);
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};

const sendResetCode = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const resetCode = crypto.randomInt(10000, 99999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordReset.destroy({ where: { email } });
  await PasswordReset.create({ email, code: resetCode, expiresAt });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Code",
    html: `<p>Your password reset code is <strong>${resetCode}</strong>. It will expire in 15 minutes.</p>`,
  });
};

const resetUserPassword = async (resetCode, newPassword) => {
  const resetRequest = await PasswordReset.findOne({
    where: { code: resetCode },
  });
  if (!resetRequest) throw new Error("Invalid reset code");

  if (new Date() > resetRequest.expiresAt) {
    await resetRequest.destroy();
    throw new Error("Reset code has expired");
  }

  const user = await User.findOne({ where: { email: resetRequest.email } });
  if (!user) throw new Error("User not found");

  await user.update({ password: newPassword });
  await resetRequest.destroy();
};

const validateToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error("Invalid token or user not found");

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  sendResetCode,
  resetUserPassword,
  validateToken,
  generateToken,
};
