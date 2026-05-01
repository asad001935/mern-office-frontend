import { useState, useEffect } from "react";
import CreateEmployee from "./CreateEmployee";
import EmployeeList from "./EmployeeList";
import { getEmployees } from "../../../api/employeeApi";

function Employees() {
  const [activeTab, setActiveTab] = useState("list");
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res || []);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const activeEmployees = employees.filter((employee) => !employee.isDeleted);
  const inactiveEmployees = employees.filter((employee) => employee.isDeleted);

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

      {/* 🔹 Stats (IMPORTANT - no empty page) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Employees</p>
          <p className="text-amber-950 text-xl font-bold">{employees.length}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-500">{activeEmployees.length}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-rose-500">{inactiveEmployees.length}</p>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          View Employees
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Create Employee
        </button>
      </div>

      {activeTab === "list" && (
        <EmployeeList employees={employees} refresh={fetchEmployees} />
      )}

      {activeTab === "create" && <CreateEmployee refresh={fetchEmployees} />}
    </div>
  );
}

export default Employees;
