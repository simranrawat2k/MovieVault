const generateOtp = () => {
    let num =  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return num.toString();
}

module.exports = generateOtp;