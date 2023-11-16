import { DataTable } from "@/pages/Admin/Member/data-table";
import { useEffect, useState } from "react";
import { Member, columns } from "./columns";

const MemberPage = () => {
  const [member, setMember] = useState<Member[]>([]);

  const calculateEmploymentDuration = (startDate: Date) => {
    const now = new Date();
    const startDateObj = new Date(startDate);

    // Check if the startDate is today
    if (
      startDateObj.toDateString() === now.toDateString() &&
      startDateObj <= now
    ) {
      return "Employed Today";
    }

    // Check if the startDate is in the future
    if (startDateObj > now) {
      return "Not Employed Yet";
    }

    let yearDiff = now.getFullYear() - startDateObj.getFullYear();
    let monthDiff = now.getMonth() - startDateObj.getMonth();
    let dayDiff = now.getDate() - startDateObj.getDate();

    // Adjust for negative month or day differences
    if (dayDiff < 0) {
      monthDiff--;
      dayDiff += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }

    const yearString =
      yearDiff > 0 ? `${yearDiff} year${yearDiff > 1 ? "s" : ""}` : "";
    const monthString =
      monthDiff > 0 ? `${monthDiff} month${monthDiff > 1 ? "s" : ""}` : "";
    const dayString =
      dayDiff > 0 ? `${dayDiff} day${dayDiff > 1 ? "s" : ""}` : "";

    const durationString = [yearString, monthString, dayString]
      .filter(Boolean)
      .join(", ");

    return durationString;
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/employee`);
      const data: {
        id: number;
        first_name: string;
        last_name: string;
        birth_date: string;
        email: string;
        gender: string;
        address: string;
        username: string;
        password: string;
        auth: number;
        dep_id: number | null;
        date_employed: Date;
        phone: string;
        status: string;
        role: string;
        dep: {
          id: number;
          dep_name: number;
        };
      }[] = await res.json();
      const formattedData: Array<Member> = data.map((item) => ({
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
        dep_name: item.dep ? item.dep?.dep_name.toString() : "No Department",
        email: item.email,
        phone_number: item.phone,
        service_year: calculateEmploymentDuration(item.date_employed),
      }));

      setMember(formattedData);
    };

    fetchMembers();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Member</h2>
      <DataTable columns={columns} data={member} />
    </div>
  );
};

export default MemberPage;
