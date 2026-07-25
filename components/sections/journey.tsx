import dynamic from "next/dynamic";
import { getPublishedExperience } from "@/lib/actions/experience";

// Split into its own chunk so the GSAP timeline wiring hydrates after the
// initial paint (lower mobile TBT). ssr:true keeps the server HTML identical —
// desktop output is byte-for-byte unchanged; only the JS chunk is deferred.
const JourneyClient = dynamic(
  () => import("./journey-client").then((m) => ({ default: m.JourneyClient })),
);

/**
 * Server entry for "The path so far". Fetches published experience and hands
 * it to the cinematic client timeline. Renders nothing when empty.
 */
export async function Journey() {
  const timeline = await getPublishedExperience();

  if (timeline.length === 0) return null;

  return <JourneyClient timeline={timeline} />;
}
