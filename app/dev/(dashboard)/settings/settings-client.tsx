"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs } from "@/components/admin/tabs";
import { DynamicList } from "@/components/admin/dynamic-list";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateProfileSettings } from "@/lib/actions/settings";
import { uploadFile } from "@/lib/actions/media";
import type { ProfileSettings } from "@/lib/types/database";

const settingsTabs = [
  { key: "general", label: "General" },
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "seo", label: "SEO" },
  { key: "social", label: "Social" },
  { key: "resume", label: "Resume" },
];

export function SettingsClient({ settings }: { settings: ProfileSettings | null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState(settings?.name ?? "");
  const [email, setEmail] = useState(settings?.email ?? "");
  const [location, setLocation] = useState(settings?.location ?? "");
  const [headline, setHeadline] = useState(settings?.headline ?? "");
  const [subtitle, setSubtitle] = useState(settings?.subtitle ?? "");
  const [about, setAbout] = useState(settings?.about ?? []);
  const [seoTitle, setSeoTitle] = useState(settings?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(settings?.seo_description ?? "");
  const [seoKeywords, setSeoKeywords] = useState(settings?.seo_keywords ?? []);
  const [ogImage, setOgImage] = useState(settings?.og_image ?? "");
  const [siteUrl, setSiteUrl] = useState(settings?.site_url ?? "");
  const [github, setGithub] = useState(settings?.github ?? "");
  const [linkedin, setLinkedin] = useState(settings?.linkedin ?? "");
  const [instagram, setInstagram] = useState(settings?.instagram ?? "");
  const [resumeUrl, setResumeUrl] = useState(settings?.resume_url ?? "");
  const [cvUrl, setCvUrl] = useState(settings?.cv_url ?? "");
  const [avatarUrl, setAvatarUrl] = useState(settings?.avatar_url ?? "");

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfileSettings({
      name, email, location, headline, subtitle, about,
      seo_title: seoTitle, seo_description: seoDescription, seo_keywords: seoKeywords,
      og_image: ogImage || null, site_url: siteUrl,
      github, linkedin, instagram,
      resume_url: resumeUrl || null, cv_url: cvUrl || null, avatar_url: avatarUrl || null,
    });
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Settings saved"); router.refresh(); }
  };

  const handleUpload = async (bucket: "avatars" | "documents" | "media", formData: FormData) => {
    const result = await uploadFile(bucket, formData);
    if (result.error) return { error: result.error };
    return { url: result.url };
  };

  const inputClass = "w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none";

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and portfolio configuration"
        action={
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80] disabled:opacity-50">
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6 rounded-xl border border-[#27272a] bg-[#111113] p-6">
        {activeTab === "general" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Avatar</label>
              <ImageUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                onUpload={(fd) => handleUpload("avatars", fd)}
              />
            </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Headline</label>
              <input value={headline} onChange={(e) => setHeadline(e.target.value)} className={inputClass} placeholder="Web Developer" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Subtitle</label>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={3} className={inputClass} placeholder="A short intro..." />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4 max-w-xl">
            <DynamicList values={about} onChange={setAbout} placeholder="Add paragraph..." label="Bio Paragraphs" maxItems={5} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">SEO Title</label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">SEO Description</label>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Site URL</label>
              <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className={inputClass} placeholder="https://bayupraditya.dev" />
            </div>
            <DynamicList values={seoKeywords} onChange={setSeoKeywords} placeholder="Add keyword..." label="SEO Keywords" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">OG Image</label>
              <ImageUpload value={ogImage} onChange={setOgImage} onUpload={(fd) => handleUpload("media", fd)} />
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">GitHub</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)} className={inputClass} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">LinkedIn</label>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Instagram</label>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
            </div>
          </div>
        )}

        {activeTab === "resume" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">Resume PDF</label>
              {resumeUrl && <p className="mb-2 text-xs text-[#71717a] truncate">{resumeUrl}</p>}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#27272a] px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-[#fafafa]">
                Upload Resume
                <input type="file" accept=".pdf" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.set("file", file);
                  const result = await uploadFile("documents", fd, "resume");
                  if (result.url) { setResumeUrl(result.url); toast.success("Resume uploaded"); }
                  else toast.error(result.error ?? "Upload failed");
                }} />
              </label>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#fafafa]">CV PDF</label>
              {cvUrl && <p className="mb-2 text-xs text-[#71717a] truncate">{cvUrl}</p>}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#27272a] px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-[#fafafa]">
                Upload CV
                <input type="file" accept=".pdf" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.set("file", file);
                  const result = await uploadFile("documents", fd, "cv");
                  if (result.url) { setCvUrl(result.url); toast.success("CV uploaded"); }
                  else toast.error(result.error ?? "Upload failed");
                }} />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
