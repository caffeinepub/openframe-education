export interface Blog {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  content: string;
  authorName: string;
  date: string;
  imageUrl: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  published: boolean;
}

const BLOG_KEY = "openframe_blogs";

const SAMPLE_BLOGS: Blog[] = [
  {
    id: 1,
    title: "How to Prepare for Navodaya Entrance Exam",
    slug: "navodaya-entrance-exam-preparation",
    category: "Competitive Exams",
    shortDescription:
      "The Jawahar Navodaya Vidyalaya Selection Test (JNVST) is one of the most prestigious school entrance exams in India. Here's your complete preparation guide.",
    content: `<p>The Jawahar Navodaya Vidyalaya Selection Test (JNVST) is conducted by Navodaya Vidyalaya Samiti (NVS) for admission to Class 6 in Jawahar Navodaya Vidyalayas across India. This exam is highly competitive, with lakhs of students appearing every year for a limited number of seats. Understanding the exam pattern is the first step toward success.</p>

<p>The JNVST paper is divided into three sections: Mental Ability Test (50 marks), Arithmetic Test (25 marks), and Language Test (25 marks). The Mental Ability section tests spatial reasoning and pattern recognition — these questions can be mastered with regular practice of figure-based problems. Students should dedicate at least 30 minutes daily to mental ability exercises starting six months before the exam.</p>

<p>For Arithmetic preparation, focus on topics like fractions, percentages, simple interest, and basic geometry. The Language Test evaluates reading comprehension and grammar at the Class 5 level. Students should read short passages daily and practice answering questions on them. Using previous years' JNVST question papers is one of the most effective strategies — it builds familiarity with question formats and improves time management.</p>

<p>At OpenFrame Education, we offer specialized coaching for JNVST aspirants with weekly mock tests, personalized feedback, and study material aligned with the latest exam pattern. Our students from rural Karnataka have consistently secured seats in prestigious Navodaya schools. Enroll today and give your child the best chance at quality residential education.</p>`,
    authorName: "OpenFrame Education Team",
    date: "March 5, 2026",
    imageUrl: "/assets/generated/blog-cover-competitive-exams.dim_600x600.jpg",
    seoTitle: "Navodaya Entrance Exam Preparation Guide",
    metaDescription:
      "Complete guide to prepare for Navodaya Vidyalaya JNVST entrance exam",
    keywords: "navodaya, JNVST, entrance exam",
    published: true,
  },
  {
    id: 2,
    title: "NMMS Scholarship Exam Tips for Class 8 Students",
    slug: "nmms-scholarship-exam-tips",
    category: "Scholarships",
    shortDescription:
      "NMMS (National Means-cum-Merit Scholarship) is a central sector scholarship scheme for Class 8 students. Learn top tips to crack this exam.",
    content: `<p>The National Means-cum-Merit Scholarship (NMMS) exam is conducted by the State Government for students studying in Class 8 in government, government-aided, and local body schools. The scholarship amount of ₹12,000 per year is renewable up to Class 12, making it a life-changing opportunity for meritorious students from economically weaker sections.</p>

<p>The NMMS exam has two parts: the Mental Ability Test (MAT) and the Scholastic Aptitude Test (SAT). The MAT consists of 90 questions testing verbal and non-verbal reasoning, while the SAT covers Science, Social Studies, and Mathematics at the Class 7 and 8 level. Each section carries 90 marks, and students must score at least 40% in each (35% for SC/ST) to qualify.</p>

<p>Preparation strategy should begin in Class 7 itself. Build strong conceptual clarity in Science and Social Studies by thoroughly reading NCERT/State Board textbooks. For MAT, practice analogy, classification, pattern completion, and series questions daily. Time management is critical — with 180 questions in 180 minutes, you get just one minute per question. Regular timed mock tests will sharpen your speed and accuracy.</p>

<p>OpenFrame Education provides dedicated NMMS coaching with comprehensive study notes, chapter-wise practice tests, and full-length mock exams. Our expert teachers have helped hundreds of students from Karnataka win this scholarship. Join our program and secure your future education with financial support.</p>`,
    authorName: "OpenFrame Education Team",
    date: "March 3, 2026",
    imageUrl: "",
    seoTitle: "NMMS Scholarship Exam Tips for Class 8",
    metaDescription:
      "Top tips and strategies to crack the NMMS scholarship exam for Class 8 students",
    keywords: "NMMS, scholarship, Class 8, merit scholarship",
    published: true,
  },
  {
    id: 3,
    title: "International Mathematics Olympiad Preparation Guide",
    slug: "international-mathematics-olympiad-guide",
    category: "Olympiad Exams",
    shortDescription:
      "The International Mathematics Olympiad (IMO) tests mathematical reasoning and problem-solving. Discover the best strategies to prepare.",
    content: `<p>The International Mathematics Olympiad (IMO) is one of the most prestigious math competitions for school students worldwide. In India, it is conducted by the Science Olympiad Foundation (SOF) and provides students an opportunity to benchmark their mathematical ability against peers globally. The IMO is held in two levels — Level 1 at the school level and Level 2 for top performers.</p>

<p>The exam tests students on topics from their current school syllabus but at a deeper, application-based level. For classes 1-5, the focus is on numbers, basic arithmetic, shapes, and patterns. For classes 6-8, questions cover number theory, algebra, geometry, and mensuration. Senior students (Classes 9-12) face problems in coordinate geometry, trigonometry, calculus basics, and statistics that require creative problem-solving skills.</p>

<p>Effective preparation involves three phases: first, mastering the school curriculum thoroughly; second, studying Olympiad-specific concepts using dedicated books like RD Sharma's Olympiad section and SOF previous papers; third, taking full timed mock tests to simulate exam conditions. Forming a study group where students discuss and solve problems together is highly effective for building mathematical intuition.</p>

<p>OpenFrame Education's Olympiad coaching program provides structured preparation with weekly problem sets, concept workshops, and mock Olympiad tests. Students who perform well in IMO and other Olympiads gain significant advantages in scholarship applications and competitive exam preparation for engineering and medical entrances. Start early and build the mathematical foundation that lasts a lifetime.</p>`,
    authorName: "OpenFrame Education Team",
    date: "February 28, 2026",
    imageUrl: "",
    seoTitle: "International Mathematics Olympiad Preparation Guide",
    metaDescription:
      "Complete preparation guide for IMO - International Mathematics Olympiad for school students",
    keywords: "IMO, mathematics olympiad, SOF, competitive math",
    published: true,
  },
  {
    id: 4,
    title: "Career Guidance for Students After 10th Standard",
    slug: "career-guidance-after-10th-standard",
    category: "Career Guidance",
    shortDescription:
      "Choosing the right stream after 10th Standard is a crucial decision. This guide helps students and parents make an informed choice.",
    content: `<p>The decision made after Class 10 shapes a student's career trajectory for the next decade and beyond. With three main streams available — Science, Commerce, and Arts/Humanities — and multiple vocational options, students often feel overwhelmed. The key is to align the stream choice with a student's genuine interests, strengths, and long-term career aspirations rather than peer pressure or parental expectations.</p>

<p>Students who excel in Mathematics and Science subjects and aspire to careers in Engineering, Medicine, Research, or Technology should choose the Science stream with PCM (Physics, Chemistry, Mathematics) or PCB (Physics, Chemistry, Biology). It is also possible to take all four subjects (PCMB) in many boards. The Science stream keeps the maximum number of career doors open, but it is also the most academically demanding.</p>

<p>Commerce is ideal for students interested in Business, Finance, Accounting, Economics, and Entrepreneurship. With subjects like Accountancy, Business Studies, and Economics, it builds a strong foundation for CA, MBA, CS, and related careers. The Arts/Humanities stream offers rich opportunities in Law, Civil Services (IAS/IPS), Journalism, Teaching, Psychology, Social Work, and the creative fields. The UPSC Civil Services exam — one of India's most sought-after exams — is equally open to students from all three streams.</p>

<p>Before making the final decision, students should take aptitude tests, speak to professionals in fields of interest, and discuss honestly with teachers and parents. OpenFrame Education offers career counseling sessions where experienced educators help students map their interests to viable career paths. Remember, the best stream is the one that aligns with your passion — a motivated student excels in any field.</p>`,
    authorName: "OpenFrame Education Team",
    date: "February 25, 2026",
    imageUrl: "",
    seoTitle: "Career Guidance After 10th Standard",
    metaDescription:
      "Comprehensive career guidance for students choosing stream after 10th Standard in India",
    keywords:
      "career guidance, after 10th, stream selection, Science Commerce Arts",
    published: true,
  },
];

