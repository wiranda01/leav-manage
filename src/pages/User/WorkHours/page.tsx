import { useEffect, useState } from "react";
import { WorkHours, columns } from "./columns";
import { DataTable } from "./data-table";

const UserWorkHoursPage = () => {
  const [timeRecords, setTimeRecords] = useState<WorkHours[]>([]);
  const user = JSON.parse(localStorage.getItem("user")!);

  type clockInOutAPI = {
    id: number;
    emp: {
      first_name: string;
      last_name: string;
      dep: {
        id: number;
        dep_name: string;
      };
    };
    date: string;
    clock_in: string;
    clock_out: string;
    total_hours: string;
    late_time: string;
  };

  useEffect(() => {
    const fetchTimeRecordsData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clockinout/employee/${
          user.emp_id
        }`
      );
      const data: Array<clockInOutAPI> = await res.json();

      if (Array.isArray(data)) {
        const flattendData: Array<WorkHours> = data.map((item) => ({
          id: item.id,
          name: `${item.emp.first_name} ${item.emp.last_name}`,
          department: item.emp.dep.dep_name,
          date: item.date,
          clock_in: item.clock_in,
          clock_out: item.clock_out,
          total_hours: item.total_hours,
          late_time: item.late_time,
        }));

        setTimeRecords(flattendData);
      }
    };

    fetchTimeRecordsData();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Work Hours</h2>
      <DataTable columns={columns} data={timeRecords} />
    </div>
  );
};

export default UserWorkHoursPage;
