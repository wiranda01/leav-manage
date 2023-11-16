import { UserContext } from "@/App";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarSearch,
  CalendarX,
  Clock,
  Component,
  GanttChartSquare,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  User2,
  Users2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./Notification";

const NavBar = () => {
  const { setTheme } = useTheme();
  const isAdmin = useContext(UserContext);
  const [isLogin, setLogin] = useState<boolean>(false);
  const [department, setDepartment] = useState<string>("");

  // const [user, setUser] = useState<User | null>(null);
  const user = JSON.parse(localStorage.getItem("user")!);
  const isHead = user?.role === "head";

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
      title: "Dashboard (Department)",
      Icons: LayoutDashboard,
      path: "/department",
    },
    {
      title: "Member",
      Icons: Users2,
      path: "/member",
    },
    {
      title: "Work Hours (department)",
      Icons: Clock,
      path: "workhours/department",
    },
    {
      title: "Leave (department)",
      Icons: CalendarX,
      path: "/leaves/department",
    },
  ];

  useEffect(() => {
    if (user != null) {
      setLogin(true);
    }

    async function fetchDepartment() {
      if (user) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/department/${user.dep_id}`
        );
        const data = await res.json();
        setDepartment(data.dep_name);
      }
    }
    fetchDepartment();
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.reload();
    window.location.replace("/");
  }

  return (
    <div className="flex justify-between items-center bg-background border-b-[1px] border-border h-nav px-4">
      <div className="flex gap-2 items-center">
        {isLogin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {items.map((item, index) =>
                isAdmin === true && item.admin === true ? (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={item.path} key={index} className="flex">
                      <div className="flex justify-start gap-4 px-3 w-full">
                        <item.Icons />
                        <p>{item.title}</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  item.admin === false && (
                    <DropdownMenuItem key={index} asChild>
                      <Link to={item.path} key={index} className="flex">
                        <div className="flex justify-start gap-4 px-3 w-full">
                          <item.Icons />
                          <p>{item.title}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                )
              )}
              {isHead &&
                headItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={item.path} key={index} className="flex">
                      <div className="flex justify-start gap-4 px-3 w-full">
                        <item.Icons />
                        <p>{item.title}</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="h-6">
          <img src="/logo.png" alt="logo" className="h-full" />
        </div>
        <span className="font-bold">Leave Management</span>
      </div>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {user && <Notification />}
        {isLogin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User2 size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Name : {user?.first_name} {user?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuLabel>Department : {department}</DropdownMenuLabel>
              <DropdownMenuLabel className="capitalize">
                Role : {user.role}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default NavBar;
