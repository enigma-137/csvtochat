import React from "react";
import { CodeRender } from "../code-render";

interface ErrorOutputProps {
  data: string;
}

export const ErrorOutput: React.FC<ErrorOutputProps> = ({ data }) => (
  <div className="mt-4 rounded-lg overflow-hidden border border-red-700 bg-[#2d1e1e]">
    <h3 className="text-red-300 text-xs font-semibold px-4 py-2 border-b border-red-700">
      Error:
    </h3>
    <CodeRender code={data} language="bash" theme="dark" />
  </div>
);
