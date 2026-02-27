import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Timer "mo:core/Timer";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Application-specific roles
  public type AppRole = {
    #Admin;
    #Student;
    #Parent;
    #Teacher;
    #FieldExecutive;
  };

  public type UserProfile = {
    userId : Nat;
    name : Text;
    email : Text;
    phone : Text;
    role : AppRole;
    createdAt : Nat;
  };

  // Data models
  type Student = {
    studentId : Nat;
    name : Text;
    parentId : Nat;
    classLevel : Text;
    medium : Text;
    syllabus : Text;
    enrolledPlanId : Nat;
    referredBy : ?Nat;
    isActive : Bool;
  };

  type DemoBooking = {
    bookingId : Nat;
    studentName : Text;
    parentName : Text;
    classLevel : Text;
    mobile : Text;
    cityVillage : Text;
    medium : Text;
    status : Text;
    createdAt : Nat;
  };

  type ClassLevel = {
    id : Nat;
    name : Text;
    subjects : [Text];
    monthlyFee : Nat;
  };

  type PricingPlan = {
    planId : Nat;
    name : Text;
    monthlyPrice : Nat;
    features : [Text];
    isPopular : Bool;
  };

  type Payment = {
    paymentId : Nat;
    studentId : Nat;
    planId : Nat;
    amount : Nat;
    razorpayOrderId : Text;
    razorpayPaymentId : Text;
    status : Text;
    createdAt : Nat;
  };

  type AttendanceRecord = {
    recordId : Nat;
    studentId : Nat;
    teacherId : Nat;
    date : Text;
    status : Text;
  };

  type Homework = {
    homeworkId : Nat;
    teacherId : Nat;
    classLevel : Text;
    title : Text;
    description : Text;
    dueDate : Text;
    createdAt : Nat;
  };

  type TestResult = {
    resultId : Nat;
    studentId : Nat;
    subject : Text;
    score : Nat;
    maxScore : Nat;
    testDate : Text;
  };

  type StudyMaterial = {
    materialId : Nat;
    teacherId : Nat;
    classLevel : Text;
    title : Text;
    description : Text;
    fileUrl : Text;
    createdAt : Nat;
  };

  type Certificate = {
    certId : Nat;
    studentId : Nat;
    courseName : Text;
    issueDate : Text;
    certNumber : Text;
  };

  type Referral = {
    referralId : Nat;
    fieldExecId : Nat;
    studentId : Nat;
    commissionAmount : Nat;
    isPaid : Bool;
    createdAt : Nat;
  };

  type ScheduledClass = {
    classId : Nat;
    teacherId : Nat;
    classLevel : Text;
    subject : Text;
    scheduledDate : Text;
    scheduledTime : Text;
    meetingLink : Text;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userIdToPrincipal = Map.empty<Nat, Principal>();
  let students = Map.empty<Nat, Student>();
  let demoBookings = Map.empty<Nat, DemoBooking>();
  let classLevels = Map.empty<Nat, ClassLevel>();
  let pricingPlans = Map.empty<Nat, PricingPlan>();
  let payments = Map.empty<Nat, Payment>();
  let attendanceRecords = Map.empty<Nat, AttendanceRecord>();
  let homeworks = Map.empty<Nat, Homework>();
  let testResults = Map.empty<Nat, TestResult>();
  let studyMaterials = Map.empty<Nat, StudyMaterial>();
  let certificates = Map.empty<Nat, Certificate>();
  let referrals = Map.empty<Nat, Referral>();
  let scheduledClasses = Map.empty<Nat, ScheduledClass>();

  // Helper functions for role checking
  func getAppRole(caller : Principal) : ?AppRole {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.role };
    };
  };

  func isAppAdmin(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#Admin) { true };
      case (_) { false };
    };
  };

  func isTeacher(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#Teacher) { true };
      case (_) { false };
    };
  };

  func isParent(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#Parent) { true };
      case (_) { false };
    };
  };

  func isStudentFunc(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#Student) { true };
      case (_) { false };
    };
  };

  func isFieldExecutive(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#FieldExecutive) { true };
      case (_) { false };
    };
  };

  func getUserIdFromPrincipal(caller : Principal) : ?Nat {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.userId };
    };
  };

  // Authorization checks
  func checkAppAdminAuthorized(caller : Principal) {
    if (not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func checkTeacherAuthorized(caller : Principal) {
    if (not (isTeacher(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only teachers can perform this action");
    };
  };

  func checkStudentAuthorized(caller : Principal) {
    if (not isStudentFunc(caller)) {
      Runtime.trap("Unauthorized: Only students can perform this action");
    };
  };

  func checkParentAuthorized(caller : Principal) {
    if (not isParent(caller)) {
      Runtime.trap("Unauthorized: Only parents can perform this action");
    };
  };

  func checkFieldExecutiveAuthorized(caller : Principal) {
    if (not (isFieldExecutive(caller) or isAppAdmin(caller))) {
      Runtime.trap("Unauthorized: Only field executives can perform this action");
    };
  };

  // UserProfile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
    userIdToPrincipal.add(profile.userId, caller);
  };

  // Students CRUD
  public shared ({ caller }) func createStudent(student : Student) : async () {
    students.add(student.studentId, student);
  };

  public query ({ caller }) func getStudent(studentId : Nat) : async Student {
    switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?s) { s };
    };
  };

  public shared ({ caller }) func updateStudent(student : Student) : async () {
    students.add(student.studentId, student);
  };

  public shared ({ caller }) func deleteStudent(studentId : Nat) : async () {
    students.remove(studentId);
  };

  // DemoBookings CRUD - Public can create, admin can manage
  public shared ({ caller }) func createDemoBooking(booking : DemoBooking) : async () {
    // Anyone including guests can create demo bookings
    demoBookings.add(booking.bookingId, booking);
  };

  public query ({ caller }) func getDemoBooking(bookingId : Nat) : async DemoBooking {
    switch (demoBookings.get(bookingId)) {
      case (null) { Runtime.trap("Demo booking not found") };
      case (?booking) { booking };
    };
  };

  public shared ({ caller }) func updateDemoBooking(booking : DemoBooking) : async () {
    demoBookings.add(booking.bookingId, booking);
  };

  public shared ({ caller }) func deleteDemoBooking(bookingId : Nat) : async () {
    demoBookings.remove(bookingId);
  };

  public query ({ caller }) func getAllDemoBookings() : async [DemoBooking] {
    demoBookings.values().toArray();
  };

  // ClassLevels CRUD
  public shared ({ caller }) func createClassLevel(classLevel : ClassLevel) : async () {
    classLevels.add(classLevel.id, classLevel);
  };

  public query ({ caller }) func getAllClassLevels() : async [ClassLevel] {
    classLevels.values().toArray();
  };

  public shared ({ caller }) func updateClassLevel(classLevel : ClassLevel) : async () {
    classLevels.add(classLevel.id, classLevel);
  };

  public shared ({ caller }) func deleteClassLevel(id : Nat) : async () {
    classLevels.remove(id);
  };

  // PricingPlans CRUD
  public shared ({ caller }) func createPricingPlan(plan : PricingPlan) : async () {
    pricingPlans.add(plan.planId, plan);
  };

  public query ({ caller }) func getAllPricingPlans() : async [PricingPlan] {
    pricingPlans.values().toArray();
  };

  public shared ({ caller }) func updatePricingPlan(plan : PricingPlan) : async () {
    pricingPlans.add(plan.planId, plan);
  };

  public shared ({ caller }) func deletePricingPlan(planId : Nat) : async () {
    pricingPlans.remove(planId);
  };

  // Payments CRUD
  public shared ({ caller }) func createPayment(payment : Payment) : async () {
    payments.add(payment.paymentId, payment);
  };

  public query ({ caller }) func getPaymentsByStudent(studentId : Nat) : async [Payment] {
    let result = List.empty<Payment>();
    for ((_, payment) in payments.entries()) {
      if (payment.studentId == studentId) {
        result.add(payment);
      };
    };
    result.values().toArray();
  };

  public shared ({ caller }) func confirmPayment(paymentId : Nat, razorpayPaymentId : Text) : async Bool {
    switch (payments.get(paymentId)) {
      case (?payment) {
        let updatedPayment = {
          paymentId = payment.paymentId;
          studentId = payment.studentId;
          planId = payment.planId;
          amount = payment.amount;
          razorpayOrderId = payment.razorpayOrderId;
          razorpayPaymentId = payment.razorpayPaymentId;
          status = "Success";
          createdAt = payment.createdAt;
        };
        payments.add(paymentId, updatedPayment);
        true;
      };
      case (null) { false };
    };
  };

  // AttendanceRecords CRUD
  public shared ({ caller }) func createAttendanceRecord(record : AttendanceRecord) : async () {
    attendanceRecords.add(record.recordId, record);
  };

  public query ({ caller }) func getAttendanceByStudent(studentId : Nat) : async [AttendanceRecord] {
    let result = List.empty<AttendanceRecord>();
    for ((_, record) in attendanceRecords.entries()) {
      if (record.studentId == studentId) {
        result.add(record);
      };
    };
    result.values().toArray();
  };

  // Homework CRUD
  public shared ({ caller }) func createHomework(homework : Homework) : async () {
    homeworks.add(homework.homeworkId, homework);
  };

  public query ({ caller }) func getHomeworkByClass(classLevel : Text) : async [Homework] {
    let result = List.empty<Homework>();
    for ((_, homework) in homeworks.entries()) {
      if (homework.classLevel == classLevel) {
        result.add(homework);
      };
    };
    result.values().toArray();
  };

  public shared ({ caller }) func updateHomework(homework : Homework) : async () {
    homeworks.add(homework.homeworkId, homework);
  };

  public shared ({ caller }) func deleteHomework(homeworkId : Nat) : async () {
    homeworks.remove(homeworkId);
  };

  // TestResults CRUD
  public shared ({ caller }) func createTestResult(result : TestResult) : async () {
    testResults.add(result.resultId, result);
  };

  public query ({ caller }) func getTestResults(studentId : Nat) : async [TestResult] {
    let result = List.empty<TestResult>();
    for ((_, testResult) in testResults.entries()) {
      if (testResult.studentId == studentId) {
        result.add(testResult);
      };
    };
    result.values().toArray();
  };

  // StudyMaterials CRUD
  public shared ({ caller }) func createStudyMaterial(material : StudyMaterial) : async () {
    studyMaterials.add(material.materialId, material);
  };

  public query ({ caller }) func getStudyMaterials(classLevel : Text) : async [StudyMaterial] {
    let result = List.empty<StudyMaterial>();
    for ((_, material) in studyMaterials.entries()) {
      if (material.classLevel == classLevel) {
        result.add(material);
      };
    };
    result.values().toArray();
  };

  public query ({ caller }) func getAllStudyMaterials() : async [StudyMaterial] {
    studyMaterials.values().toArray();
  };

  public shared ({ caller }) func updateStudyMaterial(material : StudyMaterial) : async () {
    studyMaterials.add(material.materialId, material);
  };

  public shared ({ caller }) func deleteStudyMaterial(materialId : Nat) : async () {
    studyMaterials.remove(materialId);
  };

  // Certificates CRUD
  public shared ({ caller }) func generateCertificate(studentId : Nat, courseName : Text) : async Certificate {
    let certId = certificates.size();
    let cert = {
      certId = certId;
      studentId = studentId;
      courseName = courseName;
      issueDate = "2024-01-01"; // Mock date
      certNumber = "CERT-" # certId.toText();
    };
    certificates.add(certId, cert);
    cert;
  };

  public query ({ caller }) func getCertificatesByStudent(studentId : Nat) : async [Certificate] {
    let result = List.empty<Certificate>();
    for ((_, cert) in certificates.entries()) {
      if (cert.studentId == studentId) {
        result.add(cert);
      };
    };
    result.values().toArray();
  };

  // Referrals CRUD
  public shared ({ caller }) func createReferral(referral : Referral) : async () {
    referrals.add(referral.referralId, referral);
  };

  public query ({ caller }) func getReferralsByFieldExec(fieldExecId : Nat) : async [Referral] {
    let result = List.empty<Referral>();
    for ((_, referral) in referrals.entries()) {
      if (referral.fieldExecId == fieldExecId) {
        result.add(referral);
      };
    };
    result.values().toArray();
  };

  // ScheduledClasses CRUD
  public shared ({ caller }) func createScheduledClass(scheduledClass : ScheduledClass) : async () {
    scheduledClasses.add(scheduledClass.classId, scheduledClass);
  };

  public query ({ caller }) func getClassSchedule(classLevel : Text) : async [ScheduledClass] {
    let result = List.empty<ScheduledClass>();
    for ((_, scheduledClass) in scheduledClasses.entries()) {
      if (scheduledClass.classLevel == classLevel) {
        result.add(scheduledClass);
      };
    };
    result.values().toArray();
  };

  public shared ({ caller }) func updateScheduledClass(scheduledClass : ScheduledClass) : async () {
    scheduledClasses.add(scheduledClass.classId, scheduledClass);
  };

  public shared ({ caller }) func deleteScheduledClass(classId : Nat) : async () {
    scheduledClasses.remove(classId);
  };

  // Helper functions
  public query ({ caller }) func getStudentsByParent(parentId : Nat) : async [Student] {
    let result = List.empty<Student>();
    for ((_, student) in students.entries()) {
      if (student.parentId == parentId) {
        result.add(student);
      };
    };
    result.values().toArray();
  };

  public query ({ caller }) func getStudentsByTeacher(teacherId : Nat) : async [Student] {
    // In a real implementation, this would filter by teacher's assigned classes
    students.values().toArray();
  };

  public shared ({ caller }) func createRazorpayOrder(studentId : Nat, planId : Nat) : async Text {
    // Mock implementation
    "order_mock_" # studentId.toText() # "_" # planId.toText();
  };

  public query ({ caller }) func getUserRole(userId : Nat) : async ?AppRole {
    switch (userIdToPrincipal.get(userId)) {
      case (?principal) {
        getAppRole(principal);
      };
      case (null) { null };
    };
  };
};
