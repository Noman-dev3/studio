
'use client';
import { rtdb } from './firebase'; // Use Realtime Database
import { ref, get, set, remove, child, update } from 'firebase/database';


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
    // For easier querying in RTDB
    student_name_lowercase?: string;
    class_lowercase?: string;
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
  toppers: Topper[];
  adminUsername: string;
  adminPassword: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
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

export const defaultSettings: SiteSettings = {
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
    toppers: [],
    adminUsername: 'admin',
    adminPassword: 'password',
    contactEmail: 'contact@piiss.edu',
    contactPhone: '+1 234 567 890',
    contactAddress: '123 Education Lane, Knowledge City',
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

const rootRef = ref(rtdb);

// Helper to convert snapshot object to array
const snapshotToArray = <T>(snapshotVal: { [key: string]: Omit<T, 'id'> } | null): T[] => {
  if (!snapshotVal) return [];
  return Object.keys(snapshotVal).map(key => ({ ...(snapshotVal[key] as T), id: key }));
};

const dbService = {
  getSettings: async (): Promise<SiteSettings> => {
    const settingsRef = child(rootRef, 'settings/global');
    const snapshot = await get(settingsRef);
    if (snapshot.exists()) {
      return { ...defaultSettings, ...snapshot.val() };
    } else {
      await set(settingsRef, defaultSettings);
      return defaultSettings;
    }
  },
  saveSettings: async (settings: SiteSettings): Promise<void> => {
    await set(child(rootRef, 'settings/global'), settings);
  },

  getStudents: async (): Promise<Student[]> => {
    const snapshot = await get(child(rootRef, 'students'));
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  },
  saveStudents: async (students: Student[]): Promise<void> => {
    const updates: { [key: string]: Student } = {};
    students.forEach(student => {
      updates[`/students/${student.Roll_Number}`] = student;
    });
    await update(ref(rtdb), updates);
  },
  deleteStudent: async (rollNumber: string): Promise<void> => {
    await remove(child(rootRef, `students/${rollNumber}`));
  },

  getTeachers: async (): Promise<Teacher[]> => {
    const snapshot = await get(child(rootRef, 'teachers'));
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  },
  saveTeachers: async (teachers: Teacher[]): Promise<void> => {
    const updates: { [key: string]: Teacher } = {};
    teachers.forEach(teacher => {
      updates[`/teachers/${teacher.Teacher_ID}`] = teacher;
    });
    await update(ref(rtdb), updates);
  },
  deleteTeacher: async (teacherId: string): Promise<void> => {
     await remove(child(rootRef, `teachers/${teacherId}`));
  },

  getToppers: async (): Promise<Topper[]> => {
    const settings = await dbService.getSettings();
    return settings.toppers || [];
  },

  getResults: async (): Promise<StudentResult[]> => {
    const snapshot = await get(child(rootRef, 'results'));
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  },
  getResult: async (queryData: { rollNumber?: string; name?: string; className?: string }): Promise<StudentResult | null> => {
    const cleanRollNumber = queryData.rollNumber?.trim().toLowerCase();
    const cleanName = queryData.name?.trim().toLowerCase();
    const cleanClassName = queryData.className?.trim().toLowerCase();
    
    // In RTDB, complex queries are harder. We'll fetch all and filter.
    // For performance, this would be optimized with server-side functions or denormalized data.
    const allResults = await dbService.getResults();

    if (cleanRollNumber) {
        return allResults.find(r => r.roll_number.toLowerCase() === cleanRollNumber) || null;
    }
    
    if (cleanName && cleanClassName) {
       return allResults.find(r => 
        r.student_name_lowercase === cleanName && 
        r.class_lowercase === cleanClassName
       ) || null;
    }
    
    return null;
  },
  saveResult: async (result: StudentResult): Promise<void> => {
    const resultWithLowercase = {
      ...result,
      student_name_lowercase: result.student_name.toLowerCase(),
      class_lowercase: result.class.toLowerCase()
    };
    const resultRef = child(rootRef, `results/${result.roll_number.trim().toLowerCase()}`);
    await set(resultRef, resultWithLowercase);
  },

  getAdmissions: async (): Promise<Admission[]> => {
    const snapshot = await get(child(rootRef, 'admissions'));
    return snapshotToArray<Admission>(snapshot.val());
  },
  saveAdmission: async (admission: Omit<Admission, 'id'>): Promise<string> => {
    const newId = Date.now().toString();
    const newAdmission: Admission = { ...admission, id: newId };
    const admissionRef = child(rootRef, `admissions/${newId}`);
    await set(admissionRef, newAdmission);
    return newId;
  },
  saveAdmissions: async (admissions: Admission[]): Promise<void> => {
    const updates: { [key: string]: Admission } = {};
    admissions.forEach(adm => {
      updates[`/admissions/${adm.id}`] = adm;
    });
    await update(ref(rtdb), updates);
  },
};

export { dbService as db };
