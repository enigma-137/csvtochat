import React from "react";

export function HeroSection() {
  return (
    <div className="max-w-[277px] md:max-w-[400px] flex flex-col items-center md:items-start ">
      <img src="/logo.svg" className="size-[42px]  mb-8" />
      {/* Title */}
      <h1 className="text-[28px] font-medium text-slate-900 text-center mb-12 leading-tight">
        What do you want to analyze?
      </h1>
    </div>
  );
}
