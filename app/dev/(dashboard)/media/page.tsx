import { getAllMedia } from "@/lib/actions/media";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const media = await getAllMedia();
  return <MediaClient media={media} />;
}
