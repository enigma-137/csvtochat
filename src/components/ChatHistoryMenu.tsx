"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function ChatHistoryMenu() {
  // Placeholder chat links
  const chatLinks = [
    { id: "1", title: "Chat with sales.csv" },
    { id: "2", title: "Chat with marketing.csv" },
    { id: "3", title: "Chat with data.csv" },
  ];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const HistoryLinks = () => {
    return (
      <div className="flex flex-col gap-2 pb-8 md:pb-5">
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

  return (
    <>
      {/* Desktop: DropdownMenu, Mobile: Drawer */}
      <div className="hidden md:block">
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
          <DrawerContent className="!bg-slate-100 !border-[0.5px] !border-[#45556c]">
            <HistoryLinks />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
