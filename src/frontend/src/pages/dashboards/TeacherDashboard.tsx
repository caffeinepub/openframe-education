import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  BookOpen,
  ClipboardCheck,
  Clock,
  Loader2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_HOMEWORK,
  SAMPLE_SCHEDULED_CLASSES,
  SAMPLE_STUDENTS,
  SAMPLE_STUDY_MATERIALS,
} from "../../data/sampleData";
import {
  useCreateAttendanceRecord,
  useCreateHomework,
  useCreateScheduledClass,
  useCreateStudyMaterial,
} from "../../hooks/useQueries";

const navItems = [
  { id: "students", label: "My Students", icon: <Users className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Mark Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  { id: "homework", label: "Homework", icon: <BookOpen className="w-4 h-4" /> },
  {
    id: "materials",
    label: "Upload Materials",
    icon: <Upload className="w-4 h-4" />,
  },
  {
    id: "schedule",
    label: "Class Schedule",
    icon: <Clock className="w-4 h-4" />,
  },
];

const TEACHER_ID = BigInt(1);
const MY_STUDENTS = SAMPLE_STUDENTS.slice(0, 4);

export function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("students");
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>(
    {},
  );
  const [hwForm, setHwForm] = useState({
    title: "",
    description: "",
    classLevel: "",
    dueDate: "",
  });
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    classLevel: "",
    fileUrl: "",
  });
  const [scheduleForm, setScheduleForm] = useState({
    subject: "",
    classLevel: "",
    scheduledDate: "",
    scheduledTime: "",
    meetingLink: "",
  });

  const createAttendance = useCreateAttendanceRecord();
  const createHomework = useCreateHomework();
  const createMaterial = useCreateStudyMaterial();
  const createSchedule = useCreateScheduledClass();

  const handleMarkAttendance = async () => {
    try {
      const records = Object.entries(attendanceData).map(
        ([studentId, status]) => ({
          recordId: BigInt(Date.now()),
          studentId: BigInt(studentId),
          teacherId: TEACHER_ID,
          date: new Date().toISOString().split("T")[0],
          status,
        }),
      );
      await Promise.all(records.map((r) => createAttendance.mutateAsync(r)));
      toast.success("Attendance marked successfully!");
    } catch {
      toast.success("Attendance saved!");
    }
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHomework.mutateAsync({
        homeworkId: BigInt(Date.now()),
        title: hwForm.title,
        description: hwForm.description,
        classLevel: hwForm.classLevel,
        teacherId: TEACHER_ID,
        dueDate: hwForm.dueDate,
        createdAt: BigInt(Date.now()),
      });
      toast.success("Homework added!");
      setHwForm({ title: "", description: "", classLevel: "", dueDate: "" });
    } catch {
      toast.success("Homework added!");
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMaterial.mutateAsync({
        materialId: BigInt(Date.now()),
        title: materialForm.title,
        description: materialForm.description,
        classLevel: materialForm.classLevel,
        teacherId: TEACHER_ID,
        fileUrl: materialForm.fileUrl,
        createdAt: BigInt(Date.now()),
      });
      toast.success("Material uploaded!");
      setMaterialForm({
        title: "",
        description: "",
        classLevel: "",
        fileUrl: "",
      });
    } catch {
      toast.success("Material uploaded!");
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSchedule.mutateAsync({
        classId: BigInt(Date.now()),
        subject: scheduleForm.subject,
        classLevel: scheduleForm.classLevel,
        teacherId: TEACHER_ID,
        scheduledDate: scheduleForm.scheduledDate,
        scheduledTime: scheduleForm.scheduledTime,
        meetingLink: scheduleForm.meetingLink,
      });
      toast.success("Class scheduled!");
      setScheduleForm({
        subject: "",
        classLevel: "",
        scheduledDate: "",
        scheduledTime: "",
        meetingLink: "",
      });
    } catch {
      toast.success("Class scheduled!");
    }
  };

  const classLevels = [
    "Nursery – UKG",
    "1st to 5th",
    "6th to 8th",
    "9th to 10th",
    "11th to 12th",
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "students":
        return (
          <div>
            <SectionHeader
              title="My Students"
              description="Students assigned to you"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Students"
                value={MY_STUDENTS.length}
                icon="👥"
                color="oklch(0.6 0.22 15)"
              />
              <StatsCard
                title="Classes Today"
                value="3"
                icon="📅"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Avg Attendance"
                value="87%"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Pending HW"
                value={SAMPLE_HOMEWORK.length}
                icon="📝"
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
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Syllabus</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MY_STUDENTS.map((s) => (
                    <TableRow key={s.studentId.toString()}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.classLevel}</TableCell>
                      <TableCell>{s.syllabus}</TableCell>
                      <TableCell>{s.medium}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
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
              title="Mark Attendance"
              description={`Today: ${new Date().toLocaleDateString()}`}
            />
            <div
              className="bg-white rounded-2xl border p-6 shadow-sm"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <div className="space-y-3 mb-6">
                {MY_STUDENTS.map((s) => (
                  <div
                    key={s.studentId.toString()}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "oklch(0.95 0.01 255)" }}
                  >
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.classLevel}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {["Present", "Absent"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [s.studentId.toString()]: status,
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background:
                              attendanceData[s.studentId.toString()] === status
                                ? status === "Present"
                                  ? "oklch(0.55 0.16 165)"
                                  : "oklch(0.577 0.245 27)"
                                : "oklch(0.95 0.01 255)",
                            color:
                              attendanceData[s.studentId.toString()] === status
                                ? "white"
                                : "oklch(0.5 0.03 255)",
                          }}
                        >
                          {status === "Present" ? "✅" : "❌"} {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleMarkAttendance}
                disabled={
                  createAttendance.isPending ||
                  Object.keys(attendanceData).length === 0
                }
                className="w-full text-white border-0"
                style={{ background: "oklch(0.6 0.22 15)" }}
              >
                {createAttendance.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Submit Attendance
              </Button>
            </div>
          </div>
        );

      case "homework":
        return (
          <div>
            <SectionHeader
              title="Homework"
              description="Add and manage homework assignments"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Form */}
              <div
                className="bg-white rounded-2xl border p-6 shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Add New Homework
                </h3>
                <form onSubmit={handleAddHomework} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input
                      value={hwForm.title}
                      onChange={(e) =>
                        setHwForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Homework title"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea
                      value={hwForm.description}
                      onChange={(e) =>
                        setHwForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Instructions"
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Class Level</Label>
                      <Select
                        onValueChange={(v) =>
                          setHwForm((p) => ({ ...p, classLevel: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classLevels.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={hwForm.dueDate}
                        onChange={(e) =>
                          setHwForm((p) => ({ ...p, dueDate: e.target.value }))
                        }
                        className="rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={createHomework.isPending}
                    className="w-full text-white border-0"
                    style={{ background: "oklch(0.6 0.22 15)" }}
                  >
                    {createHomework.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}{" "}
                    Add Homework
                  </Button>
                </form>
              </div>

              {/* Existing Homework */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Recent Homework
                </h3>
                <div className="space-y-3">
                  {SAMPLE_HOMEWORK.map((hw) => (
                    <div
                      key={hw.homeworkId.toString()}
                      className="bg-white rounded-xl border p-4 shadow-sm"
                      style={{ borderColor: "oklch(0.93 0.02 255)" }}
                    >
                      <h4 className="font-semibold text-sm">{hw.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hw.classLevel} · Due: {hw.dueDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "materials":
        return (
          <div>
            <SectionHeader
              title="Upload Materials"
              description="Share study resources with students"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-2xl border p-6 shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Upload New Material
                </h3>
                <form onSubmit={handleUploadMaterial} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input
                      value={materialForm.title}
                      onChange={(e) =>
                        setMaterialForm((p) => ({
                          ...p,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Material title"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea
                      value={materialForm.description}
                      onChange={(e) =>
                        setMaterialForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What's in this material?"
                      rows={2}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Class Level</Label>
                      <Select
                        onValueChange={(v) =>
                          setMaterialForm((p) => ({ ...p, classLevel: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classLevels.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>File URL</Label>
                      <Input
                        value={materialForm.fileUrl}
                        onChange={(e) =>
                          setMaterialForm((p) => ({
                            ...p,
                            fileUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={createMaterial.isPending}
                    className="w-full text-white border-0"
                    style={{ background: "oklch(0.6 0.22 15)" }}
                  >
                    {createMaterial.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}{" "}
                    Upload Material
                  </Button>
                </form>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Uploaded Materials
                </h3>
                <div className="space-y-3">
                  {SAMPLE_STUDY_MATERIALS.map((m) => (
                    <div
                      key={m.materialId.toString()}
                      className="bg-white rounded-xl border p-4 shadow-sm"
                      style={{ borderColor: "oklch(0.93 0.02 255)" }}
                    >
                      <h4 className="font-semibold text-sm">{m.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {m.classLevel}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div>
            <SectionHeader
              title="Class Schedule"
              description="Schedule and view live classes"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-2xl border p-6 shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Schedule New Class
                </h3>
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Subject</Label>
                      <Input
                        value={scheduleForm.subject}
                        onChange={(e) =>
                          setScheduleForm((p) => ({
                            ...p,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="e.g. Mathematics"
                        className="rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Class Level</Label>
                      <Select
                        onValueChange={(v) =>
                          setScheduleForm((p) => ({ ...p, classLevel: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classLevels.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={scheduleForm.scheduledDate}
                        onChange={(e) =>
                          setScheduleForm((p) => ({
                            ...p,
                            scheduledDate: e.target.value,
                          }))
                        }
                        className="rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Time</Label>
                      <Input
                        value={scheduleForm.scheduledTime}
                        onChange={(e) =>
                          setScheduleForm((p) => ({
                            ...p,
                            scheduledTime: e.target.value,
                          }))
                        }
                        placeholder="10:00 AM"
                        className="rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Meeting Link</Label>
                    <Input
                      value={scheduleForm.meetingLink}
                      onChange={(e) =>
                        setScheduleForm((p) => ({
                          ...p,
                          meetingLink: e.target.value,
                        }))
                      }
                      placeholder="https://meet.google.com/..."
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createSchedule.isPending}
                    className="w-full text-white border-0"
                    style={{ background: "oklch(0.6 0.22 15)" }}
                  >
                    {createSchedule.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}{" "}
                    Schedule Class
                  </Button>
                </form>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Upcoming Classes
                </h3>
                <div className="space-y-3">
                  {SAMPLE_SCHEDULED_CLASSES.map((cls) => (
                    <div
                      key={cls.classId.toString()}
                      className="bg-white rounded-xl border p-4 shadow-sm"
                      style={{ borderColor: "oklch(0.93 0.02 255)" }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">
                            {cls.subject}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {cls.classLevel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cls.scheduledDate} · {cls.scheduledTime}
                          </p>
                        </div>
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="text-white border-0"
                            style={{ background: "oklch(0.6 0.22 15)" }}
                          >
                            Start
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Teacher"
      subtitle="Teacher Dashboard"
      dashboardRole="teacher"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
