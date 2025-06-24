"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { ChatHistoryMenu } from "./ChatHistoryMenu";

interface HeaderProps {
  onNewChat?: () => void;
  chatId?: string;
}

export function Header({ onNewChat, chatId }: HeaderProps) {
  // Mobile header show/hide state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Only run on mobile
    const isMobile = () => window.innerWidth < 768;
    if (!isMobile()) return;

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 10) {
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY.current) {
            // Scrolling down
            setShowHeader(false);
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up
            setShowHeader(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <aside
        className={`md:flex-col md:h-screen md:w-20 md:fixed md:left-0 md:top-0 items-center justify-between p-4 border-b md:border-b-0 md:border-r border-slate-100 z-20 bg-white
          flex flex-row-reverse
          transition-transform duration-300 ease-in-out
          md:translate-y-0
          fixed top-0 left-0 right-0
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
          md:block
          h-[70px]
          `}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Icons (top on desktop, left on mobile) */}
        <div className="flex flex-row gap-4 text-slate-400 md:flex-col md:gap-2 md:w-full items-center">
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
          <img src="/logo.svg" className="size-[22px]" />
        </Link>
      </aside>
      {/* Spacer for mobile header height */}
      <div className="block md:hidden" style={{ height: 70 }} />
    </>
  );
}
