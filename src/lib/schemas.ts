
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export const admissionFormSchema = z.object({
  studentName: z.string().min(2, "Student's name is required."),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  grade: z.string({ required_error: 'Please select a grade.' }),
  parentName: z.string().min(2, "Parent's name is required."),
  parentEmail: z.string().email('Please enter a valid email.'),
  parentPhone: z.string().min(10, 'Please enter a valid phone number.'),
  previousSchool: z.string().optional(),
  comments: z.string().optional(),
});
