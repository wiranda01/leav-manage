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

import { useState } from "react";

import QRCode from "react-qr-code";

const AddQR = () => {
  const [token, setToken] = useState<string>();

  const originURL = window.location.origin;

  async function handleOnClick() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/token`);
    const json = await res.json();

    setToken(json.createdToken.token);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center gap-2" onClick={handleOnClick}>
          Clock In
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription>
            Have the employee scan the qr to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="bg-white p-4">
            <QRCode value={`${originURL}/clockin?token=${token}`} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddQR;
