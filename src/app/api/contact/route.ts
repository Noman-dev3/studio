
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Helper function to create the email body for contact form
const createContactEmailBody = (data: any) => {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;
};

// Helper function to create the email body for admission form
const createAdmissionEmailBody = (data: any) => {
  return `
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
};


export async function POST(req: Request) {
    const body = await req.json();
    const { type, ...data } = body;

    const {
        EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT,
        EMAIL_SERVER_USER,
        EMAIL_SERVER_PASSWORD,
        EMAIL_FROM,
        NEXT_PUBLIC_CONTACT_EMAIL
    } = process.env;

    if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD || !EMAIL_FROM || !NEXT_PUBLIC_CONTACT_EMAIL) {
        console.error('Missing required environment variables for email configuration.');
        return NextResponse.json({ message: 'Server is not configured to send emails.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
        host: EMAIL_SERVER_HOST,
        port: Number(EMAIL_SERVER_PORT),
        secure: Number(EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: EMAIL_SERVER_USER,
            pass: EMAIL_SERVER_PASSWORD,
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
        from: `PIISS Website <${EMAIL_FROM}>`,
        to: NEXT_PUBLIC_CONTACT_EMAIL, // Admin's email
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
