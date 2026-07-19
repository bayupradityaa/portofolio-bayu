import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { getPublishedCertificates } from "@/lib/actions/certificates";

export async function Certificates() {
  const certificates = await getPublishedCertificates();

  if (certificates.length === 0) return null;

  return (
    <Section id="certificates">
      <SectionHeading
        title="Certifications"
        lead="Structured learning that backs the self-taught work, from ML foundations to backend systems."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => {
          const Wrapper = cert.credential_url ? "a" : "div";
          return (
            <Reveal key={cert.id} delay={(i % 3) * 0.06} as="div">
              <Wrapper
                {...(cert.credential_url
                  ? {
                      href: cert.credential_url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-secondary/40"
              >
                <div className="flex items-start justify-between">
                  <BadgeCheck size={22} strokeWidth={1.5} className="text-accent" />
                  {cert.credential_url && (
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-muted transition-colors group-hover:text-accent"
                    />
                  )}
                </div>
                <h3 className="mt-5 text-base font-semibold leading-snug tracking-tight">
                  {cert.title}
                </h3>
                <div className="mt-auto flex items-baseline justify-between gap-3 pt-5 text-sm">
                  <span className="text-secondary">{cert.issuer}</span>
                  <span className="font-mono text-xs text-muted">
                    {cert.issue_date
                      ? new Date(cert.issue_date).getFullYear().toString()
                      : ""}
                  </span>
                </div>
              </Wrapper>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
