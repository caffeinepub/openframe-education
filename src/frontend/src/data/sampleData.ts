import type {
  AttendanceRecord,
  Certificate,
  ClassLevel,
  DemoBooking,
  Homework,
  Payment,
  PricingPlan,
  Referral,
  ScheduledClass,
  Student,
  StudyMaterial,
  TestResult,
} from "../backend.d";

export const SAMPLE_CLASS_LEVELS: ClassLevel[] = [
  {
    id: BigInt(1),
    name: "Nursery – UKG",
    subjects: ["EVS", "English", "Maths", "Drawing"],
    monthlyFee: BigInt(250),
  },
  {
    id: BigInt(2),
    name: "1st to 5th",
    subjects: ["English", "Maths", "Science", "Social", "Kannada"],
    monthlyFee: BigInt(300),
  },
  {
    id: BigInt(3),
    name: "6th to 8th",
    subjects: ["English", "Maths", "Science", "Social", "Kannada", "Hindi"],
    monthlyFee: BigInt(350),
  },
  {
    id: BigInt(4),
    name: "9th to 10th",
    subjects: ["English", "Maths", "Science", "Social", "Kannada", "Hindi"],
    monthlyFee: BigInt(400),
  },
  {
    id: BigInt(5),
    name: "11th to 12th",
    subjects: ["Physics", "Chemistry", "Maths/Biology", "Commerce", "Arts"],
    monthlyFee: BigInt(500),
  },
];

export const SAMPLE_PRICING_PLANS: PricingPlan[] = [
  {
    planId: BigInt(1),
    name: "Basic Plan",
    monthlyPrice: BigInt(299),
    features: ["Live Classes", "Daily Homework", "Weekly Tests"],
    isPopular: false,
  },
  {
    planId: BigInt(2),
    name: "Standard Plan",
    monthlyPrice: BigInt(399),
    features: [
      "Live Classes",
      "Daily Homework",
      "Weekly Tests",
      "Doubt Clearing Sessions",
      "Recorded Videos",
      "Progress Report",
    ],
    isPopular: true,
  },
  {
    planId: BigInt(3),
    name: "Premium Plan",
    monthlyPrice: BigInt(499),
    features: [
      "Live Classes",
      "Daily Homework",
      "Weekly Tests",
      "Doubt Clearing Sessions",
      "Recorded Videos",
      "Progress Report",
      "Personal Mentoring",
      "Course Certificate",
      "Study Materials Download",
    ],
    isPopular: false,
  },
];

export const SAMPLE_DEMO_BOOKINGS: DemoBooking[] = [];

export const SAMPLE_STUDENTS: Student[] = [];

export const SAMPLE_ATTENDANCE: AttendanceRecord[] = [];

export const SAMPLE_HOMEWORK: Homework[] = [];

export const SAMPLE_TEST_RESULTS: TestResult[] = [];

export const SAMPLE_STUDY_MATERIALS: StudyMaterial[] = [];

export const SAMPLE_CERTIFICATES: Certificate[] = [];

export const SAMPLE_REFERRALS: Referral[] = [];

export const SAMPLE_SCHEDULED_CLASSES: ScheduledClass[] = [];

export const SAMPLE_PAYMENTS: Payment[] = [];

// Exam & Performance sample data
export const SAMPLE_EXAMS = [
  {
    id: "ex1",
    title: "Mathematics Unit Test 1",
    className: "8th",
    section: "A",
    subject: "Mathematics",
    date: "2026-03-10",
    totalMarks: 50,
    createdBy: "Mrs. Lakshmi",
  },
  {
    id: "ex2",
    title: "Science Mid-Term",
    className: "7th",
    section: "B",
    subject: "Science",
    date: "2026-03-12",
    totalMarks: 100,
    createdBy: "Mr. Rajan",
  },
  {
    id: "ex3",
    title: "English Grammar Test",
    className: "5th",
    section: "A",
    subject: "English",
    date: "2026-03-15",
    totalMarks: 30,
    createdBy: "Mrs. Priya",
  },
];

export const SAMPLE_EXAM_RESULTS = [
  {
    id: "er1",
    examId: "ex1",
    studentName: "Rahul Kumar",
    rollNo: "01",
    marksObtained: 45,
    grade: "A+",
    remarks: "Excellent",
  },
  {
    id: "er2",
    examId: "ex1",
    studentName: "Priya Sharma",
    rollNo: "02",
    marksObtained: 38,
    grade: "B+",
    remarks: "Good",
  },
  {
    id: "er3",
    examId: "ex1",
    studentName: "Kiran Patil",
    rollNo: "03",
    marksObtained: 22,
    grade: "C",
    remarks: "Needs Improvement",
  },
  {
    id: "er4",
    examId: "ex1",
    studentName: "Anita Desai",
    rollNo: "04",
    marksObtained: 48,
    grade: "A+",
    remarks: "Outstanding",
  },
  {
    id: "er5",
    examId: "ex1",
    studentName: "Suresh Naik",
    rollNo: "05",
    marksObtained: 19,
    grade: "D",
    remarks: "Weak – needs extra attention",
  },
  {
    id: "er6",
    examId: "ex2",
    studentName: "Rahul Kumar",
    rollNo: "01",
    marksObtained: 82,
    grade: "A",
    remarks: "Very Good",
  },
  {
    id: "er7",
    examId: "ex2",
    studentName: "Priya Sharma",
    rollNo: "02",
    marksObtained: 91,
    grade: "A+",
    remarks: "Excellent",
  },
];

