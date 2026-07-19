import { getProfileSettings } from "@/lib/actions/settings";
import { HeroScene } from "./HeroScene";

/**
 * Re-exports the unified interactive motion HeroScene.
 * Keeps public component APIs clean.
 */
export async function Hero() {
  const settings = await getProfileSettings();
  return <HeroScene settings={settings} />;
}
