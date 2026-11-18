import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

const registerUser = async (userData: RegisterUserData) => {
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

const loginUser = async (email: string, password: string) => {
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

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
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

const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserProfile = async (
  userId: string,
  profileData: { fullName: string; phone: string }
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      fullName: profileData.fullName,
      phone: profileData.phone,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};