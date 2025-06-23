import React, { useMemo, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { intervalToDuration, differenceInSeconds } from "date-fns";

function formatTimeRemaining(resetTimestamp: number) {
  const now = new Date();
  const reset =
    typeof resetTimestamp === "string"
      ? new Date(parseInt(resetTimestamp, 10))
      : new Date(resetTimestamp);
  if (isNaN(reset.getTime())) return "--:--:--";
  // Only show if in the future
  if (reset.getTime() <= now.getTime()) return "00:00:00";
  // Use date-fns to get the duration breakdown
  const duration = intervalToDuration({ start: now, end: reset });
  // Calculate total hours (including days, months, years)
  const totalSeconds = differenceInSeconds(reset, now);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = (duration.minutes ?? 0).toString().padStart(2, "0");
  const seconds = (duration.seconds ?? 0).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function TooltipUsage({
  remainingMessages,
  resetTimestamp,
}: {
  remainingMessages: number;
  resetTimestamp?: number;
}) {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [open]);

  const formattedTime = useMemo(() => {
    if (!resetTimestamp) return undefined;
    return formatTimeRemaining(resetTimestamp);
    // Include tick so it recalculates every second when open
  }, [resetTimestamp, tick]);

  return (
    <Tooltip onOpenChange={setOpen} open={open}>
      <TooltipTrigger asChild>
        <button className="w-[87px] h-7 relative rounded border-[0.5px] border-[#90a1b9] flex flex-row gap-[3px] items-center justify-center cursor-pointer">
          <img src="/tooltip.svg" className="size-[14px]" />
          <p className="text-xs text-left text-[#1d293d]">
            {remainingMessages}
          </p>
          <p className="text-xs text-left text-[#45556c]">credits</p>
        </button>
      </TooltipTrigger>
      {formattedTime && (
        <TooltipContent sideOffset={8} className="min-w-[260px] bg-[#1d293d]">
          <div className="flex justify-center items-center gap-2">
            <p className="text-sm font-medium text-left text-slate-200">
              Time remaining until refill:
            </p>
            <p className="text-sm text-left text-white">{formattedTime}</p>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
