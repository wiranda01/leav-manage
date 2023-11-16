import { Button } from "@/components/ui/button";
import {
  CalendarSearch,
  CalendarX,
  Clock,
  Component,
  GanttChartSquare,
  LayoutDashboard,
  Users2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { UserContext } from "@/App";
import { useContext } from "react";
import { Separator } from "@/components/ui/separator";

const SideBar = () => {
  const isAdmin = useContext(UserContext);
  const isHead = JSON.parse(localStorage.getItem("user")!).role === "head";

  const items = [
    {
      title: "Dashboard",
      Icons: LayoutDashboard,
      path: "/",
      admin: false,
    },
    {
      title: "Dashboard (User)",
      Icons: LayoutDashboard,
      path: "/user",
      admin: true,
    },
    {
      title: "Work Hours",
      Icons: Clock,
      path: "/workhours",
      admin: false,
    },
    {
      title: "Holiday",
      Icons: CalendarSearch,
      path: "/holiday",
      admin: false,
    },
    {
      title: "Department",
      Icons: Component,
      path: "/department",
      admin: true,
    },
    {
      title: "Member",
      Icons: Users2,
      path: "/member",
      admin: true,
    },
    {
      title: "Leave Type",
      Icons: GanttChartSquare,
      path: "/leavetype",
      admin: true,
    },
    {
      title: "Leave",
      Icons: CalendarX,
      path: "/leaves",
      admin: false,
    },
    {
      title: "Leave (User)",
      Icons: CalendarX,
      path: "/user/leaves",
      admin: true,
    },
  ];

  const headItems = [
    {
      title: "Dashboard",
      Icons: LayoutDashboard,
      path: "/department",
    },
    {
      title: "Member",
      Icons: Users2,
      path: "/member",
    },
    {
      title: "Work Hours",
      Icons: Clock,
      path: "workhours/department",
    },
    {
      title: "Leave",
      Icons: CalendarX,
      path: "/leaves/department",
    },
  ];

  return (
    <div className="hidden w-[55px] xl:block xl:w-[250px] h-[calc(100vh_-_60px)] border-border py-2">
      <div className="hidden sm:flex flex-col mx-4 mt-4">
        {isHead && <span className="flex gap-4 my-2 font-extrabold">User</span>}
        {items.map((item, index) => {
          return isAdmin === true && item.admin === true ? (
            <Link to={item.path} key={index} className="flex">
              <Button
                variant="ghost"
                className="justify-start gap-4 px-3 w-full text-start"
              >
                <item.Icons />
                <p>{item.title}</p>
              </Button>
            </Link>
          ) : (
            item.admin === false && (
              <Link to={item.path} key={index} className="flex">
                <Button
                  variant="ghost"
                  className="justify-start gap-4 px-3 w-full text-start"
                >
                  <item.Icons />
                  <p>{item.title}</p>
                </Button>
              </Link>
            )
          );
        })}
        {isHead && <Separator className="my-2" />}
        {isHead && (
          <span className="flex gap-4 my-2 font-extrabold">Department</span>
        )}
        {isHead &&
          headItems.map((item, index) => (
            <Link to={item.path} key={index} className="flex">
              <Button
                variant="ghost"
                className="justify-start gap-4 px-3 w-full text-start"
              >
                <item.Icons />
                <p>{item.title}</p>
              </Button>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
