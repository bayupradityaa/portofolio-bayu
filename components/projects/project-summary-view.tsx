import { cn } from "@/lib/utils";

export interface FormattedSummaryItem {
  number: string;
  title: string;
  desc: string;
}

/**
 * Parses project summary text to intelligently detect:
 * 1. An introductory paragraph before numbered features
 * 2. Inline or multiline numbered points (e.g., "1. Feature: Description... 2. ...")
 */
export function parseProjectSummary(summary: string): {
  intro: string;
  items: FormattedSummaryItem[];
} {
  if (!summary) return { intro: "", items: [] };

  // Match where numbered list begins: '1. ' or ' 1. '
  const listMatch = summary.match(/(?:^|\s)(1\.\s+[\s\S]*)/);
  if (!listMatch) {
    return { intro: summary, items: [] };
  }

  const listStartIndex = summary.indexOf(listMatch[1]);
  const intro = summary.slice(0, listStartIndex).trim();
  const listPart = summary.slice(listStartIndex).trim();

  // Split list by numbered boundaries ('1. ', '2. ', etc.)
  const rawItems = listPart.split(/(?:\s+|^)(?=\d+\.\s+)/).map((s) => s.trim()).filter(Boolean);
  const items: FormattedSummaryItem[] = [];

  for (const raw of rawItems) {
    const numMatch = raw.match(/^(\d+)\.\s*([\s\S]*)$/);
    if (!numMatch) continue;

    const number = numMatch[1];
    const body = numMatch[2].trim();

    // Check if there is a 'Title: Description' or 'Title - Description' pattern
    const colonIndex = body.indexOf(":");
    if (colonIndex !== -1 && colonIndex < 80) {
      items.push({
        number,
        title: body.slice(0, colonIndex).trim(),
        desc: body.slice(colonIndex + 1).trim(),
      });
    } else {
      items.push({
        number,
        title: "",
        desc: body,
      });
    }
  }

  return { intro, items };
}

interface ProjectSummaryViewProps {
  summary: string;
  className?: string;
  textSize?: "sm" | "base" | "lg";
}

export function ProjectSummaryView({
  summary,
  className,
  textSize = "base",
}: ProjectSummaryViewProps) {
  const { intro, items } = parseProjectSummary(summary);

  const textClass =
    textSize === "sm"
      ? "text-xs sm:text-sm"
      : textSize === "lg"
      ? "text-base md:text-lg"
      : "text-sm sm:text-base";

  return (
    <div className={cn("space-y-4 font-sans", className)}>
      {/* Intro Paragraphs with text-justify (rata kanan-kiri) */}
      {intro && (
        <div className="space-y-3">
          {intro.split(/\n{2,}/).map((paragraph, idx) => (
            <p
              key={idx}
              className={cn(
                textClass,
                "text-secondary/90 leading-relaxed text-justify [text-align-last:left]"
              )}
            >
              {paragraph.trim()}
            </p>
          ))}
        </div>
      )}

      {/* Structured Numbered Points */}
      {items.length > 0 && (
        <ul className="space-y-3.5 pt-1">
          {items.map((item) => (
            <li
              key={item.number}
              className={cn(
                "group relative flex items-start gap-3.5 rounded-xl p-3 sm:p-3.5 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-accent/20 shadow-sm",
                textClass
              )}
            >
              {/* Badge Nomor */}
              <span className="inline-flex items-center justify-center font-mono text-xs font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/25 shrink-0 mt-0.5 select-none shadow-sm group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                {item.number.padStart(2, "0")}
              </span>

              {/* Konten Poin: Judul Bold + Deskripsi Rata Kanan-Kiri */}
              <div className="leading-relaxed text-justify [text-align-last:left] flex-1">
                {item.title && (
                  <strong className="text-foreground font-semibold mr-1.5 tracking-tight">
                    {item.title}:
                  </strong>
                )}
                <span className="text-secondary/90">{item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
