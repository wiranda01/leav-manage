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
  FormMessage,
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

import { useEffect, useState } from "react";

import * as z from "zod";

import { toast } from "../ui/use-toast";
import { ButtonLoading } from "../ButtonLoading";

interface DepartmentDialogProps {
  id?: number;
  method: "Add" | "Edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  memDefault?: MemberDefaultValues;
}

export type MemberDefaultValues = {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  dep_id: string;
  gender: string;
  date_employed: Date;
  username: string;
  password: string;
  address: string;
  phone: string;
  email: string;
  role: string;
};

type Department = {
  id: number;
  dep_id: number;
  dep: {
    dep_name: string;
  };
  emp1_appr: {
    first_nam: string;
    last_name: string;
  } | null;
  emp2_appr: {
    first_nam: string;
    last_name: string;
  } | null;
};

const MemberDialog = ({
  id,
  method,
  open,
  setOpen,
  memDefault,
}: DepartmentDialogProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkUsername = async (usr: string) => {
    if (usr === memDefault?.username) return null; // same username status: OK

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/employee/usr?username=${usr}`
    );
    const json = await res.json();

    if (!json) return null; // username not exists status: OK
    return json.username;
  };

  const checkHead = async (depId: string, role: string) => {
    if (role !== "head") {
      return true;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/employee/head?depId=${depId}`
    );
    const json = await res.json();

    if (!json || json.id === memDefault?.id) {
      return true;
    }

    return false;
  };

  const formSchema = z
    .object({
      firstName: z.string().min(1, "First Name must be more than 1 character"),
      lastName: z.string().min(1, "Last Name must be more than 1 character"),
      birthDate: z.date(),
      department: z.string(),
      gender: z.string(),
      dateEmployed: z.date(),
      username: z
        .string()
        .min(4, {
          message: "Username must be at least 4 characters.",
        })
        .max(25),
      password: z
        .string()
        .min(8, {
          message: `Password must be at least 8 characters.`,
        })
        .max(16),
      confirmPw: z.string(),
      address: z.string().min(6, "Address be at least 6 characters."),
      phone: z
        .string()
        .min(4, "Phone number be at least 4 characters.")
        .max(15, "Phone number must not be more than 15 characters."),
      email: z.string().email(),
      role: z.string(),
    })
    .refine((data) => data.password === data.confirmPw, {
      message: "Passwords must match",
      path: ["confirmPw"],
    })
    .refine(async (data) => (await checkUsername(data.username)) === null, {
      message: "Username already exists",
      path: ["username"],
    })
    .refine(async (data) => await checkHead(data.department, data.role), {
      message: "Department already has head user",
      path: ["role"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: undefined,
      department: undefined,
      gender: undefined,
      dateEmployed: undefined,
      username: "",
      password: "",
      confirmPw: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/department`);
      const data: Array<Department> = await res.json();

      setDepartments(data);
    };

    if (memDefault) {
      form.setValue("firstName", memDefault.first_name);
      form.setValue("lastName", memDefault.last_name);
      form.setValue("birthDate", new Date(memDefault.birth_date));
      form.setValue(
        "department",
        memDefault.dep_id !== null ? memDefault.dep_id.toString() : "None"
      );
      form.setValue("gender", "male");
      form.setValue("dateEmployed", new Date(memDefault.date_employed));
      form.setValue("username", memDefault.username);
      // form.setValue("password", memDefault.password);
      // form.setValue("confirmPw", memDefault.password);
      form.setValue("address", memDefault.address);
      form.setValue("phone", memDefault.phone);
      form.setValue("email", memDefault.email);
      form.setValue("role", memDefault.role);
    }

    fetchDepartment();
  }, [memDefault]);

  const isNumber = (value: string) => /^\d+$/.test(value);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (method === "Add") {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/employee`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: values.birthDate,
            email: values.email,
            gender: values.gender,
            address: values.address,
            username: values.username,
            password: values.confirmPw,
            auth: 0,
            depId: values.department,
            dateEmployed: values.dateEmployed,
            phone: values.phone,
            status: "active",
            role: values.role,
          }),
        });

        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }

      const date = new Date();
      const formattedDate = format(date, "eeee, d MMMM yyyy HH:mm");

      toast({
        title: `Member ${values.firstName} has been added`,
        description: `Created at : ${formattedDate}`,
      });
    } else {
      try {
        const responseDepartment = await fetch(
          `${import.meta.env.VITE_API_URL}/api/employee/${id?.toString()}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: values.firstName,
              lastName: values.lastName,
              birthDate: values.birthDate,
              email: values.email,
              gender: values.gender,
              address: values.address,
              username: values.username,
              password: values.confirmPw,
              auth: 0,
              depId: values.department,
              dateEmployed: values.dateEmployed,
              phone: values.phone,
              status: "active",
              role: values.role,
            }),
          }
        );

        if (responseDepartment.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{method} Member</DialogTitle>
              <DialogDescription>
                Fill employee's info and click on submit
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-12 gap-4 py-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">First Name</FormLabel>
                    <FormControl>
                      <Input className="col-span-6" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Last Name</FormLabel>
                    <FormControl>
                      <Input className="col-span-6" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Date of birth</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "col-span-6 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center">
                    <FormLabel className="col-span-6">Department</FormLabel>
                    <div className="col-span-6">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {departments.length > 0
                              ? departments.map((item, index) => (
                                  <SelectItem
                                    value={item.dep_id.toString()}
                                    key={index}
                                  >
                                    {item.dep.dep_name}
                                  </SelectItem>
                                ))
                              : "No Department"}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center">
                    <FormLabel className="col-span-6">Gender</FormLabel>
                    <div className="col-span-6">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">
                              <span>Male</span>
                            </SelectItem>
                            <SelectItem value="female">
                              <span>Female</span>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateEmployed"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Date Employed</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "col-span-6 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center">
                    <FormLabel className="col-span-6">Username</FormLabel>
                    <FormControl>
                      <Input className="col-span-6" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Password</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-6"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPw"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-6"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Address</FormLabel>
                    <FormControl>
                      <Textarea className="col-span-6" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-6"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isNumber(value) || value === "") {
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center ">
                    <FormLabel className="col-span-6">Email Address</FormLabel>
                    <FormControl>
                      <Input className="col-span-6" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 col-span-6 items-center">
                    <FormLabel className="col-span-6">Role</FormLabel>
                    {/* <DepartmentSelect /> */}
                    <div className="col-span-6">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select member's role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {["admin", "head", "user"].map((item, index) => (
                              <SelectItem value={item} key={index}>
                                <span className="capitalize">{item}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="col-span-6" />
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

export default MemberDialog;
