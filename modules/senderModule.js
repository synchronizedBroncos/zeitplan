const twilio = require('twilio');
const nodemailer = require('nodemailer');

// required for twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'zeitplanme@gmail.com',
    pass: process.env.GM_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports.sendSMS = (body, number) => {
  const promise = new Promise(function(resolve, reject) {
    client.messages.create({
    body: body,
    to: number,  // Text this number
    from: '+18183512938' // From our own valid Twilio number
    })
    .then((message) => {
      resolve(message.sid);
    })
    .catch(e => {
       console.error('SMS Send Error:', e.code, e.message);
       reject(Error('Error ' + e.code + ', ' + e.message));
    });
  });
  return promise;
}

module.exports.sendEmail = (email, subject, text) => {
  const mailOptions = {
    from: '"Zeitplan" <zeitplanme@gmail.com>', //from email is our own email to send from
    to: email,
    subject: subject,
    text: text
  };

  const promise = new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error('Send Email Error:', error);
        reject(Error(error));
      } else {
        resolve(info.response);
      }
    });
  });
  return promise;
}
