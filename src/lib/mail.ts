
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
    console.warn('***************************************************************************');
    console.warn('** WARNING: Email server environment variables are not set.                **');
    console.warn('** Email submission will be simulated.                                     **');
    console.warn('** To enable real email sending, set up your provider in the .env file.    **');
    console.warn('***************************************************************************');
    console.log(`Simulated email sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    // In a real app, you might want to throw an error, but for this demo,
    // we will simulate success to allow the form to complete.
    return { success: true, messageId: 'simulated-message-id' };
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
      from: EMAIL_FROM, // Mailgun requires the 'from' address to match the sending user.
      to: to,
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
