import { getAllEducation } from "@/lib/actions/education";
import { EducationClient } from "./education-client";

export default async function AdminEducationPage() {
  const data = await getAllEducation();
  return <EducationClient data={data} />;
}
