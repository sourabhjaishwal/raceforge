const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send email verification link
  async sendVerificationEmail(email, verificationToken) {
    try {
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your RaceForge Email",
        html: `
          <h2>Welcome to RaceForge!</h2>
          <p>Thank you for registering.</p>
          <p>Click the button below to verify your email address:</p>

          <a
            href="${verificationLink}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            "
          >
            Verify Email
          </a>

          <p>Or copy and paste this link:</p>
          <p>${verificationLink}</p>

          <p>This verification link expires in 24 hours.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);

      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error(
        `Failed to send verification email to ${email}:`,
        error.message,
      );

      throw new Error("Failed to send verification email");
    }
  }
}

module.exports = new EmailService();
