
'use server';

import { z } from 'zod';
import { smartSearch, type SmartSearchInput } from '@/ai/flows/smart-search';
import { sendMail } from '@/lib/mail';
import { format } from 'date-fns';
import { db, type Admission } from '@/lib/db';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  recipientEmail: z.string().email(),
});

export async function submitContactForm(data: unknown) {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, subject, message, recipientEmail } = parsed.data;

  if (!recipientEmail) {
    console.error('Contact email is not set in admin settings.');
    return { success: false, message: 'Server is not configured to receive contact emails. Please contact an administrator.' };
  }

  try {
    await sendMail({
      to: recipientEmail,
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\\nEmail: ${email}\\n\\nMessage:\\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2E3192;">New Inquiry from PIISS Website</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });
    return { success: true, message: 'Thank you for your message! We will get back to you soon.' };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, message: 'There was an error sending your message. Please try again later.' };
  }
}

const admissionFormSchema = z.object({
  studentName: z.string().min(2, "Student's name is required."),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  grade: z.string({ required_error: 'Please select a grade.' }),
  parentName: z.string().min(2, "Parent's name is required."),
  parentEmail: z.string().email('Please enter a valid email.'),
  parentPhone: z.string().min(10, 'Please enter a valid phone number.'),
  previousSchool: z.string().optional(),
  comments: z.string().optional(),
  recipientEmail: z.string().email(),
});

export async function submitAdmissionForm(data: unknown) {
  const parsed = admissionFormSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors };
  }
  
  const { studentName, dob, grade, parentName, parentEmail, parentPhone, previousSchool, comments, recipientEmail } = parsed.data;
  
  if (!recipientEmail) {
    console.error('Contact email is not set in admin settings for admissions.');
    return { success: false, message: 'Server is not configured to receive admission emails. Please contact an administrator.' };
  }

  const newAdmission: Admission = {
    id: `ADM-${Date.now()}`,
    studentName,
    dob: dob.toISOString(),
    grade,
    parentName,
    parentEmail,
    parentPhone,
    previousSchool: previousSchool || '',
    comments: comments || '',
    status: 'Pending',
    applicationDate: new Date().toISOString(),
  };
  
  try {
    // Save the admission application to our "database"
    await db.saveAdmission(newAdmission);

    // Prepare and send the email notification
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="background-color: #2E3192; color: white; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1 style="margin: 0; font-size: 24px;">New Admission Application</h1>
          <p style="margin: 5px 0 0; font-size: 16px;">Pakistan Islamic International School System</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #D9534F; border-bottom: 2px solid #D9534F; padding-bottom: 5px;">Student Information</h2>
          <p><strong>Student's Name:</strong> ${studentName}</p>
          <p><strong>Date of Birth:</strong> ${format(dob, "PPP")}</p>
          <p><strong>Applying for Grade:</strong> ${grade}</p>
          <p><strong>Previous School:</strong> ${previousSchool || 'N/A'}</p>
        </div>
        <div style="padding: 0 20px;">
          <h2 style="color: #D9534F; border-bottom: 2px solid #D9534F; padding-bottom: 5px;">Parent/Guardian Information</h2>
          <p><strong>Parent's Name:</strong> ${parentName}</p>
          <p><strong>Parent's Email:</strong> <a href="mailto:${parentEmail}">${parentEmail}</a></p>
          <p><strong>Parent's Phone:</strong> ${parentPhone}</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #D9534F; border-bottom: 2px solid #D9534F; padding-bottom: 5px;">Additional Comments</h2>
          <p>${comments || 'No comments provided.'}</p>
        </div>
        <div style="background-color: #f7f7f7; padding: 15px 20px; text-align: center; color: #777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          <p style="margin: 0;">This email was generated from the PIISS website admissions form.</p>
        </div>
      </div>
    `;
    
    const textContent = `
      New Admission Application - PIISS
      =================================
      Student Information:
      - Student's Name: ${studentName}
      - Date of Birth: ${format(dob, "PPP")}
      - Applying for Grade: ${grade}
      - Previous School: ${previousSchool || 'N/A'}

      Parent/Guardian Information:
      - Parent's Name: ${parentName}
      - Parent's Email: ${parentEmail}
      - Parent's Phone: ${parentPhone}

      Additional Comments:
      - ${comments || 'No comments provided.'}
    `;

    await sendMail({
      to: recipientEmail,
      subject: `New Admission Application for ${studentName} - Grade ${grade}`,
      text: textContent,
      html: htmlContent,
    });
    
    return { success: true, message: 'Thank you for your application! We have received it and will be in touch soon.' };
  } catch (error) {
    console.error('Failed to send admission email:', error);
    return { success: false, message: 'There was an error submitting your application. Please try again later.' };
  }
}


export async function handleSmartSearch(input: SmartSearchInput) {
  try {
    const result = await smartSearch(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Smart search failed:', error);
    return { success: false, message: 'AI search is currently unavailable. Please try again later.' };
  }
}
