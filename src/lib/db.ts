
'use client';

// This file simulates a database using local storage.
// In a real-world application, you would replace this with a connection to a real database.

export interface Student {
  Name: string;
  Roll_Number: string;
  Class: string;
  Gender: string;
  Contact: string;
  Address: string;
}

export interface Teacher {
  Name: string;
  Teacher_ID: string;
  Contact: string;
  Salary: string;
  Photo_Path: string;
  Date_Joined: string; // Stored as ISO string
  isDummy?: boolean;
}

export interface Topper {
    id: string;
    name: string;
    grade: string;
    marks: string;
}

export interface Subject {
  id: string;
  name: string;
  marks: number;
}

export interface StudentResult {
  studentRollNumber: string;
  subjects: Subject[];
  totalMarks: number;
  percentage: number;
  grade: string;
  position?: '1st' | '2nd' | '3rd' | 'No Position';
}

export interface Admission {
  id: string;
  studentName: string;
  dob: string; // ISO String
  grade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  previousSchool?: string;
  comments?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  applicationDate: string; // ISO String
}


// Helper function to safely access local storage
const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = <T>(key: string, value: T) => {
    if (typeof window === 'undefined') {
        console.warn(`Tried to save to localStorage ("${key}") on the server.`);
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
    }
}

// --- Data Access Functions ---
// All these functions are async to simulate real database calls
export const db = {
  // === Student Methods ===
  getStudents: async (): Promise<Student[]> => {
    return Promise.resolve(getFromLocalStorage<Student[]>('students', []));
  },
  saveStudents: async (students: Student[]): Promise<void> => {
    saveToLocalStorage('students', students);
    return Promise.resolve();
  },
  deleteStudent: async (rollNumber: string): Promise<void> => {
    let students = await db.getStudents();
    students = students.filter(s => s.Roll_Number !== rollNumber);
    saveToLocalStorage('students', students);
    return Promise.resolve();
  },

  // === Teacher Methods ===
  getTeachers: async (): Promise<Teacher[]> => {
    return Promise.resolve(getFromLocalStorage<Teacher[]>('teachers', []));
  },
  saveTeachers: async (teachers: Teacher[]): Promise<void> => {
    saveToLocalStorage('teachers', teachers);
    return Promise.resolve();
  },
  deleteTeacher: async (teacherId: string): Promise<void> => {
    let teachers = await db.getTeachers();
    teachers = teachers.filter(t => t.Teacher_ID !== teacherId);
    saveToLocalStorage('teachers', teachers);
    return Promise.resolve();
  },

  // === Topper Methods ===
  getToppers: async (): Promise<Topper[]> => {
    return Promise.resolve(getFromLocalStorage<Topper[]>('toppers', []));
  },
  saveToppers: async (toppers: Topper[]): Promise<void> => {
    saveToLocalStorage('toppers', toppers);
    return Promise.resolve();
  },

  // === Result Methods ===
  getResults: async (): Promise<StudentResult[]> => {
      return Promise.resolve(getFromLocalStorage<StudentResult[]>('results', []));
  },
  getResultByRollNumber: async (rollNumber: string): Promise<StudentResult | null> => {
      const results = await db.getResults();
      const result = results.find(r => r.studentRollNumber === rollNumber) || null;
      return Promise.resolve(result);
  },
  saveResult: async (result: StudentResult): Promise<void> => {
    let results = await db.getResults();
    const existingIndex = results.findIndex(r => r.studentRollNumber === result.studentRollNumber);
    
    // Simplified: remove position logic
    const newResultData = { ...result };
    delete newResultData.position;

    if (existingIndex !== -1) {
        results[existingIndex] = newResultData;
    } else {
        results.push(newResultData);
    }
    
    saveToLocalStorage('results', results);
    return Promise.resolve();
  },
   saveResults: async (results: StudentResult[]): Promise<void> => {
    saveToLocalStorage('results', results);
    return Promise.resolve();
  },

  // === Admission Methods ===
  getAdmissions: async (): Promise<Admission[]> => {
    return Promise.resolve(getFromLocalStorage<Admission[]>('admissions', []));
  },
  saveAdmission: async (admission: Admission): Promise<void> => {
    const admissions = await db.getAdmissions();
    admissions.push(admission);
    saveToLocalStorage('admissions', admissions);
    return Promise.resolve();
  },
  saveAdmissions: async (admissions: Admission[]): Promise<void> => {
      saveToLocalStorage('admissions', admissions);
      return Promise.resolve();
  },
};
