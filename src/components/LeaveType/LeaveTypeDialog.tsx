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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MinusCircle } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChangeEvent, useEffect, useState } from "react";
import { ButtonLoading } from "../ButtonLoading";

type Row = {
  id: number;
  year: number;
  quantity: number;
};

export type LeaveTypeDefault = {
  type_name: string;
  fixed_quota: string;
  type: "fixed" | "serviceYears";
  type_quantity: Row[];
};

interface LeaveTypeDialogProps {
  id?: number;
  method: "Add" | "Edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  typeDetails?: LeaveTypeDefault;
}

const LeaveTypeDialog = ({
  id,
  method,
  open,
  setOpen,
  typeDetails,
}: LeaveTypeDialogProps) => {
  const [radioSelected, setRadioSelected] = useState<string | undefined>(
    "fixed"
  );
  const [divs, setDivs] = useState<Row[]>([{ id: 0, year: 0, quantity: 0 }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const FormSchema = z.object({
    typeName: z.string().min(1),
    fixedValue: z.string(),
    typeOptions: z.enum(["fixed", "serviceYears"]),
    // durationYears: z.array(
    //   z.object({
    //     year: z.string(),
    //     quantity: z.string(),
    //   })
    // ),
  });

  // Function to add a new div
  const addDiv = () => {
    setDivs([
      ...divs,
      {
        id: divs[divs.length - 1].id + 1,
        year: divs[divs.length - 1].year + 1,
        quantity: 0,
      },
    ]);
  };

  // Function to remove a div by its ID
  const removeDiv = (id: number) => {
    setDivs(
      divs
        .filter((div) => div.id !== id)
        .map((prev, index) => ({
          id: prev.id,
          year: index,
          quantity: prev.quantity,
        }))
    );
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const list: any = [...divs];
    list[index][name] = value;

    setDivs(list);
  };

  useEffect(() => {
    if (typeDetails) {
      form.setValue("typeName", typeDetails.type_name || "");
      form.setValue("fixedValue", typeDetails.fixed_quota || "0");
      setRadioSelected(typeDetails.type);
      form.setValue("typeOptions", typeDetails.type || "");
      setDivs(typeDetails.type_quantity);
      typeDetails.type_quantity.length === 0 &&
        setDivs([{ id: 0, year: 0, quantity: 0 }]);
    }
  }, [typeDetails]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      typeName: "",
      typeOptions: "fixed",
      fixedValue: "0",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    if (method === "Add") {
      try {
        // POST department to database
        await fetch(`${import.meta.env.VITE_API_URL}/api/LeaveType`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            typeName: values.typeName,
            fixedQuota: values.fixedValue,
            type: values.typeOptions,
            typeQuantity: divs,
          }),
        });
        //////////
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/LeaveType/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            typeName: values.typeName,
            fixedQuota: values.fixedValue,
            type: values.typeOptions,
            typeQuantity: divs,
          }),
        });

        // if (radioSelected === "serviceYears") {
        //   await fetch(
        //     `${import.meta.env.VITE_API_URL}/api/TypeQuantity/type/${id}`,
        //     {
        //       method: "DELETE",
        //     }
        //   );

        //   await divs.map((item) =>
        //     fetch(`${import.meta.env.VITE_API_URL}/api/TypeQuantity`, {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         year: item.year,
        //         quantity: item.quantity,
        //       }),
        //     })
        //   );
        // }
        //////////
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Add Leave Type</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>{method} Leave Type</DialogTitle>
              <DialogDescription>
                Specify the leave type and submit.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="typeOptions"
              render={({ field }) => (
                <div className="grid gap-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(newValue) => {
                        field.onChange(newValue); // Update the form field with the new value
                        setRadioSelected(newValue);
                      }}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel>Fixed Quota</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="serviceYears" />
                        </FormControl>
                        <FormLabel>Duration of Service Years</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </div>
              )}
            />
            {radioSelected === "fixed" ? (
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="fixedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quota Day</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={0} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <>
                {" "}
                <div className="grid grid-cols-4 gap-y-4 max-h-[410px] pe-6 py-1 overflow-y-auto overflow-x-hidden">
                  <Label htmlFor="name" className="col-span-3">
                    Duration
                  </Label>
                  <Label htmlFor="name" className="col-span-1">
                    Quota (Day)
                  </Label>
                  {divs.map((div, index) => (
                    <div className="grid grid-cols-4 col-span-4" key={index}>
                      <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-4 content-center">
                          <Label className="self-center text-right">
                            More Than
                          </Label>
                          <Input
                            className=""
                            type="number"
                            name="year"
                            value={div.year}
                            onChange={(e) => onInputChange(e, index)}
                            readOnly
                          />
                          <Label className="self-center">Years</Label>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="grid grid-cols-6">
                          <Input
                            id="day"
                            type="number"
                            min={0}
                            name="quantity"
                            className="col-span-4"
                            value={div.quantity}
                            onChange={(e) => onInputChange(e, index)}
                          />
                          <Button
                            className="self-center"
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={divs.length === 1}
                            onClick={() => removeDiv(div.id)}
                          >
                            <MinusCircle />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="col-span-full" />
                <div className="flex justify-center">
                  <Button className="w-full" onClick={addDiv} type="button">
                    Add More
                  </Button>
                </div>
              </>
            )}
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

export default LeaveTypeDialog;
