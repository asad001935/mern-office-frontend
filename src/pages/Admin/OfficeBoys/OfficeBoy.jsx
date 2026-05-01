import { useEffect, useState } from "react";
import CreateOfficeBoy from "./CreateOfficeBoy";
import OfficeBoyList from "./OfficeBoyList";
import { getOfficeBoys } from "../../../api/officeBoyApi";

function OfficeBoy() {
  const [activeTab, setActiveTab] = useState("list");
  const [officeBoys, setOfficeBoys] = useState([]);

  const fetchOfficeBoys = async () => {
    const res = await getOfficeBoys();
    setOfficeBoys(res || []);
  };

  useEffect(() => {
    fetchOfficeBoys();
  }, []);

  const activeOfficeBoys = officeBoys.filter((officeBoy) => !officeBoy.isDeleted);
  const inactiveOfficeBoys = officeBoys.filter((officeBoy) => officeBoy.isDeleted);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Office Boy Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Office Boys</p>
          <p className="text-xl font-bold">{officeBoys.length}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-500">
            {activeOfficeBoys.length}
          </p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Inactive</p>
          <p className="text-xl font-bold text-rose-500">{inactiveOfficeBoys.length}</p>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded ${
            activeTab === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          View Office Boys
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded ${
            activeTab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Create Office Boy
        </button>
      </div>

      {/* 🔹 Content */}
      {activeTab === "list" && (
        <OfficeBoyList data={officeBoys} refresh={fetchOfficeBoys} />
      )}

      {activeTab === "create" && <CreateOfficeBoy refresh={fetchOfficeBoys} />}
    </div>
  );
}

export default OfficeBoy;
