import nodemailer from "nodemailer";

let transporter;

/**
 * Sends a production email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML format email content
 */
export const sendRealEmail = async (to, subject, html) => {
  try {
    if (!transporter) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASS,
        },
      });
    }

    const mailOptions = {
      from: `"RankU1 Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Nodemailer Error: Failed to send email", error);
    throw new Error("Could not send email. Please check credentials or network.");
  }
};
