import { DataTable } from "@/pages/Head/Leaves/data-table";
import { LeaveAPI } from "@/pages/User/Leaves/page";
import { useEffect, useState } from "react";
import { Leave, columns } from "./columns";

const LeavesPage = () => {
  const [Leave, setLeave] = useState<Leave[]>([]);
  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    const getLeave = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/LeaveDocument/admin/${
          user.emp_id
        }?depId=${user.dep_id}`
      );
      const json: LeaveAPI[] = await res.json();

      if (res.ok) {
        const formattedData: Leave[] = json.map((item) => ({
          id: item.id,
          name: `${item.emp.first_name} ${item.emp.last_name}`,
          leave_type: item.type.type_name,
          amount: item.amount,
          reason: item.reason,
          status: item.status,
          date: `${new Date(item.start_date).toLocaleDateString(
            "en-GB"
          )} - ${new Date(item.end_date).toLocaleDateString("en-GB")}`,
        }));

        setLeave(formattedData);
      }
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

export default LeavesPage;
