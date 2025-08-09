
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
}

export interface Topper {
    id: string;
    name: string;
    grade: string;
    marks: string;
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

  // === General Settings ===
  getSetting: async (key: string): Promise<string | null> => {
    return Promise.resolve(getFromLocalStorage<string | null>(key, null));
  },
  saveSetting: async (key: string, value: string): Promise<void> => {
    saveToLocalStorage(key, value);
    return Promise.resolve();
  }
};
