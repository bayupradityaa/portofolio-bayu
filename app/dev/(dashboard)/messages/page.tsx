import { getMessages } from "@/lib/actions/messages";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage() {
  const data = await getMessages();
  return <MessagesClient data={data} />;
}
