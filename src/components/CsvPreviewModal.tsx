import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";

export function CsvPreviewModal({
  open,
  onOpenChange,
  headers,
  rows,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headers: string[];
  rows: { [key: string]: string }[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="w-full max-w-none md:max-w-[670px] mx-auto p-4 bg-white rounded shadow-lg flex flex-col">
        <DialogTitle>Preview CSV File</DialogTitle>
        <div className="overflow-x-auto overflow-y-auto mt-4 flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, idx) => (
                  <TableHead key={idx}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rIdx) => (
                <TableRow key={rIdx}>
                  {headers.map((header, cIdx) => (
                    <TableCell key={cIdx}>{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogClose asChild>
          <button className="mt-4 px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
