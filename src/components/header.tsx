"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ChatHistoryMenu } from "./ChatHistoryMenu";

interface HeaderProps {
  onNewChat?: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  return (
    <aside className="flex flex-row-reverse md:flex-col md:h-screen md:w-20 md:fixed md:left-0 md:top-0 items-center justify-between p-4 border-b md:border-b-0 md:border-r border-slate-100 z-20 bg-white">
      {/* Icons (top on desktop, left on mobile) */}
      <div className="flex flex-row gap-4 text-slate-400 md:flex-col md:gap-2 md:w-full items-center">
        <a href="https://github.com/nutlope">
          <img src="/github.svg" className="size-9 mx-auto" />
        </a>
        <ChatHistoryMenu />
        {/* New Chat Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 gap-1 px-2 cursor-pointer mx-auto"
          onClick={onNewChat}
        >
          <img src="/new.svg" className="size-9" />
          <span className="block md:hidden">New chat</span>
        </Button>
      </div>
      {/* Logo (bottom on desktop, right on mobile) */}
      <Link
        href="/"
        className="flex items-center md:mt-auto md:mb-2 md:w-full justify-center"
      >
        <img src="/logo.svg" className="size-8" />
      </Link>
    </aside>
  );
}
