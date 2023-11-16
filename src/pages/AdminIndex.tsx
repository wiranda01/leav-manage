// import { TimeRecord } from "@/components/AdminIndex/columns";
import {
  EmployeeRecord,
  columns as amountColumns,
} from "@/components/AdminIndex/columnsAmount";
import { DataTable } from "@/components/AdminIndex/data-table";
import DashItem from "@/components/DashItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";
import WorkHoursPage from "./Admin/WorkHours/page";
import LeavesPage from "./Admin/Leaves/page";

type Data = {
  empCount: { _count: { id: number } };
  pendingAmount: { _count: { id: number } };
  approvedAmount: { _count: { id: number } };
  rejectedAmount: { _count: { id: number } };
  todayAmount: { _count: { id: number } };
};

const AdminIndex = () => {
  // const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [weekRecords, setWeekRecords] = useState<EmployeeRecord[]>([]);
  const [monthRecords, setMonthRecords] = useState<EmployeeRecord[]>([]);
  const [data, setData] = useState<Data>();

  // const [day, setDay] = useState<Date>(new Date());
  const [startWeek, setStartWeek] = useState<Date>(new Date(0));
  const [endWeek, setEndWeek] = useState<Date>(new Date(0));
  const [startMonth, setStartMonth] = useState<Date>(new Date(0));
  const [endMonth, setEndMonth] = useState<Date>(new Date(0));

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/AdminDashboard`
      );
      const data = await res.json();
      setData(data);
      // console.log(data);
      // console.log(data.empCount._count.id);

      // const resDay = await fetch(
      //   `${import.meta.env.VITE_API_URL}/api/AdminDashboard/day`,
      //   {
      //     headers: {
      //       "content-type": "application/json",
      //     },
      //     method: "POST",
      //     body: JSON.stringify({ date: day }),
      //   }
      // );

      // const json = await resDay.json();

      // const timeRecords: TimeRecord[] = [];

      // for (let timeRecord of json.timeRecords) {
      //   timeRecords.push({
      //     id: timeRecord.id,
      //     name: timeRecord.emp.first_name + " " + timeRecord.emp.last_name,
      //     clockIn: timeRecord.clock_in,
      //     lateTime: timeRecord.late_time,
      //     status: timeRecord.status,
      //   });
      // }

      // for (let employeeLeave of json.employeeLeaves) {
      //   timeRecords.push({
      //     id: employeeLeave.id,
      //     name:
      //       employeeLeave.emp.first_name + " " + employeeLeave.emp.last_name,
      //     clockIn: "",
      //     lateTime: "",
      //     status: "leave",
      //   });
      // }

      // setTimeRecords(timeRecords);

      const startWeek = new Date();
      startWeek.setDate(startWeek.getDate() - startWeek.getDay());
      startWeek.setHours(0, 0, 0, 0);

      const endWeek = new Date();
      endWeek.setDate(endWeek.getDate() - endWeek.getDay() + 6);
      endWeek.setHours(24, 0, 0, 0);

      const resWeek = await fetch(
        `${import.meta.env.VITE_API_URL}/api/AdminDashboard/day-range`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            startDate: startWeek,
            endDate: endWeek,
          }),
        }
      );

      const jsonWeek = await resWeek.json();
      const employeeRecords = jsonWeek.employeeRecords;

      const weekRecords: EmployeeRecord[] = [];

      for (let employeeId in employeeRecords) {
        weekRecords.push({
          id: parseInt(employeeId),
          name: employeeRecords[employeeId].name,
          onTimeAmount: employeeRecords[employeeId].on_time_amount,
          lateAmount: employeeRecords[employeeId].late_amount,
          leaveAmount: employeeRecords[employeeId].leave_amount,
        });
      }

      setWeekRecords(weekRecords);

      const startMonth = new Date();
      startMonth.setDate(1);
      startMonth.setHours(0, 0, 0, 0);

      const endMonth = new Date();
      endMonth.setMonth(endMonth.getMonth() + 1);
      endMonth.setDate(1);
      endMonth.setHours(0, 0, 0, 0);

      const resMonth = await fetch(
        `${import.meta.env.VITE_API_URL}/api/AdminDashboard/day-range`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            startDate: startMonth,
            endDate: endMonth,
          }),
        }
      );

      const jsonMonth = await resMonth.json();
      const employeeRecordsMonth = jsonMonth.employeeRecords;
      const monthRecords: EmployeeRecord[] = [];

      for (let employeeId in employeeRecordsMonth) {
        monthRecords.push({
          id: parseInt(employeeId),
          name: employeeRecordsMonth[employeeId].name,
          onTimeAmount: employeeRecordsMonth[employeeId].on_time_amount,
          lateAmount: employeeRecordsMonth[employeeId].late_amount,
          leaveAmount: employeeRecordsMonth[employeeId].leave_amount,
        });
      }

      setMonthRecords(monthRecords);

      setStartWeek(startWeek);
      endWeek.setDate(endWeek.getDate() - 1);
      setEndWeek(endWeek);

      setStartMonth(startMonth);
      setEndMonth(endMonth);
    }

    fetchData();
  }, []);

  // async function handleDayChange(e: React.MouseEvent<HTMLButtonElement>) {
  //   const name = e.currentTarget.name;
  //   if (name == "prev") {
  //     day.setDate(day.getDate() - 1);
  //   } else if (name == "next") {
  //     day.setDate(day.getDate() + 1);
  //   }

  //   const resDay = await fetch(
  //     `${import.meta.env.VITE_API_URL}/api/AdminDashboard/day`,
  //     {
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       method: "POST",
  //       body: JSON.stringify({ date: day }),
  //     }
  //   );

  //   const json = await resDay.json();

  //   const timeRecords: TimeRecord[] = [];

  //   for (let timeRecord of json.timeRecords) {
  //     timeRecords.push({
  //       id: timeRecord.id,
  //       name: timeRecord.emp.first_name + " " + timeRecord.emp.last_name,
  //       clockIn: timeRecord.clock_in,
  //       lateTime: timeRecord.late_time,
  //       status: timeRecord.status,
  //     });
  //   }

  //   for (let employeeLeave of json.employeeLeaves) {
  //     timeRecords.push({
  //       id: employeeLeave.id,
  //       name: employeeLeave.emp.first_name + " " + employeeLeave.emp.last_name,
  //       clockIn: "",
  //       lateTime: "",
  //       status: "leave",
  //     });
  //   }

  //   setTimeRecords(timeRecords);

  //   setDay(new Date(day));
  // }

  async function handleWeekChange(e: React.MouseEvent<HTMLButtonElement>) {
    const name = e.currentTarget.name;
    if (name == "prev") {
      startWeek.setDate(startWeek.getDate() - 7);
      endWeek.setDate(endWeek.getDate() - 6);
    } else if (name == "next") {
      startWeek.setDate(startWeek.getDate() + 7);
      endWeek.setDate(endWeek.getDate() + 8);
    }

    const resWeek = await fetch(
      `${import.meta.env.VITE_API_URL}/api/AdminDashboard/day-range`,
      {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          startDate: startWeek,
          endDate: endWeek,
        }),
      }
    );

    const jsonWeek = await resWeek.json();
    const employeeRecords = jsonWeek.employeeRecords;

    const weekRecords: EmployeeRecord[] = [];

    for (let employeeId in employeeRecords) {
      weekRecords.push({
        id: parseInt(employeeId),
        name: employeeRecords[employeeId].name,
        onTimeAmount: employeeRecords[employeeId].on_time_amount,
        lateAmount: employeeRecords[employeeId].late_amount,
        leaveAmount: employeeRecords[employeeId].leave_amount,
      });
    }

    setWeekRecords(weekRecords);

    setStartWeek(new Date(startWeek));
    endWeek.setDate(endWeek.getDate() - 1);
    setEndWeek(new Date(endWeek));
  }

  async function handleMonthChange(e: React.MouseEvent<HTMLButtonElement>) {
    const name = e.currentTarget.name;
    if (name == "prev") {
      startMonth.setMonth(startMonth.getMonth() - 1);
      endMonth.setMonth(endMonth.getMonth() - 1);
    } else if (name == "next") {
      startMonth.setMonth(startMonth.getMonth() + 1);
      endMonth.setMonth(endMonth.getMonth() + 1);
    }

    const resMonth = await fetch(
      `${import.meta.env.VITE_API_URL}/api/AdminDashboard/day-range`,
      {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          startDate: startMonth,
          endDate: endMonth,
        }),
      }
    );

    const jsonMonth = await resMonth.json();
    const employeeRecordsMonth = jsonMonth.employeeRecords;
    const monthRecords: EmployeeRecord[] = [];

    for (let employeeId in employeeRecordsMonth) {
      monthRecords.push({
        id: parseInt(employeeId),
        name: employeeRecordsMonth[employeeId].name,
        onTimeAmount: employeeRecordsMonth[employeeId].on_time_amount,
        lateAmount: employeeRecordsMonth[employeeId].late_amount,
        leaveAmount: employeeRecordsMonth[employeeId].leave_amount,
      });
    }

    setMonthRecords(monthRecords);

    setStartMonth(new Date(startMonth));
    setEndMonth(new Date(endMonth));
  }

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
        {/* <div className="col-span-5">
          <DataCalendar />
        </div> */}
        <div className="col-span-12">
          <Tabs defaultValue="day">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            <TabsContent value="day">
              <WorkHoursPage />
              {/* <div className="flex justify-center items-center gap-2">
                <Button
                  name="prev"
                  variant={"outline"}
                  onClick={handleDayChange}
                >
                  <ChevronLeft />
                </Button>

                <div className="w-[250px] text-center">
                  {day.toLocaleString("en-GB", {
                    dateStyle: "full",
                  })}
                </div>

                <Button
                  name="next"
                  variant={"outline"}
                  onClick={handleDayChange}
                >
                  <ChevronRight />
                </Button>
              </div>
              <DataTable columns={columns} data={timeRecords} /> */}
            </TabsContent>
            <TabsContent value="week">
              <div className="flex justify-center items-center gap-2">
                <Button
                  name="prev"
                  variant={"outline"}
                  onClick={handleWeekChange}
                >
                  <ChevronLeft />
                </Button>

                <div className="w-[450px] text-center">
                  {startWeek.toLocaleString("en-GB", { dateStyle: "full" })}
                  {" - "}
                  {endWeek.toLocaleString("en-GB", { dateStyle: "full" })}
                </div>

                <Button
                  name="next"
                  variant={"outline"}
                  onClick={handleWeekChange}
                >
                  <ChevronRight />
                </Button>
              </div>
              <DataTable columns={amountColumns} data={weekRecords} />
            </TabsContent>
            <TabsContent value="month">
              <div className="flex justify-center items-center gap-2">
                <Button
                  name="prev"
                  variant={"outline"}
                  onClick={handleMonthChange}
                >
                  <ChevronLeft />
                </Button>

                <div className="w-[200px] text-center">
                  {startMonth.toLocaleString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <Button
                  name="next"
                  variant={"outline"}
                  onClick={handleMonthChange}
                >
                  <ChevronRight />
                </Button>
              </div>
              <DataTable columns={amountColumns} data={monthRecords} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="col-span-12">
          <LeavesPage />
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
