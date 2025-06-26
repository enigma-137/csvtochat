import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChatModel } from "@/lib/models";

export function ModelDropdown({
  models,
  value,
  onChange,
  className,
}: {
  models: ChatModel[];
  value?: string;
  onChange: (model: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((m) => (
          <SelectItem key={m.model} value={m.slug}>
            {m.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
