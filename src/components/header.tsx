"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  onNewChat?: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100">
      <Link href="/" className="flex items-center">
        <img src="/logo.svg" className="size-8" />
      </Link>
      <div className="flex items-center gap-4 text-slate-400">
        <a href="https://github.com/nutlope">
          <img src="/github.svg" className="size-9" />
        </a>

        <Button variant="ghost" size="sm" className="cursor-pointer !p-1">
          <img src="/history.svg" className="size-9" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 gap-1 px-2 cursor-pointer"
          onClick={onNewChat}
        >
          <img src="/new.svg" className="size-9" />
          New chat
        </Button>
      </div>
    </div>
  );
}
