import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ClassLevel {
    id: bigint;
    subjects: Array<string>;
    name: string;
    monthlyFee: bigint;
}
export interface Payment {
    razorpayPaymentId: string;
    status: string;
    studentId: bigint;
    planId: bigint;
    createdAt: bigint;
    razorpayOrderId: string;
    paymentId: bigint;
    amount: bigint;
}
export interface PricingPlan {
    features: Array<string>;
    planId: bigint;
    name: string;
    isPopular: boolean;
    monthlyPrice: bigint;
}
export interface ScheduledClass {
    subject: string;
    scheduledDate: string;
    scheduledTime: string;
    classId: bigint;
    meetingLink: string;
    teacherId: bigint;
    classLevel: string;
}
export interface DemoBooking {
    status: string;
    bookingId: bigint;
    studentName: string;
    createdAt: bigint;
    classLevel: string;
    cityVillage: string;
    mobile: string;
    parentName: string;
    medium: string;
}
export interface TestResult {
    studentId: bigint;
    maxScore: bigint;
    subject: string;
    testDate: string;
    score: bigint;
    resultId: bigint;
}
export interface StudyMaterial {
    title: string;
    createdAt: bigint;
    description: string;
    materialId: bigint;
    teacherId: bigint;
    classLevel: string;
    fileUrl: string;
}
export interface Referral {
    studentId: bigint;
    createdAt: bigint;
    isPaid: boolean;
    referralId: bigint;
    commissionAmount: bigint;
    fieldExecId: bigint;
}
export interface AttendanceRecord {
    status: string;
    studentId: bigint;
    date: string;
    teacherId: bigint;
    recordId: bigint;
}
export interface Homework {
    title: string;
    homeworkId: bigint;
    createdAt: bigint;
    dueDate: string;
    description: string;
    teacherId: bigint;
    classLevel: string;
}
export interface Certificate {
    issueDate: string;
    certId: bigint;
    studentId: bigint;
    certNumber: string;
    courseName: string;
}
export interface UserProfile {
    userId: bigint;
    name: string;
    createdAt: bigint;
    role: AppRole;
    email: string;
    phone: string;
}
export interface Student {
    studentId: bigint;
    enrolledPlanId: bigint;
    name: string;
    isActive: boolean;
    referredBy?: bigint;
    classLevel: string;
    parentId: bigint;
    syllabus: string;
    medium: string;
}
export enum AppRole {
    Parent = "Parent",
    Teacher = "Teacher",
    Student = "Student",
    FieldExecutive = "FieldExecutive",
    Admin = "Admin"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmPayment(paymentId: bigint, razorpayPaymentId: string): Promise<boolean>;
    createAttendanceRecord(record: AttendanceRecord): Promise<void>;
    createClassLevel(classLevel: ClassLevel): Promise<void>;
    createDemoBooking(booking: DemoBooking): Promise<void>;
    createHomework(homework: Homework): Promise<void>;
    createPayment(payment: Payment): Promise<void>;
    createPricingPlan(plan: PricingPlan): Promise<void>;
    createRazorpayOrder(studentId: bigint, planId: bigint): Promise<string>;
    createReferral(referral: Referral): Promise<void>;
    createScheduledClass(scheduledClass: ScheduledClass): Promise<void>;
    createStudent(student: Student): Promise<void>;
    createStudyMaterial(material: StudyMaterial): Promise<void>;
    createTestResult(result: TestResult): Promise<void>;
    deleteClassLevel(id: bigint): Promise<void>;
    deleteDemoBooking(bookingId: bigint): Promise<void>;
    deleteHomework(homeworkId: bigint): Promise<void>;
    deletePricingPlan(planId: bigint): Promise<void>;
    deleteScheduledClass(classId: bigint): Promise<void>;
    deleteStudent(studentId: bigint): Promise<void>;
    deleteStudyMaterial(materialId: bigint): Promise<void>;
    generateCertificate(studentId: bigint, courseName: string): Promise<Certificate>;
    getAllClassLevels(): Promise<Array<ClassLevel>>;
    getAllDemoBookings(): Promise<Array<DemoBooking>>;
    getAllPricingPlans(): Promise<Array<PricingPlan>>;
    getAllStudyMaterials(): Promise<Array<StudyMaterial>>;
    getAttendanceByStudent(studentId: bigint): Promise<Array<AttendanceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCertificatesByStudent(studentId: bigint): Promise<Array<Certificate>>;
    getClassSchedule(classLevel: string): Promise<Array<ScheduledClass>>;
    getDemoBooking(bookingId: bigint): Promise<DemoBooking>;
    getHomeworkByClass(classLevel: string): Promise<Array<Homework>>;
    getPaymentsByStudent(studentId: bigint): Promise<Array<Payment>>;
    getReferralsByFieldExec(fieldExecId: bigint): Promise<Array<Referral>>;
    getStudent(studentId: bigint): Promise<Student>;
    getStudentsByParent(parentId: bigint): Promise<Array<Student>>;
    getStudentsByTeacher(teacherId: bigint): Promise<Array<Student>>;
    getStudyMaterials(classLevel: string): Promise<Array<StudyMaterial>>;
    getTestResults(studentId: bigint): Promise<Array<TestResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(userId: bigint): Promise<AppRole | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClassLevel(classLevel: ClassLevel): Promise<void>;
    updateDemoBooking(booking: DemoBooking): Promise<void>;
    updateHomework(homework: Homework): Promise<void>;
    updatePricingPlan(plan: PricingPlan): Promise<void>;
    updateScheduledClass(scheduledClass: ScheduledClass): Promise<void>;
    updateStudent(student: Student): Promise<void>;
    updateStudyMaterial(material: StudyMaterial): Promise<void>;
}
