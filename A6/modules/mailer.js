const { Resend } = require('resend');

const resend = new Resend(process.env.API_RESEND);

function sendVerificationEmail(email, code) {
  return resend.emails.send({
    from: 'Your App <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Hello! Your verification code is: <strong>${code}</strong></p>`
  });
}

module.exports = { sendVerificationEmail };
