import Link from "next/link";
import { Nav } from "@/components/shell/nav";
import { Footer } from "@/components/shell/footer";
import { getProfileSettings } from "@/lib/actions/settings";
import { ArrowLeft, FolderKanban } from "lucide-react";

export default async function NotFound() {
  const settings = await getProfileSettings();

  return (
    <>
      <Nav />
      <main id="main" className="flex-1 flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/60 text-accent font-sans text-xs font-bold uppercase tracking-widest">
            <span>404 — Error</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans">
            Page Not Found
          </h1>

          <p className="text-sm md:text-base text-foreground/70 leading-relaxed font-sans">
            The case study, page, or resource you are looking for does not exist, has been unpublished, or has moved.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border/80 bg-card/50 text-foreground font-sans text-xs font-bold uppercase tracking-wider hover:bg-card transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              <span>All Projects</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
