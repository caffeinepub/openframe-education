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
