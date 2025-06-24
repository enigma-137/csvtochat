"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function ChatHistoryMenu({ chatId }: { chatId?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [chatLinks, setChatLinks] = useState<{ id: string; title: string }[]>(
    []
  );

  // Track visited chat ids in localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && chatId) {
      const key = "visitedChatIds";
      let ids: string[] = [];
      try {
        ids = JSON.parse(localStorage.getItem(key) || "[]");
      } catch {}
      if (!ids.includes(chatId)) {
        ids.push(chatId);
        localStorage.setItem(key, JSON.stringify(ids));
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "visitedChatIds";
    let ids: string[] = [];
    try {
      ids = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {}
    if (ids.length === 0) return;
    // Fetch chat metadata from backend
    fetch("/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setChatLinks(data);
      });
  }, []);

  const HistoryLinks = () => {
    return (
      <div className="flex flex-col gap-2 pb-8 md:pb-5 mx-1.5">
        {chatLinks.map((chat) => {
          const href = `/chat/${chat.id}`;
          const isActive = pathname === href;
          return (
            <Link
              key={chat.id}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={`text-sm text-left py-2.5 px-6 md:py-2 md:px-4 ${
                isActive
                  ? "bg-slate-200 rounded font-medium text-[#0f172b]"
                  : "text-[#314158]"
              }`}
            >
              {chat.title}
            </Link>
          );
        })}
      </div>
    );
  };

  if (chatLinks.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop: DropdownMenu, Mobile: Drawer */}
      <div className="hidden md:flex h-[36px] items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer !p-1 mx-auto"
            >
              <img src="/history.svg" className="size-9" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="!p-0">
            <p className="text-sm font-medium text-left text-[#314158] px-3 py-4 border-b border-b-[#CAD5E2] mb-4">
              Chat History
            </p>
            <HistoryLinks />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="md:hidden flex items-center justify-center">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer !p-1 mx-auto"
            >
              <img src="/history.svg" className="size-9" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="!bg-slate-100 !border-[0.5px] !border-[#45556c] pt-6">
            <VisuallyHidden asChild>
              <DrawerTitle>Chat History</DrawerTitle>
            </VisuallyHidden>
            <div className="absolute left-1/2 -translate-x-1/2 top-2 z-10">
              <svg
                width="164"
                height="4"
                viewBox="0 0 164 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="164" height="4" rx="2" fill="#E2E8F0" />
              </svg>
            </div>
            <HistoryLinks />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
