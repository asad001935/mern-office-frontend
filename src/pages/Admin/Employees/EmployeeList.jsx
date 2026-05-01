import { RotateCcw, UserX } from "lucide-react";
import { toast } from "react-toastify";
import { deleteEmployee, restoreEmployee } from "../../../api/employeeApi";

function EmployeeList({ employees, refresh }) {
  const changeStatus = async (employee) => {
    try {
      if (employee.isDeleted) {
        await restoreEmployee(employee._id);
        toast.success("Employee restored");
      } else {
        await deleteEmployee(employee._id);
        toast.success("Employee deactivated");
      }
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update employee");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {employees.map((employee) => (
              <tr key={employee._id} className={employee.isDeleted ? "bg-slate-50 dark:bg-slate-700" : ""}>
                <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{employee.userName}</td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{employee.email}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {employee.role || "Employee"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      employee.isDeleted ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                    }`}
                  >
                    {employee.isDeleted ? "Inactive" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => changeStatus(employee)}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${
                      employee.isDeleted
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
                    }`}
                  >
                    {employee.isDeleted ? <RotateCcw size={14} /> : <UserX size={14} />}
                    {employee.isDeleted ? "Restore" : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
