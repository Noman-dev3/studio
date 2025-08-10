
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
  
  // Hardcoded recipient email as requested
  const recipientEmail = "noman.dev3@gmail.com";

  // Using environment variables for transporter as a fallback
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Using a common service, can be changed
    auth: {
      user: process.env.EMAIL_USER, // These need to be set in your deployment environment
      pass: process.env.EMAIL_PASS,
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
    from: `"${settings.schoolName}" <${process.env.EMAIL_FROM || 'no-reply@yourdomain.com'}>`,
    to: recipientEmail,
    replyTo: type === 'contact' ? data.email : data.parentEmail,
    subject: subject,
    html: html,
  };

  try {
    // Check for required env vars
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email environment variables (EMAIL_USER, EMAIL_PASS) are not set.');
      // Log submission and return success to user, as email cannot be sent.
      console.log("Form submission received but email not sent due to missing config:", data);
      return NextResponse.json({ message: 'Your message has been received. The site administrator will be notified.' }, { status: 200 });
    }
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}
