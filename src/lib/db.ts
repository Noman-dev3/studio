
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

export interface Fee {
  id: string;
  studentRollNumber: string;
  studentName: string;
  grade: string;
  amount: number;
  dueDate: string; // ISO String
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentDate?: string; // ISO String
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

  // === Fee Methods ===
  getFees: async (): Promise<Fee[]> => {
    return Promise.resolve(getFromLocalStorage<Fee[]>('fees', []));
  },
  saveFee: async (fee: Fee): Promise<void> => {
    const fees = await db.getFees();
    const existingIndex = fees.findIndex(f => f.id === fee.id);
    if (existingIndex !== -1) {
      fees[existingIndex] = fee;
    } else {
      fees.push(fee);
    }
    saveToLocalStorage('fees', fees);
    return Promise.resolve();
  },
  saveFees: async (fees: Fee[]): Promise<void> => {
    saveToLocalStorage('fees', fees);
    return Promise.resolve();
  },
  deleteFee: async (feeId: string): Promise<void> => {
    let fees = await db.getFees();
    fees = fees.filter(f => f.id !== feeId);
    saveToLocalStorage('fees', fees);
    return Promise.resolve();
  },

  // === Result Methods ===
  getResults: async (): Promise<StudentResult[]> => {
      return Promise.resolve(getFromLocalStorage<StudentResult[]>('results', []));
  },
  getResultsForClass: async (className: string): Promise<StudentResult[]> => {
    const allResults = await db.getResults();
    const allStudents = await db.getStudents();
    const studentIdsInClass = allStudents
        .filter(s => s.Class === className)
        .map(s => s.Roll_Number);
    
    return Promise.resolve(allResults.filter(r => studentIdsInClass.includes(r.studentRollNumber)));
  },
  saveResult: async (result: StudentResult): Promise<void> => {
    let results = await db.getResults();
    const allStudents = await db.getStudents();
    const existingIndex = results.findIndex(r => r.studentRollNumber === result.studentRollNumber);
    if (existingIndex !== -1) {
        results[existingIndex] = result;
    } else {
        results.push(result);
    }

    const student = allStudents.find(s => s.Roll_Number === result.studentRollNumber);
    if (student) {
        const classResults = await db.getResultsForClass(student.Class);
        // Ensure the current result is included for calculation if it's new
        const currentResultIndex = classResults.findIndex(r => r.studentRollNumber === result.studentRollNumber);
        if (currentResultIndex === -1) {
            classResults.push(result);
        } else {
            classResults[currentResultIndex] = result;
        }

        classResults.sort((a, b) => b.percentage - a.percentage);
        
        const positionMap: { [key: string]: '1st' | '2nd' | '3rd' | 'No Position' } = {};
        
        if(classResults.length > 0) positionMap[classResults[0].studentRollNumber] = '1st';
        if(classResults.length > 1) positionMap[classResults[1].studentRollNumber] = '2nd';
        if(classResults.length > 2) positionMap[classResults[2].studentRollNumber] = '3rd';

        results = results.map(r => {
            const studentForPos = allStudents.find(s => s.Roll_Number === r.studentRollNumber);
            if (studentForPos?.Class === student.Class) {
                return { ...r, position: positionMap[r.studentRollNumber] || 'No Position' };
            }
            return r;
        });
    }
    
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
