
'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { smartSearch, type SmartSearchInput } from '@/ai/flows/smart-search';
import { db, type Student, SiteSettings } from '@/lib/db';
import { contactFormSchema } from '@/lib/schemas';

// Helper to check for admin authentication
async function isAdminAuthenticated() {
  // This is a simplified check for the prototype and should be
  // replaced with a robust auth system like Firebase Auth in a real app.
  try {
    const settings = await db.getSettings();
    const adminUsernameHeader = headers().get('X-Admin-Username');
    const adminPasswordHeader = headers().get('X-Admin-Password');
    
    // NOTE: This is NOT a secure way to handle authentication for a production app.
    // It's a placeholder for the prototype.
    return adminUsernameHeader === settings.adminUsername && adminPasswordHeader === settings.adminPassword;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
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

// Action to update admission status
export async function updateAdmissionStatus(admissionId: string, status: 'Approved' | 'Rejected') {
  if (!await isAdminAuthenticated()) {
    return { success: false, message: 'Authentication failed. Insufficient permissions.' };
  }
  try {
    const admissions = await db.getAdmissions();
    const admissionIndex = admissions.findIndex(a => a.id === admissionId);

    if (admissionIndex === -1) {
      return { success: false, message: 'Admission not found.' };
    }
    
    admissions[admissionIndex].status = status;
    await db.saveAdmissions(admissions);

    return { success: true, message: `Admission status updated to ${status}.` };
  } catch (error) {
    console.error('Failed to update admission status:', error);
    return { success: false, message: 'Failed to update admission status.' };
  }
}

// Action to delete a student
export async function deleteStudent(rollNumber: string) {
    if (!await isAdminAuthenticated()) {
        return { success: false, message: 'Authentication failed. Insufficient permissions.' };
    }
    try {
        await db.deleteStudent(rollNumber);
        return { success: true, message: 'Student deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete student:', error);
        return { success: false, message: 'Failed to delete student.' };
    }
}

// Action to delete a teacher
export async function deleteTeacher(teacherId: string) {
    if (!await isAdminAuthenticated()) {
        return { success: false, message: 'Authentication failed. Insufficient permissions.' };
    }
    try {
        await db.deleteTeacher(teacherId);
        return { success: true, message: 'Teacher deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete teacher:', error);
        return { success: false, message: 'Failed to delete teacher.' };
    }
}

// Action to update student
const studentFormSchema = z.object({
  Roll_Number: z.string(),
  Name: z.string().min(2, "Name is required."),
  Class: z.string().min(1, "Class is required."),
  Gender: z.string(),
  Contact: z.string(),
  Address: z.string(),
});

export async function updateStudent(data: Student) {
    if (!await isAdminAuthenticated()) {
        return { success: false, message: 'Authentication failed. Insufficient permissions.' };
    }
    const parsed = studentFormSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: 'Invalid student data.' };
    }
    try {
        const students = await db.getStudents();
        const studentIndex = students.findIndex(s => s.Roll_Number === data.Roll_Number);
        if (studentIndex !== -1) {
            students[studentIndex] = data;
            await db.saveStudents(students);
            return { success: true, message: 'Student updated successfully.' };
        }
        return { success: false, message: 'Student not found.' };

    } catch (error) {
        return { success: false, message: 'Failed to update student.' };
    }
}
    
