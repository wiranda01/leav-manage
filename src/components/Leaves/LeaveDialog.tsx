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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePickerWithRange from "../DateRange";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "@/components/ui/use-toast";
import { LeaveDash } from "@/pages/UserIndex";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";
import StatusCard from "./StatusCard";
import { ButtonLoading } from "../ButtonLoading";

export type LeaveDefault = {
  doc_id?: number;
  name: string;
  leaveType: string;
  typeName: string;
  date: DateRange | undefined;
  reason: string;
  writtenPlace: string;
  backupContact: string;
  attachment?: string | null;
  status: string;
  status_first: string | null;
  status_second: string | null;
  dep_id: number;
  depAppr: {
    id: number | null;
    level: string;
    name: string | null;
    status: string | null;
    reviewAt: Date | null;
  }[];
};

interface LeaveDialogProps {
  id?: number | null;
  method: "Add" | "Edit" | "Review" | "View";
  open: boolean;
  setOpen: (open: boolean) => void;
}

type LeaveType = {
  id: number;
  type_name: string;
  fixed_quota: number;
  type: string;
};

export type Employee = {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
};

type LeaveDocApi = {
  emp_id: number;
  dep_id: number;
  type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  written_place: string;
  backup_contact: string;
  attachment: null | string;
  status_first_appr: string;
  first_appr_at: Date | null;
  status_second_appr: null | string;
  second_appr_at: Date | null;
  status: string;
  emp: Employee;
  dep: {
    dep_appr: {
      emp1_appr: Employee | null;
      emp2_appr: Employee | null;
    };
  };
  type: {
    type_name: string;
  };
};

const FormSchema = z.object({
  name: z.string().min(1),
  typeId: z.string(),
  reason: z.string().min(1),
  writtenPlace: z.string().min(1),
  backupContact: z.string().min(1),
  attachment: z.instanceof(FileList, { message: "No attachment" }).nullish(),
});

export const colorCheck = (status: string) => {
  if (status === "approved") return "text-green-600";
  else if (status === "rejected") return "text-red-600";
  else if (status === "pending") return "text-blue-600";
  else return null;
};

