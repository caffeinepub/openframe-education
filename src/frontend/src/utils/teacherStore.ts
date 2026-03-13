/**
 * teacherStore.ts
 * localStorage-based data store for Teacher Management System.
 */

export type ClassSection = "A" | "B" | "C";
export type AttendanceStatus = "Present" | "Absent" | "Late";

export interface SchoolClass {
  id: string;
  className: string;
  section: ClassSection;
  teacherId: string;
}

export interface TeacherAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  subject: string;
  qualification: string;
  assignedClasses: string[];
  profilePhoto: string;
  createdAt: string;
}

export interface SchoolStudent {
  id: string;
  name: string;
  classId: string;
  section: ClassSection;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  teacherId: string;
  date: string;
  status: AttendanceStatus;
  documentUrl: string;
  createdAt: string;
}

export interface ClassTrackingRecord {
  id: string;
  teacherId: string;
  classId: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  topicCovered: string;
  homeworkGiven: string;
  createdAt: string;
}

export interface HomeworkRecord {
  id: string;
  teacherId: string;
  classId: string;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string;
  createdAt: string;
}

export interface TeacherNotification {
  id: string;
  title: string;
  message: string;
  sentBy: string;
  sentTo: string;
  date: string;
  read: boolean;
}

const KEYS = {
  teachers: "of_teachers",
  students: "of_school_students",
  classes: "of_school_classes",
  attendance: "of_attendance",
  classTracking: "of_class_tracking",
  homework: "of_homework",
  notifications: "of_teacher_notifications",
};

const CLASS_NAMES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const SECTIONS: ClassSection[] = ["A", "B", "C"];

function initClasses(): void {
  if (localStorage.getItem(KEYS.classes)) return;
  const classes: SchoolClass[] = [];
  for (const cn of CLASS_NAMES) {
    for (const sec of SECTIONS) {
      classes.push({
        id: `${cn}-${sec}`,
        className: cn,
        section: sec,
        teacherId: "",
      });
    }
  }
  localStorage.setItem(KEYS.classes, JSON.stringify(classes));
}

initClasses();

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Teachers ─────────────────────────────────────────────────────────────────

export function getTeachers(): TeacherAccount[] {
  return load<TeacherAccount>(KEYS.teachers);
}

export function addTeacher(
  t: Omit<TeacherAccount, "id" | "createdAt">,
): TeacherAccount {
  const teachers = getTeachers();
  const newT: TeacherAccount = {
    ...t,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  save(KEYS.teachers, [...teachers, newT]);
  return newT;
}

export function updateTeacher(
  id: string,
  updates: Partial<TeacherAccount>,
): void {
  const teachers = getTeachers().map((t) =>
    t.id === id ? { ...t, ...updates } : t,
  );
  save(KEYS.teachers, teachers);
}

export function deleteTeacher(id: string): void {
  save(
    KEYS.teachers,
    getTeachers().filter((t) => t.id !== id),
  );
}

export function getTeacherByEmail(email: string): TeacherAccount | undefined {
  return getTeachers().find(
    (t) => t.email.toLowerCase() === email.toLowerCase(),
  );
}

export function getTeacherById(id: string): TeacherAccount | undefined {
  return getTeachers().find((t) => t.id === id);
}

// ─── Students ─────────────────────────────────────────────────────────────────

export function getStudents(): SchoolStudent[] {
  return load<SchoolStudent>(KEYS.students);
}

export function addStudent(
  s: Omit<SchoolStudent, "id" | "createdAt">,
): SchoolStudent {
  const students = getStudents();
  const newS: SchoolStudent = {
    ...s,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  save(KEYS.students, [...students, newS]);
  return newS;
}

export function updateStudent(
  id: string,
  updates: Partial<SchoolStudent>,
): void {
  save(
    KEYS.students,
    getStudents().map((s) => (s.id === id ? { ...s, ...updates } : s)),
  );
}

export function deleteStudent(id: string): void {
  save(
    KEYS.students,
    getStudents().filter((s) => s.id !== id),
  );
}

export function getStudentsByClass(classId: string): SchoolStudent[] {
  return getStudents().filter((s) => s.classId === classId);
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export function getClasses(): SchoolClass[] {
  return load<SchoolClass>(KEYS.classes);
}

export function updateClassTeacher(classId: string, teacherId: string): void {
  save(
    KEYS.classes,
    getClasses().map((c) => (c.id === classId ? { ...c, teacherId } : c)),
  );
}

export function getClassById(id: string): SchoolClass | undefined {
  return getClasses().find((c) => c.id === id);
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export function getAttendance(): AttendanceRecord[] {
  return load<AttendanceRecord>(KEYS.attendance);
}

export function addAttendanceRecord(
  r: Omit<AttendanceRecord, "id" | "createdAt">,
): AttendanceRecord {
  const records = getAttendance();
  const newR: AttendanceRecord = {
    ...r,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  save(KEYS.attendance, [...records, newR]);
  return newR;
}

export function addBulkAttendance(
  records: Omit<AttendanceRecord, "id" | "createdAt">[],
): void {
  const existing = getAttendance();
  const newRecords = records.map((r) => ({
    ...r,
    id: uid(),
    createdAt: new Date().toISOString(),
  }));
  save(KEYS.attendance, [...existing, ...newRecords]);
}

// ─── Class Tracking ───────────────────────────────────────────────────────────

export function getClassTracking(): ClassTrackingRecord[] {
  return load<ClassTrackingRecord>(KEYS.classTracking);
}

export function addClassTrackingRecord(
  r: Omit<ClassTrackingRecord, "id" | "createdAt">,
): ClassTrackingRecord {
  const records = getClassTracking();
  const newR: ClassTrackingRecord = {
    ...r,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  save(KEYS.classTracking, [...records, newR]);
  return newR;
}

// ─── Homework ─────────────────────────────────────────────────────────────────

export function getHomework(): HomeworkRecord[] {
  return load<HomeworkRecord>(KEYS.homework);
}

export function addHomeworkRecord(
  r: Omit<HomeworkRecord, "id" | "createdAt">,
): HomeworkRecord {
  const records = getHomework();
  const newR: HomeworkRecord = {
    ...r,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  save(KEYS.homework, [...records, newR]);
  return newR;
}

export function deleteHomeworkRecord(id: string): void {
  save(
    KEYS.homework,
    getHomework().filter((h) => h.id !== id),
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function getNotifications(): TeacherNotification[] {
  return load<TeacherNotification>(KEYS.notifications);
}

export function addNotification(
  n: Omit<TeacherNotification, "id" | "read">,
): TeacherNotification {
  const notes = getNotifications();
  const newN: TeacherNotification = { ...n, id: uid(), read: false };
  save(KEYS.notifications, [...notes, newN]);
  return newN;
}

export function markNotificationRead(id: string): void {
  save(
    KEYS.notifications,
    getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)),
  );
}
