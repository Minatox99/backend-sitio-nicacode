import { Handler, HandlerEvent } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
  }

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  const data = JSON.parse(event.body || '{}');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@nicacodes.com',
    subject: 'Formulario de nuevo cliente',
    text: `Datos del cliente: email: ${data.email}\nMensaje: ${data.tel}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Correo enviado correctamente' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al enviar el correo', error }),
    };
  }
};
