import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { Separator } from "./ui/separator";

interface DateModalProps {
  method: "workHours" | "leave";
}

const FormSchema = z
  .object({
    type: z.enum(["invidual", "all"], {
      required_error: "You need to select an export type.",
    }),
    dateType: z.enum(["day", "month", "year"], {
      required_error: "You need to select a date type.",
    }),
    month: z.string().optional(),
    aYear: z.string().optional(),
    iYear: z.string().optional(),
    employee: z.string().optional(),
    dob: z.date().optional(),
  })
  .refine(
    (data) =>
      (data.type === "invidual" && data.employee !== undefined) ||
      data.type === "all",
    {
      message: "Employee must be selected",
      path: ["employee"],
    }
  )
  .refine(
    (data) =>
      (data.type === "invidual" && data.iYear !== undefined) ||
      data.type === "all",
    {
      message: "Year must be selected",
      path: ["iYear"],
    }
  )
  .refine(
    (data) =>
      (data.type === "all" &&
        data.dateType === "day" &&
        data.dob !== undefined) ||
      data.type === "invidual" ||
      data.dateType !== "day",
    {
      message: "Day must be selected",
      path: ["dob"],
    }
  )
  .refine(
    (data) =>
      (data.type === "all" &&
        data.dateType === "month" &&
        data.month !== undefined) ||
      data.type === "invidual" ||
      data.dateType !== "month",
    {
      message: "Month must be selected",
      path: ["month"],
    }
  )
  .refine(
    (data) =>
      (data.type === "all" &&
        data.dateType === "year" &&
        data.aYear !== undefined) ||
      data.type === "invidual" ||
      data.dateType !== "year",
    {
      message: "Year must be selected",
      path: ["aYear"],
    }
  );

const getFiveYearsBefore = () => {
  var currentYear = new Date().getFullYear();
  const years = [];
  var startYear = currentYear - 5;
  while (startYear <= currentYear) {
    years.push(startYear.toString());
    startYear++;
  }
  return years;
};
const fiveYearsBefore: string[] = getFiveYearsBefore();

const DateModal: React.FC<DateModalProps> = ({ method }) => {
  const [radio, setRadio] = useState("all");
  const [dateRadio, setDateRadio] = useState("day");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "all",
      dateType: "day",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (
        method === "workHours" &&
        data.type === "all" &&
        data.dateType === "day"
      ) {
        const formattedDate = data.dob ? new Date(data.dob) : new Date();
        // Create a hidden anchor element
        const link = document.createElement("a");
        link.style.display = "none";
        // Set the anchor's href to the download URL
        link.href = `${
          import.meta.env.VITE_API_URL
        }/api/excel/all/day?date=${formattedDate.toISOString()}`;
        // Append the anchor to the document body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to start the download
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      }
      if (
        method === "workHours" &&
        data.type === "all" &&
        data.dateType === "month"
      ) {
        const monthIndex = data.month;
        // Create a hidden anchor element
        const link = document.createElement("a");
        link.style.display = "none";
        // Set the anchor's href to the download URL
        link.href = `${
          import.meta.env.VITE_API_URL
        }/api/excel/all/month?month=${monthIndex}`;
        // Append the anchor to the document body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to start the download
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      }
      if (
        method === "workHours" &&
        data.type === "all" &&
        data.dateType === "year"
      ) {
        const year = data.aYear;

        // Create a hidden anchor element
        const link = document.createElement("a");
        link.style.display = "none";
        // Set the anchor's href to the download URL
        link.href = `${
          import.meta.env.VITE_API_URL
        }/api/excel/all/year?year=${year}`;
        // Append the anchor to the document body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to start the download
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      }
      if (
        method === "leave" &&
        data.type === "all" &&
        data.dateType === "day"
      ) {
        // Create a hidden anchor element
        const link = document.createElement("a");
        link.style.display = "none";
        // Set the anchor's href to the download URL
        link.href = `${
          import.meta.env.VITE_API_URL
        }/api/excel/leave/all/day?date=${data.dob?.toISOString()}`;
        // Append the anchor to the document body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to start the download
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      }
      if (
        method === "leave" &&
        data.type === "all" &&
        data.dateType === "month"
      ) {
        const monthIndex = data.month;
        // Create a hidden anchor element
        const link = document.createElement("a");
        link.style.display = "none";
        // Set the anchor's href to the download URL
        link.href = `${
          import.meta.env.VITE_API_URL
        }/api/excel/leave/all/month?month=${monthIndex}`;
        // Append the anchor to the document body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to start the download
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      }
      if (
        method === "leave" &&
        data.type === "all" &&
        data.dateType === "year"
      ) {
        const year = data.aYear;

        // Create a hidden anchor element
        const link = document.createElement("a");
        link.style.display = "none";
        // Set the anchor's href to the download URL
        link.href = `${
          import.meta.env.VITE_API_URL
        }/api/excel/leave/all/year?year=${year}`;
        // Append the anchor to the document body
        document.body.appendChild(link);
        // Trigger a click event on the anchor to start the download
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      }
    } catch (e) {
      console.log(e);
    }

    setOpen(false);
    setRadio("all");
    setDateRadio("day");
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Export Excel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Export Excel</DialogTitle>
              <DialogDescription>
                Select the start and end date. And click export when you are
                done.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRadio(value);
                      }}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="hidden items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="invidual" />
                        </FormControl>
                        <FormLabel className="font-normal">Invidual</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="all" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          All Employees
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            {radio === "invidual" && (
              <>
                <FormField
                  control={form.control}
                  name="employee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alf">
                            Nattpon Hoedkunthod
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="iYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {radio === "invidual" && <Separator />}
            {radio === "all" && (
              <FormField
                control={form.control}
                name="dateType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setDateRadio(value);
                        }}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="day" />
                          </FormControl>
                          <FormLabel className="font-normal">Day</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="month" />
                          </FormControl>
                          <FormLabel className="font-normal">Month</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="year" />
                          </FormControl>
                          <FormLabel className="font-normal">Year</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {radio === "all" && <Separator />}

            {dateRadio === "day" && radio === "all" && (
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {dateRadio === "month" && radio === "all" && (
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent side="right">
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {dateRadio === "year" && radio === "all" && (
              <FormField
                control={form.control}
                name="aYear"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fiveYearsBefore.map((year, index) => (
                          <SelectItem key={index} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {radio === "all" && <Separator />}
            {/* <div className={cn("grid gap-2", className)}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div> */}
            <DialogFooter>
              <Button type="submit">Export</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DateModal;
