"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

import DepartmentDialog, {
  DefaultValues,
} from "@/components/Department/DepartmentDialog";
import { useEffect, useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Department = {
  id: number;
  dep_name: string;
  first_approver: string;
  second_approver: string;
};

export const columns: ColumnDef<Department>[] = [
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
    accessorKey: "dep_name",
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
    cell: ({ row }) => <div>{row.getValue("dep_name")}</div>,
  },
  {
    accessorKey: "first_approver",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Approver
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("first_approver")}</div>,
  },
  {
    accessorKey: "second_approver",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Second Approver
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("second_approver")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [open, setOpen] = useState<boolean>(false);
      const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
      const [defaultValue, setDefaultValue] = useState<DefaultValues>();
      // const [approvers, setApprovers] = useState<Approver[]>([]);

      const department = row.original;

      const deleteDepartment = async (id: number) => {
        // console.log("delete" + id);
        try {
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/department/${id.toString()}`,
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
        // const fetchApprovers = async () => {
        //   try {
        //     const res = await fetch(
        //       "${import.meta.env.VITE_API_URL}/api/employee/getName"
        //     );
        //     if (!res.ok) {
        //       throw new Error("Network response was not ok");
        //     }
        //     const data: Employee[] = await res.json();
        //     const formattedData = data.map((employee) => ({
        //       id: employee.id,
        //       name: `${employee.first_name} ${employee.last_name}`,
        //     }));

        //     setApprovers(formattedData);
        //   } catch (error) {
        //     console.error("Error fetching data:", error);
        //   }
        // };

        const fetchDefaultValues = async (id: number) => {
          try {
            const department = await fetch(
              `${import.meta.env.VITE_API_URL}/api/department/${id.toString()}`
            );
            const departmentData = await department.json();

            const approver = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/approver/DepId/${id.toString()}`
            );
            const approverData = await approver.json();

            const formattedData: DefaultValues = {
              departmentName: departmentData.dep_name,
              firstAppr:
                approverData.first_appr === null ||
                approverData.first_appr === undefined
                  ? "None"
                  : approverData.first_appr.toString(),
              secAppr:
                approverData.second_appr === null ||
                approverData.second_appr === undefined
                  ? "None"
                  : approverData.second_appr.toString(),
            };

            setDefaultValue(formattedData);
          } catch (error) {}
        };

        fetchDefaultValues(department.id);
        // fetchApprovers();
      }, []);

      return (
        <>
          <DepartmentDialog
            id={department.id}
            method="Edit"
            open={open}
            setOpen={setOpen}
            depDetails={defaultValue}
          />
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteDepartment(department.id);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                className="flex gap-2"
                onSelect={() => {
                  setDeleteOpen(true);
                }}
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
