"use client";

export function GithubBanner() {
  const handleClose = () => {};

  return (
    <div className="w-full max-w-[1440px] h-[34px] flex items-center overflow-hidden bg-[#1d293d] border-b border-slate-200 px-4">
      <div className="flex items-center bg-[#314158] h-[28px] px-3 rounded mr-4">
        <img src="/star.svg" alt="star" className="size-[18px]" />
        <p className="text-sm text-white">54</p>
      </div>
      <div className="flex items-center mr-4">
        <p className="text-sm text-white mr-1">Open source on</p>
        <img src="/githubLogo.svg" alt="GitHub" className="h-[18px]" />
      </div>
      <div className="flex items-center mr-4">
        <img src="/together.svg" alt="Together" className="h-[15px] w-[69px]" />
      </div>
      <p className="text-[13px] text-[#90a1b9] ml-auto">Powered & created by</p>

      <button className="cursor-pointer p-2" onClick={handleClose}>
        <img src="/fileX.svg" alt="close banner" className="size-2" />
      </button>
    </div>
  );
}
