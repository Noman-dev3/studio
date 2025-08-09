// This file simulates a database for students and teachers.
// In a real-world application, you would replace this with a connection to a database like Firebase Firestore, PostgreSQL, etc.
// The use of `global` is to prevent the in-memory data from being lost during hot-reloads in development.

import { format } from 'date-fns';

export interface Student {
  id: string; // e.g., PIISS-1234
  name: string;
  grade: string;
  dob: Date;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: 'Active' | 'Inactive';
  registered: string; // Formatted date string
}

export interface Teacher {
    id: string; // e.g., PIISS-T-5678
    name: string;
    subject: string;
    email: string;
    phone: string;
    joiningDate: Date;
    status: 'Active' | 'On-Leave' | 'Resigned';
}

declare global {
  var __db: {
    students: Student[];
    teachers: Teacher[];
  } | undefined;
}

const initialStudents: Student[] = [
    { id: 'PIISS-3421', name: 'Aisha Ahmed', grade: 'Grade 5', dob: new Date('2014-05-10'), parentName: 'Rashid Ahmed', parentEmail: 'r.ahmed@email.com', parentPhone: '0300-1234567', status: 'Active', registered: format(new Date('2023-08-15'), "PPP") },
    { id: 'PIISS-8754', name: 'Bilal Khan', grade: 'Grade 8', dob: new Date('2011-02-25'), parentName: 'Imran Khan', parentEmail: 'i.khan@email.com', parentPhone: '0333-9876543', status: 'Active', registered: format(new Date('2023-09-01'), "PPP") },
    { id: 'PIISS-5233', name: 'Fatima Ali', grade: 'KG-2', dob: new Date('2018-11-30'), parentName: 'Zahid Ali', parentEmail: 'z.ali@email.com', parentPhone: '0321-5554433', status: 'Active', registered: format(new Date('2023-08-20'), "PPP") },
];

const initialTeachers: Teacher[] = [];

if (process.env.NODE_ENV === 'production') {
  global.__db = {
    students: initialStudents,
    teachers: initialTeachers,
  };
} else {
  if (!global.__db) {
    global.__db = {
      students: initialStudents,
      teachers: initialTeachers,
    };
  }
}

const db_ = global.__db!;

export const db = {
  // === Student Methods ===
  getStudents: async (): Promise<Student[]> => {
    return Promise.resolve(db_.students);
  },
  addStudent: async (studentData: Omit<Student, 'id' | 'status' | 'registered'>): Promise<Student> => {
    const newStudent: Student = {
      ...studentData,
      id: `PIISS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      registered: format(new Date(), "PPP"),
    };
    db_.students.push(newStudent);
    return Promise.resolve(newStudent);
  },

  // === Teacher Methods ===
  getTeachers: async (): Promise<Teacher[]> => {
    return Promise.resolve(db_.teachers);
  },
  addTeacher: async (teacherData: Omit<Teacher, 'id' | 'status'>): Promise<Teacher> => {
    const newTeacher: Teacher = {
        ...teacherData,
        id: `PIISS-T-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
    };
    db_.teachers.push(newTeacher);
    return Promise.resolve(newTeacher);
  },
};
