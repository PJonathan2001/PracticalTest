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
      console.log('⚠️  Usando Ethereal para envío de correos (modo desarrollo)');
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
        console.log('📧 Correo enviado (Ethereal):', url);
        console.log('📧 Message ID:', info.messageId);
      } else {
        console.log('📧 Correo enviado exitosamente a:', to);
        console.log('📧 Message ID:', info.messageId);
      }
      
      return info;
    } catch (err) {
      console.error('❌ Error enviando correo:', err);
      
      // Proporcionar información más específica del error
      if (err instanceof Error) {
        if (err.message.includes('Invalid login')) {
          throw new Error('Credenciales de correo inválidas. Verifica SMTP_USER y SMTP_PASS.');
        } else if (err.message.includes('Connection timeout')) {
          throw new Error('Timeout de conexión con el servidor de correo. Verifica SMTP_HOST y SMTP_PORT.');
        } else if (err.message.includes('Authentication failed')) {
          throw new Error('Autenticación fallida con el servidor de correo.');
        }
      }
      
      throw new Error('Error al enviar el correo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  }
}

export default MailService; 