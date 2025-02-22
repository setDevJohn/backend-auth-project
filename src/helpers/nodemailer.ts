import { AppError, HttpStatus } from "../error/appError";
import { errorHandler } from "../error/errorHandler";

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smpt.gmail.com',
  port: '465',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})

export async function sendEmail(email: string) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'Confirmação de cadastro',
    text: 'Você está recebendo este email para confirmar seu cadastro. Clique no link abaixo para completar seu cadastro.'
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error(err)
    throw new AppError('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR)
  }  
}