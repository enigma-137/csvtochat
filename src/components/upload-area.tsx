"use client";

interface UploadAreaProps {
  onFileSelect: () => void;
  hasFile: boolean;
}

export function UploadArea({ onFileSelect, hasFile }: UploadAreaProps) {
  return (
    <div className="flex flex-col items-center pt-16 pb-8">
      <img src="/logo.svg" className="size-[42px]  mb-8" />
      {/* Title */}
      <h1 className="text-[28px] font-medium text-slate-900 text-center mb-12 leading-tight max-w-[277px]">
        What do you want to analyze?
      </h1>

      {!hasFile && (
        <button
          onClick={onFileSelect}
          className="w-full max-w-sm h-40 flex flex-col justify-between overflow-hidden rounded-lg bg-white border border-[#cad5e2] border-dashed p-4  cursor-pointer"
          style={{ boxShadow: "0px 1px 7px -4px rgba(0,0,0,0.25)" }}
        >
          <p className="text-base text-left text-[#90a1b9]">
            Upload your CSV first, then ask a question
          </p>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-[#90a1b9] text-center">
              or drag and drop here
            </p>
            <div
              className="w-full h-[45px] flex items-center justify-center rounded-md bg-slate-50 border-[0.7px] border-[#cad5e2]"
              style={{ boxShadow: "0px 1px 7px -4px rgba(0,0,0,0.25)" }}
            >
              <div className="flex justify-center items-center gap-2">
                <img src="/upload.svg" className="size-5" />
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#0f172b]">
                  Upload CSV
                </p>
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
