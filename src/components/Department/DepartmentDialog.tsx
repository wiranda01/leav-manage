import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

import { Department } from "@/pages/Admin/Department/columns";
import { Employee } from "@/pages/Admin/Department/data-table";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as z from "zod";
import { ButtonLoading } from "../ButtonLoading";

interface DepartmentDialogProps {
  id?: number;
  method: "Add" | "Edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  depDetails?: DefaultValues;
  setDefaultValues?: Dispatch<SetStateAction<Department[]>>;
  departments?: Department;
  setDepartment?: Dispatch<SetStateAction<Department[]>>;
}

export type Approver = {
  id: string;
  name: string;
};

export type DefaultValues = {
  departmentName: string;
  firstAppr: string;
  secAppr: string;
};

const formSchema = z.object({
  departmentName: z.string().min(1),
  firstAppr: z.string(),
  secAppr: z.string(),
});

const DepartmentDialog = ({
  id,
  method,
  open,
  setOpen,
  depDetails,
}: DepartmentDialogProps) => {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [firstApprovers, setFirstApprovers] = useState<Approver[]>([]);
  const [secondApprovers, setSecondApprovers] = useState<Approver[]>([]);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: depDetails,
  });

  useEffect(() => {
    if (depDetails?.firstAppr == "None") setDisabled(true);

    if (depDetails != undefined) {
      form.setValue("departmentName", depDetails.departmentName);
      form.setValue("firstAppr", depDetails.firstAppr);
      form.setValue("secAppr", depDetails.secAppr);
    }
  }, [open]);

  // useEffect(() => {
  //   console.log(form.formState.dirtyFields);
  //   const fetchDefaultData = async () => {
  //     if (method === "Edit") {
  //       const department = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/department/${id}`
  //       );
  //       const departmentData = await department.json();

  //       const approver = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/approver/DepId/${id}`
  //       );
  //       const approverData = await approver.json();

  //       const formattedData: DefaultValues = {
  //         departmentName: departmentData.dep_name,
  //         firstAppr:
  //           approverData.first_appr === null ||
  //           approverData.first_appr === undefined
  //             ? "None"
  //             : approverData.first_appr.toString(),
  //         secAppr:
  //           approverData.second_appr === null ||
  //           approverData.second_appr === undefined
  //             ? "None"
  //             : approverData.second_appr.toString(),
  //       };

  //       form.setValue("departmentName", formattedData.departmentName);
  //       form.setValue("firstAppr", formattedData.firstAppr);
  //       form.setValue("secAppr", formattedData.secAppr);
  //     } else {
  //       form.setValue("departmentName", "");
  //       form.setValue("firstAppr", "None");
  //       form.setValue("secAppr", "None");
  //     }
  //   };

  //   fetchDefaultData();
  // }, [method, id]);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/employee/getAppr`
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Employee[] = await res.json();
        const formattedData = data.map((employee) => ({
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
        }));

        setApprovers(formattedData);
        setFirstApprovers(formattedData);
        setSecondApprovers(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (depDetails) {
      form.setValue("departmentName", depDetails.departmentName);
      form.setValue("firstAppr", depDetails.firstAppr);
      form.setValue("secAppr", depDetails.secAppr);
    }

    fetchApprovers();
  }, [depDetails]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (method === "Add") {
      try {
        // POST department to database
        await fetch(`${import.meta.env.VITE_API_URL}/api/department`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ departmentName: values.departmentName }),
        });
        // POST approver to database
        await fetch(`${import.meta.env.VITE_API_URL}/api/approver`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstApprover: values.firstAppr,
            secondApprover: values.secAppr,
          }),
        });

        // if (responseDepartment.ok && responseApprover.ok) {
        //   setOpen(false);
        //   if (setDepartment) {
        //     setDepartment((prevDepartments) => [
        //       ...prevDepartments,
        //       {
        //         id: Math.max(...prevDepartments.map((item) => item.id)) + 1,
        //         dep_name: values.departmentName,
        //       },
        //     ]);
        //   }
        // }
        //////////
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }

      const date = new Date();
      const formattedDate = format(date, "eeee, d MMMM yyyy HH:mm");

      toast({
        title: `Department ${values.departmentName} has been added`,
        description: `Created at : ${formattedDate}`,
      });
    } else {
      // UPDATE department to database
      try {
        const responseDepartment = await fetch(
          `${import.meta.env.VITE_API_URL}/api/department/${id?.toString()}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ departmentName: values.departmentName }),
          }
        );
        // UPDATE approver to database
        const responseApprover = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/approver/DepId/${id?.toString()}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstApprover: values.firstAppr,
              secondApprover: values.secAppr,
            }),
          }
        );

        if (responseDepartment.ok && responseApprover.ok) {
          setOpen(false);

          const date = new Date();
          const formattedDate = format(date, "eeee, d MMMM yyyy HH:mm");

          toast({
            title: `Department ${values.departmentName} has been updated`,
            description: `Updated at : ${formattedDate}`,
          });

          form.setValue("departmentName", values.departmentName);
          form.setValue("firstAppr", values.firstAppr);
          form.setValue("secAppr", values.secAppr);

          window.location.reload();
          // if (setDepartment && departments) {
          //   if (departments.id === id) {
          //     setDepartment([{ id: id, dep_name: values.departmentName }]);
          //   }
          // }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  function handleChange(id: string) {
    const temp = JSON.parse(JSON.stringify(approvers));
    for (var i in temp) {
      if (temp[i].id == id) {
        temp.splice(i, 1);
      }
    }
    setSecondApprovers(temp);

    if (id == "None") {
      form.setValue("secAppr", "None", { shouldDirty: true });
      setDisabled(true);
    } else if (id == form.getValues("secAppr")) {
      form.setValue("secAppr", "None", { shouldDirty: true });
      setDisabled(false);
    } else {
      setDisabled(false);
    }
  }

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{method} Department</DialogTitle>
              <DialogDescription>
                Specify the department's name and Approvers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right col-span-2">
                      Department Name
                    </FormLabel>
                    <FormControl>
                      <Input className="col-span-4" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name="firstAppr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="text-right col-span-2">
                      First Approver
                    </FormLabel>
                    <Select
                      onValueChange={(e) => {
                        handleChange(e);
                        field.onChange(e);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="None">None</SelectItem>
                          {firstApprovers.map((employee, index) => (
                            <SelectItem
                              key={index}
                              value={employee.id.toString()}
                            >
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secAppr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="text-right col-span-2">
                      Second Approver
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={disabled}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="None">None</SelectItem>
                          {secondApprovers.map((employee, index) => (
                            <SelectItem
                              key={index}
                              value={employee.id.toString()}
                            >
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              {isLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default DepartmentDialog;
