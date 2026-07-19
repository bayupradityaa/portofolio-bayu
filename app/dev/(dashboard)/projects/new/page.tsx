import { getAllTechnologies } from "@/lib/actions/technologies";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  const technologies = await getAllTechnologies();

  return <ProjectForm technologies={technologies} />;
}
