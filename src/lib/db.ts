
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
  Photo_Path: string; // Stored as ISO string
  Date_Joined: string; // Stored as ISO string
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


export const db = {
  // === Student Methods ===
  getStudents: async (): Promise<Student[]> => {
    return Promise.resolve(getFromLocalStorage<Student[]>('students', []));
  },
  saveStudents: async (students: Student[]): Promise<void> => {
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

  getResultsForClass: async(className: string): Promise<StudentResult[]> => {
    const allResults = await db.getResults();
    const allStudents = await db.getStudents();
    const studentIdsInClass = allStudents
        .filter(s => s.Class === className)
        .map(s => s.Roll_Number);
    
    return allResults.filter(r => studentIdsInClass.includes(r.studentRollNumber));
  },

  saveResult: async (result: StudentResult): Promise<void> => {
    let results = await db.getResults();
    const existingIndex = results.findIndex(r => r.studentRollNumber === result.studentRollNumber);
    if (existingIndex !== -1) {
        results[existingIndex] = result;
    } else {
        results.push(result);
    }

    // After saving, recalculate positions for the entire class
    const student = (await db.getStudents()).find(s => s.Roll_Number === result.studentRollNumber);
    if (student) {
        const classResults = await db.getResultsForClass(student.Class);
        // Sort by percentage descending
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

  // === General Settings ===
  getSetting: async (key: string): Promise<string | null> => {
    return Promise.resolve(getFromLocalStorage<string | null>(key, null));
  },
  saveSetting: async (key: string, value: string): Promise<void> => {
    saveToLocalStorage(key, value);
    return Promise.resolve();
  }
};
