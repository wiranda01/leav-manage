import DataCalendar from "@/components/DataCalendar";
import AddHoliday from "@/components/Holiday/AddHoliday";
import HolidayCard from "@/components/Holiday/HolidayCard";

const HolidayPage = () => {
  return (
    <div className="w-full">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Holiday</h2>
        <AddHoliday />
      </div>
      <div className="mt-3">
        <DataCalendar />
      </div>
      <div className="mt-3">
        <HolidayCard />
      </div>
    </div>
  );
};

export default HolidayPage;
