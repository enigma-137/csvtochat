"use client";
import Dropzone from "react-dropzone";
import React from "react";
import { HeroSection } from "./hero-section";

interface UploadAreaProps {
  onFileChange: (file: File | null) => void;
  uploadedFile: File | null;
}

export function UploadArea({ onFileChange, uploadedFile }: UploadAreaProps) {
  if (uploadedFile) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <Dropzone
        multiple={false}
        accept={{
          // accept csv
          "text/csv": [".csv"],
        }}
        onDrop={(acceptedFiles) => {
          const file = acceptedFiles[0];

          if (!file) {
            // TODO if no file meaning user tried to upload a file that is not csv!
            return;
          }

          if (file.size > 15 * 1024 * 1024) {
            // 10MB in bytes
            console.log({
              title: "📁 File Too Large",
              description: "⚠️ File size must be less than 15MB",
            });
            return;
          }
          onFileChange(file);
        }}
      >
        {({ getRootProps, getInputProps, isDragAccept }) => (
          <div
            className="w-full h-full flex flex-col justify-center items-center pointer-events-auto"
            {...getRootProps()}
          >
            <input required={!uploadedFile} {...getInputProps()} />

            <div
              className="w-full max-w-sm h-40 flex flex-col justify-between overflow-hidden rounded-lg bg-white border border-[#cad5e2] border-dashed p-4 cursor-pointer"
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
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
