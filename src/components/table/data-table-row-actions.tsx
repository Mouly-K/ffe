"use client";

import { type Row } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROW_ACTIONS, type RowAction } from "./data/data";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actionFn: (action: RowAction, route: TData) => void;
}

export function DataTableRowActions<TData>({
  row,
  actionFn,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => actionFn(ROW_ACTIONS.EDIT, row.original)}
        >
          Edit
          <DropdownMenuShortcut>
            <Pencil />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => actionFn(ROW_ACTIONS.COPY, row.original)}
        >
          Make a copy
          <DropdownMenuShortcut>
            <Copy />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => actionFn(ROW_ACTIONS.DELETE, row.original)}
          variant="destructive"
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 className="text-destructive" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
