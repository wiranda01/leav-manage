import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { QrCode, RotateCw } from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "../ui/button";

const QRDropdown = () => {
  const [token, setToken] = useState<string>();
  const [ClockInOpen, setClockInOpen] = useState<boolean>();
  const [ClockOutOpen, setClockOutOpen] = useState<boolean>();
  const [countDown, setCountDown] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout>();

  const originURL = window.location.origin;

  async function handleOnClick() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/token`);
    const json = await res.json();

    setToken(json.createdToken.token);

    setCountDown(60);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountDown((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);
  }

  return (
    <>
      <Dialog open={ClockInOpen} onOpenChange={setClockInOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code for Clock In</DialogTitle>
            <DialogDescription>
              Have the employee scan the qr to proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center w-full text-2xl gap-2">
            {countDown}
            <Button onClick={handleOnClick}>
              <RotateCw size={20} />
            </Button>
          </div>
          <div className="flex justify-center">
            <QRCode
              className="bg-white p-4"
              value={`${originURL}/clockin?token=${token}`}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={ClockOutOpen} onOpenChange={setClockOutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code for Clock Out</DialogTitle>
            <DialogDescription>
              Have the employee scan the qr to proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center w-full text-2xl gap-2">
            {countDown}
            <Button onClick={handleOnClick}>
              <RotateCw size={20} />
            </Button>
          </div>
          <div className="flex justify-center">
            <QRCode
              className="bg-white p-4"
              value={`${originURL}/clockout?token=${token}`}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-center gap-2 min-w-max"
          >
            <QrCode size={18} />
            <span className="font-normal">Generate QR Code</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleOnClick}
            onSelect={() => setClockInOpen(true)}
          >
            Clock In
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleOnClick}
            onSelect={() => setClockOutOpen(true)}
          >
            Clock Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default QRDropdown;
