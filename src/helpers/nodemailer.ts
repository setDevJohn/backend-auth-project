import { AppError, HttpStatus } from "../error/appError";

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: '465',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
})

export async function sendEmail(email: string, subject: string, content: string) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject,
    text: content
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error(err)
    throw new AppError('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR)
  }  
}