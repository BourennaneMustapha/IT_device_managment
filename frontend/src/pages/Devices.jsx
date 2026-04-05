import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/UI/Button";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  Loader2,
  Monitor,
  Cpu,
  HardDrive,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../components/UI/DeleteModal";
import Pagination from "../components/UI/Pagination";

export default function Devices() {
  const API_URL = "http://localhost:5000/api/devices";

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [showDelet, setShowdelet] = useState(false);
  const [showLoadingDelet, SetShowLoadingDelet] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    type: "",
    marque: "",
    model: "",
    os: "",
    ram: "",
    cpu: "",
    stock: 0,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 5;

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/getAllDevice`, {
        withCredentials: true,
      });
      setDevices(res.data);
    } catch (err) {
      toast.error("Failed to load devices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const openNewModal = () => {
    setEditId(null);
    setForm({
      type: "",
      marque: "",
      model: "",
      os: "",
      ram: "",
      cpu: "",
      stock: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (dev) => {
    setEditId(dev._id);
    setForm({
      type: dev.type,
      marque: dev.marque,
      model: dev.model,
      os: dev.specs?.os || "",
      ram: dev.specs?.ram || "",
      cpu: dev.specs?.cpu || "",
      stock: dev.stock,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowdelet(false);
  };

  const handleSave = async () => {
    if (!form.type || !form.marque || !form.model) {
      return toast.error("Type, Marque, and Model are required.", {
          position: "bottom-left",
          theme: "colored" 
        });
    }

    const payload = {
      type: form.type,
      marque: form.marque,
      model: form.model,
      specs: { os: form.os, ram: form.ram, cpu: form.cpu },
      stock: form.stock,
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/updateDevice/${editId}`, payload, {
          withCredentials: true,
        });
        toast.success("Device updated.", {
          position: "bottom-left",
          theme: "colored" 
        });
      } else {
        await axios.post(`${API_URL}/addDevice`, payload, {
          withCredentials: true,
        });
        toast.success("Device added.", {
          position: "bottom-left",
          theme: "colored" 
        });
      }
      setModalOpen(false);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving device.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      SetShowLoadingDelet(true);
      await axios.delete(`${API_URL}/deleteDevice/${deleteId}`, {
        withCredentials: true,
      });
      toast.success("Device deleted.");
      setShowdelet(false);
      fetchDevices();
    } catch (err) {
      toast.error("Cannot delete device.");
    } finally {
      SetShowLoadingDelet(false);
    }
  };

  // Filter and Paginate
  const filtered = devices.filter((d) =>
    `${d.type} ${d.marque} ${d.model}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / devicesPerPage);
  const currentDevices = filtered.slice(
    (currentPage - 1) * devicesPerPage,
    currentPage * devicesPerPage,
  );

  return (
    <div className="flex min-h-screen bg-[#98a7a3]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl font-mono min-h-full flex flex-col gap-6">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-200 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                <Monitor className="text-[#295e61]" size={32} />
                Device Inventory
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Assets: {devices.length}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-[#295e61] outline-none transition-all"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                onClick={openNewModal}
                className="shadow-lg hover:scale-105 transition-transform"
              >
                <Plus size={20} className="mr-2" /> Add Device
              </Button>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="animate-spin text-[#295e61]" size={50} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                  Synchronizing Data...
                </span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400 italic">
                No devices found.
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                    <th className="px-4 pb-2">Device Info</th>
                    <th className="px-4 pb-2">Hardware Specs</th>
                    <th className="px-4 pb-2 text-center">Stock</th>
                    <th className="px-4 pb-2 text-center">Assigned</th>
                    <th className="px-4 pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDevices.map((dev) => (
                    <tr
                      key={dev._id}
                      className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                    >
                      <td className="px-4 py-2 rounded-l-2xl border-y-2 border-l-2 border-[#f0f2f3]">
                        <div className="font-black text-gray-800">
                          {dev.marque} {dev.model}
                        </div>
                        <div className="text-[10px] text-[#295e61] font-bold uppercase tracking-tight">
                          {dev.type}
                        </div>
                      </td>
                      <td className="px-4 py-2 border-y-2  border-[#f0f2f3]">
                        <div className="flex flex-wrap gap-2">
                          <span className="flex items-center gap-1 text-[10px] bg-gray-50 px-2 py-1 rounded-md text-gray-600 border border-gray-100">
                            <Cpu size={12} /> {dev.specs?.cpu || "N/A"}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] bg-gray-50 px-2 py-1 rounded-md text-gray-600 border border-gray-100">
                            <HardDrive size={12} /> {dev.specs?.ram || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2  border-y-2  border-[#f0f2f3] text-center">
                        <span
                          className={`${dev.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"} px-3 py-1 rounded-full text-[10px] font-black uppercase`}
                        >
                          {dev.stock} In Stock
                        </span>
                      </td>
                      <td className="px-4 py-2  border-y-2  border-[#f0f2f3] text-center font-bold text-blue-600">
                        <span className="bg-blue-50 px-3 py-1 rounded-full text-[10px]">
                          {dev.assigned || 0} Active
                        </span>
                      </td>
                      <td className="   text-right px-4 py-2 rounded-r-2xl border-y-2  border-r-2 border-[#f0f2f3]">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            data-analytics=""
                            data-cta=""
                            onClick={() => openEditModal(dev)}
                            className="p-2 bg-gray-50 text-[#295e61] rounded-xl hover:bg-[#295e61] hover:text-white transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            data-analytics=""
                            data-cta=""
                            onClick={() => {
                              setDeleteId(dev._id);
                              setShowdelet(true);
                            }}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {/* DEVICE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-[550px] bg-white rounded-3xl shadow-2xl p-8 transform transition-all font-mono">
            <button
              data-analytics=""
              data-cta=""
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-[#295e61]/10 rounded-2xl text-[#295e61] mb-3">
                <Monitor size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800">
                {editId ? "Update" : "Register"} Device
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["type", "marque", "model", "os", "ram", "cpu", "stock"].map(
                (field) => (
                  <div
                    key={field}
                    className={field === "stock" ? "col-span-2" : "col-span-1"}
                  >
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                      {field}
                    </label>
                    <input
                      type={field === "stock" ? "number" : "text"}
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-2xl focus:border-[#295e61] outline-none transition-all font-bold text-gray-700 bg-gray-50 focus:bg-white"
                      placeholder={`Enter ${field}...`}
                    />
                  </div>
                ),
              )}
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="flex-1 py-3 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 py-3 rounded-2xl shadow-[#295e61]/20 shadow-lg"
              >
                {editId ? "Update Asset" : "Save Asset"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDelet && (
        <DeleteModal
          onclose={handleCloseModal}
          message="Are you sure you want to delete this device?"
          deleteLoading={showLoadingDelet}
          handledelet={handleDelete}
        />
      )}

      <ToastContainer
        autoClose={1600}
        position="bottom-right"
        theme="colored"
      />
    </div>
  );
}
