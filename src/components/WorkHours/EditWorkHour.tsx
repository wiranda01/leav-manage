import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ButtonLoading } from "../ButtonLoading";

const formSchema = z.object({
  start_time: z.string().min(1, { message: "Please enter start time" }),
  end_time: z.string().min(1, { message: "Please enter end time" }),
});

const EditWorkHour = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workHour`);
      const data = await res.json();

      if (!data) {
        return;
      }

      const startTimeDate = new Date(data.start_time);
      const endTimeDate = new Date(data.end_time);

      const startTime =
        String(startTimeDate.getHours()).padStart(2, "0") +
        ":" +
        String(startTimeDate.getMinutes()).padStart(2, "0");

      const endTime =
        String(endTimeDate.getHours()).padStart(2, "0") +
        ":" +
        String(endTimeDate.getMinutes()).padStart(2, "0");

      form.setValue("start_time", startTime);
      form.setValue("end_time", endTime);
    }

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_time: "",
      end_time: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsLoading(true);

    // const start_time = new Date(`1970-01-01T${values.start_time}:00.000Z`);
    // const [start_hour, start_minute] = values.start_time.split(":");
    // start_time.setHours(parseInt(start_hour), parseInt(start_minute), 0, 0);

    // const end_time = new Date(`1970-01-01T${values.end_time}:00.000Z`);
    // const [end_hour, end_minute] = values.end_time.split(":");
    // end_time.setHours(parseInt(end_hour), parseInt(end_minute), 0, 0);
    const startTime = new Date();
    const endTime = new Date();

    const startHour = parseInt(values.start_time.slice(0, 2));
    const startMinute = parseInt(values.start_time.slice(3, 4));

    const endHour = parseInt(values.end_time.slice(0, 2));
    const endMinute = parseInt(values.end_time.slice(3, 4));

    startTime.setHours(startHour, startMinute, 0, 0);
    endTime.setHours(endHour, endMinute, 0, 0);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workHour`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      }),
    });
    await res.json();

    setIsLoading(false);
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="min-w-max">
          Edit Work Hour
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Work Hour</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" className="col-span-3" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-x-4">
                  <FormLabel className="text-right">End Time</FormLabel>
                  <FormControl>
                    <Input type="time" className="col-span-3" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <DialogFooter>
              {isLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">Save changes</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkHour;
