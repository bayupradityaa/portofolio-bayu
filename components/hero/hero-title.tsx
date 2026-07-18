"use client";

interface HeroTitleProps {
  helloRef: React.RefObject<HTMLSpanElement | null>;
  bayuRef: React.RefObject<HTMLSpanElement | null>;
  pradityaRef: React.RefObject<HTMLSpanElement | null>;
}

/**
 * Hero title with word-mask structure for editorial reveal.
 * Direct props ref passing avoids any useImperativeHandle race conditions.
 */
export function HeroTitle({ helloRef, bayuRef, pradityaRef }: HeroTitleProps) {
  return (
    <div>
      <p
        className="text-lg text-secondary md:text-xl"
        style={{ marginBottom: "0.75rem" }}
      >
        <span className="word-mask">
          <span ref={helloRef} className="word">
            Hello, I&apos;m
          </span>
        </span>
      </p>
      <h1
        className="font-semibold leading-[0.95] tracking-[-0.03em]"
        style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)" }}
      >
        <span className="word-mask">
          <span ref={bayuRef} className="word">
            Bayu
          </span>
        </span>
        <br />
        <span className="word-mask">
          <span ref={pradityaRef} className="word">
            Praditya
          </span>
        </span>
      </h1>
    </div>
  );
}
