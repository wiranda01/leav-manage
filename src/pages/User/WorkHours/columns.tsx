"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import moment from "moment";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WorkHours = {
  id: number;
  name: string;
  department: string;
  date: string;
  clock_in: string;
  clock_out: string;
  total_hours: string;
  late_time: string;
};

export const columns: ColumnDef<WorkHours>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">
        {moment(row.getValue("date")).local().format("dddd, DD/MM/YYYY")}
      </div>
    ),
  },
  {
    accessorKey: "clock_in",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clock In
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{moment(row.getValue("clock_in")).local().format("HH:mm")}</div>
    ),
  },
  {
    accessorKey: "clock_out",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clock Out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("clock_out")
          ? moment(row.getValue("clock_out")).local().format("HH:mm")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "late_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Late Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const late_time = new Date(row.getValue("late_time"));
      const hours = late_time.getUTCHours();
      const minutes = late_time.getUTCMinutes();

      return (
        <div className="">
          {`${hours ? `${hours} Hours ` : ""}${
            minutes ? minutes : "-"
          } Minutes`}
        </div>
      );
    },
  },
  {
    accessorKey: "total_hours",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Work Hours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timeAmount = parseFloat(row.getValue("total_hours"));
      const hours = Math.floor(timeAmount);
      const minutes = Math.round((timeAmount - hours) * 60);

      return (
        <div className="">
          {`${hours ? `${hours} Hours ` : ""}${
            minutes ? minutes : "-"
          } Minutes`}
        </div>
      );
    },
  },
];
