import type { ProfileSettings } from "@/lib/types/database";
import { HeroScene } from "./HeroScene";

/**
 * Re-exports the unified interactive motion HeroScene.
 * Keeps public component APIs clean.
 */
export async function Hero({ settings }: { settings: ProfileSettings | null }) {
  return <HeroScene settings={settings} />;
}
