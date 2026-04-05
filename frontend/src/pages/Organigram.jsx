import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit3,
  Trash2,
  Loader2,
  X,
  Briefcase,
  Pin,
  NetworkIcon,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Button from "../components/UI/Button";
import DeleteModal from "../components/UI/DeleteModal";

const API = "http://localhost:5000/api";

export default function OrgTree() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [parentId, setParentId] = useState(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/directions/full`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (t, parent = null, item = null) => {
    setType(t);
    setParentId(parent);
    setEditingId(item?._id || null);
    setName(item?.name || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setName("");
    setEditingId(null);
    setParentId(null);
  };

  const handleSave = async () => {
    if (!name) return toast.error("Name required");
    try {
      if (editingId) {
        await axios.put(
          `${API}/${type}s/${editingId}`,
          { name },
          { withCredentials: true },
        );
      } else {
        await axios.post(
          `${API}/${type}s`,
          {
            name,
            ...(type === "department" && { direction: parentId }),
            ...(type === "position" && { department: parentId }),
          },
          { withCredentials: true },
        );
      }
      toast.success("Structure Updated");
      closeModal();
      fetchData();
    } catch (err) {
      toast.error("Error saving changes");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteInfo.type}s/${deleteInfo.id}`, {
        withCredentials: true,
      });
      toast.success("Deleted successfully");
      setShowDelete(false);
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#98a7a3]">
      <Sidebar />

      {/* MAIN WRAPPER: Removed max-width and added overflow handling */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col h-screen">
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl font-mono flex-1 overflow-auto custom-scrollbar">
          {/* HEADER SECTION - min-w-max prevents squishing on scroll */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200 gap-4 min-w-max">
            <div>
              <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                <NetworkIcon className="text-[#295e61]" size={32} />
                Organization
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage levels, departments, and roles
              </p>
            </div>
            <Button
              onClick={() => openModal("direction")}
              className="shadow-lg hover:scale-105 transition-transform"
            >
              <Plus size={20} className="mr-2" /> Add New Direction
            </Button>
          </div>

          {/* TREE CONTENT */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="animate-spin text-[#295e61]" size={50} />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                Synchronizing Data...
              </span>
            </div>
          ) : (
            /* min-w-max ensures the tree branches don't wrap and push the scrollbar instead */
            <div className="space-y-4 min-w-max pb-6">
              {data.map((dir) => (
                <div key={dir._id} className="group transition-all">
                  {/* DIRECTION CARD - Reduced height/padding for a cleaner look */}
                  <div
                    className={`flex justify-between items-center p-2 px-5 rounded-2xl border-2 transition-all shadow-sm ${expanded[dir._id] ? "bg-gradient-to-r from-gray-50 to-white border-[#295e61]" : "bg-white border-transparent hover:shadow-md"}`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        data-analytics=""
                        data-cta=""
                        onClick={() => toggle(dir._id)}
                        className={`p-1 rounded-lg transition-colors ${expanded[dir._id] ? "bg-[#295e61] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        {expanded[dir._id] ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#295e61] block tracking-widest">
                          Direction
                        </span>
                        <span className="font-black text-lg text-gray-800 tracking-tight">
                          {dir.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        data-analytics=""
                        data-cta=""
                        title="Add Dept"
                        onClick={() => openModal("department", dir._id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        data-analytics=""
                        data-cta=""
                        title="Edit"
                        onClick={() => openModal("direction", null, dir)}
                        className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-800 hover:text-white transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        data-analytics=""
                        data-cta=""
                        title="Delete"
                        onClick={() => {
                          setDeleteInfo({ id: dir._id, type: "direction" });
                          setShowDelete(true);
                        }}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* DEPARTMENTS (NESTED) */}
                  {expanded[dir._id] && (
                    <div className="ml-10 mt-2 pl-6 border-l-2 border-dashed border-gray-300 space-y-4 pt-2">
                      {dir.departments.map((dep) => (
                        <div key={dep._id} className="relative group/dep">
                          <div className="absolute -left-6 top-6 w-6 border-t-2 border-dashed border-gray-300"></div>

                          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <button
                                  data-analytics=""
                                  data-cta=""
                                  onClick={() => toggle(dep._id)}
                                  className="text-gray-400 hover:text-[#295e61]"
                                >
                                  {expanded[dep._id] ? (
                                    <ChevronDown size={18} />
                                  ) : (
                                    <ChevronRight size={18} />
                                  )}
                                </button>
                                <span className="font-bold text-gray-700 flex items-center gap-2">
                                  <Pin
                                    size={14}
                                    className="text-orange-400"
                                  />{" "}
                                  {dep.name}
                                </span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/dep:opacity-100 transition-opacity">
                                <button
                                  data-analytics=""
                                  data-cta=""
                                  onClick={() => openModal("position", dep._id)}
                                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                                >
                                  <Plus size={16} />
                                </button>
                                <button
                                  data-analytics=""
                                  data-cta=""
                                  onClick={() =>
                                    openModal("department", dir._id, dep)
                                  }
                                  className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  data-analytics=""
                                  data-cta=""
                                  onClick={() => {
                                    setDeleteInfo({
                                      id: dep._id,
                                      type: "department",
                                    });
                                    setShowDelete(true);
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* POSITIONS (NESTED) */}
                            {expanded[dep._id] && (
                              <div className="mt-4 flex flex-wrap gap-2 pl-4">
                                {dep.positions.map((pos) => (
                                  <div
                                    key={pos._id}
                                    className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 p-2.5 rounded-lg group/pos hover:bg-white transition-colors"
                                  >
                                    <div className="flex items-center gap-2 text-sm text-gray-600 italic">
                                      <Briefcase
                                        size={14}
                                        className="text-gray-400"
                                      />
                                      {pos.name}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover/pos:opacity-100 transition-opacity border-l pl-2 border-gray-200">
                                      <button
                                        data-analytics=""
                                        data-cta=""
                                        onClick={() =>
                                          openModal("position", dep._id, pos)
                                        }
                                        className="text-gray-400 hover:text-blue-500"
                                      >
                                        <Edit3 size={12} />
                                      </button>
                                      <button
                                        data-analytics=""
                                        data-cta=""
                                        onClick={() => {
                                          setDeleteInfo({
                                            id: pos._id,
                                            type: "position",
                                          });
                                          setShowDelete(true);
                                        }}
                                        className="text-gray-400 hover:text-red-500"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                {dep.positions.length === 0 && (
                                  <p className="text-[10px] text-gray-400 italic">
                                    No positions defined.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-[450px] bg-white rounded-3xl shadow-2xl p-8 transform transition-all scale-100">
            <button
              data-analytics=""
              data-cta=""
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-[#295e61]/10 rounded-2xl text-[#295e61] mb-3">
                <NetworkIcon size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800">
                {editingId ? "Edit" : "Create"}{" "}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  Title Name
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-2xl focus:border-[#295e61] outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 shadow-sm"
                  placeholder={`e.g. ${type === "direction" ? "Finance & Admin" : "Marketing"}`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-2xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-2xl shadow-[#295e61]/20 shadow-lg"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <DeleteModal
          onclose={() => setShowDelete(false)}
          handledelet={handleDelete}
        />
      )}

      <ToastContainer
        autoClose={1500}
        position="bottom-right"
        theme="colored"
      />
    </div>
  );
}