// Timetable sample data
export const SAMPLE_TIMETABLE = [
  {
    id: "tt1",
    className: "8th",
    section: "A",
    day: "Monday",
    subject: "Mathematics",
    teacher: "Mrs. Lakshmi",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: "tt2",
    className: "8th",
    section: "A",
    day: "Monday",
    subject: "Science",
    teacher: "Mr. Rajan",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "tt3",
    className: "8th",
    section: "A",
    day: "Tuesday",
    subject: "English",
    teacher: "Mrs. Priya",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: "tt4",
    className: "8th",
    section: "A",
    day: "Tuesday",
    subject: "Mathematics",
    teacher: "Mrs. Lakshmi",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "tt5",
    className: "8th",
    section: "A",
    day: "Wednesday",
    subject: "Social Science",
    teacher: "Mr. Suresh",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: "tt6",
    className: "8th",
    section: "A",
    day: "Thursday",
    subject: "Science",
    teacher: "Mr. Rajan",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: "tt7",
    className: "8th",
    section: "A",
    day: "Friday",
    subject: "Mathematics",
    teacher: "Mrs. Lakshmi",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: "tt8",
    className: "8th",
    section: "A",
    day: "Saturday",
    subject: "English",
    teacher: "Mrs. Priya",
    startTime: "09:00",
    endTime: "10:00",
  },
];

// Fee Tracking sample data
export const SAMPLE_FEE_RECORDS = [
  {
    id: "fee1",
    studentName: "Rahul Kumar",
    className: "8th",
    section: "A",
    parentPhone: "9876543210",
    monthlyFee: 350,
    amountPaid: 350,
    dueDate: "2026-03-05",
    paidDate: "2026-03-04",
    status: "Paid",
  },
  {
    id: "fee2",
    studentName: "Priya Sharma",
    className: "8th",
    section: "A",
    parentPhone: "9876543211",
    monthlyFee: 350,
    amountPaid: 0,
    dueDate: "2026-03-05",
    paidDate: null,
    status: "Unpaid",
  },
  {
    id: "fee3",
    studentName: "Kiran Patil",
    className: "7th",
    section: "B",
    parentPhone: "9876543212",
    monthlyFee: 350,
    amountPaid: 350,
    dueDate: "2026-03-05",
    paidDate: "2026-03-06",
    status: "Paid",
  },
  {
    id: "fee4",
    studentName: "Anita Desai",
    className: "5th",
    section: "A",
    parentPhone: "9876543213",
    monthlyFee: 300,
    amountPaid: 150,
    dueDate: "2026-03-05",
    paidDate: null,
    status: "Partial",
  },
  {
    id: "fee5",
    studentName: "Suresh Naik",
    className: "5th",
    section: "A",
    parentPhone: "9876543214",
    monthlyFee: 300,
    amountPaid: 0,
    dueDate: "2026-02-05",
    paidDate: null,
    status: "Overdue",
  },
  {
    id: "fee6",
    studentName: "Meena Joshi",
    className: "3rd",
    section: "A",
    parentPhone: "9876543215",
    monthlyFee: 300,
    amountPaid: 300,
    dueDate: "2026-03-05",
    paidDate: "2026-03-01",
    status: "Paid",
  },
];

// FE GPS Visit Logs sample data
export const SAMPLE_FE_VISIT_LOGS = [
  {
    id: "vl1",
    feId: "fe1",
    feName: "Vijay Kumar",
    date: "2026-03-19",
    time: "10:30 AM",
    latitude: 14.7901,
    longitude: 75.9597,
    address: "Near Main Market, Laxmeshwar",
    purpose: "Student follow-up",
    leadName: "Ramesh Patil",
  },
  {
    id: "vl2",
    feId: "fe1",
    feName: "Vijay Kumar",
    date: "2026-03-19",
    time: "02:15 PM",
    latitude: 14.7856,
    longitude: 75.9612,
    address: "Govt School Area, Gadag",
    purpose: "New lead visit",
    leadName: "Savita Desai",
  },
  {
    id: "vl3",
    feId: "fe2",
    feName: "Ravi Nayak",
    date: "2026-03-19",
    time: "11:00 AM",
    latitude: 14.792,
    longitude: 75.958,
    address: "Vidyanagar, Laxmeshwar",
    purpose: "Enrollment conversion",
    leadName: "Sunil Kumar",
  },
];
