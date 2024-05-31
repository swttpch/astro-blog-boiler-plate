const Mail = require("../lib/mail");
const { stringify } = require("qs");

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.MAIL_URL
    : "http://localhost:3000";

class MailService {
  buildUrlWithParams(path, params) {
    const query = stringify(params);

    const pathNormalized = path.startsWith("/") ? path.substring(1) : path;

    return `${baseURL}/${pathNormalized}?${query}`;
  }

  async sendMailConfirmation(to, userName, urlActivation, activationCode) {
    try {
      Mail.sendMail({
        to: to,
        subject: "Ativação de usuário Locasty",
        template: "confirmation",
        context: {
          userName,
          baseURL,
          urlActivation,
          activationCode,
          to,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendMailForgotPassword(to, userName, passwordToken) {
    try {
      const resetUrl = this.buildUrlWithParams("reset-password", {
        token: passwordToken,
      });

      Mail.sendMail({
        to: to,
        subject: "Redefinição de Senha Locasty",
        template: "forgot-password",
        context: {
          email: to,
          userName,
          resetUrl,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendMailResetPassword(to, userName) {
    try {
      Mail.sendMail({
        to: to,
        subject: "Senha Alterada",
        template: "reset-password",
        context: {
          email: to,
          userName,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendMailMonthlyReport(monthlyReport) {
    try {
      Mail.sendMail({
        to: monthlyReport.email,
        subject: "Relatório Mensal Locasty",
        template: "monthly-report",
        context: {
          ...monthlyReport,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendMailTicketOpened(to, userName, ticketId) {
    try {
      Mail.sendMail({
        to: to,
        subject: "Chamado aberto",
        template: "ticket-opened",
        context: {
          email: to,
          userName,
          ticketId,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendMailTicketOpenedToSupport(message) {
    const { to, userName, ticketId } = message;
    try {
      Mail.sendSimpleMail({
        to: to,
        subject: "Chamado aberto",
        context: {
          email: to,
          userName,
          ticketId,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new MailService();