const LeaveDialog = ({ id, method, open, setOpen }: LeaveDialogProps) => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveDash, setLeaveDash] = useState<LeaveDash>();
  const user = JSON.parse(localStorage.getItem("user")!);
  const [max, setMax] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [conclusion, setConclusion] = useState("");
  const [leaveDefault, setLeaveDefault] = useState<LeaveDefault | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDefault = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDocument/${id}`
      );
      const data: LeaveDocApi = await res.json();

      form.setValue("name", `${data.emp.first_name} ${data.emp.last_name}`);
      form.setValue("typeId", data.type_id.toString());
      setDate({ from: new Date(data.start_date), to: new Date(data.end_date) });
      form.setValue("reason", data.reason);
      form.setValue("writtenPlace", data.written_place);
      form.setValue("backupContact", data.backup_contact);

      setLoading(false);

      const approver = [];

      if (data.dep.dep_appr.emp1_appr) {
        approver.push({
          id: data.dep.dep_appr.emp1_appr.id || null,
          level: "first",
          name: `${data.dep.dep_appr.emp1_appr.first_name} ${data.dep.dep_appr.emp1_appr.last_name}`,
          reviewAt: data.first_appr_at ? new Date(data.first_appr_at) : null,
          status: data.status_first_appr,
        });
      }

      if (data.dep.dep_appr.emp2_appr) {
        approver.push({
          id: data.dep.dep_appr.emp2_appr.id || null,
          level: "second",
          name: `${data.dep.dep_appr.emp2_appr.first_name} ${data.dep.dep_appr.emp2_appr.last_name}`,
          reviewAt: data.second_appr_at ? new Date(data.second_appr_at) : null,
          status: data.status_second_appr || null,
        });
      }

      const formattedData: LeaveDefault = {
        name: `${data.emp.first_name} ${data.emp.last_name}`,
        typeName: data.type.type_name,
        leaveType: data.type_id.toString(),
        date: {
          from: new Date(data.start_date),
          to: new Date(data.end_date),
        },
        reason: data.reason,
        writtenPlace: data.written_place,
        backupContact: data.backup_contact,
        attachment: data.attachment,
        status: data.status,
        status_first: data.status_first_appr,
        status_second: data.status_second_appr,
        dep_id: data.dep_id,
        depAppr: approver,
      };

      setLeaveDefault(formattedData);
    };

    async function fetchData() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/LeaveType`);
      const data = await res.json();
      // console.log(data);
      setLeaveTypes(data);
    }

    async function fetchDashData() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDashboard/${user.emp_id}`
      );
      const data = await res.json();
      // console.log(data);
      setLeaveDash(data);
    }

    fetchDashData();
    fetchData();
    id && fetchDefault();
    if (method === "Add") setLoading(false);
  }, [id]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: method !== "Review" ? `${user.first_name} ${user.last_name}` : "",
      typeId: undefined,
      reason: "",
      writtenPlace: "",
      backupContact: "",
      attachment: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    if (date?.from === undefined) {
      return toast({
        title: "Please select start date",
      });
    } else if (date?.to === undefined) {
      return toast({
        title: "Please select end date",
      });
    }

    formData.append("name", data.name);
    formData.append("empId", user.emp_id);
    formData.append("depId", user.dep_id);
    formData.append("typeId", data.typeId);
    formData.append("startDate", date?.from?.toISOString());
    formData.append("endDate", date?.to?.toISOString());
    formData.append("reason", data.reason);
    formData.append("writtenPlace", data.writtenPlace);
    formData.append("backupContact", data.backupContact);
    data.attachment && formData.append("attachment", data.attachment[0]);

    setIsLoading(true);

    if (method === "Add") {
      const createDoc = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDocument`,
        {
          method: "POST",
          body: formData,
        }
      );

      await createDoc.json();

      const depAppr = await fetch(
        `${import.meta.env.VITE_API_URL}/api/approver/DepId/${user.dep_id}`
      );
      await depAppr.json();

      window.location.reload();
    } else if (method === "Edit") {
      const sad = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDocument/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      await sad.json();

      window.location.reload();
    } else if (method === "Review") {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/LeaveDocument/status/${id}?emp_id=${user.emp_id}&dep_id=${
          leaveDefault?.dep_id
        }`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({ status: conclusion }),
        }
      );

      await res.json();
      window.location.reload();
    }

    setIsLoading(false);
  }

  if (loading)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[170px]">
          <span className="flex items-center gap-2">
            <Loader2 size={15} className="animate-spin" />
            Loading...
          </span>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            {method === "View" ? "" : method} Leave Request {id}
            {method !== "Add" && (
              <StatusCard
                trigger={{
                  name: leaveDefault && leaveDefault.status,
                  className: colorCheck(leaveDefault?.status || ""),
                }}
                apprStatus={leaveDefault ? leaveDefault.depAppr : null}
              />
            )}
          </DialogTitle>
          <DialogDescription>
            {method === "Review"
              ? "Review the input below and choose 'Approve' or 'Reject'."
              : method === "Add"
              ? "Fill in the inputs below. Click submit when you're done."
              : method === "Edit" &&
                "Edit in the inputs below. Click submit when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} readOnly={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  {method === "Add" || method === "Edit" ? (
                    <Select
                      onValueChange={(newValue) => {
                        const found = leaveDash?.allLeaveQnty.find(
                          (value) => value.id.toString() === newValue.toString()
                        );
                        setMax(found?.amountLeft);

                        return field.onChange(newValue);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes.map((leaveType) => (
                          <SelectItem
                            key={leaveType.id}
                            value={leaveType.id.toString()}
                            disabled={leaveDash?.allLeaveQnty.some(
                              (dash) =>
                                dash.id === leaveType.id && dash.amountLeft <= 0
                            )}
                          >
                            <div className="flex justify-between">
                              <span>
                                {leaveType.type_name} (
                                {leaveDash?.allLeaveQnty.map(
                                  (dash) =>
                                    leaveType.id === dash.id && dash.amountLeft
                                )}
                                )
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="..."
                      value={leaveDefault?.typeName}
                      readOnly={
                        (method === "Review" || method === "View") && true
                      }
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label>Date</Label>
            {method === "Add" || method === "Edit" ? (
              <DatePickerWithRange
                max={max}
                disabled={max === undefined ? true : false}
                date={date}
                setDate={setDate}
              />
            ) : (
              <Input
                placeholder="..."
                value={`${leaveDefault?.date?.from?.toDateString()} - ${leaveDefault?.date?.to?.toDateString()}`}
                readOnly={(method === "Review" || method === "View") && true}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="..."
                      {...field}
                      readOnly={
                        (method === "Review" || method === "View") && true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="writtenPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Written Place</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="..."
                      {...field}
                      readOnly={
                        (method === "Review" || method === "View") && true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backupContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Contact</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="..."
                      {...field}
                      readOnly={
                        (method === "Review" || method === "View") && true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(method === "Review" || method === "View") &&
            leaveDefault?.attachment !== null ? (
              <Link
                to={`${
                  import.meta.env.VITE_API_URL
                }/uploads/${leaveDefault?.attachment?.slice(15)}`}
                className="w-fit flex flex-col pt-2 gap-2"
              >
                <Label>Attachment (Optional)</Label>
                <Button type="button" variant={"link"}>
                  {leaveDefault?.attachment?.slice(15)}
                </Button>
              </Link>
            ) : leaveDefault?.attachment == null &&
              (method === "Review" || method === "View") ? (
              <div className="w-fit flex flex-col pt-2 gap-2">
                <Label>Attachment (Optional)</Label>
                <Button variant={"ghost"} disabled>
                  File was not attached
                </Button>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="attachment"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Attachment (Optional)</FormLabel>
                    <FormControl className="flex flex-col">
                      <Input
                        type="file"
                        // {...field}
                        onChange={(event) => onChange(event.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              {method === "Review" ? (
                <div className="flex w-full justify-end gap-2 mt-4">
                  <Button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white"
                    disabled={
                      leaveDefault?.status === "rejected" ||
                      leaveDefault?.status === "approved" ||
                      leaveDefault?.depAppr?.some(
                        (appr) =>
                          appr.id === user.emp_id &&
                          (appr.status === "approved" ||
                            appr.status === "rejected")
                      )
                    }
                    onClick={() => setConclusion("approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    type="submit"
                    variant={"destructive"}
                    disabled={
                      leaveDefault?.status === "rejected" ||
                      leaveDefault?.status === "approved" ||
                      leaveDefault?.depAppr?.some(
                        (appr) =>
                          appr.id === user.emp_id &&
                          (appr.status === "approved" ||
                            appr.status === "rejected")
                      )
                    }
                    onClick={() => setConclusion("rejected")}
                  >
                    Reject
                  </Button>
                </div>
              ) : method === "View" ? (
                ""
              ) : (
                <div className="flex w-full justify-end mt-4">
                  {leaveDefault?.depAppr?.some(
                    (item) =>
                      item.status === "rejected" || item.status === "approved"
                  ) ? (
                    <Button
                      type="submit"
                      disabled={leaveDefault?.depAppr?.some(
                        (item) =>
                          item.status === "rejected" ||
                          item.status === "approved"
                      )}
                    >
                      Reviewed
                    </Button>
                  ) : (
                    <>
                      {isLoading ? (
                        <ButtonLoading />
                      ) : (
                        <Button type="submit">Submit</Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDialog;
