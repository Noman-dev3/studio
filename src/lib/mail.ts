
'use server';

import nodemailer from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail({ to, subject, text, html }: MailOptions) {
  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
    EMAIL_FROM,
  } = process.env;

  if (
    !EMAIL_SERVER_HOST ||
    !EMAIL_SERVER_PORT ||
    !EMAIL_SERVER_USER ||
    !EMAIL_SERVER_PASSWORD ||
    !EMAIL_FROM
  ) {
    console.error('Email server environment variables are not set.');
    throw new Error('Email service is not configured.');
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: parseInt(EMAIL_SERVER_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
}
