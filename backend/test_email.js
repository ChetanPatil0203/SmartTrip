const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const nodemailer = require('nodemailer');
const config = require('./src/config/env');

async function testEmail() {
  console.log('Testing Email Configuration...');
  console.log('EMAIL_USER:', config.emailUser);
  console.log('EMAIL_PASS length:', config.emailPass ? config.emailPass.length : 0);

  if (!config.emailUser || !config.emailPass) {
    console.log('❌ Error: EMAIL_USER or EMAIL_PASS not found in .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection Verified! Credentials are valid.');

    const info = await transporter.sendMail({
      from: `SmartTrip <${config.emailUser}>`,
      to: config.emailUser,
      subject: '⚡ SmartTrip Real Email Test',
      text: 'If you receive this email, your SmartTrip real email delivery is 100% working!',
    });
    console.log('✅ Test email sent successfully! MessageId:', info.messageId);
  } catch (err) {
    console.log('❌ Email test failed:', err.message);
    if (err.message.includes('535') || err.message.includes('BadCredentials')) {
      console.log('\n👉 Reason: Google rejected the App Password.');
      console.log('Steps to fix:');
      console.log('1. Go to: https://myaccount.google.com/apppasswords');
      console.log('2. Sign in with ' + config.emailUser);
      console.log('3. Create a new App Password (name it "SmartTrip")');
      console.log('4. Copy the 16-letter code and update EMAIL_PASS in backend/.env');
    }
  }
}

testEmail();
