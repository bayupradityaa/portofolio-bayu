import { Sidebar } from "@/components/admin/sidebar";
import { getUnreadCount } from "@/lib/actions/messages";
import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dev — Portfolio CMS",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/dev/login");

  const unreadCount = await getUnreadCount();

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans text-[#fafafa]">
      <Sidebar unreadCount={unreadCount} userEmail={session.email ?? undefined} />
      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
