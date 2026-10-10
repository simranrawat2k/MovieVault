const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (email, otp) => {
    try {
        const response = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: "MovieVault",
            },

            to: [
                {
                    email: email,
                },
            ],

            subject: "MovieVault Email Verification",

            htmlContent: `
                <div>
                    <h2>MovieVault Email Verification</h2>

                    <p>Your verification OTP is:</p>

                    <h1>${otp}</h1>

                    <p>This OTP will expire in 5 minutes.</p>

                    <p>If you did not create a MovieVault account, you can ignore this email.</p>
                </div>
            `,
        });

        console.log("OTP email sent:", response.messageId);

        return response;
    } catch (error) {
        console.error("Brevo email error:", error);
        throw error;
    }
};

module.exports = sendEmail;
