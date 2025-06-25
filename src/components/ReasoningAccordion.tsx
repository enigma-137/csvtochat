import { useState } from "react";

type ReasoningUIPart = {
  type: "reasoning";
  /**
   * The reasoning text.
   */
  reasoning: string;
  details: Array<
    | {
        type: "text";
        text: string;
        signature?: string;
      }
    | {
        type: "redacted";
        data: string;
      }
  >;
};

export default function ReasoningAccordion({
  reasoning,
}: {
  reasoning?: ReasoningUIPart;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!reasoning?.details?.length) return null;
  return (
    <div className="my-4 max-w-[480px]">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#7b8794] hover:bg-[#f1f5f9] transition-colors shadow-sm"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▶
        </span>
        {expanded ? "Full thought" : "Thought for a few seconds..."}
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded ? 500 : 0,
          opacity: expanded ? 1 : 0,
          padding: expanded ? "0.5em 0.5em 0.5em 2em" : "0 0.5em",
          background: "#f8fafc",
          borderRadius: "0 0 8px 8px",
        }}
      >
        {expanded && (
          <div className="flex flex-col gap-1 text-xs text-[#7b8794]">
            {reasoning.details.map((detail: any, idx: number) =>
              detail.type === "text" ? (
                <span key={idx}>{detail.text}</span>
              ) : (
                <span key={idx} className="italic text-[#cbd5e1]">
                  &lt;redacted&gt;
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
