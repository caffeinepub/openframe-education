import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BookUser,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Edit,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  Lock,
  MapPin,
  Newspaper,
  PenLine,
  Phone,
  PlusCircle,
  School,
  Search,
  Share2,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  Users2,
  Wallet,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminAnalyticsSection } from "../../components/analytics/AdminAnalyticsSection";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_DEMO_BOOKINGS,
  SAMPLE_EXAMS,
  SAMPLE_EXAM_RESULTS,
  SAMPLE_FEE_RECORDS,
  SAMPLE_FE_VISIT_LOGS,
  SAMPLE_PAYMENTS,
  SAMPLE_REFERRALS,
  SAMPLE_SCHEDULED_CLASSES,
  SAMPLE_STUDENTS,
  SAMPLE_STUDY_MATERIALS,
  SAMPLE_TIMETABLE,
} from "../../data/sampleData";
import { useActor } from "../../hooks/useActor";
import {
  useGetAllDemoBookings,
  useGetAllStudyMaterials,
} from "../../hooks/useQueries";
import {
  type Blog,
  addBlog,
  deleteBlog,
  generateSlug,
  getBlogs,
  togglePublish,
  updateBlog,
} from "../../utils/blogStore";
import type {
  EnrollmentLead,
  FieldExecAccount,
  MagazineOrder,
  WithdrawalRequest,
} from "../../utils/referralStore";
import {
  approveLead,
  approveWithdrawal,
  fulfillMagazineOrder,
  getFEAccounts,
  getLeads,
  getMagazineOrders,
  getWithdrawals,
  rejectLead,
  rejectWithdrawal,
  resetAllReferralData,
  saveFEAccount,
  updateFEAccount,
  updateLead,
} from "../../utils/referralStore";
import {
  type TeacherAccount,
  addNotification,
  addStudent,
  addTeacher,
  deleteStudent,
  deleteTeacher,
  getAttendance,
  getClassTracking,
  getClasses,
  getHomework,
  getNotifications,
  getStudents,
  getTeachers,
  updateClassTeacher,
  updateStudent,
  updateTeacher,
} from "../../utils/teacherStore";

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "enrollment-leads",
    label: "Enrollment Leads",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "magazine-orders",
    label: "Magazine Orders",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "fe-management",
    label: "FE Management",
    icon: <Users2 className="w-4 h-4" />,
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    id: "commission-reports",
    label: "Commission Reports",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "demo-bookings",
    label: "Demo Bookings",
    icon: <Calendar className="w-4 h-4" />,
  },
  { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="w-4 h-4" />,
  },
  { id: "referrals", label: "Referrals", icon: <Share2 className="w-4 h-4" /> },
  {
    id: "certificates",
    label: "Certificates",
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: "materials",
    label: "Study Materials",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "schedule",
    label: "Class Schedule",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: "blog-manager",
    label: "Blog Manager",
    icon: <Newspaper className="w-4 h-4" />,
  },
  {
    id: "teacher-analytics",
    label: "Teacher Analytics",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: "manage-teachers",
    label: "Manage Teachers",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "school-students",
    label: "School Students",
    icon: <BookUser className="w-4 h-4" />,
  },
  {
    id: "school-classes",
    label: "Classes",
    icon: <School className="w-4 h-4" />,
  },
  {
    id: "teacher-attendance",
    label: "Attendance Reports",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  {
    id: "class-tracking-admin",
    label: "Class Tracking",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  {
    id: "teacher-homework",
    label: "Homework",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "teacher-notifications",
    label: "Notifications",
    icon: <Bell className="w-4 h-4" />,
  },
  {
    id: "exams",
    label: "Exams & Marks",
    icon: <PenLine className="w-4 h-4" />,
  },
  {
    id: "timetable",
    label: "Timetable",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "fee-tracking",
    label: "Fee Tracking",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    id: "fe-locations",
    label: "FE Locations",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: "fe-portal-fes",
    label: "FE Portal FEs",
    icon: <Users2 className="w-4 h-4" />,
  },
  {
    id: "fe-portal-enrollments",
    label: "FE Enrollments",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "fe-identity",
    label: "FE Security",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: "fe-live-feed",
    label: "FE Live Feed",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: "fe-commission-admin",
    label: "FE Commission",
    icon: <IndianRupee className="w-4 h-4" />,
  },
  {
    id: "fe-withdrawals-admin",
    label: "FE Withdrawals",
    icon: <Wallet className="w-4 h-4" />,
  },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Paid: "bg-green-100 text-green-800",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Received: "bg-blue-100 text-blue-800",
  Unpaid: "bg-gray-100 text-gray-600",
  Fulfilled: "bg-green-100 text-green-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

interface NewFEForm {
  feAccountId: string;
  feCode: string;
  name: string;
  phone: string;
  upiDetails: string;
}

// ─── Teacher Management Sub-Components ────────────────────────────────────────

function AdminManageTeachers() {
  const [teacherList, setTeacherList] = useState(getTeachers());
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState<string | null>(null);
  const [tForm, setTForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    subject: "",
    qualification: "",
    assignedClasses: [] as string[],
  });
  const allClasses = getClasses();

  const refreshTeachers = () => setTeacherList(getTeachers());

  const handleAddTeacher = () => {
    if (!tForm.name || !tForm.email || !tForm.password) {
      toast.error("Name, email and password required");
      return;
    }
    if (editTeacherId) {
      updateTeacher(editTeacherId, {
        name: tForm.name,
        email: tForm.email,
        password: tForm.password,
        phone: tForm.phone,
        subject: tForm.subject,
        qualification: tForm.qualification,
        assignedClasses: tForm.assignedClasses,
      });
      for (const c of allClasses) {
        const shouldAssign = tForm.assignedClasses.includes(c.id);
        if (shouldAssign) updateClassTeacher(c.id, editTeacherId);
        else if (c.teacherId === editTeacherId) updateClassTeacher(c.id, "");
      }
      toast.success("Teacher updated!");
      setEditTeacherId(null);
    } else {
      const newT = addTeacher({
        name: tForm.name,
        email: tForm.email,
        password: tForm.password,
        phone: tForm.phone,
        subject: tForm.subject,
        qualification: tForm.qualification,
        assignedClasses: tForm.assignedClasses,
        profilePhoto: "",
      });
      for (const cid of tForm.assignedClasses) {
        updateClassTeacher(cid, newT.id);
      }
      toast.success("Teacher added!");
    }
    setTForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      subject: "",
      qualification: "",
      assignedClasses: [],
    });
    setShowAddTeacher(false);
    refreshTeachers();
  };

  const handleEditTeacher = (t: TeacherAccount) => {
    const assigned = allClasses
      .filter((c) => c.teacherId === t.id)
      .map((c) => c.id);
    setTForm({
      name: t.name,
      email: t.email,
      password: t.password,
      phone: t.phone,
      subject: t.subject,
      qualification: t.qualification,
      assignedClasses: assigned,
    });
    setEditTeacherId(t.id);
    setShowAddTeacher(true);
  };

  const handleDeleteTeacher = (id: string) => {
    deleteTeacher(id);
    for (const c of allClasses) {
      if (c.teacherId === id) updateClassTeacher(c.id, "");
    }
    refreshTeachers();
    toast.success("Teacher deleted");
  };

  const toggleClassAssign = (cid: string) => {
    setTForm((f) => ({
      ...f,
      assignedClasses: f.assignedClasses.includes(cid)
        ? f.assignedClasses.filter((id) => id !== cid)
        : [...f.assignedClasses, cid],
    }));
  };

  return (
    <div>
      <SectionHeader
        title="Manage Teachers"
        description="Add, edit, and manage teacher accounts"
      />
      <div className="flex justify-end mb-4">
        <button
          type="button"
          data-ocid="teacher.manage.open_modal_button"
          onClick={() => {
            setShowAddTeacher(!showAddTeacher);
            setEditTeacherId(null);
            setTForm({
              name: "",
              email: "",
              password: "",
              phone: "",
              subject: "",
              qualification: "",
              assignedClasses: [],
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {showAddTeacher && (
        <div
          className="bg-white rounded-2xl border border-border p-6 mb-6"
          data-ocid="teacher.manage.panel"
        >
          <h3 className="font-semibold mb-4">
            {editTeacherId ? "Edit Teacher" : "Add New Teacher"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                label: "Full Name *",
                key: "name",
                placeholder: "Dr. Ramesh Kumar",
              },
              {
                label: "Email *",
                key: "email",
                placeholder: "teacher@school.edu",
              },
              { label: "Password *", key: "password", placeholder: "Password" },
              { label: "Phone", key: "phone", placeholder: "+91 9876543210" },
              { label: "Subject", key: "subject", placeholder: "Mathematics" },
              {
                label: "Qualification",
                key: "qualification",
                placeholder: "M.Sc, B.Ed",
              },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  placeholder={placeholder}
                  type={key === "password" ? "password" : "text"}
                  value={
                    (tForm as Record<string, string | string[]>)[key] as string
                  }
                  onChange={(e) =>
                    setTForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  data-ocid={`teacher.manage.${key}.input`}
                  className="mt-1"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Assigned Classes</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                {allClasses.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={tForm.assignedClasses.includes(c.id)}
                      onChange={() => toggleClassAssign(c.id)}
                      data-ocid="teacher.manage.classes.checkbox"
                      className="w-3.5 h-3.5"
                    />
                    {c.className}-{c.section}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              data-ocid="teacher.manage.save_button"
              onClick={handleAddTeacher}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              {editTeacherId ? "Save Changes" : "Add Teacher"}
            </button>
            <button
              type="button"
              data-ocid="teacher.manage.cancel_button"
              onClick={() => setShowAddTeacher(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <Table data-ocid="teacher.manage.table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="teacher.manage.empty_state"
                >
                  No teachers added yet. Click "Add Teacher" to begin.
                </TableCell>
              </TableRow>
            )}
            {teacherList.map((t, idx) => {
              const assigned = allClasses.filter((c) => c.teacherId === t.id);
              return (
                <TableRow
                  key={t.id}
                  data-ocid={`teacher.manage.row.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.phone || "—"}
                  </TableCell>
                  <TableCell>{t.subject || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.qualification || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {assigned.length > 0
                      ? assigned
                          .map((c) => `${c.className}-${c.section}`)
                          .join(", ")
                      : "None"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-ocid={`teacher.manage.edit_button.${idx + 1}`}
                        onClick={() => handleEditTeacher(t)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-ocid={`teacher.manage.delete_button.${idx + 1}`}
                        onClick={() => handleDeleteTeacher(t.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminSchoolStudents() {
  const [studentList, setStudentList] = useState(getStudents());
  const [filterClass, setFilterClass] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const allClasses = getClasses();
  const [sForm, setSForm] = useState({
    name: "",
    classId: "",
    section: "A" as const,
    rollNumber: "",
    parentName: "",
    parentPhone: "",
    dateOfBirth: "",
  });

  const refreshStudents = () => setStudentList(getStudents());
  const filtered = filterClass
    ? studentList.filter((s) => s.classId === filterClass)
    : studentList;

  const handleAddStudent = () => {
    if (!sForm.name || !sForm.classId || !sForm.rollNumber) {
      toast.error("Name, class and roll number required");
      return;
    }
    if (editStudentId) {
      updateStudent(editStudentId, sForm);
      toast.success("Student updated!");
      setEditStudentId(null);
    } else {
      addStudent(sForm);
      toast.success("Student added!");
    }
    setSForm({
      name: "",
      classId: "",
      section: "A",
      rollNumber: "",
      parentName: "",
      parentPhone: "",
      dateOfBirth: "",
    });
    setShowAddStudent(false);
    refreshStudents();
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    refreshStudents();
    toast.success("Student deleted");
  };

  return (
    <div>
      <SectionHeader
        title="School Students"
        description="Manage student enrollments by class"
      />
      <div className="flex flex-wrap gap-3 justify-between mb-4">
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          data-ocid="admin.students.select"
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All Classes</option>
          {allClasses.map((c) => (
            <option key={c.id} value={c.id}>
              Class {c.className} - {c.section}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-ocid="admin.students.open_modal_button"
          onClick={() => {
            setShowAddStudent(!showAddStudent);
            setEditStudentId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" /> Add Student
        </button>
      </div>

      {showAddStudent && (
        <div
          className="bg-white rounded-2xl border border-border p-6 mb-6"
          data-ocid="admin.students.panel"
        >
          <h3 className="font-semibold mb-4">
            {editStudentId ? "Edit Student" : "Add New Student"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                label: "Full Name *",
                key: "name",
                placeholder: "Rahul Sharma",
              },
              { label: "Roll Number *", key: "rollNumber", placeholder: "001" },
              {
                label: "Parent Name",
                key: "parentName",
                placeholder: "Mr. Sharma",
              },
              {
                label: "Parent Phone",
                key: "parentPhone",
                placeholder: "+91 9876543210",
              },
              {
                label: "Date of Birth",
                key: "dateOfBirth",
                type: "date" as const,
              },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type={type || "text"}
                  placeholder={placeholder}
                  value={(sForm as Record<string, string>)[key]}
                  onChange={(e) =>
                    setSForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  data-ocid={`admin.students.${key}.input`}
                  className="mt-1"
                />
              </div>
            ))}
            <div>
              <Label>Class *</Label>
              <select
                value={sForm.classId}
                onChange={(e) =>
                  setSForm((f) => ({ ...f, classId: e.target.value }))
                }
                data-ocid="admin.students.class.select"
                className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">-- Select Class --</option>
                {allClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.className} - {c.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              data-ocid="admin.students.save_button"
              onClick={handleAddStudent}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              {editStudentId ? "Save Changes" : "Add Student"}
            </button>
            <button
              type="button"
              data-ocid="admin.students.cancel_button"
              onClick={() => setShowAddStudent(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <Table data-ocid="admin.students.table">
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Parent Name</TableHead>
              <TableHead>Parent Phone</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.students.empty_state"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((s, idx) => {
              const cls = allClasses.find((c) => c.id === s.classId);
              return (
                <TableRow
                  key={s.id}
                  data-ocid={`admin.students.row.item.${idx + 1}`}
                >
                  <TableCell className="font-mono text-xs">
                    {s.rollNumber}
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-sm">
                    {cls ? `${cls.className}-${cls.section}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.parentName || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.parentPhone || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.dateOfBirth || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-ocid={`admin.students.delete_button.${idx + 1}`}
                        onClick={() => handleDeleteStudent(s.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminSchoolClasses() {
  const [classList, setClassList] = useState(getClasses());
  const teacherList = getTeachers();

  const handleAssign = (classId: string, teacherId: string) => {
    updateClassTeacher(classId, teacherId);
    setClassList(getClasses());
    toast.success("Teacher assigned!");
  };

  return (
    <div>
      <SectionHeader
        title="Classes"
        description="Assign teachers to classes (Nursery to 12th, Sections A/B/C)"
      />
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <Table data-ocid="admin.classes.table">
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classList.map((c, idx) => {
              const currentTeacher = teacherList.find(
                (t) => t.id === c.teacherId,
              );
              return (
                <TableRow
                  key={c.id}
                  data-ocid={`admin.classes.row.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">
                    Class {c.className}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      Section {c.section}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select
                      defaultValue={c.teacherId}
                      onChange={(e) => handleAssign(c.id, e.target.value)}
                      data-ocid={`admin.classes.teacher.select.${idx + 1}`}
                      className="border border-border rounded-lg px-3 py-1.5 text-sm bg-white w-full max-w-xs"
                    >
                      <option value="">— Unassigned —</option>
                      {teacherList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.subject})
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    {currentTeacher ? (
                      <span className="text-xs text-green-600 font-semibold">
                        Assigned
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminAttendanceReports() {
  const [filterClassAtt, setFilterClassAtt] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const allClasses = getClasses();
  const allStudents = getStudents();
  const allAtt = getAttendance();

  const filtered = allAtt.filter((a) => {
    if (filterClassAtt && a.classId !== filterClassAtt) return false;
    if (filterDate && a.date !== filterDate) return false;
    return true;
  });

  const presentCount = filtered.filter((a) => a.status === "Present").length;
  const absentCount = filtered.filter((a) => a.status === "Absent").length;
  const lateCount = filtered.filter((a) => a.status === "Late").length;

  const attStatusColor: Record<string, string> = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div>
      <SectionHeader
        title="Attendance Reports"
        description="View and filter student attendance records"
      />
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterClassAtt}
          onChange={(e) => setFilterClassAtt(e.target.value)}
          data-ocid="admin.attendance.class.select"
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All Classes</option>
          {allClasses.map((c) => (
            <option key={c.id} value={c.id}>
              Class {c.className} - {c.section}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          data-ocid="admin.attendance.date.input"
          className="w-auto"
        />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Present", count: presentCount, color: "text-green-600" },
          { label: "Absent", count: absentCount, color: "text-red-600" },
          { label: "Late", count: lateCount, color: "text-yellow-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-border p-4 text-center"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <Table data-ocid="admin.attendance.table">
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.attendance.empty_state"
                >
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
            {filtered.slice(0, 50).map((a, idx) => {
              const stu = allStudents.find((s) => s.id === a.studentId);
              const cls = allClasses.find((c) => c.id === a.classId);
              return (
                <TableRow
                  key={a.id}
                  data-ocid={`admin.attendance.row.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">
                    {stu?.name || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {stu?.rollNumber || "—"}
                  </TableCell>
                  <TableCell>
                    {cls ? `${cls.className}-${cls.section}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.date}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${attStatusColor[a.status] || ""}`}
                    >
                      {a.status}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminClassTracking() {
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterTrackDate, setFilterTrackDate] = useState("");
  const allTracking = getClassTracking();
  const allClasses = getClasses();
  const allTeachers = getTeachers();

  const filtered = allTracking.filter((t) => {
    if (filterTeacher && t.teacherId !== filterTeacher) return false;
    if (filterTrackDate && t.date !== filterTrackDate) return false;
    return true;
  });

  return (
    <div>
      <SectionHeader
        title="Class Tracking"
        description="All classes conducted by teachers"
      />
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterTeacher}
          onChange={(e) => setFilterTeacher(e.target.value)}
          data-ocid="admin.tracking.teacher.select"
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All Teachers</option>
          {allTeachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={filterTrackDate}
          onChange={(e) => setFilterTrackDate(e.target.value)}
          data-ocid="admin.tracking.date.input"
          className="w-auto"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <Table data-ocid="admin.tracking.table">
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Topic Covered</TableHead>
              <TableHead>Homework</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.tracking.empty_state"
                >
                  No class tracking records yet.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((t, idx) => {
              const teacher = allTeachers.find((tc) => tc.id === t.teacherId);
              const cls = allClasses.find((c) => c.id === t.classId);
              return (
                <TableRow
                  key={t.id}
                  data-ocid={`admin.tracking.row.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">
                    {teacher?.name || "—"}
                  </TableCell>
                  <TableCell>
                    {cls ? `${cls.className}-${cls.section}` : "—"}
                  </TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.date}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {t.startTime}–{t.endTime}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate">
                    {t.topicCovered}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.homeworkGiven || "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminTeacherNotifications() {
  const [notifList, setNotifList] = useState(getNotifications());
  const [nTitle, setNTitle] = useState("");
  const [nMessage, setNMessage] = useState("");
  const [nTarget, setNTarget] = useState("all");
  const teacherListForNotif = getTeachers();

  const handleSendNotif = () => {
    if (!nTitle || !nMessage) {
      toast.error("Title and message required");
      return;
    }
    addNotification({
      title: nTitle,
      message: nMessage,
      sentBy: "Admin",
      sentTo: nTarget,
      date: new Date().toLocaleDateString("en-IN"),
    });
    toast.success("Notification sent!");
    setNTitle("");
    setNMessage("");
    setNTarget("all");
    setNotifList(getNotifications());
  };

  return (
    <div>
      <SectionHeader
        title="Teacher Notifications"
        description="Send messages to teachers"
      />
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <h3 className="font-semibold mb-4">Compose Notification</h3>
        <div className="space-y-4">
          <div>
            <Label>Send To</Label>
            <select
              value={nTarget}
              onChange={(e) => setNTarget(e.target.value)}
              data-ocid="admin.notifications.send_to.select"
              className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Teachers</option>
              {teacherListForNotif.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={nTitle}
              onChange={(e) => setNTitle(e.target.value)}
              placeholder="Notification title"
              data-ocid="admin.notifications.title.input"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea
              value={nMessage}
              onChange={(e) => setNMessage(e.target.value)}
              placeholder="Write your message..."
              data-ocid="admin.notifications.message.textarea"
              className="mt-1"
              rows={4}
            />
          </div>
          <button
            type="button"
            data-ocid="admin.notifications.submit_button"
            onClick={handleSendNotif}
            className="px-5 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Notification
          </button>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Sent Notifications</h3>
      {notifList.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-10 text-center"
          data-ocid="admin.notifications.empty_state"
        >
          <p className="text-muted-foreground text-sm">
            No notifications sent yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifList
            .slice()
            .reverse()
            .map((n, idx) => {
              const teacher = teacherListForNotif.find(
                (t) => t.id === n.sentTo,
              );
              return (
                <div
                  key={n.id}
                  className="bg-white rounded-xl border border-border p-4"
                  data-ocid={`admin.notifications.item.${idx + 1}`}
                >
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {n.date} · To:{" "}
                    {n.sentTo === "all"
                      ? "All Teachers"
                      : teacher?.name || n.sentTo}
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// Teacher Sent Notifications (from localStorage)
function AdminTeacherSentNotifications() {
  interface SentNotif {
    id: string;
    teacherName: string;
    principal: string;
    to: string;
    title: string;
    message: string;
    createdAt: string;
  }
  const [items, setItems] = useState<SentNotif[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("teacherSentNotifications");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);
  return (
    <div>
      <h3
        className="font-semibold mb-3 text-sm"
        style={{ color: "oklch(0.2 0.04 265)" }}
      >
        Teacher-Sent Notifications
      </h3>
      {items.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-8 text-center"
          data-ocid="admin.teacher_sent_notifs.empty_state"
        >
          <p className="text-sm text-muted-foreground">
            No notifications sent by teachers yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...items].reverse().map((n, idx) => (
            <div
              key={n.id}
              className="bg-white rounded-xl border border-border p-4"
              data-ocid={`admin.teacher_sent_notifs.item.${idx + 1}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.message}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.45 0.18 262)" }}
                  >
                    To: {n.to}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    By: {n.teacherName}
                  </p>
                  <p className="text-xs text-muted-foreground">{n.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Teacher Class Tracking Logs (from localStorage)
function AdminTeacherClassTrackingLogs() {
  interface TrackEntry {
    id: string;
    teacherName: string;
    principal: string;
    className: string;
    section: string;
    subject: string;
    topic: string;
    date: string;
    startTime: string;
    endTime: string;
    notes: string;
    homeworkGiven: boolean;
    completed: boolean;
  }
  const [items, setItems] = useState<TrackEntry[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("teacherClassTracking");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);
  return (
    <div>
      <h3
        className="font-semibold mb-3 text-sm"
        style={{ color: "oklch(0.2 0.04 265)" }}
      >
        Class Tracking Logs (All Teachers)
      </h3>
      {items.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-8 text-center"
          data-ocid="admin.class_tracking_logs.empty_state"
        >
          <p className="text-sm text-muted-foreground">
            No class tracking entries yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Teacher",
                  "Class",
                  "Subject",
                  "Topic",
                  "Date",
                  "Time",
                  "Status",
                  "HW",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...items].reverse().map((t, idx) => (
                <tr
                  key={t.id}
                  className="border-t border-border hover:bg-slate-50"
                  data-ocid={`admin.class_tracking_logs.row.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{t.teacherName}</td>
                  <td className="px-4 py-3">
                    {t.className}-{t.section}
                  </td>
                  <td className="px-4 py-3">{t.subject}</td>
                  <td className="px-4 py-3 max-w-[160px] truncate text-muted-foreground">
                    {t.topic}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {t.startTime}–{t.endTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.completed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {t.completed ? "Done" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {t.homeworkGiven ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Admin Exams Section ──────────────────────────────────────────────────────

function AdminExamsSection() {
  const [examList, setExamList] = useState([...SAMPLE_EXAMS]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showAddExam, setShowAddExam] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    className: "",
    section: "A",
    subject: "",
    date: "",
    totalMarks: "50",
  });

  const results = SAMPLE_EXAM_RESULTS.filter((r) => r.examId === selectedExam);
  const selectedExamObj = examList.find((e) => e.id === selectedExam);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Exams & Marks"
        description="Create exams and enter student marks"
      />
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Total Exams"
          value={examList.length}
          icon="📝"
          color="oklch(0.45 0.18 262)"
        />
        <StatsCard
          title="Students Tested"
          value="7"
          icon="🎯"
          color="oklch(0.55 0.16 165)"
        />
        <StatsCard
          title="Avg Score"
          value="72%"
          icon="📊"
          color="oklch(0.68 0.19 50)"
        />
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Exam List</h3>
        <Button
          size="sm"
          onClick={() => setShowAddExam(true)}
          data-ocid="exams.open_modal_button"
          style={{ background: "oklch(0.45 0.18 262)" }}
          className="text-white border-0"
        >
          + Add Exam
        </Button>
      </div>
      {showAddExam && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="font-semibold">New Exam</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={examForm.title}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Exam title"
                data-ocid="exams.input"
              />
            </div>
            <div>
              <Label>Class</Label>
              <Input
                value={examForm.className}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, className: e.target.value }))
                }
                placeholder="8th"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={examForm.subject}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="Mathematics"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={examForm.date}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Total Marks</Label>
              <Input
                value={examForm.totalMarks}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, totalMarks: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-white border-0"
              style={{ background: "oklch(0.45 0.18 262)" }}
              onClick={() => {
                setExamList((l) => [
                  ...l,
                  {
                    ...examForm,
                    id: `ex${Date.now()}`,
                    totalMarks: Number(examForm.totalMarks),
                    createdBy: "Admin",
                  },
                ]);
                setShowAddExam(false);
                toast.success("Exam added");
              }}
              data-ocid="exams.submit_button"
            >
              Save Exam
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddExam(false)}
              data-ocid="exams.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examList.map((ex) => (
              <TableRow key={ex.id}>
                <TableCell className="font-medium">{ex.title}</TableCell>
                <TableCell>
                  {ex.className} {ex.section}
                </TableCell>
                <TableCell>{ex.subject}</TableCell>
                <TableCell>{ex.date}</TableCell>
                <TableCell>{ex.totalMarks}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedExam(ex.id)}
                    data-ocid="exams.secondary_button"
                  >
                    View Results
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() =>
                      setExamList((l) => l.filter((e) => e.id !== ex.id))
                    }
                    data-ocid="exams.delete_button"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedExam && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="font-semibold">Results: {selectedExamObj?.title}</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedExam(null)}
            >
              Close
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    No results entered yet
                  </TableCell>
                </TableRow>
              ) : (
                results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.rollNo}</TableCell>
                    <TableCell>
                      {r.studentName}{" "}
                      {r.marksObtained <
                        (selectedExamObj?.totalMarks ?? 50) * 0.4 && (
                        <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                          Weak
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{r.marksObtained}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{r.grade}</span>
                    </TableCell>
                    <TableCell>{r.remarks}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Admin Timetable Section ──────────────────────────────────────────────────

const CLASS_LIST = [
  "Nursery",
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function AdminTimetableSection() {
  const [ttClass, setTtClass] = useState("8th");
  const [ttSection, setTtSection] = useState("A");
  const [ttEntries, setTtEntries] = useState([...SAMPLE_TIMETABLE]);
  const [showTtForm, setShowTtForm] = useState(false);
  const [ttForm, setTtForm] = useState({
    day: "Monday",
    subject: "",
    teacher: "",
    startTime: "",
    endTime: "",
  });

  const filtered = ttEntries.filter(
    (t) => t.className === ttClass && t.section === ttSection,
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Timetable"
        description="Weekly class schedule per class"
      />
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <Label className="text-xs mb-1 block">Class</Label>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={ttClass}
            onChange={(e) => setTtClass(e.target.value)}
          >
            {CLASS_LIST.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Section</Label>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={ttSection}
            onChange={(e) => setTtSection(e.target.value)}
          >
            {["A", "B", "C"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <Button
          size="sm"
          className="text-white border-0"
          style={{ background: "oklch(0.45 0.18 262)" }}
          onClick={() => setShowTtForm(true)}
          data-ocid="timetable.open_modal_button"
        >
          + Add Schedule
        </Button>
      </div>
      {showTtForm && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="font-semibold">Add Schedule</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Day</Label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                value={ttForm.day}
                onChange={(e) =>
                  setTtForm((f) => ({ ...f, day: e.target.value }))
                }
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                className="mt-1"
                value={ttForm.subject}
                onChange={(e) =>
                  setTtForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="Mathematics"
                data-ocid="timetable.input"
              />
            </div>
            <div>
              <Label>Teacher</Label>
              <Input
                className="mt-1"
                value={ttForm.teacher}
                onChange={(e) =>
                  setTtForm((f) => ({ ...f, teacher: e.target.value }))
                }
                placeholder="Mrs. Lakshmi"
              />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                className="mt-1"
                value={ttForm.startTime}
                onChange={(e) =>
                  setTtForm((f) => ({ ...f, startTime: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                className="mt-1"
                value={ttForm.endTime}
                onChange={(e) =>
                  setTtForm((f) => ({ ...f, endTime: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-white border-0"
              style={{ background: "oklch(0.45 0.18 262)" }}
              onClick={() => {
                setTtEntries((l) => [
                  ...l,
                  {
                    ...ttForm,
                    id: `tt${Date.now()}`,
                    className: ttClass,
                    section: ttSection,
                  },
                ]);
                setShowTtForm(false);
                toast.success("Schedule added");
              }}
              data-ocid="timetable.submit_button"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTtForm(false)}
              data-ocid="timetable.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  No schedule for this class
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-medium">{slot.day}</TableCell>
                  <TableCell>{slot.subject}</TableCell>
                  <TableCell>{slot.teacher}</TableCell>
                  <TableCell>
                    {slot.startTime}–{slot.endTime}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 text-xs"
                      onClick={() =>
                        setTtEntries((l) => l.filter((t) => t.id !== slot.id))
                      }
                      data-ocid="timetable.delete_button"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Admin Fee Tracking Section ───────────────────────────────────────────────

function AdminFeeTrackingSection() {
  const [feeFilter, setFeeFilter] = useState("All");
  const [feeRecords, setFeeRecords] = useState([...SAMPLE_FEE_RECORDS]);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [feeForm, setFeeForm] = useState({
    studentName: "",
    className: "",
    section: "A",
    monthlyFee: "",
    dueDate: "",
  });

  const filtered =
    feeFilter === "All"
      ? feeRecords
      : feeRecords.filter((f) => f.status === feeFilter);
  const totalCollected = feeRecords
    .filter((f) => f.status === "Paid")
    .reduce((s, f) => s + f.amountPaid, 0);
  const totalPending = feeRecords
    .filter((f) => f.status !== "Paid")
    .reduce((s, f) => s + (f.monthlyFee - f.amountPaid), 0);
  const overdueCount = feeRecords.filter((f) => f.status === "Overdue").length;

  const feeStatusColor: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    Unpaid: "bg-red-100 text-red-800",
    Partial: "bg-yellow-100 text-yellow-800",
    Overdue: "bg-red-200 text-red-900",
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fee Tracking"
        description="Monitor student fee payment status"
      />
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Total Collected"
          value={`₹${totalCollected}`}
          icon="✅"
          color="oklch(0.55 0.16 165)"
        />
        <StatsCard
          title="Pending Amount"
          value={`₹${totalPending}`}
          icon="⏳"
          color="oklch(0.68 0.19 50)"
        />
        <StatsCard
          title="Overdue Students"
          value={overdueCount}
          icon="⚠️"
          color="oklch(0.577 0.245 27)"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {["All", "Paid", "Unpaid", "Partial", "Overdue"].map((f) => (
          <Button
            key={f}
            size="sm"
            variant={feeFilter === f ? "default" : "outline"}
            onClick={() => setFeeFilter(f)}
            data-ocid="fee-tracking.tab"
          >
            {f}
          </Button>
        ))}
        <Button
          size="sm"
          className="text-white border-0 ml-auto"
          style={{ background: "oklch(0.45 0.18 262)" }}
          onClick={() => setShowFeeForm(true)}
          data-ocid="fee-tracking.open_modal_button"
        >
          + Add Fee Record
        </Button>
      </div>
      {showFeeForm && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="font-semibold">Add Fee Record</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Student Name</Label>
              <Input
                className="mt-1"
                value={feeForm.studentName}
                onChange={(e) =>
                  setFeeForm((f) => ({ ...f, studentName: e.target.value }))
                }
                data-ocid="fee-tracking.input"
              />
            </div>
            <div>
              <Label>Class</Label>
              <Input
                className="mt-1"
                value={feeForm.className}
                onChange={(e) =>
                  setFeeForm((f) => ({ ...f, className: e.target.value }))
                }
                placeholder="8th"
              />
            </div>
            <div>
              <Label>Monthly Fee</Label>
              <Input
                className="mt-1"
                value={feeForm.monthlyFee}
                onChange={(e) =>
                  setFeeForm((f) => ({ ...f, monthlyFee: e.target.value }))
                }
                placeholder="350"
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                className="mt-1"
                value={feeForm.dueDate}
                onChange={(e) =>
                  setFeeForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-white border-0"
              style={{ background: "oklch(0.45 0.18 262)" }}
              onClick={() => {
                setFeeRecords((l) => [
                  ...l,
                  {
                    id: `fee${Date.now()}`,
                    studentName: feeForm.studentName,
                    className: feeForm.className,
                    section: feeForm.section,
                    parentPhone: "",
                    monthlyFee: Number(feeForm.monthlyFee),
                    amountPaid: 0,
                    dueDate: feeForm.dueDate,
                    paidDate: null,
                    status: "Unpaid",
                  },
                ]);
                setShowFeeForm(false);
                toast.success("Fee record added");
              }}
              data-ocid="fee-tracking.submit_button"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFeeForm(false)}
              data-ocid="fee-tracking.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Monthly Fee</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f, i) => (
              <TableRow key={f.id} data-ocid={`fee-tracking.item.${i + 1}`}>
                <TableCell className="font-medium">{f.studentName}</TableCell>
                <TableCell>
                  {f.className} {f.section}
                </TableCell>
                <TableCell>₹{f.monthlyFee}</TableCell>
                <TableCell>₹{f.amountPaid}</TableCell>
                <TableCell>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${feeStatusColor[f.status] || "bg-gray-100"}`}
                  >
                    {f.status}
                  </span>
                </TableCell>
                <TableCell>{f.dueDate}</TableCell>
                <TableCell>
                  {f.status !== "Paid" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setFeeRecords((l) =>
                          l.map((r) =>
                            r.id === f.id
                              ? {
                                  ...r,
                                  status: "Paid",
                                  amountPaid: r.monthlyFee,
                                  paidDate: new Date()
                                    .toISOString()
                                    .slice(0, 10),
                                }
                              : r,
                          ),
                        );
                        toast.success("Marked as Paid");
                      }}
                      data-ocid="fee-tracking.save_button"
                    >
                      Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Admin FE Locations Section ───────────────────────────────────────────────

function AdminFELocationsSection() {
  const { actor } = useActor();
  const [liveCheckIns, setLiveCheckIns] = useState<
    Array<{
      id: string;
      feName: string;
      time: string;
      lat: number;
      lng: number;
      date: string;
      purpose: string;
      leadName: string;
    }>
  >([]);

  useEffect(() => {
    const load = async () => {
      if (!actor) return;
      try {
        const backendData = (await (
          actor as any
        ).getAllGpsCheckIns()) as Array<{
          checkInId: bigint;
          feId: string;
          feName: string;
          time: string;
          date: string;
          lat: number;
          lng: number;
          purpose: string;
          leadName: string;
          createdAt: bigint;
        }>;
        const mapped = backendData.map((c) => ({
          id: c.checkInId.toString(),
          feName: c.feName || "Field Executive",
          time: c.time,
          lat: Number(c.lat),
          lng: Number(c.lng),
          date: c.date,
          purpose: c.purpose,
          leadName: c.leadName,
        }));
        // Also read from localStorage as fallback and merge
        const localRaw = localStorage.getItem("FE_GPS_CHECKINS");
        let localMapped: typeof mapped = [];
        if (localRaw) {
          try {
            const localData = JSON.parse(localRaw) as Array<{
              id?: string;
              checkInId?: string;
              feName?: string;
              time: string;
              date: string;
              lat: number;
              lng: number;
              purpose: string;
              leadName?: string;
            }>;
            localMapped = localData.map((c) => ({
              id: c.id || c.checkInId || `local-${c.time}-${c.date}`,
              feName: c.feName || "Field Executive",
              time: c.time,
              lat: Number(c.lat),
              lng: Number(c.lng),
              date: c.date,
              purpose: c.purpose,
              leadName: c.leadName || "",
            }));
          } catch {
            // ignore parse errors
          }
        }
        // Merge and deduplicate by id
        const backendIds = new Set(mapped.map((m) => m.id));
        const merged = [
          ...mapped,
          ...localMapped.filter((l) => !backendIds.has(l.id)),
        ];
        setLiveCheckIns(merged);
      } catch {
        // backend unavailable — fall back to localStorage only
        const localRaw = localStorage.getItem("FE_GPS_CHECKINS");
        if (localRaw) {
          try {
            const localData = JSON.parse(localRaw) as Array<{
              id?: string;
              checkInId?: string;
              feName?: string;
              time: string;
              date: string;
              lat: number;
              lng: number;
              purpose: string;
              leadName?: string;
            }>;
            const localMapped = localData.map((c) => ({
              id: c.id || c.checkInId || `local-${c.time}-${c.date}`,
              feName: c.feName || "Field Executive",
              time: c.time,
              lat: Number(c.lat),
              lng: Number(c.lng),
              date: c.date,
              purpose: c.purpose,
              leadName: c.leadName || "",
            }));
            setLiveCheckIns(localMapped);
          } catch {
            // ignore
          }
        }
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [actor]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FE Location Logs"
        description="Real-time GPS check-in data from field executives"
      />
      {liveCheckIns.length === 0 ? (
        <div
          className="bg-white rounded-2xl border p-8 text-center text-muted-foreground"
          data-ocid="fe-locations.empty_state"
        >
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No GPS check-ins yet</p>
          <p className="text-sm mt-1">
            No GPS check-ins yet. Check-ins from the Field Executive panel will
            appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Executive</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Lead</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveCheckIns.map((v, i) => (
                <TableRow key={v.id} data-ocid={`fe-locations.item.${i + 1}`}>
                  <TableCell>{v.feName}</TableCell>
                  <TableCell>{v.date}</TableCell>
                  <TableCell>{v.time}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {v.lat.toFixed(5)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {v.lng.toFixed(5)}
                  </TableCell>
                  <TableCell>{v.purpose}</TableCell>
                  <TableCell>{v.leadName || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { data: demoBookings, refetch: refetchBookings } =
    useGetAllDemoBookings();
  const { data: studyMaterials } = useGetAllStudyMaterials();

  // localStorage-backed state
  const [leads, setLeads] = useState<EnrollmentLead[]>([]);
  const [feAccounts, setFeAccounts] = useState<FieldExecAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [magazineOrders, setMagazineOrders] = useState<MagazineOrder[]>([]);

  // FE Management
  const [showAddFE, setShowAddFE] = useState(false);
  const [newFEForm, setNewFEForm] = useState<NewFEForm>({
    feAccountId: "",
    feCode: "",
    name: "",
    phone: "",
    upiDetails: "",
  });
  const [editFEId, setEditFEId] = useState<string | null>(null);
  const [editUPI, setEditUPI] = useState("");
  const [editActive, setEditActive] = useState(true);

  const bookings = demoBookings ?? [];
  const materials =
    studyMaterials && studyMaterials.length > 0
      ? studyMaterials
      : SAMPLE_STUDY_MATERIALS;

  const [confirmReset, setConfirmReset] = useState(false);

  // ─── Blog Manager State ───────────────────────────────────────────────────────
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogDeleteConfirm, setBlogDeleteConfirm] = useState<number | null>(
    null,
  );
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    category: "Competitive Exams",
    shortDescription: "",
    content: "",
    authorName: "OpenFrame Education Team",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    imageUrl: "",
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    published: true,
  });

  const refreshData = () => {
    setLeads(getLeads());
    setFeAccounts(getFEAccounts());
    setWithdrawals(getWithdrawals());
    setMagazineOrders(getMagazineOrders());
    setAllBlogs(getBlogs());
  };

  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: "",
      slug: "",
      category: "Competitive Exams",
      shortDescription: "",
      content: "",
      authorName: "OpenFrame Education Team",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      imageUrl: "",
      seoTitle: "",
      metaDescription: "",
      keywords: "",
      published: true,
    });
    setBlogDialogOpen(true);
  };

  const openEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      shortDescription: blog.shortDescription,
      content: blog.content,
      authorName: blog.authorName,
      date: blog.date,
      imageUrl: blog.imageUrl,
      seoTitle: blog.seoTitle,
      metaDescription: blog.metaDescription,
      keywords: blog.keywords,
      published: blog.published,
    });
    setBlogDialogOpen(true);
  };

  const handleBlogFormSubmit = () => {
    if (!blogForm.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }
    if (editingBlog) {
      updateBlog({ ...blogForm, id: editingBlog.id });
      toast.success("Blog updated successfully.");
    } else {
      addBlog(blogForm);
      toast.success("Blog published successfully.");
    }
    setBlogDialogOpen(false);
    setAllBlogs(getBlogs());
  };

  const handleBlogDelete = (id: number) => {
    deleteBlog(id);
    setBlogDeleteConfirm(null);
    setAllBlogs(getBlogs());
    toast.success("Blog deleted.");
  };

  const handleTogglePublish = (id: number) => {
    togglePublish(id);
    setAllBlogs(getBlogs());
  };

  const handleResetReferrals = () => {
    resetAllReferralData();
    refreshData();
    setConfirmReset(false);
    toast.success("All referral data has been reset to zero.");
  };

  useEffect(() => {
    setLeads(getLeads());
    setFeAccounts(getFEAccounts());
    setWithdrawals(getWithdrawals());
    setMagazineOrders(getMagazineOrders());
    setAllBlogs(getBlogs());
  }, []);

  // ─── FE lookup helper ────────────────────────────────────────────────────────
  const getFEName = (feAccountId: string) => {
    const acc = feAccounts.find((a) => a.feAccountId === feAccountId);
    return acc ? `${acc.name} (${acc.feCode})` : "—";
  };

  // ─── Enrollment Leads Handlers ───────────────────────────────────────────────
  const handleApproveLead = (leadId: string) => {
    approveLead(leadId);
    refreshData();
    toast.success("Lead approved and commission credited!");
  };

  const handleRejectLead = (leadId: string) => {
    const note = window.prompt("Reason for rejection (optional):");
    if (note === null) return; // cancelled
    rejectLead(leadId);
    refreshData();
    toast.success("Lead rejected.");
  };

  const handleMarkPayment = (leadId: string) => {
    updateLead(leadId, { paymentStatus: "Received" });
    refreshData();
    toast.success("Payment marked as received.");
  };

  // ─── Magazine Order Handlers ─────────────────────────────────────────────────
  const handleFulfillOrder = (orderId: string) => {
    fulfillMagazineOrder(orderId);
    refreshData();
    toast.success("Magazine order fulfilled!");
  };

  // ─── Withdrawal Handlers ─────────────────────────────────────────────────────
  const handleApproveWithdrawal = (requestId: string) => {
    const note =
      window.prompt("Admin note (optional):", "Payment processed") ?? "";
    approveWithdrawal(requestId, note);
    refreshData();
    toast.success("Withdrawal approved!");
  };

  const handleRejectWithdrawal = (requestId: string) => {
    const note = window.prompt("Reason for rejection:") ?? "";
    rejectWithdrawal(requestId, note);
    refreshData();
    toast.error("Withdrawal rejected.");
  };

  // ─── FE Management Handlers ──────────────────────────────────────────────────
  const handleAddFE = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFEForm.feCode.trim() || !newFEForm.name.trim()) {
      toast.error("FE Code and Name are required.");
      return;
    }
    const existing = feAccounts.find(
      (a) => a.feAccountId === newFEForm.feAccountId.trim(),
    );
    if (existing) {
      toast.error("FE Account ID already exists.");
      return;
    }
    saveFEAccount({
      feAccountId: newFEForm.feAccountId.trim() || `FE${Date.now()}`,
      feCode: newFEForm.feCode.trim(),
      name: newFEForm.name.trim(),
      phone: newFEForm.phone.trim(),
      upiDetails: newFEForm.upiDetails.trim(),
      totalEarned: 0,
      totalWithdrawn: 0,
      enrollmentCount: 0,
      bonusEarned: 0,
      isActive: true,
      createdAt: Date.now(),
    });
    refreshData();
    setShowAddFE(false);
    setNewFEForm({
      feAccountId: "",
      feCode: "",
      name: "",
      phone: "",
      upiDetails: "",
    });
    toast.success("Field Executive added successfully!");
  };

  const startEditFE = (acc: FieldExecAccount) => {
    setEditFEId(acc.feAccountId);
    setEditUPI(acc.upiDetails);
    setEditActive(acc.isActive);
  };

  const saveEditFE = (feAccountId: string) => {
    updateFEAccount(feAccountId, { upiDetails: editUPI, isActive: editActive });
    refreshData();
    setEditFEId(null);
    toast.success("Field Executive updated.");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div>
            <SectionHeader
              title="Admin Overview"
              description="Platform performance at a glance"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Total Students"
                value={SAMPLE_STUDENTS.length}
                icon="👥"
                color="oklch(0.45 0.18 262)"
                trend="+12%"
              />
              <StatsCard
                title="Demo Bookings"
                value={bookings.length}
                icon="📅"
                color="oklch(0.68 0.19 50)"
                trend="+5%"
              />
              <StatsCard
                title="Total Revenue"
                value="₹0"
                icon="💰"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Active Teachers"
                value="0"
                icon="👨‍🏫"
                color="oklch(0.6 0.22 15)"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-2xl p-5 border shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Recent Demo Bookings
                </h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.bookingId.toString()}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: "oklch(0.95 0.01 255)" }}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {b.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.classLevel} · {b.cityVillage}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="bg-white rounded-2xl p-5 border shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Enrollment by Class
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Nursery – UKG" },
                    { label: "1st to 5th" },
                    { label: "6th to 8th" },
                    { label: "9th to 10th" },
                    { label: "11th to 12th" },
                  ].map(({ label }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/70">{label}</span>
                        <span className="font-medium text-foreground">0/0</span>
                      </div>
                      <Progress value={0} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────────────────
      case "enrollment-leads": {
        // Merge localStorage leads with backend DemoBookings for cross-device sync
        const backendLeads: EnrollmentLead[] = (demoBookings ?? []).map(
          (b) => ({
            leadId: b.bookingId.toString(),
            studentName: b.studentName,
            parentName: b.parentName,
            mobile: b.mobile,
            classLevel: b.classLevel,
            courseSelected: b.medium || "—",
            cityVillage: b.cityVillage,
            referralCode: "—",
            feAccountId: "—",
            status: (b.status === "New"
              ? "Pending"
              : b.status === "Approved"
                ? "Approved"
                : "Pending") as import("../../utils/referralStore").LeadStatus,
            paymentStatus: "Unpaid",
            commissionAmount: 0,
            commissionPaid: false,
            createdAt: Number(b.createdAt),
          }),
        );
        const localLeadIds = new Set(leads.map((l) => l.leadId));
        const mergedLeads: EnrollmentLead[] = [
          ...leads,
          ...backendLeads.filter((b) => !localLeadIds.has(b.leadId)),
        ];
        const totalLeads = mergedLeads.length;
        const pendingLeads = mergedLeads.filter(
          (l) => l.status === "Pending",
        ).length;
        const approvedLeads = mergedLeads.filter(
          (l) => l.status === "Approved",
        ).length;
        const rejectedLeads = mergedLeads.filter(
          (l) => l.status === "Rejected",
        ).length;

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Student Enrollment Leads"
              description="Students enrolled via referral links or the Enroll Student form"
              action={
                <button
                  type="button"
                  onClick={() => refetchBookings()}
                  className="text-xs text-blue-600 underline ml-2 hover:text-blue-800"
                >
                  ↻ Refresh
                </button>
              }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatsCard
                title="Total Leads"
                value={totalLeads}
                icon={<ClipboardList className="w-5 h-5" />}
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Pending"
                value={pendingLeads}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Approved"
                value={approvedLeads}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Rejected"
                value={rejectedLeads}
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
            </div>

            {/* Table */}
            {mergedLeads.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="leads.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No enrollment leads yet. Share referral links to get started.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="admin.leads.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Mobile Number</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Field Executive</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mergedLeads.map((lead, idx) => {
                        const isLocked =
                          lead.status === "Rejected" ||
                          (lead.status === "Approved" &&
                            lead.paymentStatus === "Received");

                        return (
                          <TableRow
                            key={lead.leadId}
                            data-ocid={`admin.leads.item.${idx + 1}`}
                          >
                            <TableCell className="font-mono text-xs text-foreground/50">
                              #{idx + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {lead.studentName}
                            </TableCell>
                            <TableCell className="text-sm text-foreground/70">
                              {lead.parentName || "—"}
                            </TableCell>
                            <TableCell className="text-sm font-mono">
                              {lead.mobile || "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {lead.classLevel}
                            </TableCell>
                            <TableCell>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  background: "oklch(0.96 0.03 262)",
                                  color: "oklch(0.45 0.18 262)",
                                }}
                              >
                                {lead.courseSelected}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs">
                              {lead.cityVillage || "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              <select
                                value={
                                  lead.feAccountId === "—"
                                    ? ""
                                    : lead.feAccountId
                                }
                                onChange={(e) => {
                                  const selectedFEId = e.target.value;
                                  // Update in localStorage leads
                                  updateLead(lead.leadId, {
                                    feAccountId: selectedFEId || "—",
                                  });
                                  setLeads(getLeads());
                                }}
                                className="border rounded px-1 py-0.5 text-xs bg-white w-full min-w-[120px]"
                                style={{ borderColor: "oklch(0.88 0.03 255)" }}
                              >
                                <option value="">— Unassigned —</option>
                                {feAccounts.map((fe) => (
                                  <option
                                    key={fe.feAccountId}
                                    value={fe.feAccountId}
                                  >
                                    {fe.name} ({fe.feCode})
                                  </option>
                                ))}
                              </select>
                            </TableCell>
                            <TableCell className="text-xs text-foreground/60">
                              {new Date(lead.createdAt).toLocaleDateString(
                                "en-IN",
                                { day: "2-digit", month: "short" },
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={lead.paymentStatus} />
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              ₹{lead.commissionAmount}
                            </TableCell>
                            <TableCell>
                              {isLocked ? (
                                <span title="No actions available">
                                  <Lock className="w-4 h-4 text-foreground/30" />
                                </span>
                              ) : lead.status === "Pending" ? (
                                <div className="flex flex-wrap gap-1.5">
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5"
                                    onClick={() =>
                                      handleApproveLead(lead.leadId)
                                    }
                                    data-ocid={`admin.leads.approve.primary_button.${idx + 1}`}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-7 text-xs px-2.5"
                                    onClick={() =>
                                      handleRejectLead(lead.leadId)
                                    }
                                    data-ocid={`admin.leads.reject.delete_button.${idx + 1}`}
                                  >
                                    Reject
                                  </Button>
                                  <a
                                    href={`https://wa.me/91${lead.mobile}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-ocid={`admin.leads.contact.primary_button.${idx + 1}`}
                                  >
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 gap-1"
                                    >
                                      <Phone className="w-3 h-3" />
                                      Contact
                                    </Button>
                                  </a>
                                </div>
                              ) : lead.status === "Approved" &&
                                lead.paymentStatus === "Unpaid" ? (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white px-2.5"
                                  onClick={() => handleMarkPayment(lead.leadId)}
                                  data-ocid={`admin.leads.payment.primary_button.${idx + 1}`}
                                >
                                  Mark Payment Received
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "magazine-orders": {
        const totalOrders = magazineOrders.length;
        const pendingOrders = magazineOrders.filter(
          (o) => o.status === "Pending",
        ).length;
        const fulfilledOrders = magazineOrders.filter(
          (o) => o.status === "Fulfilled",
        ).length;

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Magazine Orders"
              description="Pragati Study Magazine orders from field executives"
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatsCard
                title="Total Orders"
                value={totalOrders}
                icon={<BookOpen className="w-5 h-5" />}
                color="oklch(0.52 0.18 145)"
              />
              <StatsCard
                title="Pending"
                value={pendingOrders}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Fulfilled"
                value={fulfilledOrders}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
            </div>

            {/* Table */}
            {magazineOrders.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="magazine.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No magazine orders yet. Field executives can submit orders
                  from their dashboard.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="admin.magazine.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>FE Name/ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {magazineOrders.map((order, idx) => (
                        <TableRow
                          key={order.orderId}
                          data-ocid={`admin.magazine.item.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-foreground/50">
                            #{idx + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.studentName}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {order.mobile}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/70 max-w-[160px] truncate">
                            {order.address}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {order.quantity}
                          </TableCell>
                          <TableCell className="text-xs">
                            {getFEName(order.feAccountId)}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/60">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            {order.status === "Pending" ? (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5"
                                onClick={() =>
                                  handleFulfillOrder(order.orderId)
                                }
                                data-ocid={`admin.magazine.fulfill.primary_button.${idx + 1}`}
                              >
                                Fulfill
                              </Button>
                            ) : (
                              <span title="Already fulfilled">
                                <Lock className="w-4 h-4 text-foreground/30" />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "leaderboard": {
        const sortedFEs = [...feAccounts]
          .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
          .slice(0, 10);

        const rankMedal = (rank: number) => {
          if (rank === 1) return "🥇";
          if (rank === 2) return "🥈";
          if (rank === 3) return "🥉";
          return `#${rank}`;
        };

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Top Field Executives This Month"
              description="Top sellers motivating the team to grow"
            />

            {sortedFEs.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="leaderboard.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No field executives registered yet. Add FEs from FE Management
                  to see the leaderboard.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="admin.leaderboard.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>FE Code</TableHead>
                        <TableHead>Students Enrolled</TableHead>
                        <TableHead>Commission Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFEs.map((acc, idx) => {
                        const rank = idx + 1;
                        const isTopThree = rank <= 3;
                        return (
                          <TableRow
                            key={acc.feAccountId}
                            data-ocid={`admin.leaderboard.item.${idx + 1}`}
                            className={
                              isTopThree
                                ? "bg-gradient-to-r from-yellow-50/60 to-transparent"
                                : ""
                            }
                          >
                            <TableCell>
                              <span
                                className={`text-lg font-bold ${isTopThree ? "" : "font-mono text-sm text-foreground/60"}`}
                              >
                                {rankMedal(rank)}
                              </span>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {acc.name}
                            </TableCell>
                            <TableCell
                              className="font-mono font-bold text-xs"
                              style={{ color: "oklch(0.45 0.18 262)" }}
                            >
                              {acc.feCode}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">
                                  {acc.enrollmentCount}
                                </span>
                                <span className="text-xs text-foreground/50">
                                  students
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-green-700">
                              ₹{acc.totalEarned}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "fe-management":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Field Executive Management"
                description="Add, view, and manage all field executives"
              />
              <Button
                onClick={() => setShowAddFE(!showAddFE)}
                className="gap-2 text-white font-semibold shrink-0"
                style={{ background: "oklch(0.45 0.18 262)" }}
                data-ocid="fe.add.open_modal_button"
              >
                {showAddFE ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Add Field Executive
                  </>
                )}
              </Button>
            </div>

            {/* Add FE Inline Form */}
            {showAddFE && (
              <form
                onSubmit={handleAddFE}
                className="bg-white rounded-2xl border p-6 shadow-sm space-y-4 max-w-lg"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="fe.add.panel"
              >
                <h3 className="font-bold text-foreground">
                  Add Field Executive
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="feId">FE Account ID *</Label>
                    <Input
                      id="feId"
                      value={newFEForm.feAccountId}
                      onChange={(e) =>
                        setNewFEForm((p) => ({
                          ...p,
                          feAccountId: e.target.value,
                        }))
                      }
                      placeholder="e.g. FE1002"
                      className="rounded-xl"
                      data-ocid="fe.id.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="feCode">Referral Code *</Label>
                    <Input
                      id="feCode"
                      value={newFEForm.feCode}
                      onChange={(e) =>
                        setNewFEForm((p) => ({ ...p, feCode: e.target.value }))
                      }
                      placeholder="e.g. RK2045"
                      className="rounded-xl"
                      data-ocid="fe.code.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="feName">Name *</Label>
                    <Input
                      id="feName"
                      value={newFEForm.name}
                      onChange={(e) =>
                        setNewFEForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Full name"
                      className="rounded-xl"
                      data-ocid="fe.name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fePhone">Phone</Label>
                    <Input
                      id="fePhone"
                      value={newFEForm.phone}
                      onChange={(e) =>
                        setNewFEForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      type="tel"
                      className="rounded-xl"
                      data-ocid="fe.phone.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="feUpi">UPI Details</Label>
                  <Input
                    id="feUpi"
                    value={newFEForm.upiDetails}
                    onChange={(e) =>
                      setNewFEForm((p) => ({
                        ...p,
                        upiDetails: e.target.value,
                      }))
                    }
                    placeholder="UPI ID or bank account"
                    className="rounded-xl"
                    data-ocid="fe.upi.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-white font-semibold gap-2"
                  style={{ background: "oklch(0.45 0.18 262)" }}
                  data-ocid="fe.add.submit_button"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Field Executive
                </Button>
              </form>
            )}

            {/* FE Table */}
            {feAccounts.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="fe.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No field executives yet. Add one above.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="fe.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FE Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>UPI Details</TableHead>
                        <TableHead>Total Earned</TableHead>
                        <TableHead>Withdrawn</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Enrollments</TableHead>
                        <TableHead>Bonus</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feAccounts.map((acc, idx) => {
                        const isEditing = editFEId === acc.feAccountId;
                        const balance = acc.totalEarned - acc.totalWithdrawn;

                        return (
                          <TableRow
                            key={acc.feAccountId}
                            data-ocid={`fe.item.${idx + 1}`}
                          >
                            <TableCell
                              className="font-mono font-bold text-xs"
                              style={{ color: "oklch(0.45 0.18 262)" }}
                            >
                              {acc.feCode}
                            </TableCell>
                            <TableCell className="font-medium">
                              {acc.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {acc.phone}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={editUPI}
                                  onChange={(e) => setEditUPI(e.target.value)}
                                  className="h-7 text-xs rounded-lg w-36"
                                  data-ocid={`fe.upi.input.${idx + 1}`}
                                />
                              ) : (
                                <span className="text-xs text-foreground/70">
                                  {acc.upiDetails || "—"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="font-semibold text-green-700">
                              ₹{acc.totalEarned}
                            </TableCell>
                            <TableCell className="text-sm">
                              ₹{acc.totalWithdrawn}
                            </TableCell>
                            <TableCell
                              className="font-semibold"
                              style={{ color: "oklch(0.45 0.18 262)" }}
                            >
                              ₹{balance}
                            </TableCell>
                            <TableCell className="text-center">
                              {acc.enrollmentCount}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-orange-600">
                              ₹{acc.bonusEarned}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Switch
                                  checked={editActive}
                                  onCheckedChange={setEditActive}
                                  data-ocid={`fe.active.switch.${idx + 1}`}
                                />
                              ) : (
                                <StatusBadge
                                  status={acc.isActive ? "Active" : "Inactive"}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <div className="flex gap-1.5">
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-green-600 text-white px-2.5"
                                    onClick={() => saveEditFE(acc.feAccountId)}
                                    data-ocid={`fe.save.save_button.${idx + 1}`}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-2.5"
                                    onClick={() => setEditFEId(null)}
                                    data-ocid={`fe.cancel.cancel_button.${idx + 1}`}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => startEditFE(acc)}
                                  data-ocid={`fe.edit.edit_button.${idx + 1}`}
                                >
                                  Edit
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );

      // ─────────────────────────────────────────────────────────────────────────
      case "withdrawals": {
        const pendingW = withdrawals.filter((w) => w.status === "Pending");
        const approvedW = withdrawals.filter((w) => w.status === "Approved");
        const totalApprovedAmount = approvedW.reduce((s, w) => s + w.amount, 0);

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Withdrawal Requests"
              description="Manage field executive payout requests"
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatsCard
                title="Pending"
                value={pendingW.length}
                icon={<Wallet className="w-5 h-5" />}
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Approved"
                value={approvedW.length}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Total Approved"
                value={`₹${totalApprovedAmount}`}
                icon={<IndianRupee className="w-5 h-5" />}
                color="oklch(0.45 0.18 262)"
              />
            </div>

            {/* Table */}
            {withdrawals.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="withdrawals.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No withdrawal requests yet.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="withdrawals.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>FE Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UPI Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Admin Note</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((w, idx) => (
                        <TableRow
                          key={w.requestId}
                          data-ocid={`withdrawals.item.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-foreground/50">
                            {w.requestId}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {getFEName(w.feAccountId)}
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{w.amount}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/70 max-w-[160px] truncate">
                            {w.upiDetails}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={w.status} />
                          </TableCell>
                          <TableCell className="text-xs text-foreground/50">
                            {new Date(w.createdAt).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/60">
                            {w.adminNote || "—"}
                          </TableCell>
                          <TableCell>
                            {w.status === "Pending" ? (
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5"
                                  onClick={() =>
                                    handleApproveWithdrawal(w.requestId)
                                  }
                                  data-ocid={`withdrawals.approve.primary_button.${idx + 1}`}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 text-xs px-2.5"
                                  onClick={() =>
                                    handleRejectWithdrawal(w.requestId)
                                  }
                                  data-ocid={`withdrawals.reject.delete_button.${idx + 1}`}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span title="Already processed">
                                <Lock className="w-4 h-4 text-foreground/30" />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "commission-reports": {
        // Per-FE summary
        const summaryMap: Record<
          string,
          {
            feCode: string;
            feName: string;
            totalReferrals: number;
            approvedEnrollments: number;
            commissionEarned: number;
            bonusEarned: number;
            totalPaidOut: number;
            balanceOwed: number;
          }
        > = {};

        for (const acc of feAccounts) {
          summaryMap[acc.feAccountId] = {
            feCode: acc.feCode,
            feName: acc.name,
            totalReferrals: 0,
            approvedEnrollments: acc.enrollmentCount,
            commissionEarned: acc.totalEarned,
            bonusEarned: acc.bonusEarned,
            totalPaidOut: acc.totalWithdrawn,
            balanceOwed: acc.totalEarned - acc.totalWithdrawn,
          };
        }

        // Count referrals per FE from leads
        for (const lead of leads) {
          if (summaryMap[lead.feAccountId]) {
            summaryMap[lead.feAccountId].totalReferrals += 1;
          }
        }

        const summaryRows = Object.values(summaryMap);

        const grandTotals = summaryRows.reduce(
          (acc, row) => ({
            totalReferrals: acc.totalReferrals + row.totalReferrals,
            approvedEnrollments:
              acc.approvedEnrollments + row.approvedEnrollments,
            commissionEarned: acc.commissionEarned + row.commissionEarned,
            bonusEarned: acc.bonusEarned + row.bonusEarned,
            totalPaidOut: acc.totalPaidOut + row.totalPaidOut,
            balanceOwed: acc.balanceOwed + row.balanceOwed,
          }),
          {
            totalReferrals: 0,
            approvedEnrollments: 0,
            commissionEarned: 0,
            bonusEarned: 0,
            totalPaidOut: 0,
            balanceOwed: 0,
          },
        );

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Commission Reports"
              description="Per-FE earnings summary and balance overview"
            />

            {summaryRows.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="reports.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No field executives found. Add FEs to see commission reports.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="reports.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FE Code</TableHead>
                        <TableHead>FE Name</TableHead>
                        <TableHead>Total Referrals</TableHead>
                        <TableHead>Approved Enrollments</TableHead>
                        <TableHead>Commission Earned</TableHead>
                        <TableHead>Bonus Earned</TableHead>
                        <TableHead>Total Paid Out</TableHead>
                        <TableHead>Balance Owed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryRows.map((row, idx) => (
                        <TableRow
                          key={row.feCode}
                          data-ocid={`reports.item.${idx + 1}`}
                        >
                          <TableCell
                            className="font-mono font-bold text-xs"
                            style={{ color: "oklch(0.45 0.18 262)" }}
                          >
                            {row.feCode}
                          </TableCell>
                          <TableCell className="font-medium">
                            {row.feName}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.totalReferrals}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.approvedEnrollments}
                          </TableCell>
                          <TableCell className="font-semibold text-green-700">
                            ₹{row.commissionEarned}
                          </TableCell>
                          <TableCell className="font-semibold text-orange-600">
                            ₹{row.bonusEarned}
                          </TableCell>
                          <TableCell className="text-sm">
                            ₹{row.totalPaidOut}
                          </TableCell>
                          <TableCell
                            className="font-bold"
                            style={{ color: "oklch(0.45 0.18 262)" }}
                          >
                            ₹{row.balanceOwed}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Grand Totals Row */}
                      <TableRow
                        className="font-bold"
                        style={{ background: "oklch(0.97 0.03 262)" }}
                      >
                        <TableCell colSpan={2} className="font-extrabold">
                          Grand Total
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {grandTotals.totalReferrals}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {grandTotals.approvedEnrollments}
                        </TableCell>
                        <TableCell className="font-extrabold text-green-700">
                          ₹{grandTotals.commissionEarned}
                        </TableCell>
                        <TableCell className="font-extrabold text-orange-600">
                          ₹{grandTotals.bonusEarned}
                        </TableCell>
                        <TableCell className="font-bold">
                          ₹{grandTotals.totalPaidOut}
                        </TableCell>
                        <TableCell
                          className="font-extrabold"
                          style={{ color: "oklch(0.45 0.18 262)" }}
                        >
                          ₹{grandTotals.balanceOwed}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "demo-bookings":
        return (
          <div>
            <SectionHeader
              title="Demo Bookings"
              description={`${bookings.length} bookings received`}
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.bookingId.toString()}>
                      <TableCell className="font-medium">
                        {b.studentName}
                      </TableCell>
                      <TableCell>{b.parentName}</TableCell>
                      <TableCell>{b.classLevel}</TableCell>
                      <TableCell>{b.mobile}</TableCell>
                      <TableCell>{b.cityVillage}</TableCell>
                      <TableCell>{b.medium}</TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "students":
        return (
          <div>
            <SectionHeader
              title="All Students"
              description={`${SAMPLE_STUDENTS.length} students registered`}
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Syllabus</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_STUDENTS.map((s) => (
                    <TableRow key={s.studentId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{s.studentId.toString()}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.classLevel}</TableCell>
                      <TableCell>{s.syllabus}</TableCell>
                      <TableCell>{s.medium}</TableCell>
                      <TableCell>Plan {s.enrolledPlanId.toString()}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={s.isActive ? "Active" : "Inactive"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "attendance":
        return (
          <div>
            <SectionHeader
              title="Attendance Overview"
              description="Student attendance records"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Present Today"
                value="0"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Absent Today"
                value="0"
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
              <StatsCard
                title="Avg Attendance"
                value="0%"
                icon="📊"
                color="oklch(0.45 0.18 262)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Teacher ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_ATTENDANCE.map((a) => (
                    <TableRow key={a.recordId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{a.recordId.toString()}
                      </TableCell>
                      <TableCell>Student #{a.studentId.toString()}</TableCell>
                      <TableCell>{a.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>
                      <TableCell>Teacher #{a.teacherId.toString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "payments":
        return (
          <div>
            <SectionHeader
              title="Payment Records"
              description="All payment transactions"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Total Revenue"
                value="₹0"
                icon="💰"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Paid"
                value="₹0"
                icon="✅"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Pending"
                value="0"
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_PAYMENTS.map((p) => (
                    <TableRow key={p.paymentId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{p.paymentId.toString()}
                      </TableCell>
                      <TableCell>Student #{p.studentId.toString()}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{(Number(p.amount) / 100).toFixed(0)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        Order-{p.paymentId.toString().padStart(4, "0")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "referrals":
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title="Referral Tracking"
                description="Field executive referrals and commissions"
              />
              <div className="flex gap-2 items-center">
                {confirmReset ? (
                  <>
                    <span className="text-sm text-red-600 font-medium">
                      Are you sure? This cannot be undone.
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-ocid="referrals.confirm_button"
                      onClick={handleResetReferrals}
                    >
                      Yes, Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="referrals.cancel_button"
                      onClick={() => setConfirmReset(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    data-ocid="referrals.delete_button"
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset All Referral Data
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Total Referrals"
                value={SAMPLE_REFERRALS.length}
                icon="🔗"
                color="oklch(0.62 0.2 320)"
              />
              <StatsCard
                title="Paid Commission"
                value={`₹${SAMPLE_REFERRALS.filter((r) => r.isPaid).reduce((a, r) => a + Number(r.commissionAmount), 0)}`}
                icon="💸"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Pending Commission"
                value={`₹${SAMPLE_REFERRALS.filter((r) => !r.isPaid).reduce((a, r) => a + Number(r.commissionAmount), 0)}`}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referral ID</TableHead>
                    <TableHead>Field Exec</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_REFERRALS.map((r) => (
                    <TableRow key={r.referralId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{r.referralId.toString()}
                      </TableCell>
                      <TableCell>Exec #{r.fieldExecId.toString()}</TableCell>
                      <TableCell>Student #{r.studentId.toString()}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{r.commissionAmount.toString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.isPaid ? "Paid" : "Pending"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "certificates":
        return (
          <div>
            <SectionHeader
              title="Certificates"
              description="Issue and manage student certificates"
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatsCard
                title="Total Issued"
                value="0"
                icon="🏆"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="This Month"
                value="0"
                icon="📜"
                color="oklch(0.45 0.18 262)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cert Number</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    [] as {
                      certId: string;
                      certNumber: string;
                      studentId: string;
                      courseName: string;
                      issueDate: string;
                    }[]
                  ).map((c) => (
                    <TableRow key={c.certId}>
                      <TableCell className="font-mono text-xs">
                        {c.certNumber}
                      </TableCell>
                      <TableCell>Student #{c.studentId}</TableCell>
                      <TableCell>{c.courseName}</TableCell>
                      <TableCell>{c.issueDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "materials":
        return (
          <div>
            <SectionHeader
              title="Study Materials"
              description="All uploaded study materials"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((m) => (
                <div
                  key={m.materialId.toString()}
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-lg"
                    style={{ background: "oklch(0.95 0.04 255)" }}
                  >
                    📄
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                    {m.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {m.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "oklch(0.95 0.04 255)",
                        color: "oklch(0.45 0.18 262)",
                      }}
                    >
                      {m.classLevel}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "schedule":
        return (
          <div>
            <SectionHeader
              title="Class Schedule"
              description="All scheduled live classes"
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class Level</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Meeting Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_SCHEDULED_CLASSES.map((sc) => (
                    <TableRow key={sc.classId.toString()}>
                      <TableCell className="font-medium">
                        {sc.subject}
                      </TableCell>
                      <TableCell>{sc.classLevel}</TableCell>
                      <TableCell>Teacher #{sc.teacherId.toString()}</TableCell>
                      <TableCell>{sc.scheduledDate}</TableCell>
                      <TableCell>{sc.scheduledTime}</TableCell>
                      <TableCell>
                        <a
                          href={sc.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Join
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "blog-manager":
        return (
          <div>
            <SectionHeader
              title="Blog Manager"
              description="Create and manage blog posts for the education website"
            />
            <div className="flex justify-end mb-4">
              <button
                type="button"
                data-ocid="blog.open_modal_button"
                onClick={openAddBlog}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Blog
              </button>
            </div>

            {/* Blog Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table data-ocid="blog.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBlogs.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="blog.empty_state"
                      >
                        No blogs yet. Click "Add New Blog" to create your first
                        post.
                      </TableCell>
                    </TableRow>
                  )}
                  {allBlogs.map((blog, idx) => (
                    <TableRow
                      key={blog.id}
                      data-ocid={`blog.row.item.${idx + 1}`}
                    >
                      <TableCell>
                        {blog.imageUrl ? (
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-14 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded bg-gradient-to-br from-blue-400 to-orange-300 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-[180px] truncate">
                        {blog.title}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {blog.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {blog.authorName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {blog.date}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${blog.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-ocid={`blog.edit_button.${idx + 1}`}
                            onClick={() => openEditBlog(blog)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            data-ocid={`blog.delete_button.${idx + 1}`}
                            onClick={() => setBlogDeleteConfirm(blog.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            data-ocid={`blog.toggle.${idx + 1}`}
                            onClick={() => handleTogglePublish(blog.id)}
                            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${blog.published ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                          >
                            {blog.published ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Delete Confirm */}
            {blogDeleteConfirm !== null && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                data-ocid="blog.dialog"
              >
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                  <h3 className="font-bold text-lg mb-2">Delete Blog?</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    This action cannot be undone. The blog post will be
                    permanently deleted.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      data-ocid="blog.confirm_button"
                      onClick={() => handleBlogDelete(blogDeleteConfirm)}
                      className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      data-ocid="blog.cancel_button"
                      onClick={() => setBlogDeleteConfirm(null)}
                      className="flex-1 border border-border rounded-lg py-2 text-sm font-semibold hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Add/Edit Dialog */}
            {blogDialogOpen && (
              <div
                className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8"
                data-ocid="blog.modal"
              >
                <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h3 className="font-bold text-lg">
                      {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                    </h3>
                    <button
                      type="button"
                      data-ocid="blog.close_button"
                      onClick={() => setBlogDialogOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="blog-title-input"
                        className="text-sm font-semibold mb-1 block"
                      >
                        Title *
                      </label>
                      <input
                        type="text"
                        id="blog-title-input"
                        data-ocid="blog.title.input"
                        value={blogForm.title}
                        onChange={(e) =>
                          setBlogForm((p) => ({
                            ...p,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                          }))
                        }
                        placeholder="Blog post title"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="blog-slug-input"
                        className="text-sm font-semibold mb-1 block"
                      >
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        id="blog-slug-input"
                        data-ocid="blog.slug.input"
                        value={blogForm.slug}
                        onChange={(e) =>
                          setBlogForm((p) => ({ ...p, slug: e.target.value }))
                        }
                        placeholder="url-friendly-slug"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-secondary/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="blog-category-select"
                        className="text-sm font-semibold mb-1 block"
                      >
                        Category
                      </label>
                      <select
                        id="blog-category-select"
                        data-ocid="blog.category.select"
                        value={blogForm.category}
                        onChange={(e) =>
                          setBlogForm((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <option>Competitive Exams</option>
                        <option>Scholarships</option>
                        <option>Olympiad Exams</option>
                        <option>Career Guidance</option>
                        <option>Study Tips</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="blog-short-desc"
                        className="text-sm font-semibold mb-1 block"
                      >
                        Short Description (max 200 chars)
                      </label>
                      <textarea
                        id="blog-short-desc"
                        data-ocid="blog.short_desc.textarea"
                        value={blogForm.shortDescription}
                        onChange={(e) =>
                          setBlogForm((p) => ({
                            ...p,
                            shortDescription: e.target.value.slice(0, 200),
                          }))
                        }
                        placeholder="Brief description shown on the blog card"
                        rows={2}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {blogForm.shortDescription.length}/200
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="blog-content"
                        className="text-sm font-semibold mb-1 block"
                      >
                        Content (HTML supported)
                      </label>
                      <textarea
                        id="blog-content"
                        data-ocid="blog.content.textarea"
                        value={blogForm.content}
                        onChange={(e) =>
                          setBlogForm((p) => ({
                            ...p,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Write full blog content here. Use <p> tags for paragraphs."
                        rows={8}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-y font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="blog-author"
                          className="text-sm font-semibold mb-1 block"
                        >
                          Author Name
                        </label>
                        <input
                          type="text"
                          id="blog-author"
                          data-ocid="blog.author.input"
                          value={blogForm.authorName}
                          onChange={(e) =>
                            setBlogForm((p) => ({
                              ...p,
                              authorName: e.target.value,
                            }))
                          }
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-date"
                          className="text-sm font-semibold mb-1 block"
                        >
                          Date
                        </label>
                        <input
                          type="text"
                          id="blog-date"
                          data-ocid="blog.date.input"
                          value={blogForm.date}
                          onChange={(e) =>
                            setBlogForm((p) => ({ ...p, date: e.target.value }))
                          }
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1 block">
                        Blog Image
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          data-ocid="blog.upload_button"
                          className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-3 py-3 text-sm text-muted-foreground hover:border-brand-blue hover:text-brand-blue transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          {blogForm.imageUrl ? "Change Image" : "Upload Image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setBlogForm((p) => ({
                                  ...p,
                                  imageUrl: ev.target?.result as string,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {blogForm.imageUrl && (
                          <div className="relative">
                            <img
                              src={blogForm.imageUrl}
                              alt="Preview"
                              className="w-full h-40 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setBlogForm((p) => ({ ...p, imageUrl: "" }))
                              }
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        SEO Settings
                      </p>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label
                            htmlFor="blog-seo-title"
                            className="text-sm font-semibold mb-1 block"
                          >
                            SEO Title
                          </label>
                          <input
                            type="text"
                            id="blog-seo-title"
                            data-ocid="blog.seo_title.input"
                            value={blogForm.seoTitle}
                            onChange={(e) =>
                              setBlogForm((p) => ({
                                ...p,
                                seoTitle: e.target.value,
                              }))
                            }
                            placeholder="SEO optimized title"
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="blog-meta-desc"
                            className="text-sm font-semibold mb-1 block"
                          >
                            Meta Description
                          </label>
                          <textarea
                            id="blog-meta-desc"
                            data-ocid="blog.meta_desc.textarea"
                            value={blogForm.metaDescription}
                            onChange={(e) =>
                              setBlogForm((p) => ({
                                ...p,
                                metaDescription: e.target.value,
                              }))
                            }
                            placeholder="Under 160 characters"
                            rows={2}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="blog-keywords"
                            className="text-sm font-semibold mb-1 block"
                          >
                            Keywords
                          </label>
                          <input
                            type="text"
                            id="blog-keywords"
                            data-ocid="blog.keywords.input"
                            value={blogForm.keywords}
                            onChange={(e) =>
                              setBlogForm((p) => ({
                                ...p,
                                keywords: e.target.value,
                              }))
                            }
                            placeholder="keyword1, keyword2, keyword3"
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-border">
                      <div>
                        <p className="text-sm font-semibold">Publish Status</p>
                        <p className="text-xs text-muted-foreground">
                          Toggle to publish or save as draft
                        </p>
                      </div>
                      <button
                        type="button"
                        data-ocid="blog.publish.toggle"
                        onClick={() =>
                          setBlogForm((p) => ({
                            ...p,
                            published: !p.published,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${blogForm.published ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${blogForm.published ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 p-6 border-t border-border">
                    <button
                      type="button"
                      data-ocid="blog.submit_button"
                      onClick={handleBlogFormSubmit}
                      className="flex-1 bg-brand-blue text-white rounded-lg py-2.5 text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      {editingBlog ? "Update Blog" : "Publish Blog"}
                    </button>
                    <button
                      type="button"
                      data-ocid="blog.cancel_button"
                      onClick={() => setBlogDialogOpen(false)}
                      className="px-6 border border-border rounded-lg py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "teacher-analytics": {
        const teachers = getTeachers();
        const students = getStudents();
        const today = new Date().toISOString().slice(0, 10);
        const allAtt = getAttendance().filter((a) => a.date === today);
        const presentToday = allAtt.filter(
          (a) => a.status === "Present",
        ).length;
        const attPct =
          allAtt.length > 0
            ? Math.round((presentToday / allAtt.length) * 100)
            : 0;
        const allTracking = getClassTracking().filter((t) => t.date === today);
        return (
          <div>
            <SectionHeader
              title="Teacher Analytics"
              description="Overview of teacher management system"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Teachers",
                  value: teachers.length,
                  color: "text-blue-600",
                },
                {
                  label: "Total Students",
                  value: students.length,
                  color: "text-green-600",
                },
                {
                  label: "Attendance Today",
                  value: `${attPct}%`,
                  color: "text-orange-600",
                },
                {
                  label: "Classes Today",
                  value: allTracking.length,
                  color: "text-purple-600",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl p-5 border border-border shadow-sm"
                >
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    {s.label}
                  </p>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "manage-teachers":
        return <AdminManageTeachers />;

      case "school-students":
        return <AdminSchoolStudents />;

      case "school-classes":
        return <AdminSchoolClasses />;

      case "teacher-attendance":
        return <AdminAttendanceReports />;

      case "class-tracking-admin":
        return <AdminClassTracking />;

      case "teacher-homework": {
        const allHw = getHomework();
        const allClasses = getClasses();
        const allTeachers = getTeachers();
        return (
          <div>
            <SectionHeader
              title="Homework"
              description="All homework assigned by teachers"
            />
            <div className="overflow-x-auto rounded-2xl border border-border bg-white">
              <Table data-ocid="admin.homework.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>File</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allHw.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="admin.homework.empty_state"
                      >
                        No homework assigned yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {allHw.map((hw, idx) => {
                    const teacher = allTeachers.find(
                      (t) => t.id === hw.teacherId,
                    );
                    const cls = allClasses.find((c) => c.id === hw.classId);
                    return (
                      <TableRow
                        key={hw.id}
                        data-ocid={`admin.homework.row.item.${idx + 1}`}
                      >
                        <TableCell className="font-medium">
                          {teacher?.name || "—"}
                        </TableCell>
                        <TableCell>
                          {cls ? `${cls.className}-${cls.section}` : "—"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {hw.title}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                          {hw.description || "—"}
                        </TableCell>
                        <TableCell className="text-sm">{hw.dueDate}</TableCell>
                        <TableCell>
                          {hw.fileUrl ? (
                            <a
                              href={hw.fileUrl}
                              download
                              className="text-xs text-blue-600 underline"
                            >
                              Download
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      }

      case "teacher-notifications":
        return (
          <div className="space-y-8">
            <AdminTeacherNotifications />
            <AdminTeacherSentNotifications />
            <AdminTeacherClassTrackingLogs />
          </div>
        );

      case "exams":
        return <AdminExamsSection />;
      case "timetable":
        return <AdminTimetableSection />;
      case "fee-tracking":
        return <AdminFeeTrackingSection />;
      case "fe-locations":
        return <AdminFELocationsSection />;
      case "fe-portal-fes":
        return <AdminFEPortalFEsSection />;
      case "fe-portal-enrollments":
        return <AdminFEPortalEnrollmentsSection />;
      case "fe-identity":
        return <AdminFEIdentitySection />;
      case "fe-live-feed":
        return <AdminFELiveFeedSection />;
      case "fe-commission-admin":
        return <AdminFECommissionSection />;
      case "fe-withdrawals-admin":
        return <AdminFEWithdrawalsSection />;
      case "analytics":
        return <AdminAnalyticsSection />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Admin"
      subtitle="Admin Dashboard"
      dashboardRole="admin"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

// ─── FE Portal Admin Sections ──────────────────────────────────────────────

interface FEPortalEnrollment {
  id: string;
  studentName: string;
  studentPhone: string;
  classLevel: string;
  courseType: string;
  feId: string;
  feName: string;
  createdAt: string;
}

interface FEPortalFE {
  feId: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  status: string;
  createdAt: string;
}

function lsGetAdmin<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSetAdmin(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function AdminFEPortalFEsSection() {
  const [fes, setFEs] = React.useState<FEPortalFE[]>(() =>
    lsGetAdmin<FEPortalFE[]>("fePortalFEs", []),
  );
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    location: "",
    username: "",
    password: "",
  });

  const allEnrollments = lsGetAdmin<FEPortalEnrollment[]>("feEnrollments", []);

  function getEnrollmentCount(feId: string) {
    return allEnrollments.filter((e) => e.feId === feId).length;
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) return;
    const newFE: FEPortalFE = {
      feId: form.username.toLowerCase(),
      username: form.username.toLowerCase(),
      password: form.password,
      name: form.name,
      phone: form.phone,
      location: form.location,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const updated = [...fes, newFE];
    lsSetAdmin("fePortalFEs", updated);
    setFEs(updated);
    setForm({ name: "", phone: "", location: "", username: "", password: "" });
    setShowAddForm(false);
  }

  function toggleStatus(feId: string) {
    const updated = fes.map((fe) =>
      fe.feId === feId
        ? { ...fe, status: fe.status === "active" ? "inactive" : "active" }
        : fe,
    );
    lsSetAdmin("fePortalFEs", updated);
    setFEs(updated);
  }

  function handleDelete(feId: string) {
    const updated = fes.filter((fe) => fe.feId !== feId);
    lsSetAdmin("fePortalFEs", updated);
    setFEs(updated);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="FE Portal – Field Executives"
          description="Manage field executives who use the FE Portal"
        />
        <Button
          onClick={() => setShowAddForm((p) => !p)}
          className="gap-2 text-white font-semibold shrink-0"
          style={{ background: "oklch(0.45 0.18 262)" }}
          data-ocid="fe_portal_admin.add.open_modal_button"
        >
          <PlusCircle className="w-4 h-4" />
          Add FE
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border p-6 shadow-sm space-y-4 max-w-lg"
          data-ocid="fe_portal_admin.add.panel"
        >
          <h3 className="font-bold text-foreground">Add Field Executive</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Full name"
                className="rounded-xl"
                data-ocid="fe_portal_admin.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                className="rounded-xl"
                data-ocid="fe_portal_admin.phone.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              placeholder="City / Village"
              className="rounded-xl"
              data-ocid="fe_portal_admin.location.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Username *</Label>
              <Input
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                placeholder="e.g. fe003"
                className="rounded-xl"
                data-ocid="fe_portal_admin.username.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password *</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Set password"
                className="rounded-xl"
                data-ocid="fe_portal_admin.password.input"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full text-white font-semibold gap-2"
            style={{ background: "oklch(0.45 0.18 262)" }}
            data-ocid="fe_portal_admin.add.submit_button"
          >
            <PlusCircle className="w-4 h-4" />
            Add Field Executive
          </Button>
        </form>
      )}

      {fes.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center bg-white"
          data-ocid="fe_portal_admin.fe.empty_state"
        >
          <p className="text-sm text-foreground/60">
            No FE Portal executives yet. Add one above.
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
          data-ocid="fe_portal_admin.fe.table"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fes.map((fe, idx) => (
                  <TableRow
                    key={fe.feId}
                    data-ocid={`fe_portal_admin.fe.item.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{fe.name}</TableCell>
                    <TableCell className="text-sm">{fe.phone || "—"}</TableCell>
                    <TableCell className="text-sm">
                      {fe.location || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getEnrollmentCount(fe.feId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          fe.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {fe.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={fe.status === "active"}
                          onCheckedChange={() => toggleStatus(fe.feId)}
                          data-ocid={`fe_portal_admin.fe.toggle.${idx + 1}`}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(fe.feId)}
                          data-ocid={`fe_portal_admin.fe.delete_button.${idx + 1}`}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminFEPortalEnrollmentsSection() {
  const [enrollments, setEnrollments] = React.useState<FEPortalEnrollment[]>(
    [],
  );
  const [search, setSearch] = React.useState("");
  const [filterFE, setFilterFE] = React.useState("all");
  const [filterDate, setFilterDate] = React.useState("");

  React.useEffect(() => {
    function load() {
      setEnrollments(lsGetAdmin<FEPortalEnrollment[]>("feEnrollments", []));
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const fes = lsGetAdmin<FEPortalFE[]>("fePortalFEs", []);
  const allFENames = Array.from(new Set(enrollments.map((e) => e.feName)));

  const filtered = enrollments.filter((e) => {
    const matchSearch =
      e.studentName.toLowerCase().includes(search.toLowerCase()) ||
      e.studentPhone.includes(search);
    const matchFE =
      filterFE === "all" || e.feId === filterFE || e.feName === filterFE;
    const matchDate = !filterDate || e.createdAt.startsWith(filterDate);
    return matchSearch && matchFE && matchDate;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = enrollments.filter((e) =>
    e.createdAt.startsWith(todayStr),
  ).length;
  const activeFECount = fes.filter((fe) => fe.status === "active").length + 2; // +2 for sample FEs

  // Leaderboard
  const feCounts: Record<string, { name: string; count: number }> = {};
  for (const e of enrollments) {
    if (!feCounts[e.feId]) feCounts[e.feId] = { name: e.feName, count: 0 };
    feCounts[e.feId].count++;
  }
  const leaderboard = Object.entries(feCounts)
    .map(([feId, data]) => ({ feId, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  function exportCSV() {
    const headers = [
      "Student Name",
      "Phone",
      "Class",
      "Course",
      "Field Executive",
      "Date",
    ];
    const rows = filtered.map((e) => [
      e.studentName,
      e.studentPhone,
      e.classLevel,
      e.courseType,
      e.feName,
      new Date(e.createdAt).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fe-enrollments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const rankBadgeColors = [
    "oklch(0.78 0.16 80)",
    "oklch(0.75 0.03 255)",
    "oklch(0.65 0.12 60)",
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FE Portal – Enrollments"
        description="All student enrollments submitted by field executives"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{enrollments.length}</p>
            <p className="text-xs text-foreground/60">Total FE Enrollments</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{todayCount}</p>
            <p className="text-xs text-foreground/60">Today's Enrollments</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{activeFECount}</p>
            <p className="text-xs text-foreground/60">Total Active FEs</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              🏆 Top FE Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((fe, idx) => (
                <div
                  key={fe.feId}
                  className="flex items-center gap-3"
                  data-ocid={`fe_portal_admin.leaderboard.item.${idx + 1}`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{
                      background:
                        rankBadgeColors[idx] || "oklch(0.65 0.05 255)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium">{fe.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {fe.count} enrollments
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl w-56"
            data-ocid="fe_portal_admin.search.input"
          />
        </div>
        <select
          value={filterFE}
          onChange={(e) => setFilterFE(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm bg-white"
          data-ocid="fe_portal_admin.fe_filter.select"
        >
          <option value="all">All FEs</option>
          {allFENames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-xl w-44"
          data-ocid="fe_portal_admin.date_filter.input"
        />
        <Button
          variant="outline"
          onClick={exportCSV}
          className="gap-2 ml-auto"
          data-ocid="fe_portal_admin.export.button"
        >
          ⬇ Export CSV
        </Button>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        data-ocid="fe_portal_admin.enrollments.table"
      >
        {filtered.length === 0 ? (
          <div
            className="p-10 text-center"
            data-ocid="fe_portal_admin.enrollments.empty_state"
          >
            <p className="text-sm text-foreground/60">No enrollments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Field Executive</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e, idx) => (
                  <TableRow
                    key={e.id}
                    data-ocid={`fe_portal_admin.enrollment.item.${idx + 1}`}
                  >
                    <TableCell className="text-xs text-foreground/50">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {e.studentName}
                    </TableCell>
                    <TableCell className="text-sm">{e.studentPhone}</TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {e.classLevel}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {e.courseType}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-sm font-medium"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    >
                      {e.feName}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/60">
                      {new Date(e.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FE Security Admin Sections ────────────────────────────────────────────

interface FEPortalSession {
  sessionId: string;
  feId: string;
  feUsername: string;
  feName: string;
  deviceId: string;
  browser: string;
  os: string;
  timestamp: number;
  isNewDevice: boolean;
}

interface FEPortalEnrollmentSecure {
  enrollmentId: string;
  feId: string;
  feUsername: string;
  feName: string;
  studentName: string;
  phone: string;
  course: string;
  plan: string;
  deviceId: string;
  lat?: number;
  lng?: number;
  timestamp: number;
  isSuspicious: boolean;
}

interface FEPortalCheckin {
  checkInId: string;
  feId: string;
  feUsername: string;
  lat: number;
  lng: number;
  deviceId: string;
  timestamp: number;
  isFake: boolean;
}

interface FEPortalFraudLog {
  logId: string;
  feId: string;
  feUsername: string;
  reason: string;
  severity: "low" | "medium" | "high";
  timestamp: number;
}

interface FEPortalWithdrawal {
  requestId: string;
  feId: string;
  feUsername: string;
  feName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: number;
}

interface FECommissionConfig {
  basicRate: number;
  standardRate: number;
  premiumRate: number;
  bonusThreshold: number;
  bonusAmount: number;
}

function AdminFEIdentitySection() {
  const [sessions, setSessions] = React.useState<FEPortalSession[]>([]);
  const [fraudLogs, setFraudLogs] = React.useState<FEPortalFraudLog[]>([]);
  const [fes, setFEs] = React.useState<FEPortalFE[]>([]);
  const [statuses, setStatuses] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    function load() {
      setSessions(lsGetAdmin<FEPortalSession[]>("fe_portal_sessions", []));
      setFraudLogs(lsGetAdmin<FEPortalFraudLog[]>("fe_portal_fraud_logs", []));
      setFEs(
        lsGetAdmin<FEPortalFE[]>("fe_portal_executives", []).concat(
          lsGetAdmin<FEPortalFE[]>("fePortalFEs", []),
        ),
      );
      setStatuses(
        lsGetAdmin<Record<string, string>>("fe_portal_fe_statuses", {}),
      );
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  function updateStatus(feId: string, status: string) {
    const updated = { ...statuses, [feId]: status };
    lsSetAdmin("fe_portal_fe_statuses", updated);
    setStatuses(updated);
    toast.success(`FE status updated to ${status}`);
  }

  const statusBadge = (feId: string) => {
    const s = statuses[feId] || "safe";
    if (s === "blocked")
      return <Badge className="bg-red-600 text-white">Blocked</Badge>;
    if (s === "suspicious")
      return <Badge className="bg-orange-500 text-white">Suspicious</Badge>;
    return <Badge className="bg-green-600 text-white">Safe</Badge>;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FE Security — Internet Identity"
        description="Device fingerprints, session history, and fraud monitoring"
      />

      {/* FE status control */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Field Executive Status Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fes.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="fe_identity.empty_state"
            >
              No FEs found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="fe_identity.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Primary Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fes.map((fe, idx) => (
                    <TableRow
                      key={fe.feId}
                      data-ocid={`fe_identity.row.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">{fe.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {(fe as FEPortalFE & { primaryDeviceId?: string })
                          .primaryDeviceId || "—"}
                      </TableCell>
                      <TableCell>{statusBadge(fe.feId)}</TableCell>
                      <TableCell>
                        <select
                          value={statuses[fe.feId] || "safe"}
                          onChange={(e) =>
                            updateStatus(fe.feId, e.target.value)
                          }
                          className="rounded-lg border border-border px-2 py-1 text-sm bg-background"
                          data-ocid={`fe_identity.status.select.${idx + 1}`}
                        >
                          <option value="safe">Safe</option>
                          <option value="suspicious">Suspicious</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session history */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Login Sessions ({sessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="fe_sessions.empty_state"
            >
              No sessions yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FE Name</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Browser / OS</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>New Device?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.slice(0, 30).map((s, idx) => (
                    <TableRow
                      key={s.sessionId}
                      className={s.isNewDevice ? "bg-orange-50" : ""}
                      data-ocid={`fe_sessions.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">{s.feName}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {s.deviceId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.browser} / {s.os}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(s.timestamp).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {s.isNewDevice ? (
                          <Badge className="bg-orange-500 text-white text-xs">
                            ⚠ New
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Known
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fraud logs */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Fraud Logs ({fraudLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fraudLogs.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="fe_fraud.empty_state"
            >
              No fraud logs
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FE</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fraudLogs.slice(0, 50).map((f, idx) => (
                    <TableRow
                      key={f.logId}
                      className={
                        f.severity === "high"
                          ? "bg-red-50"
                          : f.severity === "medium"
                            ? "bg-orange-50"
                            : ""
                      }
                      data-ocid={`fe_fraud.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {f.feUsername}
                      </TableCell>
                      <TableCell className="text-sm">{f.reason}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            f.severity === "high"
                              ? "bg-red-600 text-white"
                              : f.severity === "medium"
                                ? "bg-orange-500 text-white"
                                : "bg-yellow-500 text-white"
                          }
                        >
                          {f.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(f.timestamp).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminFELiveFeedSection() {
  const [enrollments, setEnrollments] = React.useState<
    FEPortalEnrollmentSecure[]
  >([]);
  const [checkins, setCheckins] = React.useState<FEPortalCheckin[]>([]);

  React.useEffect(() => {
    function load() {
      setEnrollments(
        lsGetAdmin<FEPortalEnrollmentSecure[]>("fe_portal_enrollments", []),
      );
      setCheckins(lsGetAdmin<FEPortalCheckin[]>("fe_portal_checkins", []));
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedEnrollments = [...enrollments].sort(
    (a, b) => b.timestamp - a.timestamp,
  );
  const sortedCheckins = [...checkins].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FE Live Feed"
        description="Real-time enrollment and check-in activity (auto-refreshes every 5s)"
      />

      {/* Live enrollments */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-600 animate-pulse" />
            Live Enrollments ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEnrollments.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="fe_live_enrollments.empty_state"
            >
              No enrollments yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="fe_live_enrollments.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>FE Name</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Flag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEnrollments.slice(0, 50).map((e, idx) => (
                    <TableRow
                      key={e.enrollmentId}
                      className={e.isSuspicious ? "bg-red-50" : ""}
                      data-ocid={`fe_live_enrollments.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {e.studentName}
                      </TableCell>
                      <TableCell className="text-sm">{e.phone}</TableCell>
                      <TableCell className="text-sm">{e.course}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {e.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{e.feName}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {e.deviceId}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(e.timestamp).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {e.isSuspicious ? (
                          <Badge className="bg-red-600 text-white text-xs">
                            ⚠ Suspicious
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ✓ Clean
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPS check-ins */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            GPS Check-Ins ({checkins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCheckins.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="fe_live_checkins.empty_state"
            >
              No check-ins yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="fe_live_checkins.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>FE</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCheckins.slice(0, 30).map((c, idx) => (
                    <TableRow
                      key={c.checkInId}
                      className={c.isFake ? "bg-red-50" : ""}
                      data-ocid={`fe_live_checkins.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {c.feUsername}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.lat.toFixed(4)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.lng.toFixed(4)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.deviceId}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(c.timestamp).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {c.isFake ? (
                          <Badge className="bg-red-600 text-white text-xs">
                            ⚠ Fake GPS
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ✓ Valid
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminFECommissionSection() {
  const [config, setConfig] = React.useState<FECommissionConfig>(() =>
    lsGetAdmin<FECommissionConfig>("fe_portal_commission_config", {
      basicRate: 50,
      standardRate: 100,
      premiumRate: 150,
      bonusThreshold: 10,
      bonusAmount: 100,
    }),
  );
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    lsSetAdmin("fe_portal_commission_config", config);
    setSaved(true);
    toast.success("Commission rates updated!");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FE Commission Config"
        description="Set commission rates for field executives"
      />
      <Card className="rounded-2xl border-0 shadow-sm max-w-lg">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Commission Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Basic Rate (₹)</Label>
                <Input
                  type="number"
                  value={config.basicRate}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      basicRate: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl"
                  data-ocid="fe_commission.basic.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Standard Rate (₹)</Label>
                <Input
                  type="number"
                  value={config.standardRate}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      standardRate: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl"
                  data-ocid="fe_commission.standard.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Premium Rate (₹)</Label>
                <Input
                  type="number"
                  value={config.premiumRate}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      premiumRate: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl"
                  data-ocid="fe_commission.premium.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bonus Threshold (enrollments)</Label>
                <Input
                  type="number"
                  value={config.bonusThreshold}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      bonusThreshold: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl"
                  data-ocid="fe_commission.threshold.input"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Bonus Amount (₹)</Label>
                <Input
                  type="number"
                  value={config.bonusAmount}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      bonusAmount: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl"
                  data-ocid="fe_commission.bonus.input"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full font-semibold rounded-xl text-white"
              style={{ background: "oklch(0.45 0.18 262)" }}
              data-ocid="fe_commission.save_button"
            >
              {saved ? "✓ Saved" : "Save Commission Rates"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminFEWithdrawalsSection() {
  const [withdrawals, setWithdrawals] = React.useState<FEPortalWithdrawal[]>(
    [],
  );

  React.useEffect(() => {
    function load() {
      setWithdrawals(
        lsGetAdmin<FEPortalWithdrawal[]>("fe_portal_withdrawals", []),
      );
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  function updateStatus(requestId: string, status: "approved" | "rejected") {
    const updated = withdrawals.map((w) =>
      w.requestId === requestId ? { ...w, status } : w,
    );
    lsSetAdmin("fe_portal_withdrawals", updated);
    setWithdrawals(updated);
    toast.success(`Withdrawal ${status}`);
  }

  const pending = withdrawals.filter((w) => w.status === "pending");
  const totalPending = pending.reduce((s, w) => s + w.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FE Withdrawals"
        description="Approve or reject field executive withdrawal requests"
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{withdrawals.length}</p>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-600">
              {pending.length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-600">
              ₹{totalPending.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">Pending Amount</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="p-0">
          {withdrawals.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-8"
              data-ocid="fe_withdrawals.empty_state"
            >
              No withdrawal requests
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="fe_withdrawals.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>FE Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...withdrawals]
                    .sort((a, b) => b.requestedAt - a.requestedAt)
                    .map((w, idx) => (
                      <TableRow
                        key={w.requestId}
                        data-ocid={`fe_withdrawals.item.${idx + 1}`}
                      >
                        <TableCell className="font-medium">
                          {w.feName}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{w.amount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              w.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : w.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(w.requestedAt).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {w.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg"
                                onClick={() =>
                                  updateStatus(w.requestId, "approved")
                                }
                                data-ocid={`fe_withdrawals.approve_button.${idx + 1}`}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs rounded-lg"
                                onClick={() =>
                                  updateStatus(w.requestId, "rejected")
                                }
                                data-ocid={`fe_withdrawals.reject_button.${idx + 1}`}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
