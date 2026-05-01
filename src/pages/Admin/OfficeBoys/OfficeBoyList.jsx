import { RotateCcw, UserX } from "lucide-react";
import { toast } from "react-toastify";
import { deleteOfficeBoy, restoreOfficeBoy } from "../../../api/officeBoyApi";

function OfficeBoyList({ data, refresh }) {
  const changeStatus = async (officeBoy) => {
    try {
      if (officeBoy.isDeleted) {
        await restoreOfficeBoy(officeBoy._id);
        toast.success("Office boy restored");
      } else {
        await deleteOfficeBoy(officeBoy._id);
        toast.success("Office boy deactivated");
      }
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update office boy");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item._id} className={item.isDeleted ? "bg-slate-50" : ""}>
                <td className="px-5 py-4 font-medium text-slate-900">{item.userName}</td>
                <td className="px-5 py-4 text-slate-600">{item.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.isDeleted ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {item.isDeleted ? "Inactive" : "Available"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => changeStatus(item)}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${
                      item.isDeleted
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    {item.isDeleted ? <RotateCcw size={14} /> : <UserX size={14} />}
                    {item.isDeleted ? "Restore" : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-slate-500">
                  No office boys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OfficeBoyList;
