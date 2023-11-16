import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import AdminIndex from "./pages/AdminIndex";
import UserIndex from "./pages/UserIndex";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

import NoRoute from "./components/404";
// admin pages
import AdminWorkHours from "./pages/Admin/WorkHours/page";
import AdminDepartment from "./pages/Admin/Department/page";
import AdminHoliday from "./pages/Admin/Holiday/page";
import AdminLeaveType from "./pages/Admin/LeaveType/page";
import AdminLeaves from "./pages/Admin/Leaves/page";
import AdminMember from "./pages/Admin/Member/page";
// user page
import UserWorkHours from "./pages/User/WorkHours/page";
import UserHoliday from "./pages/User/Holiday/page";
import UserLeaves from "./pages/User/Leaves/page";

import HeadMember from "./pages/Head/Member/page";
import HeadWorkHours from "./pages/Head/WorkHours/page";
import HeadLeaves from "./pages/Head/Leaves/page";

import { Toaster } from "@/components/ui/toaster";

import { useState, useEffect, createContext } from "react";
import Login from "./pages/Login/page";
import ClockIn from "./pages/ClockIn";
import ClockOut from "./pages/ClockOut";
import HeadIndex from "./pages/HeadIndex";

const rolePages = {
  admin: {
    index: AdminIndex,
    userIndex: UserIndex,
    workHours: AdminWorkHours,
    department: AdminDepartment,
    member: AdminMember,
    holiday: AdminHoliday,
    leaveType: AdminLeaveType,
    leaves: AdminLeaves,
    userLeaves: UserLeaves,
  },
  user: {
    index: UserIndex,
    workHours: UserWorkHours,
    holiday: UserHoliday,
    leaves: UserLeaves,
  },
};

export const UserContext = createContext<boolean | null>(null);

const App = () => {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const [isHead, setHead] = useState<boolean>(false);
  const [isLogin, setLogin] = useState<boolean>(false);
  const [isloading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem("user") != null) {
      setLogin(true);

      const user = JSON.parse(localStorage.getItem("user")!);
      if (user.role == "admin") {
        setAdmin(true);
      }

      if (user.role == "head") {
        setHead(true);
      }
    }

    setLoading(false);
  }, []);

  if (isloading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />
      </ThemeProvider>
    );
  }

  if (!isLogin) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />
        <Login />
        <Toaster />
      </ThemeProvider>
    );
  }

  const roleSpecificPages = rolePages[isAdmin ? "admin" : "user"];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserContext.Provider value={isAdmin}>
        <Router>
          <NavBar />
          <div className="flex gap-2 me-2 pe-2">
            <SideBar />
            <div className="p-4 w-full">
              <Routes>
                <Route path="*" element={<NoRoute />} />
                <Route path="/" element={<roleSpecificPages.index />} />
                <Route
                  path="/workhours"
                  element={<roleSpecificPages.workHours />}
                />
                <Route
                  path="/holiday"
                  element={<roleSpecificPages.holiday />}
                />
                <Route path="/leaves" element={<roleSpecificPages.leaves />} />
                {isAdmin && (
                  <>
                    <Route path="/user/" element={<UserIndex />} />
                    <Route path="/department" element={<AdminDepartment />} />
                    <Route path="/member" element={<AdminMember />} />

                    <Route path="/leavetype" element={<AdminLeaveType />} />

                    <Route path="/user/leaves" element={<UserLeaves />} />
                  </>
                )}
                {isHead && (
                  <>
                    <Route path="/department" element={<HeadIndex />} />
                    <Route path="/member" element={<HeadMember />} />
                    <Route
                      path="/workhours/department"
                      element={<HeadWorkHours />}
                    />
                    <Route path="/leaves/department" element={<HeadLeaves />} />
                  </>
                )}
                <Route path="/clockin" element={<ClockIn />} />
                <Route path="/clockout" element={<ClockOut />} />
              </Routes>
            </div>
          </div>
          <Toaster />
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default App;
