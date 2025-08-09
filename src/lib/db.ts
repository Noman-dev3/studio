
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

// === Student Methods ===
const getStudents = async (): Promise<Student[]> => {
  return getFromLocalStorage<Student[]>('students', []);
};
const saveStudents = async (students: Student[]): Promise<void> => {
  saveToLocalStorage('students', students);
};

// === Teacher Methods ===
const getTeachers = async (): Promise<Teacher[]> => {
  return getFromLocalStorage<Teacher[]>('teachers', []);
};
const saveTeachers = async (teachers: Teacher[]): Promise<void> => {
  saveToLocalStorage('teachers', teachers);
};

// === Topper Methods ===
const getToppers = async (): Promise<Topper[]> => {
  return getFromLocalStorage<Topper[]>('toppers', []);
};
const saveToppers = async (toppers: Topper[]): Promise<void> => {
  saveToLocalStorage('toppers', toppers);
};

// === Fee Methods ===
const getFees = async (): Promise<Fee[]> => {
  return getFromLocalStorage<Fee[]>('fees', []);
};
const saveFee = async (fee: Fee): Promise<void> => {
  const fees = await getFees();
  const existingIndex = fees.findIndex(f => f.id === fee.id);
  if (existingIndex !== -1) {
    fees[existingIndex] = fee;
  } else {
    fees.push(fee);
  }
  saveToLocalStorage('fees', fees);
};
const saveFees = async (fees: Fee[]): Promise<void> => {
  saveToLocalStorage('fees', fees);
};

// === Result Methods ===
const getResults = async (): Promise<StudentResult[]> => {
    return getFromLocalStorage<StudentResult[]>('results', []);
};

const getResultsForClass = async (className: string): Promise<StudentResult[]> => {
  const allResults = await getResults();
  const allStudents = await getStudents();
  const studentIdsInClass = allStudents
      .filter(s => s.Class === className)
      .map(s => s.Roll_Number);
  
  return allResults.filter(r => studentIdsInClass.includes(r.studentRollNumber));
};

const saveResult = async (result: StudentResult): Promise<void> => {
  let results = await getResults();
  const allStudents = await getStudents();
  const existingIndex = results.findIndex(r => r.studentRollNumber === result.studentRollNumber);
  if (existingIndex !== -1) {
      results[existingIndex] = result;
  } else {
      results.push(result);
  }

  const student = allStudents.find(s => s.Roll_Number === result.studentRollNumber);
  if (student) {
      const classResults = await getResultsForClass(student.Class);
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
};

// === Admission Methods ===
const getAdmissions = async (): Promise<Admission[]> => {
  return getFromLocalStorage<Admission[]>('admissions', []);
};
const saveAdmission = async (admission: Admission): Promise<void> => {
  const admissions = await getAdmissions();
  admissions.push(admission);
  saveToLocalStorage('admissions', admissions);
};

// === General Settings ===
const getSetting = async (key: string): Promise<string | null> => {
    return getFromLocalStorage<string | null>(`setting_${key}`, null);
};
const saveSetting = async (key: string, value: string): Promise<void> => {
    saveToLocalStorage(`setting_${key}`, value);
};

// --- Export the db object ---

export const db = {
  getStudents,
  saveStudents,
  getTeachers,
  saveTeachers,
  getToppers,
  saveToppers,
  getFees,
  saveFee,
  saveFees,
  getResults,
  getResultsForClass,
  saveResult,
  getAdmissions,
  saveAdmission,
  getSetting,
  saveSetting,
};