export function getBlogs(): Blog[] {
  try {
    const stored = localStorage.getItem(BLOG_KEY);
    if (stored) return JSON.parse(stored) as Blog[];
    // Seed
    localStorage.setItem(BLOG_KEY, JSON.stringify(SAMPLE_BLOGS));
    return SAMPLE_BLOGS;
  } catch {
    return SAMPLE_BLOGS;
  }
}

export function saveBlogs(blogs: Blog[]): void {
  localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
}

export function getPublishedBlogs(): Blog[] {
  return getBlogs().filter((b) => b.published);
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return getBlogs().find((b) => b.slug === slug);
}

export function addBlog(blog: Omit<Blog, "id">): Blog {
  const blogs = getBlogs();
  const newId = blogs.length > 0 ? Math.max(...blogs.map((b) => b.id)) + 1 : 1;
  const newBlog = { ...blog, id: newId };
  saveBlogs([...blogs, newBlog]);
  return newBlog;
}

export function updateBlog(updated: Blog): void {
  const blogs = getBlogs().map((b) => (b.id === updated.id ? updated : b));
  saveBlogs(blogs);
}

export function deleteBlog(id: number): void {
  saveBlogs(getBlogs().filter((b) => b.id !== id));
}

export function togglePublish(id: number): void {
  const blogs = getBlogs().map((b) =>
    b.id === id ? { ...b, published: !b.published } : b,
  );
  saveBlogs(blogs);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
