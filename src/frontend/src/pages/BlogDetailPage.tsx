import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Copy,
  Facebook,
  Share2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { SiX } from "react-icons/si";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import {
  type Blog,
  getBlogBySlug,
  getPublishedBlogs,
} from "../utils/blogStore";

const CATEGORY_COLORS: Record<string, string> = {
  "Competitive Exams": "bg-blue-100 text-blue-700",
  Scholarships: "bg-green-100 text-green-700",
  "Olympiad Exams": "bg-purple-100 text-purple-700",
  "Career Guidance": "bg-orange-100 text-orange-700",
  "Study Tips": "bg-teal-100 text-teal-700",
};

export function BlogDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);

  useEffect(() => {
    const found = getBlogBySlug(slug);
    if (!found || !found.published) {
      navigate({ to: "/blog" as never });
      return;
    }
    setBlog(found);
    const allPublished = getPublishedBlogs();
    setRelated(
      allPublished
        .filter((b) => b.category === found.category && b.id !== found.id)
        .slice(0, 3),
    );
  }, [slug, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(blog?.title ?? "");

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero Image */}
        <div className="relative w-full" style={{ height: 400 }}>
          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-orange-400">
              <BookOpen className="w-20 h-20 text-white/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-3xl mx-auto">
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                  CATEGORY_COLORS[blog.category] ?? "bg-white/20 text-white"
                }`}
              >
                {blog.category}
              </span>
              <h1
                className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {blog.authorName}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  {blog.date}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 py-10">
          {/* Back button */}
          <button
            type="button"
            data-ocid="blog.detail.button"
            onClick={() => navigate({ to: "/blog" as never })}
            className="flex items-center gap-2 text-sm text-brand-blue font-semibold mb-8 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          {/* Article body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="prose prose-lg max-w-none text-foreground"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted admin content
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share this article
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                data-ocid="blog.share.button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <SiWhatsapp className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                data-ocid="blog.share.button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                data-ocid="blog.share.button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <SiX className="w-4 h-4" /> Twitter
              </a>
              <button
                type="button"
                data-ocid="blog.copy_link.button"
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy Link
              </button>
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-secondary/40 py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {related.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    className="text-left w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer border border-border"
                    onClick={() => navigate({ to: `/blog/${r.slug}` as never })}
                  >
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-blue-400 to-orange-300 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white/70" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {r.date}
                      </p>
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                        {r.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

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
