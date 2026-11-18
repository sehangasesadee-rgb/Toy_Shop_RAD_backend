const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (userData) => {
  const existingUser = await User.findOne({
    email: userData.email,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = new User({
    fullName: userData.fullName,
    email: userData.email,
    password: hashedPassword,
    phone: userData.phone,
  });

  return await user.save();
};


const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user._id,
      role: user.role,
     },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};