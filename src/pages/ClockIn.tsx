import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ClockIn = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>("");

  const token = searchParams.get("token");
  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          token: token,
        }),
      });

      if (res.status == 400) {
        setMessage("Error: Invalid link or link has expired");
        return;
      }

      const json = await res.json();
      const date = json.date;

      const resClock = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ClockInOut`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            empId: user.emp_id,
            date: date,
            clockIn: new Date(),
          }),
        }
      );

      if (resClock.status == 400) {
        setMessage("You are already clock in");
        return;
      }

      await resClock.json();

      setMessage("You are now clock in for today");
    }

    fetchData();
  }, []);

  if (!token) {
    return (
      <div className="flex justify-center items-center w-full">
        Invalid link
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">{message}</div>
  );
};

export default ClockIn;
