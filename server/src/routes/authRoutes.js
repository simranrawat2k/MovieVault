const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const createOtpChallenge = require("../services/otpService");
const OtpChallenge = require("../models/OtpChallenge");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const hashOtp = require("../utils/hashOtp");
const generateOtp = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check if phone already exists
    const phoneUser = await User.findOne({ phone });

    if (phoneUser) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and send otp
    const otp = await createOtpChallenge(name, email, phone, hashedPassword);

    console.log("Generated OTP:", otp);

    return res.status(201).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

//Verify-email and create user
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const getOtp = await OtpChallenge.findOne({
      email,
      purpose: "signup",
      consumedAt: null,
    });

    if (!getOtp) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    // Check if OTP has expired
    if (new Date() > getOtp.expiresAt) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Check maximum attempts
    if (getOtp.attempts >= 5) {
      return res.status(400).json({
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    // Compare entered OTP with stored hash
    const isOtpValid = await bcrypt.compare(otp, getOtp.codeHash);

    if (!isOtpValid) {
      getOtp.attempts += 1;
      await getOtp.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Create user only after successful OTP verification
    const newUser = new User({
      name: getOtp.name,
      email: getOtp.email,
      phone: getOtp.phone,
      passwordHash: getOtp.passwordHash,
      emailVerified: true,
    });

    await newUser.save();

    // Mark OTP as consumed
    getOtp.consumedAt = new Date();
    await getOtp.save();

    return res.status(200).json({
      message: "Email verified and account created successfully",
    });
  } catch (err) {
    console.error("Email verification error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find the latest active signup OTP
    const existingOtp = await OtpChallenge.findOne({
      email,
      purpose: "signup",
      consumedAt: null,
    }).sort({ createdAt: -1 });

    if (!existingOtp) {
      return res.status(400).json({
        message: "No active OTP found",
      });
    }

    // Prevent resend within 60 seconds
    const secondsPassed = (Date.now() - existingOtp.createdAt.getTime()) / 1000;

    if (secondsPassed < 60) {
      return res.status(400).json({
        message: `Please wait before requesting a new OTP`,
      });
    }

    // Invalidate old OTP
    existingOtp.consumedAt = new Date();
    await existingOtp.save();

    // Create a new OTP
    const otp = await createOtpChallenge(
      existingOtp.name,
      existingOtp.email,
      existingOtp.phone,
      existingOtp.passwordHash,
    );

    console.log("New OTP:", otp);

    return res.status(200).json({
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const codeHash = await hashOtp(otp);

    await OtpChallenge.create({
      email: user.email,
      codeHash,
      purpose: "password-reset",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(user.email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OtpChallenge.findOne({
      email: normalizedEmail,
      purpose: "password-reset",
      consumedAt: null,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found or already used",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Request a new OTP",
      });
    }

    const isOtpCorrect = await bcrypt.compare(
      String(otp),
      otpRecord.codeHash
    );

    if (!isOtpCorrect) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
