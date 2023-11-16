"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import LeaveTypeDialog, {
  LeaveTypeDefault,
} from "@/components/LeaveType/LeaveTypeDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type LeaveType = {
  id: number;
  type_name: string;
  type: string;
};

type LeaveTypeAPI = {
  id: number;
  type_name: string;
  fixed_quota: number;
  type: "fixed" | "serviceYears";
  type_quantity: {
    id: number;
    type_id: number;
    year: number;
    quantity: number;
  }[];
};

export const columns: ColumnDef<LeaveType>[] = [
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
    accessorKey: "type_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("type_name")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [deleteOpen, setDeleteOpen] = useState<boolean>();
      const [open, setOpen] = useState<boolean>(false);
      const [typeDefault, setTypeDefault] = useState<LeaveTypeDefault>();

      const leaveType = row.original;

      const deleteLeaveType = async (id: number) => {
        // console.log("delete" + id);
        try {
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/LeaveType/${id.toString()}`,
            {
              method: "DELETE",
            }
          );

          window.location.reload();
        } catch (error) {
          throw error;
        }
      };

      useEffect(() => {
        const fetchDefaultValues = async (id: number) => {
          try {
            const leaveType = await fetch(
              `${import.meta.env.VITE_API_URL}/api/leaveType/${id}`
            );
            const leaveTypeData: LeaveTypeAPI = await leaveType.json();

            const formattedData: LeaveTypeDefault = {
              type_name: leaveTypeData.type_name,
              fixed_quota: leaveTypeData.fixed_quota.toString(),
              type: leaveTypeData.type,
              type_quantity: leaveTypeData.type_quantity.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                year: item.year,
              })),
            };

            setTypeDefault(formattedData);
          } catch (error) {}
        };

        fetchDefaultValues(leaveType.id);
      }, []);
      return (
        <>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove
                  your data including all leave document with this leave type
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteLeaveType(leaveType.id);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <LeaveTypeDialog
            id={leaveType.id}
            method="Edit"
            open={open}
            setOpen={setOpen}
            typeDetails={typeDefault}
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex gap-2"
                onSelect={() => {
                  setOpen(true);
                }}
              >
                <Pencil size={15} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setDeleteOpen(true);
                }}
                className="flex gap-2"
              >
                <Trash2 size={15} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
