import { DataTable } from "@/pages/User/Leaves/data-table";
import { useEffect, useState } from "react";
import { Leave, columns } from "./columns";

export type LeaveAPI = {
  id: number;
  type: { type_name: string };
  amount: number;
  reason: string;
  status: string;
  start_date: string;
  end_date: string;
  emp: { first_name: string; last_name: string };
};

const UserLeavesPage = () => {
  const [Leave, setLeave] = useState<Leave[]>([]);
  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    const getLeave = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDocument/employee/${
          user.emp_id
        }`
      );
      const json: LeaveAPI[] = await res.json();

      const formattedData: Leave[] = json.map((item) => ({
        id: item.id,
        leave_type: item.type.type_name,
        amount: item.amount,
        reason: item.reason,
        status: item.status,
        date: `${new Date(item.start_date).toLocaleDateString(
          "en-GB"
        )} - ${new Date(item.end_date).toLocaleDateString("en-GB")}`,
      }));

      setLeave(formattedData);
    };

    getLeave();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Leave</h2>
      <DataTable columns={columns} data={Leave} />
    </div>
  );
};

export default UserLeavesPage;
