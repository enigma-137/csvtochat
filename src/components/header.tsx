"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { ChatHistoryMenu } from "./ChatHistoryMenu";
import { GithubBanner } from "./GithubBanner";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onNewChat?: () => void;
  chatId?: string;
}

export function Header({ onNewChat, chatId }: HeaderProps) {
  const [showBanner, setShowBanner] = useLocalStorage<boolean>(
    "showBanner",
    true
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <>
      <aside
        className={cn(
          `md:flex-col md:h-screen md:w-20 md:left-0 md:top-0 items-center justify-between p-4 border-b md:border-b-0 md:border-r border-slate-100 z-20 bg-white
          flex flex-row-reverse
          transition-transform duration-300 ease-in-out
          md:translate-y-0
          fixed top-0 left-0 right-0
          md:block
          h-[70px]
          `,
          showBanner ? "mt-[34px]" : ""
        )}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Icons (top on desktop, left on mobile) */}
        <div className="flex flex-row gap-4 text-slate-400 md:flex-col md:gap-2 md:w-full items-center">
          <Link
            href="/"
            className="hidden items-center justify-center md:flex px-4"
          >
            <img src="/logo.svg" className="min-w-[24px]" />
          </Link>

          <a href="https://github.com/nutlope">
            <img src="/github.svg" className="size-9 mx-auto" />
          </a>
          <ChatHistoryMenu chatId={chatId} />

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden gap-1 pl-1.5 pr-2.5 cursor-pointer mx-auto bg-slate-100 border-[0.7px] border-slate-200 h-[36px] text-[#1d293d]"
            onClick={onNewChat}
          >
            <img src="/new.svg" className="size-9 min-w-[36px]" />
            <span>New chat</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden md:block gap-1 px-0 cursor-pointer mx-auto bg-transparent border-transparent h-auto text-[#1d293d]"
            onClick={onNewChat}
          >
            <img src="/new.svg" className="size-9 min-w-[36px]" />
          </Button>
        </div>
        {/* Logo (bottom on desktop, right on mobile) */}
        <Link
          href="/"
          className="flex items-center md:mt-auto md:mb-2 md:w-full justify-center md:hidden"
        >
          <img src="/logo.svg" className="size-[24px]" />
        </Link>
      </aside>
      {/* Spacer for mobile header height */}
      <GithubBanner show={showBanner} onClose={() => setShowBanner(false)} />
      <div
        className={cn(
          "block md:hidden",
          showBanner ? "min-h-[104px]" : "min-h-[70px]"
        )}
      />
    </>
  );
}
