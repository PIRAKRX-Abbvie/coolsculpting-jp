const https = require('https');

const ENV = process.env.ENV;
const DEV_CAPTCHA = process.env.DEV_CAPTCHA;
const HOST_NAME = process.env.HOST_NAME;
const RECIPIENT = process.env.RECIPIENT;
const SENDER = process.env.SENDER;
const SUBJECT = process.env.SUBJECT;
const API_PATH = process.env.API_PATH;


exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const {
    response: {
      recaptchaVerification,
      fullName,
      clinicName,
      email,
      phoneNumber,
      inquiry,
      message,
      consent,
    }
  } = JSON.parse(event.body);

  const formResponse = {
    recipient: RECIPIENT,
    sender: SENDER,
    subject: SUBJECT,
    recaptchaVerification: ENV === 'production' ? recaptchaVerification : DEV_CAPTCHA,
    fullName,
    clinicName,
    inquiry,
    consent,
    message,
    email,
    phoneNumber,
    
  }

  const post = (path) => new Promise((resolve, reject) => {
    const options = {     
      host: HOST_NAME,
      port: 443,
      path, 
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
       }, 
    };
    const req = https.request(options, res => {
        console.log(JSON.stringify(options));
        let buffer = "";
        res.on('data', chunk => buffer += chunk)
        res.on('end', () => resolve(JSON.parse(buffer)))
    });
    req.on('error', e => reject(e.message));
    req.write(JSON.stringify(formResponse));
    req.end();
  })

  const aemResponse = await post(API_PATH);

  if (aemResponse.success) {
    return {
      statusCode: aemResponse.status,
      body: JSON.stringify({
        success: true,
        message: aemResponse.message,
      })
    };
  }

  return {
    statusCode: aemResponse.status,
    body: JSON.stringify({
      message: aemResponse.message
    }),
  }

};
