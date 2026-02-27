import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useActor } from "./useActor";

// ─── Demo Bookings ───────────────────────────────────────────────────────────
export function useGetAllDemoBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<DemoBooking[]>({
    queryKey: ["demoBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDemoBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDemoBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: DemoBooking) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDemoBooking(booking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demoBookings"] });
    },
  });
}

// ─── Class Levels ─────────────────────────────────────────────────────────────
export function useGetAllClassLevels() {
  const { actor, isFetching } = useActor();
  return useQuery<ClassLevel[]>({
    queryKey: ["classLevels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClassLevels();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Pricing Plans ────────────────────────────────────────────────────────────
export function useGetAllPricingPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<PricingPlan[]>({
    queryKey: ["pricingPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPricingPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Students ─────────────────────────────────────────────────────────────────
export function useGetStudentsByParent(parentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["studentsByParent", parentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentsByParent(parentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudentsByTeacher(teacherId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["studentsByTeacher", teacherId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentsByTeacher(teacherId);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export function useGetAttendanceByStudent(studentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendanceByStudent(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAttendanceRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: AttendanceRecord) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAttendanceRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

// ─── Homework ─────────────────────────────────────────────────────────────────
export function useGetHomeworkByClass(classLevel: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Homework[]>({
    queryKey: ["homework", classLevel],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHomeworkByClass(classLevel);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateHomework() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (homework: Homework) => {
      if (!actor) throw new Error("Not connected");
      return actor.createHomework(homework);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework"] });
    },
  });
}

// ─── Test Results ─────────────────────────────────────────────────────────────
export function useGetTestResults(studentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<TestResult[]>({
    queryKey: ["testResults", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestResults(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Study Materials ──────────────────────────────────────────────────────────
export function useGetAllStudyMaterials() {
  const { actor, isFetching } = useActor();
  return useQuery<StudyMaterial[]>({
    queryKey: ["studyMaterials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudyMaterials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudyMaterials(classLevel: string) {
  const { actor, isFetching } = useActor();
  return useQuery<StudyMaterial[]>({
    queryKey: ["studyMaterials", classLevel],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudyMaterials(classLevel);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStudyMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: StudyMaterial) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStudyMaterial(material);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyMaterials"] });
    },
  });
}

// ─── Certificates ─────────────────────────────────────────────────────────────
export function useGetCertificatesByStudent(studentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Certificate[]>({
    queryKey: ["certificates", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCertificatesByStudent(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      courseName,
    }: { studentId: bigint; courseName: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.generateCertificate(studentId, courseName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

// ─── Referrals ────────────────────────────────────────────────────────────────
export function useGetReferralsByFieldExec(fieldExecId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Referral[]>({
    queryKey: ["referrals", fieldExecId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferralsByFieldExec(fieldExecId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (referral: Referral) => {
      if (!actor) throw new Error("Not connected");
      return actor.createReferral(referral);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}

// ─── Class Schedule ───────────────────────────────────────────────────────────
export function useGetClassSchedule(classLevel: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ScheduledClass[]>({
    queryKey: ["classSchedule", classLevel],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClassSchedule(classLevel);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateScheduledClass() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scheduledClass: ScheduledClass) => {
      if (!actor) throw new Error("Not connected");
      return actor.createScheduledClass(scheduledClass);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSchedule"] });
    },
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export function useGetPaymentsByStudent(studentId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Payment[]>({
    queryKey: ["payments", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentsByStudent(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRazorpayOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      studentId,
      planId,
    }: { studentId: bigint; planId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createRazorpayOrder(studentId, planId);
    },
  });
}

export function useConfirmPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      paymentId,
      razorpayPaymentId,
    }: { paymentId: bigint; razorpayPaymentId: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.confirmPayment(paymentId, razorpayPaymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
