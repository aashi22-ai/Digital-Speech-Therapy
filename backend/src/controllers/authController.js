const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { isValidEmail, isValidPassword } = require("../utils/validators");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are all required");
  }

  if (confirmPassword !== undefined && confirmPassword !== password) {
    res.status(400);
    throw new Error("Password verification failed: passwords do not match");
  }

  if (name.trim().length < 2) {
    res.status(400);
    throw new Error("Name must be at least 2 characters");
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  if (!isValidPassword(password)) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  res.status(201).json({
    user,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.comparePassword(password))) {
    // Deliberately vague — never confirm whether the email exists,
    // so this can't be used to enumerate registered accounts.
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user,
    token: generateToken(user._id),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, getMe };
