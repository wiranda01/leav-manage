import DashItem from "@/components/DashItem";
import DataCalendar from "@/components/DataCalendar";
import { Leave, columns } from "@/pages/User/Leaves/columns";
import { DataTable } from "@/pages/User/Leaves/data-table";

import { useEffect, useState } from "react";
import { LeaveAPI } from "./User/Leaves/page";
import UserWorkHoursPage from "./User/WorkHours/page";

export type LeaveDash = {
  leaveAvailableAmount: number;
  allLeaveQnty: {
    id: number;
    typeName: string;
    amountLeft: number;
  }[];
  pendingLeaveAmount: number;
  approvedLeaveAmount: number;
  rejectedLeaveAmount: number;
};

const UserIndex = () => {
  const [Leave, setLeave] = useState<Leave[]>([]);
  const [data, setData] = useState<LeaveDash>();

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
      const resDash = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDashboard/${user.emp_id}`
      );
      const dataDash = await resDash.json();

      setData(dataDash);
    };

    getLeave();
  }, []);

  const items = [
    {
      title: "Available Leave Balance",
      thai: "จำนวนวันลาคงเหลือทั้งหมด",
      color: { borderColor: "#B79BFF" },
      count: data?.leaveAvailableAmount,
    },
    {
      title: "Pending Leave Approval",
      thai: "การลาที่รอการอนุมัติ",
      color: { borderColor: "#FFBB4F" },
      count: data?.pendingLeaveAmount,
    },
    {
      title: "Approved Leave",
      thai: "การลาที่อนุมัติแล้ว",
      color: { borderColor: "#92C88D" },
      count: data?.approvedLeaveAmount,
    },
    {
      title: "Rejected Leave",
      thai: "การลาที่ถูกปฏิเสธ",
      color: { borderColor: "#FF7576" },
      count: data?.rejectedLeaveAmount,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex flex-col lg:grid grid-cols-12 gap-6 mt-3 overflow-y-auto">
        <div className="col-span-12 ">
          <DashItem items={items} />
        </div>
        <div className="col-span-12 h-fit ">
          <DataCalendar />
        </div>
        <div className="col-span-12">
          <UserWorkHoursPage />
        </div>
        <div className="col-span-12 ">
          <h2 className="text-3xl font-bold tracking-tight">Leave</h2>
          <DataTable columns={columns} data={Leave} />
        </div>
      </div>
    </div>
  );
};

export default UserIndex;
