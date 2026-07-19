"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, Briefcase, Award, GraduationCap,
  Cpu, MessageSquare, BarChart3, Image, Settings, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { useState } from "react";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const navGroups: { title: string | null; items: NavItem[] }[] = [
  {
    title: null,
    items: [{ href: "/dev", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { href: "/dev/projects", label: "Projects", icon: FolderKanban },
      { href: "/dev/experience", label: "Experience", icon: Briefcase },
      { href: "/dev/certificates", label: "Certificates", icon: Award },
      { href: "/dev/education", label: "Education", icon: GraduationCap },
      { href: "/dev/technologies", label: "Technologies", icon: Cpu },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/dev/messages", label: "Messages", icon: MessageSquare },
      { href: "/dev/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/dev/media", label: "Media Library", icon: Image },
      { href: "/dev/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar({
  unreadCount = 0,
  userEmail,
}: {
  unreadCount?: number;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dev") return pathname === "/dev";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272a] bg-[#18181b] text-[#a1a1aa] lg:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#27272a] bg-[#0a0a0c] transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-[#27272a] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]">
            <span className="text-sm font-bold text-[#04120a]">B</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#fafafa]">Portfolio CMS</p>
            <p className="font-mono text-[10px] text-[#71717a]">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navGroups.map((group, gi) => (
            <div key={group.title ?? `group-${gi}`}>
              {group.title && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#52525b]">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const showBadge = item.label === "Messages" && unreadCount > 0;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                          active
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]",
                        )}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                        <span className="flex-1">{item.label}</span>
                        {showBadge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#22c55e] px-1.5 text-[10px] font-bold text-[#04120a]">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#27272a] p-3">
          {userEmail && (
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18181b] text-xs font-semibold uppercase text-[#a1a1aa]">
                {userEmail.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[#fafafa]">Signed in</p>
                <p className="truncate text-[10px] text-[#71717a]">{userEmail}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
