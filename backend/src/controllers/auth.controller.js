import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  let { fullName, email, password } = req.body;

  fullName = fullName ? fullName.trim() : "";
  email = email ? email.trim().toLowerCase() : "";
  password = password ? password.trim() : "";

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if the length of password is less than minLength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters!" });
    }

    // Check if user with the same email exists in database
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      if (savedUser) {
        // generate jwt token here
        generateToken(savedUser._id, res);
        res.status(201).json({
          _id: savedUser._id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          profilePic: savedUser.profilePic,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;

  email = email ? email.trim().toLowerCase() : "";
  password = password ? password.trim() : "";

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.send("logout route");
};
