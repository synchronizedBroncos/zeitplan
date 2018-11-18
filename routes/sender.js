var express = require('express');
var router = express.Router();
const Joi = require('joi');

require("dotenv").config();

// required for twilio
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

//Nodemailer
const nodemailer = require('nodemailer');

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

// Requires phone number and text message body
router.post('/sendSMS', (req, res) => {
  const { error } = validateSMS(req.body); //result.error
  if(error) return res.status(400).send(error.details[0].message);

    client.messages.create({
    body: req.body.body,
    to: req.body.number,  // Text this number
    from: '+18183512938' // From our own valid Twilio number
  })
  .then((message) => {
    res.send(message.sid);
  })
  .catch(e => {
     console.error('SMS Send Error:', e.code, e.message);
     res.send('Error ' + e.code + ', ' + e.message);
  });
});

// requires the email to send to, subject, and text
router.post('/sendEmail', (req, res) => {
  const { error } = validateEmail(req.body); //result.error
  if(error) return res.status(400).send(error.details[0].message);

  const email = req.body.email;
  const subject = req.body.subject;
  const text = req.body.text;

  var mailOptions = {
    from: '"Zeitplan" <zeitplanme@gmail.com>', //from email is our own email to send from
    to: email,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.error('Send Email Error: ', error);
    res.send('Send Email Error: ' + error);
    } else {
    console.log('Email sent: ' + info.response);
    res.send(info.response);
    }
  });
});

//TODO: make functions to call from within the routes
//TODO: export functions to use them in notifications

// validation methods with Joi module
function validateSMS(input) {
  const schema = {
    number: Joi.string().required(),
    body: Joi.string().required()
  };

  return Joi.validate(input, schema);
}

function validateEmail(input) {
  const schema = {
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    text: Joi.string().required()
  };

  return Joi.validate(input, schema);
}

module.exports = router;
