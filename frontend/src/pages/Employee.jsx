import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  Plus,
  Search,
  X,
  Loader2,
  Eye,
  Trash2,
  Edit3,
  User,
  Briefcase,
  Layers,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../components/UI/Pagination";
import axios from "axios";
import Button from "../components/UI/Button";
import DeleteModal from "../components/UI/DeleteModal";
import Select from "react-select";

const API_URL = "http://localhost:5000/api/employees";
const API = "http://localhost:5000/api";
export default function Employee() {
  const [showModel, setShowModel] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showModelDelete, setShowModelDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [newEmp, setNewEmp] = useState({
    firstName: "",
    lastName: "",
    matricule: "",
    status: "active",
    depart: "",
    post: "",
  });

  const [editingEmpId, setEditingEmpId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const handleOpenModel = (emp = null) => {
    if (emp) {
      setEditingEmpId(emp._id);
      setNewEmp({
        firstName: emp.firstName,
        lastName: emp.lastName,
        matricule: emp.matricule,
        status: emp.status,
        depart: emp.depart,
        post: emp.post,
      });
    } else {
      setEditingEmpId(null);
      setNewEmp({
        firstName: "",
        lastName: "",
        matricule: "",
        status: "active",
        depart: "",
        post: "",
      });
    }
    setShowModel(true);
  };

  const handleCloseModal = () => {
    setShowModel(false);
    setShowModelDelete(false);
  };

  const handleFetchingEmp = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API_URL}/getall`, {
        withCredentials: true,
      });
      setEmployees(res.data.employees || []);
    } catch (err) {
      toast.error("Failed to fetch employees");
    } finally {
      setFetching(false);
    }
  };
  useEffect(() => {
    handleFetchingEmp();
  }, []);

  {
    /* fetching direction data */
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/directions/getall`, {
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
  // 1. Map all departments to Select options
  const departmentOptions = data.flatMap((dir) =>
    (dir.departments || []).map((dept) => ({
      value: dept.name,
      label: dept.name,
      positions: dept.positions, // Keep positions attached for the next step
    })),
  );

  // 2. Find the selected department object to get its positions
  const selectedDeptObj = departmentOptions.find(
    (d) => d.value === newEmp.depart,
  );

  const positionOptions = (selectedDeptObj?.positions || []).map((pos) => ({
    value: pos.name,
    label: pos.name,
  }));
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "1rem", // rounded-2xl
      padding: "2px 8px",
      borderWidth: "2px",
      borderColor: state.isFocused ? "#295e61" : "#f3f4f6",
      boxShadow: "none",
      "&:hover": { borderColor: "#295e61" },
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "700",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "1rem",
      overflow: "hidden",
      marginTop: "8px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "200px", // Standard height before scrolling
      "::-webkit-scrollbar": { width: "6px" },
      "::-webkit-scrollbar-track": { background: "transparent" },
      "::-webkit-scrollbar-thumb": {
        background: "#295e61",
        borderRadius: "10px",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#295e61"
        : state.isFocused
          ? "#295e6110"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      fontWeight: "500",
      cursor: "pointer",
    }),
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  const handleSaveEmp = async () => {
    if (
      !newEmp.firstName ||
      !newEmp.lastName ||
      !newEmp.matricule ||
      !newEmp.depart ||
      !newEmp.post
    ) {
      toast.error("Please fill out all fields!");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...newEmp, matricule: newEmp.matricule.toString() };
      if (editingEmpId) {
        await axios.put(`${API_URL}/${editingEmpId}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_URL}/`, payload, { withCredentials: true });
      }
      handleFetchingEmp();
      toast.success("Employee updated successfully!");
      setShowModel(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmp = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/${deleteId}`, { withCredentials: true });
      toast.success("Employee deleted");
      setShowModelDelete(false);
      handleFetchingEmp();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      emp.matricule.toString().includes(search),
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const currentEmpl = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage,
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
                <User className="text-[#295e61]" size={32} />
                Employees
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage staff, roles, and status
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
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-[#295e61] outline-none transition-all"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                onClick={() => handleOpenModel()}
                className="shadow-lg hover:scale-105 transition-transform whitespace-nowrap"
              >
                <Plus size={20} className="mr-2" /> Add Employee
              </Button>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="flex-1 overflow-x-auto">
            {fetching ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="animate-spin text-[#295e61]" size={50} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                  Synchronizing Data...
                </span>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-20 text-gray-400 italic">
                No employees found.
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                    <th className="px-4 pb-2">Employee Name</th>
                    <th className="px-4 pb-2">Matricule</th>
                    <th className="px-4 pb-2">Status</th>
                    <th className="px-4 pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmpl.map((empl) => (
                    <tr
                      key={empl._id}
                      className="group bg-white border  rounded-2xl shadow-sm hover:shadow-md transition-all"
                    >
                      <td className="px-4 py-2 rounded-l-2xl border-y-2 border-l-2 border-[#f0f2f3]">
                        <div className="font-black text-gray-800">
                          {empl.firstName} {empl.lastName}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          {empl.post}
                        </div>
                      </td>
                      <td className="px-4 py-2 border-y-2 border-[#f0f2f3] font-bold text-gray-600">
                        {empl.matricule}
                      </td>
                      <td className="px-4 py-2 border-y-2 border-[#f0f2f3]">
                        <span
                          className={`${empl.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter`}
                        >
                          {empl.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 rounded-r-2xl border-y-2  border-r-2 border-[#f0f2f3] text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            data-analytics=""
                            data-cta=""
                            onClick={() => setShowDetail(empl)}
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            data-analytics=""
                            data-cta=""
                            onClick={() => handleOpenModel(empl)}
                            className="p-2 bg-gray-50 text-[#295e61] rounded-xl hover:bg-[#295e61] hover:text-white transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            data-analytics=""
                            data-cta=""
                            onClick={() => {
                              setDeleteId(empl._id);
                              setShowModelDelete(true);
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

      {/* ADD/EDIT MODAL */}
      {showModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-[550px] bg-white rounded-3xl shadow-2xl p-8 transform transition-all">
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
                <User size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800">
                {editingEmpId ? "Edit" : "Register"} Employee
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  First Name
                </label>
                <input
                  type="text"
                  value={newEmp.firstName}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-100 rounded-2xl focus:border-[#295e61] outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newEmp.lastName}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-100 rounded-2xl focus:border-[#295e61] outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  Matricule ID
                </label>
                <input
                  type="number"
                  value={newEmp.matricule}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, matricule: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-100 rounded-2xl focus:border-[#295e61] outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  Service
                </label>
                <Select
                  options={departmentOptions}
                  styles={selectStyles}
                  placeholder="Search Service..."
                  value={departmentOptions.find(
                    (opt) => opt.value === newEmp.depart,
                  )}
                  onChange={(opt) =>
                    setNewEmp({ ...newEmp, depart: opt.value, post: "" })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  Position
                </label>
                <Select
                  options={positionOptions}
                  styles={selectStyles}
                  placeholder="Select Position..."
                  isDisabled={!newEmp.depart}
                  value={positionOptions.find(
                    (opt) => opt.value === newEmp.post,
                  )}
                  onChange={(opt) => setNewEmp({ ...newEmp, post: opt.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1 block">
                  Work Status
                </label>
                <Select
                  options={statusOptions}
                  styles={selectStyles} // Uses the same styles we defined for Dept/Position
                  placeholder="Select Status"
                  isSearchable={false} // Small list, so no need for a search bar here
                  value={statusOptions.find(
                    (opt) => opt.value === newEmp.status,
                  )}
                  onChange={(opt) =>
                    setNewEmp({ ...newEmp, status: opt.value })
                  }
                />
              </div>
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
                onClick={handleSaveEmp}
                disabled={loading}
                className="flex-1 py-3 rounded-2xl shadow-[#295e61]/20 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : editingEmpId ? (
                  "Update"
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white w-[500px] rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2"></div>
            <button
              data-analytics=""
              data-cta=""
              onClick={() => setShowDetail(null)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-[#295e61] flex items-center justify-center text-white text-3xl font-black shadow-xl rotate-3">
                {showDetail.firstName[0]}
                {showDetail.lastName[0]}
              </div>
              <h2 className="mt-6 text-2xl font-black text-gray-800 leading-tight">
                {showDetail.firstName} {showDetail.lastName}
              </h2>
              <span className="text-xs font-bold text-[#295e61] uppercase tracking-[0.2em] mt-1 bg-[#295e61]/5 px-4 py-1 rounded-full">
                ID: {showDetail.matricule}
              </span>
            </div>

            <div className="space-y-3">
              <DetailItem
                icon={<Layers size={14} />}
                label="Service"
                value={showDetail.depart}
              />
              <DetailItem
                icon={<Briefcase size={14} />}
                label="Current Position"
                value={showDetail.post}
              />
              <div className="space-y-3">
                <DetailItem
                  label="Status"
                  value={
                    <span
                      className={`text-[10px] font-black uppercase ${showDetail.status === "active" ? "text-green-600" : "text-red-600"}`}
                    >
                      {showDetail.status}
                    </span>
                  }
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => setShowDetail(null)}
                className="w-full py-4 rounded-2xl"
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModelDelete && (
        <DeleteModal
          onclose={handleCloseModal}
          message="Remove this employee from the system?"
          deleteLoading={deleteLoading}
          handledelet={handleDeleteEmp}
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

const DetailItem = ({ icon, label, value }) => (
  <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="font-bold text-gray-700 mt-0.5">{value || "—"}</p>
    </div>
  </div>
);
