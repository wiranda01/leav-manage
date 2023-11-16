import { DataTable } from "@/pages/Admin/Department/data-table";
import { useEffect, useState } from "react";
import { Department, columns } from "./columns";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/department`);
      const json = await res.json();

      const data: Array<Department> = [];

      for (let department of json) {
        data.push({
          id: department.dep_id,
          dep_name: department.dep.dep_name,
          first_approver: department.emp1_appr
            ? department.emp1_appr.first_name +
              " " +
              department.emp1_appr.last_name
            : "-",
          second_approver: department.emp2_appr
            ? department.emp2_appr.first_name +
              " " +
              department.emp2_appr.last_name
            : "-",
        });
      }

      setDepartments(data);
    };

    fetchDepartmentsData();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">Department</h2>
      <DataTable
        columns={columns}
        data={departments}
        setDepartment={setDepartments}
      />
    </div>
  );
};

export default DepartmentPage;
