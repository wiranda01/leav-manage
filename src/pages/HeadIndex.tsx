// import { TimeRecord } from "@/components/AdminIndex/columns";
import DashItem from "@/components/DashItem";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import WorkHoursPage from "./Head/WorkHours/page";
import LeavesPage from "./Head/Leaves/page";

type Data = {
  empCount: { _count: { id: number } };
  pendingAmount: { _count: { id: number } };
  approvedAmount: { _count: { id: number } };
  rejectedAmount: { _count: { id: number } };
  todayAmount: { _count: { id: number } };
};

const HeadIndex = () => {
  const [data, setData] = useState<Data>();

  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/AdminDashboard/department/${
          user.dep_id
        }`
      );
      const data = await res.json();
      setData(data);
    }

    fetchData();
  }, []);

  const items = [
    {
      title: "Number of Employees",
      thai: "จำนวนพนักงานทั้งหมด",
      color: { borderColor: "#B79BFF" },
      count: data?.empCount._count.id,
    },
    {
      title: "Pending Leave Approval",
      thai: "การลาที่รอการอนุมัติ",
      color: { borderColor: "#FFBB4F" },
      count: data?.pendingAmount._count.id,
    },
    {
      title: "Approved Leave",
      thai: "การลาที่อนุมัติแล้ว",
      color: { borderColor: "#92C88D" },
      count: data?.approvedAmount._count.id,
    },
    {
      title: "Rejected Leave",
      thai: "การลาที่ถูกปฏิเสธ",
      color: { borderColor: "#FF7576" },
      count: data?.rejectedAmount._count.id,
    },
    {
      title: "Today's Leave Count",
      thai: "พนักงานที่ลาวันนี้",
      color: { borderColor: "#52ACFF" },
      count: data?.todayAmount._count.id,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Shield />
      </div>
      <div className="flex flex-col lg:grid grid-cols-12 gap-12 mt-3 overflow-y-auto">
        <div className="col-span-12">
          <DashItem items={items} />
        </div>
        <div className="col-span-12">
          <WorkHoursPage />
        </div>
        <div className="col-span-12">
          <LeavesPage />
        </div>
      </div>
    </div>
  );
};

export default HeadIndex;
