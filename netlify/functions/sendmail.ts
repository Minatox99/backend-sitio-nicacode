import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const handler: Handler = async (event) => {
  // Configurar los headers CORS manualmente
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Manejar las solicitudes OPTIONS (preflight CORS request)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
    };
  }

  // Aquí va tu lógica para enviar el correo
  const data = JSON.parse(event.body!); // Usa `!` para indicar que no es null en TypeScript

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
    text: `Datos del cliente:\nEmail: ${data.email}\nTeléfono: ${data.tel}\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Correo enviado exitosamente.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error al enviar el correo.' }),
    };
  }
};

