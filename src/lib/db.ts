
// This file simulates a database for students.
// In a real-world application, you would replace this with a connection to a database like Firebase Firestore, PostgreSQL, etc.

import { format } from 'date-fns';

export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'Active' | 'Inactive';
  registered: string;
}

// Initial student data.
let students: Student[] = [
    { id: 'PIISS-3421', name: 'Aisha Ahmed', grade: 'Grade 5', status: 'Active', registered: format(new Date('2023-08-15'), "PPP") },
    { id: 'PIISS-8754', name: 'Bilal Khan', grade: 'Grade 8', status: 'Active', registered: format(new Date('2023-09-01'), "PPP") },
    { id: 'PIISS-5233', name: 'Fatima Ali', grade: 'KG-2', status: 'Active', registered: format(new Date('2023-08-20'), "PPP") },
];


// Simulate database operations.
export const db = {
  getStudents: async (): Promise<Student[]> => {
    // In a real app, this would fetch from a database.
    return Promise.resolve(students);
  },
  addStudent: async (studentData: { name: string; grade: string }): Promise<Student> => {
    const newStudent: Student = {
      id: `PIISS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: studentData.name,
      grade: studentData.grade,
      status: 'Active',
      registered: format(new Date(), "PPP"),
    };
    students.push(newStudent);
    // In a real app, this would insert into a database.
    return Promise.resolve(newStudent);
  },
  // We can add more functions here later like deleteStudent, updateStudent, etc.
};
