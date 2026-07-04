const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Try to use real SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: `${process.env.FROM_NAME || 'Resume Analyzer'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    
    if (options.html) {
      message.html = options.html;
    }

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
  } else {
    // Development mode fallback: just log it
    console.log("==========================================================");
    console.log("SMTP not configured. Email simulated:");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("Message:\n", options.message);
    console.log("==========================================================");
  }
};

module.exports = sendEmail;
