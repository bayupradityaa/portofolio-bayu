import { getPublishedExperience } from "@/lib/actions/experience";
import { JourneyClient } from "./journey-client";

/**
 * Server entry for "The path so far". Fetches published experience and hands
 * it to the cinematic client timeline. Renders nothing when empty.
 */
export async function Journey() {
  const timeline = await getPublishedExperience();

  if (timeline.length === 0) return null;

  return <JourneyClient timeline={timeline} />;
}
