
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

// Kept for manual result creation form.
export interface Subject {
  id: string;
  name: string;
  marks: number;
}

export interface StudentResult {
    student_name: string;
    roll_number: string;
    class: string;
    session: string;
    subjects: { [key: string]: number };
    total_marks: number;
    max_marks: number;
    percentage: number;
    grade: string;
    date_created: string;
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

export interface Announcement {
  id: string;
  text: string;
}

export interface Feature {
  id: string;
  text: string;
}

export interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  hint: string;
}

export interface SiteSettings {
  schoolName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  announcements: Announcement[];
  features: Feature[];
  events: Event[];
  testimonials: Testimonial[];
  adminUsername: string;
  adminPassword: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  images: {
    hero: string;
    about: string;
    location: string;
    gallery: GalleryImage[];
  }
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

const defaultSettings: SiteSettings = {
    schoolName: "Pakistan Islamic International School System",
    heroTitle: "Excellence in Education, Rooted in Faith",
    heroSubtitle: "Nurturing young minds to become future leaders through a blend of world-class academics and timeless Islamic values.",
    aboutText: "At PIISS, we are dedicated to providing a balanced and comprehensive education that integrates academic excellence with profound Islamic values. Our mission is to nurture a new generation of leaders who are knowledgeable, pious, and ready to contribute positively to the global community.",
    announcements: [
        { id: '1', text: "Annual Sports Day on December 15th. All are welcome!" },
        { id: '2', text: "Parent-Teacher meetings scheduled for the last week of November." },
        { id: '3', text: "Admissions for the 2024-2025 academic year are now open." },
    ],
    features: [
        { id: '1', text: "Holistic Islamic & Academic Education" },
        { id: '2', text: "Certified & Experienced Faculty" },
        { id: '3', text: "State-of-the-Art Facilities" },
        { id: '4', text: "Focus on Character Building" },
    ],
    events: [
        { id: '1', date: "NOV 25", title: "Annual Science Fair", description: "Showcasing innovative projects from our talented students. Open to all parents and guardians." },
        { id: '2', date: "DEC 15", title: "Annual Sports Day", description: "A day of friendly competition, teamwork, and athletic achievement. Come cheer for our students!" },
        { id: '3', date: "JAN 10", title: "Charity Bake Sale", description: "Raising funds for local community projects. Your support can make a huge difference." },
    ],
    testimonials: [
        { id: '1', name: "The Rahman Family", role: "Parent", avatar: "RF", text: "PIISS has been a blessing for our children. The blend of high-quality education and Islamic teachings is exactly what we were looking for. The teachers are caring and professional." },
        { id: '2', name: "Ali Abdullah", role: "Alumnus, Class of 2022", avatar: "AA", text: "My time at PIISS prepared me not just for university but for life. I developed a strong sense of identity and purpose. I am forever grateful to my teachers and peers." },
        { id: '3', name: "The Siddiqui Family", role: "Parent", avatar: "SF", text: "We are impressed by the school's commitment to excellence in all areas. The facilities are wonderful, and there's a strong sense of community. Highly recommended." },
    ],
    adminUsername: 'admin',
    adminPassword: 'password',
    socials: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#'
    },
    images: {
      hero: "https://placehold.co/1920x1080.png",
      about: "https://placehold.co/600x500.png",
      location: "https://placehold.co/600x500.png",
      gallery: [
        { id: '1', src: "https://placehold.co/600x400.png", alt: "Students in a classroom", hint: "students classroom" },
        { id: '2', src: "https://placehold.co/600x400.png", alt: "School library", hint: "school library" },
        { id: '3', src: "https://placehold.co/600x400.png", alt: "Science lab experiment", hint: "science lab" },
        { id: '4', src: "https://placehold.co/600x400.png", alt: "Students playing sports", hint: "students sports" },
        { id: '5', src: "https://placehold.co/600x400.png", alt: "Art class", hint: "art class" },
        { id: '6', src: "https://placehold.co/600x400.png", alt: "School assembly", hint: "school assembly" },
      ]
    }
};


// --- Data Access Functions ---
// All these functions are async to simulate real database calls
export const db = {
  // === Settings Methods ===
  getSettings: async (): Promise<SiteSettings> => {
    return Promise.resolve(getFromLocalStorage<SiteSettings>('site_settings', defaultSettings));
  },
  saveSettings: async (settings: SiteSettings): Promise<void> => {
    saveToLocalStorage('site_settings', settings);
    return Promise.resolve();
  },

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
  getResult: async (query: { rollNumber?: string; name?: string; className?: string }): Promise<StudentResult | null> => {
      const results = await db.getResults();
      let foundResult: StudentResult | undefined;
      
      const cleanRollNumber = query.rollNumber?.trim().toLowerCase();
      const cleanName = query.name?.trim().toLowerCase();
      const cleanClassName = query.className?.trim().toLowerCase();

      // First, prioritize search by roll number if provided
      if (cleanRollNumber) {
          foundResult = results.find(r => r.roll_number.trim().toLowerCase() === cleanRollNumber);
      }
      
      // If not found by roll number (or if roll number wasn't provided), search by name and class
      if (!foundResult && cleanName && cleanClassName) {
          foundResult = results.find(r => 
              r.student_name.trim().toLowerCase() === cleanName &&
              r.class.trim().toLowerCase() === cleanClassName
          );
      }
      
      return Promise.resolve(foundResult || null);
  },
  saveResult: async (result: StudentResult): Promise<void> => {
    let results = await db.getResults();
    const existingIndex = results.findIndex(r => r.roll_number.trim().toLowerCase() === result.roll_number.trim().toLowerCase());
    
    if (existingIndex !== -1) {
        // Update existing result
        results[existingIndex] = result;
    } else {
        // Add new result
        results.push(result);
    }
    
    saveToLocalStorage('results', results);
    return Promise.resolve();
  },
   saveResults: async (resultsToSave: StudentResult[]): Promise<void> => {
    // This function can be used for bulk uploads in the future, overwriting all results.
    saveToLocalStorage('results', resultsToSave);
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
