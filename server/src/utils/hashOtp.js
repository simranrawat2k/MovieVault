const bcrypt = require('bcryptjs');

const hashOtp = async (otp) => {
    const hashedOtp = await bcrypt.hash(otp, 10);
    return hashedOtp;
};

module.exports = hashOtp;