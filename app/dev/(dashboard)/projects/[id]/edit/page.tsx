import { notFound } from "next/navigation";
import { getProjectById, ensureCoverInGallery } from "@/lib/actions/projects";
import { getAllTechnologies } from "@/lib/actions/technologies";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Backfill: legacy projects whose cover predates the gallery get it added as
  // the first gallery image, so cover and gallery share one source.
  await ensureCoverInGallery(id);

  const [project, technologies] = await Promise.all([
    getProjectById(id),
    getAllTechnologies(),
  ]);

  if (!project) notFound();

  return <ProjectForm project={project} technologies={technologies} />;
}
