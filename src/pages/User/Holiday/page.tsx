import DataCalendar from "@/components/DataCalendar";

const UserHolidayPage = () => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Holiday</h2>
      <div className="mt-3">
        <DataCalendar />
      </div>
    </div>
  );
};

export default UserHolidayPage;
