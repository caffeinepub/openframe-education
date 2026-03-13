import { GraduationCap, Star } from "lucide-react";
import { motion } from "motion/react";

const teachers = [
  {
    name: "Ms. Priya Sharma",
    image: "/assets/generated/teacher-priya.dim_400x400.jpg",
    qualification: "M.Sc Mathematics, B.Ed",
    experience: "8 years experience",
    subjects: "Maths, Science (6th–10th)",
    rating: 4.9,
    students: 120,
    badge: "Top Teacher",
    fallbackIcon: "👩‍🏫",
  },
  {
    name: "Mr. Rajesh Kumar",
    image: "/assets/generated/teacher-rajesh.dim_400x400.jpg",
    qualification: "M.Sc Physics, B.Ed",
    experience: "6 years experience",
    subjects: "Physics, Chemistry (11th–12th)",
    rating: 4.8,
    students: 95,
    badge: "CBSE Expert",
    fallbackIcon: "👨‍🏫",
  },
  {
    name: "Ms. Anitha Rao",
    image: "/assets/generated/teacher-anitha.dim_400x400.jpg",
    qualification: "M.A English Literature, B.Ed",
    experience: "5 years experience",
    subjects: "English, EVS (Nursery–5th)",
    rating: 4.9,
    students: 110,
    badge: "Kids Specialist",
    fallbackIcon: "👩‍🏫",
  },
  {
    name: "Mr. Suresh Patil",
    image: "/assets/generated/teacher-suresh.dim_400x400.jpg",
    qualification: "M.A History, B.Ed",
    experience: "10 years experience",
    subjects: "Social Science, Hindi (6th–10th)",
    rating: 4.7,
    students: 130,
    badge: "Senior Faculty",
    fallbackIcon: "👨‍🏫",
  },
  {
    name: "Ms. Kavitha Naik",
    image: "/assets/generated/teacher-kavitha.dim_400x400.jpg",
    qualification: "B.Tech Computer Science, B.Ed",
    experience: "4 years experience",
    subjects: "Digital Learning, Maths (1st–5th)",
    rating: 4.8,
    students: 85,
    badge: "EdTech Expert",
    fallbackIcon: "👩‍🏫",
  },
];

export function TeachersSection() {
  return (
    <section className="py-20 section-blue-bg" id="teachers">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider"
            style={{
              background: "oklch(0.95 0.04 255)",
              color: "oklch(0.45 0.18 262)",
            }}
          >
            Our Faculty
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Meet Our Expert Teachers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trained, certified, and passionate about every student's success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {teachers.map(
            (
              {
                name,
                image,
                qualification,
                experience,
                subjects,
                rating,
                students,
                badge,
                fallbackIcon,
              },
              index,
            ) => (
              <motion.div
                key={name}
                data-ocid={`teachers.item.${index + 1}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center"
              >
                {/* Image */}
                <div
                  className="relative h-52 overflow-hidden"
                  style={{ background: "oklch(0.93 0.06 255)" }}
                >
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".fallback-icon")) {
                        const div = document.createElement("div");
                        div.className =
                          "fallback-icon w-full h-full flex items-center justify-center";
                        div.innerHTML = `<span style="font-size:4rem">${fallbackIcon}</span>`;
                        parent.appendChild(div);
                      }
                    }}
                  />
                  {/* Badge */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: "oklch(0.68 0.19 50)" }}
                  >
                    {badge}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-foreground text-base mb-1">
                    {name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <GraduationCap
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    />
                    <span className="text-xs text-muted-foreground leading-tight">
                      {qualification}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {experience}
                  </p>

                  <div
                    className="px-3 py-2 rounded-xl mb-4 text-xs"
                    style={{
                      background: "oklch(0.95 0.04 255)",
                      color: "oklch(0.33 0.17 265)",
                    }}
                  >
                    📚 {subjects}
                  </div>

                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star
                        className="w-3.5 h-3.5 fill-current"
                        style={{ color: "oklch(0.82 0.18 80)" }}
                      />
                      <span className="font-semibold text-foreground">
                        {rating}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div>
                      <span className="font-semibold text-foreground">
                        {students}+
                      </span>
                      <span className="text-muted-foreground text-xs ml-1">
                        students
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
