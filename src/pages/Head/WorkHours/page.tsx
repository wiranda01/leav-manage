import { DataTable } from "@/pages/Head/WorkHours/data-table";
import { useEffect, useState } from "react";
import { WorkHours, columns } from "./columns";

// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const WorkHoursPage = () => {
  const [timeRecords, setTimeRecords] = useState<WorkHours[]>([]);
  const user = JSON.parse(localStorage.getItem("user")!);

  type TimeRecordAPI = {
    id: number;
    first_name: string;
    last_name: string;
    dep: {
      id: number;
      dep_name: string;
    };
    time_record: TimeRecord[] | null;
    late_time: string;
  }[];

  type TimeRecord = {
    id: number;
    emp_id: number;
    date: null | string;
    clock_in: null | string;
    clock_out: null | string;
    total_hours: null | string;
  };

  useEffect(() => {
    const fetchTimeRecordsData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clockinout/dep/${user.dep_id}`
      );
      const data: TimeRecordAPI = await res.json();

      if (Array.isArray(data)) {
        const flattendData: WorkHours[] = data.map((item) => {
          const timeRecord = item.time_record ? item.time_record[0] : null;

          return {
            id: item.id,
            name: `${item.first_name} ${item.last_name}`,
            department: item.dep.dep_name,
            date: timeRecord ? timeRecord.date : null,
            clock_in: timeRecord ? timeRecord.clock_in : null,
            clock_out: timeRecord ? timeRecord.clock_out : null,
            total_hours: timeRecord ? timeRecord.total_hours : null,
            late_time: item.late_time,
          };
        });

        setTimeRecords(flattendData);
      }
    };

    fetchTimeRecordsData();
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Work Hours</h2>
      </div>
      <DataTable columns={columns} data={timeRecords} />
    </div>
  );
};

export default WorkHoursPage;
