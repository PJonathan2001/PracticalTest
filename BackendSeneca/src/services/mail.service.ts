import nodemailer from 'nodemailer';
import config from '../config/default';

class MailService {
  static async sendMail(to: string, subject: string, html: string) {
    let transporter;
    let isEthereal = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Ethereal para desarrollo
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEthereal = true;
    }
    try {
      const info = await transporter.sendMail({
        from: config.emailFrom,
        to,
        subject,
        html,
      });
      if (isEthereal) {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) {
          // Puedes usar el url para debugging en desarrollo si lo necesitas
        }
      }
    } catch (err) {
      console.error('Error enviando correo:', err);
      throw err;
    }
  }
}

export default MailService; 