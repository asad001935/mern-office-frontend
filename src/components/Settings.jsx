import { useState, useEffect } from "react";
import { User, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";

function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleSave = () => {
    toast.success("Settings updated successfully (demo)");
  };

  const handleClearData = () => {
    localStorage.clear();
    toast.success("Local data cleared");
    window.location.href = "/login";
  };

  return (
    <div className="p-6">
      {/* 🔹 HEADER */}
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>

      {/* 🔹 PROFILE CARD */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 dark:bg-slate-800 dark:shadow-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold dark:text-white">Account Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div className="border p-3 rounded flex items-center gap-2 dark:border-slate-600 dark:bg-slate-700">
            <User size={18} className="text-gray-500 dark:text-slate-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Username</p>
              <p className="font-medium dark:text-white">{user?.userName || "Admin"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="border p-3 rounded flex items-center gap-2 dark:border-slate-600 dark:bg-slate-700">
            <Mail size={18} className="text-gray-500 dark:text-slate-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Email</p>
              <p className="font-medium dark:text-white">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="border p-3 rounded flex items-center gap-2 dark:border-slate-600 dark:bg-slate-700">
            <Shield size={18} className="text-gray-500 dark:text-slate-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Role</p>
              <p className="font-medium text-blue-600 dark:text-blue-400">
                {user?.role || "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="bg-white shadow rounded-xl p-6 dark:bg-slate-800 dark:shadow-slate-900">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Actions</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>

          <button
            onClick={handleClearData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout & Clear Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
