const OtpChallenge = require("../models/OtpChallenge");
const hashOtp = require("../utils/hashOtp");
const generateOtp = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

const createOtpChallenge = async (name, email, phone, passwordHash) => {
  try {
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpInfo = new OtpChallenge({
      name,
      email,
      phone,
      passwordHash,
      codeHash: hashedOtp,
      purpose: "signup",
      expiresAt,
    });
    await otpInfo.save();
    await sendEmail(email, otp);

    return otp;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = createOtpChallenge;
