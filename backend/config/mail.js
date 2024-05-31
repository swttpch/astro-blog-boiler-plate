const mailConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  requireTLS: process.env.NODE_ENV === "production",
  auth: {
    user: process.env.MAILJET_PUBLIC_KEY,
    pass: process.env.MAILJET_SECRET_KEY,
  },
  default: {
    from: process.env.MAIL_SENDER,
  },
  tls: {
    ciphers: "SSLv3",
    // do not fail on invalid certs
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
};

module.exports = mailConfig;
