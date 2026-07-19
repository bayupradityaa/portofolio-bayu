import { getAllExperience, createExperience, updateExperience, deleteExperience, toggleExperiencePublished } from "@/lib/actions/experience";
import { CrudPage } from "./experience-client";

export default async function AdminExperiencePage() {
  const data = await getAllExperience();
  return <CrudPage data={data} />;
}
