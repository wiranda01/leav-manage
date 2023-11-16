import { DataTable } from "@/pages/Admin/LeaveType/data-table";
import { useEffect, useState } from "react";
import { LeaveType, columns } from "./columns";

const LeaveTypePage = () => {
  const [leaveType, setLeaveType] = useState<LeaveType[]>([]);

  useEffect(() => {
    const fetchLeaveType = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leavetype`);
      const data: LeaveType[] = await res.json();

      setLeaveType(data);
    };

    fetchLeaveType();
  }, []);
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Leave Type</h2>
      <DataTable columns={columns} data={leaveType} />
    </div>
  );
};

export default LeaveTypePage;
