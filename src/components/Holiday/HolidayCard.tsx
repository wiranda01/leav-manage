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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Holiday = {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
}[];

const HolidayCard = () => {
  const [holidays, setHolidays] = useState<Holiday>([]);

  const onDelete = async (id: number) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/holiday/${id}`, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    setHolidays((prev) => prev.filter((item) => item.id !== id));
  };
  useEffect(() => {
    const fetchHolidays = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/holiday`);
      const json = await res.json();

      setHolidays(json);
    };

    fetchHolidays();
  }, []);

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
      {holidays.map((holiday) => {
        const startDate = new Date(holiday.start_date);
        const endDate = new Date(holiday.end_date);
        endDate.setDate(endDate.getDate() - 1);

        return (
          <div key={holiday.id} className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{holiday.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {startDate.toDateString()} - {endDate.toDateString()}
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Remove</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(holiday.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default HolidayCard;
