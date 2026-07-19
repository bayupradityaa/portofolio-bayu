import { getProfileSettings } from "@/lib/actions/settings";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const settings = await getProfileSettings();
  return <SettingsClient settings={settings} />;
}
