const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sender = require('../modules/senderModule');

// Requires phone number and text message body
router.post('/sendSMS', (req, res) => {
  const { error } = validateSMS(req.body); //result.error
  if(error) return res.status(400).send(error.details[0].message);

  const smsPromise = Sender.sendSMS(req.body.body, req.body.number);
  smsPromise.then(function(result) {
    console.log("SendSMS Successful:", result);
    res.send(result);
  }, function(err) {
    console.error("SendSMS Error:", err);
    res.send(err);
  });
});

// requires the email to send to, subject, and text
router.post('/sendEmail', async (req, res) => {
  const { error } = validateEmail(req.body); //result.error
  if(error) return res.status(400).send(error.details[0].message);

  const emailPromise = Sender.sendEmail(req.body.email, req.body.subject, req.body.text);
  emailPromise.then(function(result) {
    console.log("SendEmail Successful:", result);
    res.send(result);
  }, function(err) {
    console.error("SendEmail Error:", err);
    res.send(err);
  });
});

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
