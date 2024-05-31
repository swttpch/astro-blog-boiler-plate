const nodemailer = require("nodemailer");
const { resolve } = require("path");
const exphbs = require("express-handlebars");
const nodemailerhbs = require("nodemailer-express-handlebars");
const { Attachment } = require("nodemailer/lib/mailer");

const mailConfig = require("../config/mail");
const {
  emailAttach,
  reportAttach,
  insightsReportAttach,
  greenArrowUpAttach,
  redArrowDownAttach,
  attachObj,
} = require("../constants/emailAttachments");

function defineAttachments(message) {
  let attachments = emailAttach.attachments;

  if (message?.template === "monthly-report") {
    const context = message?.context;
    attachments = attachments.concat(reportAttach.attachments);

    if (context?.permissions?.insights) {
      attachments = attachments.concat(insightsReportAttach.attachments);
    }

    const allPercentages = {
      questions: context?.questions,
      reviews: context?.reviews,
      ...(context?.dailyMetrics || {}),
    };

    const percentArr = Object.values(allPercentages).filter((item) => item);
    const hasPercent = percentArr.some((item) => item?.percentChange !== 0);

    if (hasPercent) {
      const hasPositive = percentArr.some(
        (item) => item?.percentChange !== 0 && item?.isPositive
      );
      if (hasPositive) {
        attachments = attachments.concat(greenArrowUpAttach.attachments);
      }

      const hasNegative = percentArr.some(
        (item) => item?.percentChange !== 0 && !item?.isPositive
      );
      if (hasNegative) {
        attachments = attachments.concat(redArrowDownAttach.attachments);
      }
    }
  }

  return { attachments };
}
class Mail {
  transporter;
  constructor() {
    const { auth, host, port, secure } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, "..", "views", "emails");
    this.transporter.use(
      "compile",
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, "layouts"),
          partialsDir: resolve(viewPath, "partials"),
          defaultLayout: "default",
          extname: ".hbs",
        }),
        viewPath,
        extName: ".hbs",
      })
    );
  }

  sendMail(message) {
    const attachments = defineAttachments(message);

    return this.transporter.sendMail({
      ...mailConfig.default,
      ...attachments,
      ...message,
    });
  }

  sendSimpleMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

module.exports = new Mail();
