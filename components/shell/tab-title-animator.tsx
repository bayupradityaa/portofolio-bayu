"use client";

import { useEffect, useState } from "react";

const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "Graphic Designer",
  "AI Enthusiast",
  "Founder @CLT.STORE",
];

export function TabTitleAnimator() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = roles[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase: add one character at a time
      if (displayedText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 80); // Speed of typing (80ms per char)
      } else {
        // Pause when fully typed
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2500); // Keep full title visible for 2.5 seconds
      }
    } else {
      // Deleting phase: remove one character at a time
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, 40); // Speed of deleting (40ms per char)
      } else {
        // Pause briefly before typing the next role
        timer = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 300);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex]);

  useEffect(() => {
    // Update the browser tab title
    document.title = `Bp. | ${displayedText}`;
  }, [displayedText]);

  return null;
}
