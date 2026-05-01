import { useState } from "react";
import { createOfficeBoy } from "../../../api/officeBoyApi";
import { toast } from "react-toastify";
import { User, Mail, Lock } from "lucide-react";

function CreateOfficeBoy({ refresh }) {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createOfficeBoy(form);
      toast.success("Office Boy created successfully");

      setForm({ userName: "", email: "", password: "" });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating office boy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border dark:bg-slate-800 dark:border-slate-700"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center dark:text-white">
          Create Office Boy
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1 dark:text-slate-300">
            Username
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-slate-700 dark:border-slate-600">
            <User className="text-gray-400 mr-2 dark:text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Enter username"
              value={form.userName}
              onChange={(e) =>
                setForm({ ...form, userName: e.target.value })
              }
              className="w-full bg-transparent focus:outline-none dark:text-white dark:placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1 dark:text-slate-300">
            Email
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-slate-700 dark:border-slate-600">
            <Mail className="text-gray-400 mr-2 dark:text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full bg-transparent focus:outline-none dark:text-white dark:placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1 dark:text-slate-300">
            Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-slate-700 dark:border-slate-600">
            <Lock className="text-gray-400 mr-2 dark:text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full bg-transparent focus:outline-none dark:text-white dark:placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Office Boy"}
        </button>
      </form>
    </div>
  );
}

export default CreateOfficeBoy;
