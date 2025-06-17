"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism, dark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeRenderProps {
  code: string;
  language: string;
  theme?: "light" | "dark";
}

export function CodeRender({
  code,
  language,
  theme = "dark",
}: CodeRenderProps) {
  const selectedTheme = theme === "dark" ? dark : prism;

  return (
    <div className="rounded-lg overflow-hidden my-4">
      <SyntaxHighlighter
        language={language}
        style={selectedTheme}
        showLineNumbers={language === "python"}
        customStyle={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#f3f3f3", // VS Code like background
          color: theme === "dark" ? "#d4d4d4" : "#333333", // VS Code like text color
          border: "1px solid " + (theme === "dark" ? "#333333" : "#e0e0e0"),
        }}
        wrapLongLines
        wrapLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
