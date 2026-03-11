import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, CalendarDays, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { type Blog, getPublishedBlogs } from "../utils/blogStore";

const CATEGORIES = [
  "All",
  "Competitive Exams",
  "Scholarships",
  "Olympiad Exams",
  "Career Guidance",
  "Study Tips",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Competitive Exams": "bg-blue-100 text-blue-700",
  Scholarships: "bg-green-100 text-green-700",
  "Olympiad Exams": "bg-purple-100 text-purple-700",
  "Career Guidance": "bg-orange-100 text-orange-700",
  "Study Tips": "bg-teal-100 text-teal-700",
};

function BlogCardImage({
  imageUrl,
  category,
}: { imageUrl: string; category: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={category}
        className="w-full h-48 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).parentElement?.classList.add(
            "fallback-active",
          );
        }}
      />
    );
  }
  return (
    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-500 to-orange-400">
      <BookOpen className="w-12 h-12 text-white/80" />
    </div>
  );
}

export function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    setBlogs(getPublishedBlogs());
  }, []);

  const filtered =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-blue to-blue-700 text-white py-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Education Blog
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Education Blog
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Expert tips, study guides, and career advice for students across
              Karnataka and India.
            </p>
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-16 z-30 bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  data-ocid="blog.category_filter.tab"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    activeCategory === cat
                      ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                      : "bg-white text-foreground/70 border-border hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="container mx-auto px-4 py-12">
          {filtered.length === 0 ? (
            <div
              data-ocid="blog.empty_state"
              className="text-center py-20 text-muted-foreground"
            >
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">
                No articles in this category yet.
              </p>
              <p className="text-sm mt-1">Check back soon for new content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, idx) => (
                <motion.article
                  key={blog.id}
                  data-ocid={`blog.card.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col border border-border"
                >
                  <BlogCardImage
                    imageUrl={blog.imageUrl}
                    category={blog.category}
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${
                        CATEGORY_COLORS[blog.category] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {blog.category}
                    </span>
                    <h2 className="font-bold text-base text-foreground leading-snug mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {blog.shortDescription}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {blog.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {blog.date}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      data-ocid={`blog.read_more.button.${idx + 1}`}
                      className="w-full bg-brand-blue hover:bg-blue-700 text-white border-0"
                      onClick={() =>
                        navigate({ to: `/blog/${blog.slug}` as never })
                      }
                    >
                      Read More
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* Footer note */}
        <div className="text-center py-6 text-xs text-muted-foreground border-t border-border">
          Published by{" "}
          <span className="font-semibold text-brand-blue">
            Openframe IT Solutions Pvt Ltd
          </span>{" "}
          – Education &amp; Skill Development
        </div>
      </main>
      <Footer />
    </div>
  );
}
