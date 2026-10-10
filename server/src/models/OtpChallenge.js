const mongoose = require("mongoose");

const OtpChallenge = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["signup", "password-reset"],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    passwordHash: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("OtpChallenge", OtpChallenge);