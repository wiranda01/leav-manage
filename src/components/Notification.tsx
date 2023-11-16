import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import LeaveDialog from "./Leaves/LeaveDialog";
import { Separator } from "./ui/separator";

import { useEffect, useState } from "react";

type Data = {
  pendingAmount: { _count: { id: number } };
  docNotification: {
    id: number;
    noti_type: string;
    sender_id: number;
    first_receiver: number;
    second_receiver: number;
    doc_id: number;
    created_at: Date;
    is_seen_first: number;
    is_seen_second: number;
    sender: {
      id: number;
      first_name: string;
      last_name: string;
    };
    firstReceiver: {
      id: number;
      first_name: string;
      last_name: string;
    };
    secondReceiver: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }[];
};

const Notification = () => {
  const [data, setData] = useState<Data>();
  const [notificationLoading, setNotificationLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem("user")!);
  const isApprover = user.is_first_approver || user.is_second_approver;

  const fetchData = async () => {
    if (user) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notification?emp_id=${user.emp_id}`
      );
      const data = await res.json();
      setData(data);
      setNotificationLoading(false);
    } else {
      setNotificationLoading(false);
    }
  };

  const handleNotificationClick = async (notiId: number, docId: number) => {
    if (user.role === "admin" || isApprover) {
      setOpen(true);
    } else {
      setOpenView(true);
    }
    setCurrentDoc(docId);

    const setRead = await fetch(
      `${import.meta.env.VITE_API_URL}/api/notification/${notiId}?user=${
        user.emp_id
      }`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    await setRead.json();
  };

  const calculateTimePassed = (notificationDate: Date): string => {
    const currentDate: Date = new Date();
    const notificationTime: Date = new Date(notificationDate);

    const timeDifference: number =
      currentDate.getTime() - notificationTime.getTime();

    // Calculate the time passed in seconds, minutes, hours, and days
    const seconds: number = Math.floor(timeDifference / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  };

  const notificationTypeCheck = (type: string) => {
    if (type === "request") return "sent you a leave document";
    else if (type === "approved") return "has approved a leave document";
    else if (type === "rejected") return "has rejected a leave document";
  };

  useEffect(() => {
    fetchData();
    setInterval(fetchData, 4000);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            fetchData();
          }}
        >
          <div className="relative">
            <Bell size={18} />
            {data?.docNotification.some(
              (item) =>
                (item.firstReceiver &&
                  item.firstReceiver.id === user.emp_id &&
                  item.is_seen_first === 0) ||
                (item.secondReceiver &&
                  item.secondReceiver.id === user.emp_id &&
                  item.is_seen_second === 0)
            ) && (
              <span className="bg-red-500 w-2 h-2 rounded-full absolute -top-0.5 -right-0.5" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <LeaveDialog
        method="Review"
        open={open}
        setOpen={setOpen}
        id={currentDoc}
      />
      <LeaveDialog
        method="View"
        open={openView}
        setOpen={setOpenView}
        id={currentDoc}
      />
      <PopoverContent
        align="end"
        className="w-[420px] max-h-[535px] overflow-y-auto"
      >
        {user.role === "admin" && notificationLoading === true ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <Skeleton className="h-5 w-[120px]" />
                <Separator />
              </div>
            ))}
          </div>
        ) : notificationLoading === false &&
          data &&
          data.docNotification.length > 0 ? (
          data?.docNotification.map((item, index) => (
            <div
              className="mb-2"
              key={index}
              onClick={() => {
                handleNotificationClick(item.id, item.doc_id);
              }}
            >
              <div className="flex flex-col p-2 rounded-sm hover:bg-accent hover:cursor-pointer">
                <div className="flex gap-2 items-center">
                  <h1 className="font-medium">
                    {`${item.sender.first_name} ${item.sender.last_name}`}
                    {"  "}
                    {`${notificationTypeCheck(item.noti_type)} (${
                      item.doc_id
                    })`}
                  </h1>
                  {((item.firstReceiver &&
                    item.firstReceiver.id === user.emp_id &&
                    item.is_seen_first === 0) ||
                    (item.secondReceiver &&
                      item.secondReceiver.id === user.emp_id &&
                      item.is_seen_second === 0)) && (
                    <span className="bg-red-500 w-2 aspect-square rounded-full" />
                  )}
                </div>
                <div>
                  <span className="text-slate-400 font-light text-sm">
                    {calculateTimePassed(item.created_at)}
                  </span>
                </div>
              </div>
              <Separator />
            </div>
          ))
        ) : (
          <div className="text-center">Your notification inbox is empty.</div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
