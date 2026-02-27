import { GraduationCap, Star } from "lucide-react";
import { motion } from "motion/react";

const teachers = [
  {
    name: "Ms. Priya Sharma",
    image: "/assets/generated/teacher-priya.dim_400x400.jpg",
    qualification: "M.Sc Mathematics",
    experience: "8 years experience",
    subjects: "Maths, Science (6th–10th)",
    rating: 4.9,
    students: 120,
    badge: "Top Teacher",
  },
  {
    name: "Mr. Rajesh Kumar",
    image: "/assets/generated/teacher-rajesh.dim_400x400.jpg",
    qualification: "B.Ed Physics & Chemistry",
    experience: "6 years experience",
    subjects: "Physics, Chemistry (11th–12th)",
    rating: 4.8,
    students: 95,
    badge: "CBSE Expert",
  },
  {
    name: "Ms. Anitha Rao",
    image: "/assets/generated/teacher-anitha.dim_400x400.jpg",
    qualification: "M.A English Literature",
    experience: "5 years experience",
    subjects: "English, EVS (Nursery–5th)",
    rating: 4.9,
    students: 110,
    badge: "Kids Specialist",
  },
];

export function TeachersSection() {
  return (
    <section className="py-20 section-blue-bg" id="teachers">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
              },
              index,
            ) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center"
              >
                {/* Image */}
                <div
                  className="relative h-56 overflow-hidden"
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
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span style="font-size:4rem">👩‍🏫</span></div>`;
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

                <div className="p-6">
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <GraduationCap
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    />
                    <span className="text-xs text-muted-foreground">
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
