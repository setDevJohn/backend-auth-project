import path from "path";
import fs from "fs";
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

export async function sendEmail(email: string, subject: string, token: string, file: string) {
  const templatePath = path.resolve(__dirname, '..', 'templates', `${file}.html`);
  let content = fs.readFileSync(templatePath, 'utf-8');

  // Substitui o placeholder {{token}} pelo token real
  content = content.replace('{{token}}', token);

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject,
    html: content
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error(err)
    throw new AppError('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR)
  }  
}