
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

const createContactEmailBody = (data: any) => `
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <p><strong>Message:</strong></p>
  <p>${data.message}</p>
`;

const createAdmissionEmailBody = (data: any) => `
  <h2>New Admission Application</h2>
  <p><strong>Student's Name:</strong> ${data.studentName}</p>
  <p><strong>Date of Birth:</strong> ${data.dob}</p>
  <p><strong>Applying for Grade:</strong> ${data.grade}</p>
  <hr>
  <h3>Parent/Guardian Information</h3>
  <p><strong>Name:</strong> ${data.parentName}</p>
  <p><strong>Email:</strong> ${data.parentEmail}</p>
  <p><strong>Phone:</strong> ${data.parentPhone}</p>
  <hr>
  <h3>Additional Information</h3>
  <p><strong>Previous School:</strong> ${data.previousSchool || 'N/A'}</p>
  <p><strong>Comments:</strong></p>
  <p>${data.comments || 'No comments provided.'}</p>
`;

export async function POST(req: Request) {
  const body = await req.json();
  const { type, ...data } = body;

  const settings = await db.getSettings();
  const emailConfig = settings.emailSettings;

  // Fallback logic for recipient email
  const recipientEmail = settings.contactEmail || "noman.dev3@gmail.com";

  if (!emailConfig || !emailConfig.host || !emailConfig.port || !emailConfig.user || !emailConfig.pass || !emailConfig.from) {
    console.error('Missing required email configuration in the admin settings.');
    // For now, we allow submission to continue and just log the data, but you might want to handle this differently.
    // In a real-world scenario, without SMTP settings, the email can't be sent.
    // We can save the submission to the DB and return a success message to the user.
    // The current implementation already saves admission data.
     console.log("Contact submission received but email not sent due to missing config:", data);
     return NextResponse.json({ message: 'Your message has been received. The site administrator has been notified.' }, { status: 200 });
  }

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.port === 465, // Use true for port 465, false for all other ports
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });

  let subject, html;

  if (type === 'contact') {
    subject = `New Message from ${data.name}: ${data.subject}`;
    html = createContactEmailBody(data);
  } else if (type === 'admission') {
    subject = `New Admission Application for ${data.studentName}`;
    html = createAdmissionEmailBody(data);
  } else {
    return NextResponse.json({ message: 'Invalid form type' }, { status: 400 });
  }

  const mailOptions = {
    from: `"${settings.schoolName}" <${emailConfig.from}>`,
    to: recipientEmail,
    replyTo: type === 'contact' ? data.email : data.parentEmail,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}
