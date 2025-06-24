const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🔧 Configuración actual:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***configurado***' : 'NO CONFIGURADO');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('');

  let transporter;
  let isEthereal = false;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('📧 Usando configuración SMTP real...');
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
    console.log('⚠️  No hay configuración SMTP, usando Ethereal...');
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
      from: process.env.EMAIL_FROM || 'test@example.com',
      to: 'test@example.com',
      subject: 'Prueba de correo',
      html: '<p>Este es un correo de prueba</p>',
    });

    if (isEthereal) {
      const url = nodemailer.getTestMessageUrl(info);
      console.log('✅ Correo enviado exitosamente (Ethereal)');
      console.log('📧 URL para ver el correo:', url);
    } else {
      console.log('✅ Correo enviado exitosamente');
    }
    console.log('📧 Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error enviando correo:', error.message);
    if (error.message.includes('Invalid login')) {
      console.log('💡 Sugerencia: Verifica que SMTP_USER y SMTP_PASS sean correctos');
    }
  }
}

testEmail(); 