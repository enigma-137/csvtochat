import React from "react";

export function HeroSection() {
  return (
    <>
      <img src="/logo.svg" className="size-[42px]  mb-8" />
      {/* Title */}
      <h1 className="text-[28px] font-medium text-slate-900 text-center mb-12 leading-tight max-w-[277px]">
        What do you want to analyze?
      </h1>
    </>
  );
}
