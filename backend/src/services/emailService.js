const nodemailer = require("nodemailer");
const config = require("../config/env");
const logger = require("../utils/logger");

let transporter = null;

/**
 * Initialize or get active Nodemailer Transporter
 */
const getTransporter = async () => {
  if (transporter) return transporter;

  const emailUser = config.emailUser || process.env.EMAIL_USER;
  const emailPass = config.emailPass || process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    // Production / Configured SMTP (Gmail, Outlook, Custom SMTP)
    transporter = nodemailer.createTransport({
      service: config.emailService || process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    logger.info(`[EmailService] SMTP Transporter configured for ${emailUser}`);
    return transporter;
  }

  // If credentials are not yet set, create an Ethereal auto-test account
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    logger.info(`[EmailService] Initialized Ethereal fallback email transport for ${testAccount.user}`);
    return transporter;
  } catch (err) {
    logger.error(`[EmailService] Failed to create test email account: ${err.message}`);
    return null;
  }
};

const emailService = {
  /**
   * Send 6-digit OTP verification code to recipient's email address
   */
  sendOtpEmail: async ({ to, otp, purpose = "login" }) => {
    try {
      const activeTransporter = await getTransporter();
      if (!activeTransporter) {
        throw new Error("Email transporter unavailable. Please configure EMAIL_USER and EMAIL_PASS in .env");
      }

      const purposeMap = {
        reset_password: {
          title: "Password Reset Verification Code",
          badge: "PASSWORD RESET",
          description: "We received a request to reset your SmartTrip password. Use the verification code below to proceed.",
        },
        register: {
          title: "Verify Your SmartTrip Account",
          badge: "NEW REGISTRATION",
          description: "Welcome to SmartTrip! Confirm your email address using the 6-digit code below.",
        },
        login: {
          title: "SmartTrip Login OTP",
          badge: "ACCOUNT LOGIN",
          description: "Use the 6-digit OTP below to securely log in to your SmartTrip account.",
        },
      };

      const info = purposeMap[purpose] || purposeMap.login;
      const fromAddress = config.emailFrom || process.env.EMAIL_FROM || (config.emailUser ? `SmartTrip <${config.emailUser}>` : "SmartTrip <no-reply@smarttrip.com>");

      const mailOptions = {
        from: fromAddress,
        to,
        subject: `⚡ ${otp} is your SmartTrip verification code`,
        text: `Your SmartTrip verification code is ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${info.title}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;">
                  
                  <!-- HEADER WITH BRANDING -->
                  <tr>
                    <td style="background-color: #D13239; padding: 28px 24px; text-align: center;">
                      <div style="font-size: 26px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px; margin: 0;">
                        ✈️ SmartTrip
                      </div>
                      <div style="font-size: 13px; color: rgba(255,255,255,0.85); margin-top: 4px; font-weight: 500;">
                        One App. Every Journey.
                      </div>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding: 32px 28px; text-align: center;">
                      <span style="display: inline-block; background-color: #FEE2E2; color: #D13239; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 12px; letter-spacing: 0.5px; margin-bottom: 12px;">
                        ${info.badge}
                      </span>

                      <h2 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
                        ${info.title}
                      </h2>

                      <p style="font-size: 14px; line-height: 22px; color: #64748B; margin: 0 0 24px 0;">
                        ${info.description}
                      </p>

                      <!-- 6-DIGIT OTP CODE BOX -->
                      <div style="background-color: #FFF1F2; border: 2px dashed #D13239; border-radius: 16px; padding: 18px 24px; margin: 0 auto 24px auto; max-width: 280px;">
                        <span style="font-size: 34px; font-weight: 900; color: #D13239; letter-spacing: 10px; display: inline-block;">
                          ${otp}
                        </span>
                      </div>

                      <p style="font-size: 12px; color: #94A3B8; margin: 0 0 16px 0;">
                        ⏱️ This verification code is valid for <strong>10 minutes</strong>.<br>
                        🔒 Never share this OTP with anyone, including SmartTrip support.
                      </p>

                      <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 24px 0;">

                      <p style="font-size: 12px; color: #64748B; line-height: 18px; margin: 0;">
                        If you did not request this verification code, please ignore this email or secure your account.
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 18px 24px; text-align: center; border-top: 1px solid #E2E8F0;">
                      <p style="font-size: 11px; color: #94A3B8; margin: 0;">
                        © ${new Date().getFullYear()} SmartTrip Technologies. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `,
      };

      const result = await activeTransporter.sendMail(mailOptions);
      logger.info(`[EmailService] OTP email sent to ${to}. MessageId: ${result.messageId}`);

      // If Ethereal test account was used, log the preview URL
      const previewUrl = nodemailer.getTestMessageUrl(result);
      if (previewUrl) {
        logger.info(`[EmailService] Preview URL: ${previewUrl}`);
      }

      return {
        success: true,
        messageId: result.messageId,
        previewUrl: previewUrl || null,
        recipient: to,
      };
    } catch (error) {
      logger.error(`[EmailService] Failed to send OTP email to ${to}: ${error.message}`);
      throw error;
    }
  },
};

module.exports = emailService;
