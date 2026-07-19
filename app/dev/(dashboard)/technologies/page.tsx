import { getAllTechnologies } from "@/lib/actions/technologies";
import { TechnologiesClient } from "./technologies-client";

export default async function AdminTechnologiesPage() {
  const data = await getAllTechnologies();
  return <TechnologiesClient data={data} />;
}
