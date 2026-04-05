import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/UI/Button";
import ModelDelete from "../components/UI/DeleteModal";
import axios from "axios";
import Pagination from "../components/UI/Pagination";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  RotateCcw,
  Wrench,
  RefreshCw,
  History,
  Plus,
  Search,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  User,
  Monitor,
  ShieldCheck,
  Info,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
export default function Affectation() {
  const API = "http://localhost:5000/api/affectations";
  const { user } = useAuth();
  const [affectations, setAffectations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignEmplSearch, setReassignEmplSearch] = useState("");
  const [showAssign, setShowAssign] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showReassign, setShowReassign] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const affectionPerPage = 5;
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    deviceId: "",
    deviceName: "",
    deviceBS: "",
  });

  const [formReassign, setFormReassign] = useState({
    newEmployeeId: "",
    employeeName: "",
    deviceBS: "",
  });

  /* ---------------- FETCH ALL DATA ---------------- */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [a, e, d] = await Promise.all([
        axios.get(`${API}/getAll`, { withCredentials: true }),
        axios.get("http://localhost:5000/api/employees/getall", {
          withCredentials: true,
        }),
        axios.get("http://localhost:5000/api/devices/getAllDevice", {
          withCredentials: true,
        }),
      ]);

      setAffectations(a.data);
      console.log(a.data);
      setEmployees(e.data.employees || []);

      setDevices(d.data);
    } catch (err) {
      toast.error("Failed to fetch data", {
        position: "bottom-left",
        toastId: "fetch-error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------- ASSIGN DEVICE ---------------- */
  const handleAssign = async () => {
    if (!form.employeeId || !form.deviceId)
      return toast.error("All fields required");

    setLoading(true);
    try {
      await axios.post(
        `${API}/assign`,
        { ...form, user: user.name },
        { withCredentials: true },
      );
      console.log(form);
      toast.success("Device assigned");
      setShowAssign(false);
      setForm({
        employeeId: "",
        deviceId: "",
        deviceName: "",
        employeeName: "",
        deviceBS: "",
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RETURN / REPAIR ---------------- */
  const handleAction = async () => {
    const { type, affectationId } = confirmAction;
    setLoading(true);

    try {
      await axios.post(
        `${API}/${type}`,
        { affectationId, user: user.name },
        { withCredentials: true },
      );

      toast.success("Action completed");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  /* ---------------- REASSIGN ---------------- */
  const handleReassign = async () => {
    if (!formReassign.newEmployeeId) return toast.error("Select employee");

    setLoading(true);
    try {
      await axios.post(
        `${API}/reassign`,
        {
          affectationId: showReassign._id,
          ...formReassign,
          user: user.name,
        },
        { withCredentials: true },
      );
      console.log(formReassign);
      toast.success("Device reassigned");
      setShowReassign(null);
      setFormReassign({
        newEmployeeId: "",
        employeeName: "",
        deviceBS: "",
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const filteredAffectaion = affectations.filter((a) => {
    if (a.status === "returned") return false;
    // Filter by search and exclude returned becuse stauts return calculat in pagenation
    const firstName = a.employeeId?.firstName?.toLowerCase() || "";
    const lastName = a.employeeId?.lastName?.toLowerCase() || "";
    const matricule = a.employeeId?.matricule?.toLowerCase() || "";
    const device = a.deviceName?.toLowerCase() || "";
    const deviceBS = a.deviceBS?.toLowerCase() || "";

    return `${firstName} ${lastName} ${matricule} ${device} ${deviceBS}`.includes(
      search.toLowerCase(),
    );
  });

  const TotalPage = Math.ceil(filteredAffectaion.length / affectionPerPage);
  const lastPage = currentPage * affectionPerPage;
  const firstPage = lastPage - affectionPerPage;
  const currentAffePage = filteredAffectaion.slice(firstPage, lastPage);

  const handleChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Make sure currentPage never exceeds total pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredAffectaion.length / affectionPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredAffectaion.length]);

  /* ---------------- PDF generate ---------------- */
  const downloadPdf = async (employeeId) => {
    if (!employeeId) {
      toast.error("Employee ID missing");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/employee-pdf/${employeeId}`,
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee_devices.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      toast.error("PDF not found");
    }
  };
  const resetAssignForm = () => {
    setShowAssign(null);
    setShowReassign(null);

    // close dropdowns
    setOpen(false);
    setDeviceOpen(false);
    setReassignOpen(false);
    setDetail(false);

    // clear searches
    setEmployeeSearch("");
    setDeviceSearch("");
    setReassignEmplSearch("");

    // clear form
    setForm({
      employeeId: "",
      employeeName: "",
      deviceId: "",
      deviceName: "",
    });
    setFormReassign({
      newEmployeeId: "",
      employeeName: "",
    });
  };
  /*******************************************extract excel file  */
  const exportToExcel = (affectations) => {
    // 1. Prepare and Flatten the data
    const excelData = filteredAffectaion.map((aff) => ({
      "Date Affectation": new Date(aff.createdAt).toLocaleDateString(),
      "Nom de PC" : (aff.deviceBS).charAt(0).toUpperCase() + (aff.deviceBS).slice(1),
      Matricule: aff.employeeId?.matricule || "N/A",
      Nom: aff.employeeId?.lastName || "",
      Prénom: aff.employeeId?.firstName || "",
      Service: aff.employeeId?.depart || "",
      Poste: aff.employeeId?.post || "",
      "Type Appareil": aff.deviceId?.type || "",
      Marque: aff.deviceId?.marque || "",
      Modèle: aff.deviceId?.model || "",
      "Statut Employé": aff.employeeId?.status || "",
    }));

    // 2. Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 3. Create Workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Affectations");

    // 4. Buffer and Download
    XLSX.writeFile(
      workbook,
      `Affectations_ENICAB_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };
  return (
    <div className="flex min-h-screen bg-[#98a7a3]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl font-mono min-h-full flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-200 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                <CheckCircle className="text-[#295e61]" size={32} />
                Device Affectations
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Affectations:{" "}
                {affectations.filter((e) => e.status === "assigned").length}
              </p>
            </div>
            <button
              data-analytics=""
              data-cta=""
              onClick={exportToExcel}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-[#295e61] text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#1d4345] hover:scale-105 transition-all"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search affecation..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-[#295e61] outline-none transition-all"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                onClick={() => setShowAssign(true)}
                className="shadow-lg hover:scale-105 transition-transform"
              >
                <Plus size={20} className="mr-2" /> Assign Device
              </Button>
            </div>
          </div>
          {/* TABLE */}
          <div className="flex-1 overflow-x-auto ">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="animate-spin text-[#295e61]" size={50} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                  Synchronizing Data...
                </span>
              </div>
            ) : currentAffePage.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl m-4 bg-gray-50/30">
                <History size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold italic">
                  No active affectations found.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                    <th className="px-4 pb-2">Reference</th>
                    <th className="px-4 pb-2">User / Employee</th>
                    <th className="px-4 pb-2">Hardware Info</th>
                    <th className="px-4 pb-2 text-center">Status</th>
                    <th className="px-4 pb-2 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAffePage.map((a) => {
                    const parts = a.deviceName.split(" ");
                    const marque = parts.shift();
                    const model = parts.join(" ");

                    return (
                      <tr
                        key={a._id}
                        className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* PC Name Column */}
                        <td className="px-4 py-2 rounded-l-2xl border-y-2 border-l-2 border-[#f0f2f3]">
                          <div className="font-black text-gray-800 uppercase text-sm leading-tight">
                            {a.deviceBS}
                          </div>
                        </td>

                        {/* Employee Column */}
                        <td className="px-4 py-2 border-y-2 border-[#f0f2f3]">
                          <div className="font-bold text-gray-700 text-sm">
                            {a.employeeId?.firstName} {a.employeeId?.lastName}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            Mat: {a.employeeId?.matricule}
                          </div>
                        </td>

                        {/* Hardware Info Column */}
                        <td className="px-4 py-2 border-y-2 border-[#f0f2f3]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-gray-50 px-2 py-1 rounded-md text-[#295e61] border border-gray-100 font-black uppercase">
                              {marque}
                            </span>
                            <span className="text-[10px] text-gray-400 italic truncate max-w-[120px]">
                              {model}
                            </span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-2 border-y-2 border-[#f0f2f3] text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm border
                        ${
                          a.status === "assigned"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : a.status === "repair"
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                          >
                            {a.status}
                          </span>
                        </td>

                        {/* Actions Column */}
                        <td className="px-4 py-2 text-right rounded-r-2xl border-y-2 border-r-2 border-[#f0f2f3]">
                          <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            {/* Operational Buttons */}
                            <button
                              data-analytics=""
                              data-cta=""
                              onClick={() =>
                                setConfirmAction({
                                  type: "return",
                                  affectationId: a._id,
                                })
                              }
                              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Return to Stock"
                            >
                              <RotateCcw size={15} />
                            </button>

                            <button
                              data-analytics=""
                              data-cta=""
                              onClick={() =>
                                setConfirmAction({
                                  type: "repair",
                                  affectationId: a._id,
                                })
                              }
                              className="p-2 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                              title="Send to Repair"
                            >
                              <Wrench size={15} />
                            </button>

                            <button
                              data-analytics=""
                              data-cta=""
                              disabled={a.status === "returned"}
                              onClick={() => {
                                setShowReassign(a);
                              }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm disabled:opacity-20"
                              title="Reassign to Employee"
                            >
                              <RefreshCw size={15} />
                            </button>
                            {/* Histroy Button */}

                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <button
                              data-analytics=""
                              data-cta=""
                              onClick={() => setShowHistory(a)} // Triggering the History Modal we just built
                              className="p-2 text-gray-400 hover:text-[#295e61] transition-colors"
                              title="View History"
                            >
                              <History size={18} />
                            </button>
                            {/* Detail Button */}
                            <button
                              data-analytics=""
                              data-cta=""
                              onClick={() => setDetail(a)}
                              className="p-2 text-gray-400 hover:text-[#295e61] transition-colors"
                              title="Affectation History"
                            >
                              <Info size={18} />
                            </button>

                            {/* PDF Print Button */}
                            <button
                              data-analytics=""
                              data-cta=""
                              onClick={() => downloadPdf(a.employeeId?._id)}
                              className="ml-1 bg-[#295e61] text-white text-[9px] font-black px-2.5 py-2 rounded-lg hover:bg-black transition-all shadow-md shadow-[#295e61]/10"
                            >
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* --- FOOTER / PAGINATION --- */}

          <Pagination
            currentPage={currentPage}
            totalPages={TotalPage}
            onPageChange={handleChange}
          />
        </div>
      </main>

      {/* ---------------- DETAIL MODAL ---------------- */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#295e61]/40 backdrop-blur-sm p-4 ">
          <div className="relative w-full  max-w-2xl rounded-[2rem] bg-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* HEADER SECTION */}
            <div className="bg-gray-50/80 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                  Affectation Details
                </h2>
              </div>
              <button
                data-analytics=""
                data-cta=""
                onClick={() => setDetail(null)}
                className="p-2 rounded-full hover:bg-red-50 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* EMPLOYEE CARD */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#f0f2f3] bg-white p-6 transition-all hover:border-[#295e61]/20">
                <div className="absolute left-0 top-0 h-full " />
                <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#295e61]/60">
                  <User size={14} strokeWidth={3} /> Employee Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <DetailItem
                    label="Matricule"
                    value={detail.employeeId?.matricule}
                    isMono
                  />
                  <DetailItem
                    label="Full Name"
                    value={`${detail.employeeId?.firstName} ${detail.employeeId?.lastName}`}
                  />
                  <DetailItem
                    label="Department"
                    value={detail.employeeId?.depart}
                  />
                  <DetailItem
                    label="Current Post"
                    value={detail.employeeId?.post}
                  />
                  <DetailItem
                    label="Status"
                    value={detail.employeeId?.status}
                  />
                </div>
              </div>

              {/* DEVICE CARD */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#f0f2f3] bg-white p-6 transition-all hover:border-[#295e61]/20 ">
                <div className="absolute left-0 top-0 h-full" />
                <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-blue-500/60">
                  <Monitor size={14} strokeWidth={3} /> Hardware Specs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <DetailItem
                    label="Asset Tag"
                    className="uppercase"
                    value={detail.deviceBS}
                    isMono
                  />
                  <DetailItem
                    label="Model"
                    value={`${detail.deviceId?.marque} ${detail.deviceId?.model}`}
                  />
                  <DetailItem label="Type" value={detail.deviceId?.type} />
                  <DetailItem
                    label="Processor"
                    value={detail.deviceId?.specs?.cpu}
                  />
                  <DetailItem
                    label="Memory (RAM)"
                    value={detail.deviceId?.specs?.ram}
                  />
                  <DetailItem
                    label="System"
                    value={detail.deviceId?.specs?.os}
                  />
                </div>
              </div>

              {/* AFFECTATION LOGIC CARD */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#f0f2f3]  p-6 hover:border-[#295e61]/20">
                <div className="absolute left-0 top-0 h-full" />
                <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-emerald-600/60">
                  <ShieldCheck size={14} strokeWidth={3} /> Assignment Status
                </h3>
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <DetailItem
                    label="Created At"
                    value={new Date(detail.createdAt).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )}
                  />

                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                      Current State
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                ${
                  detail.status === "assigned"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : detail.status === "repair"
                      ? "bg-orange-100 text-orange-700 border-orange-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                }`}
                    >
                      {detail.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTION */}
            <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
              <Button
                data-analytics=""
                data-cta=""
                onClick={() => setDetail(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- ASSIGN MODAL ---------------- */}
      {showAssign && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#295e61]/40 backdrop-blur-sm z-50 p-4">
          <div className="w-full max-w-[600px] bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* HEADER SECTION - Brand Gradient */}
            <div className="p-8 relative">
              <button
                data-analytics=""
                data-cta=""
                onClick={resetAssignForm}
                className="absolute top-6 right-6 p-2 hover:bg-red-50 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
              >
                <X size={20} strokeWidth={3} />
              </button>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight ">
                Assign New Device
              </h2>
              <p className="text-[#295e61]/40 text-xs font-bold uppercase tracking-[0.2em] mt-1 opacity-80">
                Internal Asset Management
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* 1. EMPLOYEE SELECTOR */}
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                  Assign To Employee
                </label>
                <div
                  className={`flex justify-between items-center px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm
              ${open ? "border-[#295e61] bg-white ring-4 ring-[#295e61]/5" : "border-[#f0f2f3] bg-gray-50 hover:bg-white hover:border-gray-300"}`}
                  onClick={() => setOpen((curr) => !curr)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${form.employeeName ? "bg-[#295e61] text-white" : "bg-gray-200 text-gray-400"}`}
                    >
                      <User size={16} />
                    </div>
                    <span
                      className={`text-sm font-bold ${form.employeeName ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {form.employeeName || "Search and select employee..."}
                    </span>
                  </div>
                  {open ? (
                    <ChevronUp className="text-[#295e61]" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </div>

                {open && (
                  <div className="absolute z-50 w-full bg-white border-2 border-[#f0f2f3] rounded-2xl mt-2 shadow-2xl p-2 animate-in slide-in-from-top-2">
                    <div className="relative mb-2">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Type name or matricule..."
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#295e61]/20 focus:bg-white outline-none rounded-xl text-sm font-medium transition-all"
                        value={employeeSearch}
                        autoFocus
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {employees
                        .filter(
                          (emp) =>
                            emp.status === "active" &&
                            `${emp.firstName} ${emp.lastName} ${emp.matricule}`
                              .toLowerCase()
                              .includes(employeeSearch.toLowerCase()),
                        )
                        .map((emp) => (
                          <div
                            key={emp._id}
                            className="px-4 py-3 hover:bg-[#295e61]/5 cursor-pointer rounded-xl transition-colors flex justify-between items-center group"
                            onClick={() => {
                              setForm({
                                ...form,
                                employeeId: emp._id,
                                employeeName: `${emp.firstName} ${emp.lastName} (${emp.matricule})`,
                              });
                              setOpen(false);
                              setEmployeeSearch("");
                            }}
                          >
                            <span className="text-sm font-bold text-gray-700 group-hover:text-[#295e61] transition-colors">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="text-[10px] font-mono font-black bg-gray-100 px-2 py-1 rounded text-gray-400 group-hover:bg-[#295e61]/10 group-hover:text-[#295e61]">
                              {emp.matricule}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DEVICE SELECTOR */}
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                  Hardware Selection
                </label>
                <div
                  className={`flex justify-between items-center px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm
              ${deviceOpen ? "border-blue-500 bg-white ring-4 ring-blue-50" : "border-[#f0f2f3] bg-gray-50 hover:bg-white hover:border-gray-300"}`}
                  onClick={() => setDeviceOpen((prev) => !prev)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${form.deviceName ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"}`}
                    >
                      <Monitor size={16} />
                    </div>
                    <span
                      className={`text-sm font-bold ${form.deviceName ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {form.deviceName || "Search available hardware..."}
                    </span>
                  </div>
                  {deviceOpen ? (
                    <ChevronUp className="text-blue-500" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </div>

                {deviceOpen && (
                  <div className="absolute z-40 w-full bg-white border-2 border-[#f0f2f3] rounded-2xl mt-2 shadow-2xl p-2 animate-in slide-in-from-top-2">
                    <input
                      type="text"
                      placeholder="Search model or marque..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:border-blue-200 focus:bg-white outline-none rounded-xl text-sm font-medium transition-all mb-2"
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {devices
                        .filter(
                          (d) =>
                            d.stock > 0 &&
                            `${d.marque} ${d.model}`
                              .toLowerCase()
                              .includes(deviceSearch.toLowerCase()),
                        )
                        .map((d) => (
                          <div
                            key={d._id}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer rounded-xl flex justify-between items-center group"
                            onClick={() => {
                              setForm({
                                ...form,
                                deviceId: d._id,
                                deviceName: `${d.marque} ${d.model}`,
                              });
                              setDeviceOpen(false);
                              setDeviceSearch("");
                            }}
                          >
                            <div>
                              <div className="text-sm font-black text-gray-700 group-hover:text-blue-600 transition-colors uppercase italic">
                                {d.marque}
                              </div>
                              <div className="text-xs text-gray-400">
                                {d.model}
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                              {d.stock} IN STOCK
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ASSET TAG INPUT */}
              <div className="bg-gray-50 rounded-[1.5rem] p-6 border-2 border-dashed border-gray-200 transition-all hover:bg-white hover:border-[#295e61]/30 group">
                <label className="text-[10px] font-black text-[#295e61] uppercase tracking-[0.2em] mb-3 block">
                  System Identity (BS Tag)
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#295e61]"
                  />
                  <input
                    type="text"
                    placeholder="Enter unique BS number (e.g. BS2024-001)"
                    value={form.deviceBS}
                    onChange={(e) =>
                      setForm({ ...form, deviceBS: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#295e61]/10 focus:border-[#295e61] text-sm font-bold uppercase placeholder:normal-case placeholder:font-normal transition-all"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-8 pt-0 flex gap-3">
              <button
                data-analytics=""
                data-cta=""
                onClick={resetAssignForm}
                className="flex-1 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel Request
              </button>
              <Button
                data-analytics=""
                data-cta=""
                onClick={handleAssign}
                disabled={
                  loading ||
                  !form.employeeId ||
                  !form.deviceId ||
                  !form.deviceBS
                }
                className=" flex justify-center items-center gap-2  text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#295e61]/20  transition-all disabled:opacity-30 disabled:grayscale"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Confirm Assignment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONFIRM MODAL ---------------- */}
      {confirmAction && (
        <ModelDelete
          onclose={() => setConfirmAction(null)}
          message={
            confirmAction.type === "repair"
              ? "Are you sure you want to send this device to repair?"
              : "Are you sure you want to return this device?"
          }
          icon={
            confirmAction.type === "repair" ? (
              <Wrench size={32} strokeWidth={2.5} />
            ) : (
              <RotateCcw size={32} strokeWidth={2.5} />
            )
          }
          deleteLoading={loading}
          handledelet={handleAction}
        />
      )}

      {/* ---------------- REASSIGN MODAL ---------------- */}
      {showReassign && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#295e61]/40 backdrop-blur-sm z-50 p-4">
          <div className="w-full max-w-[600px] bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* HEADER SECTION - Brand Gradient */}
            <div className=" p-8 relative">
              <button
                data-analytics=""
                data-cta=""
                onClick={resetAssignForm}
                className="absolute top-6 right-6 hover:bg-red-50 text-gray-400 border border-gray-100 bg-white/10 hover:text-red-500 p-2 rounded-full transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <RefreshCw
                    className="text-white animate-spin-slow"
                    size={24}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                    Reassign Device
                  </h2>
                  <p className=" text-[10px] font-black text-[#295e61]/40 uppercase tracking-[0.2em] opacity-80">
                    Transferring Asset: {showReassign.deviceBS}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* 1. NEW EMPLOYEE SELECTOR */}
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                  New Recipient
                </label>
                <div
                  className={`flex justify-between items-center px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm
              ${reassignOpen ? "border-[#295e61] bg-white ring-4 ring-[#295e61]/5" : "border-[#f0f2f3] bg-gray-50 hover:bg-white hover:border-gray-300"}`}
                  onClick={() => setReassignOpen((curr) => !curr)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${formReassign.employeeName ? "bg-[#295e61] text-white" : "bg-gray-200 text-gray-400"}`}
                    >
                      <User size={16} />
                    </div>
                    <span
                      className={`text-sm font-bold ${formReassign.employeeName ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {formReassign.employeeName || "Select new employee..."}
                    </span>
                  </div>
                  {reassignOpen ? (
                    <ChevronUp className="text-[#295e61]" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </div>

                {reassignOpen && (
                  <div className="absolute z-50 w-full bg-white border-2 border-[#f0f2f3] rounded-2xl mt-2 shadow-2xl p-2 animate-in slide-in-from-top-2">
                    <div className="relative mb-2">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search name or matricule..."
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#295e61]/20 focus:bg-white outline-none rounded-xl text-sm font-medium transition-all"
                        value={reassignEmplSearch}
                        autoFocus
                        onChange={(e) => setReassignEmplSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {employees
                        .filter(
                          (emp) =>
                            emp.status === "active" &&
                            `${emp.firstName} ${emp.lastName} ${emp.matricule}`
                              .toLowerCase()
                              .includes(reassignEmplSearch.toLowerCase()),
                        )
                        .map((emp) => (
                          <div
                            key={emp._id}
                            className="px-4 py-3 hover:bg-[#295e61]/5 cursor-pointer rounded-xl transition-colors flex justify-between items-center group"
                            onClick={() => {
                              setFormReassign({
                                ...formReassign,
                                newEmployeeId: emp._id,
                                employeeName: `${emp.firstName} ${emp.lastName} (${emp.matricule})`,
                              });
                              setReassignOpen(false);
                              setReassignEmplSearch("");
                            }}
                          >
                            <span className="text-sm font-bold text-gray-700 group-hover:text-[#295e61] transition-colors">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="text-[10px] font-mono font-black bg-gray-100 px-2 py-1 rounded text-gray-400 group-hover:bg-[#295e61]/10 group-hover:text-[#295e61]">
                              {emp.matricule}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DEVICE BS (READ ONLY OR EDITABLE) */}
              <div className="bg-gray-50 rounded-[1.5rem] p-6 border-2 border-dashed border-[#f0f2f3] transition-all group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">
                  Asset Identification (BS Tag)
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#295e61]"
                  />
                  <input
                    type="text"
                    value={formReassign.deviceBS || ""} // Added fallback to empty string
                    onChange={(e) =>
                      setFormReassign({
                        ...formReassign,
                        deviceBS: e.target.value,
                      })
                    } // <--- MANDATORY: This updates the state as you type
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 outline-none text-sm  font-bold text-gray-700 uppercase shadow-inner focus:ring-2 focus:ring-[#295e61]/20"
                    placeholder={showReassign.deviceBS}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">
                  * This tag is linked to the physical hardware ID.
                </p>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-8 pt-0 flex gap-3">
              <button
                data-analytics=""
                data-cta=""
                onClick={resetAssignForm}
                className="flex-1 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <Button
                data-analytics=""
                data-cta=""
                onClick={handleReassign}
                disabled={loading || !formReassign.newEmployeeId}
                className="flex-[2] flex justify-center items-center gap-2 bg-[#295e61] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#295e61]/20 hover:bg-black transition-all disabled:opacity-30 disabled:grayscale"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Confirm Transfer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- HISTORY MODAL ---------------- */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#295e61]/40 backdrop-blur-sm p-4">
          {/* Overlay click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setShowHistory(null)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* HEADER */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tightt flex items-center gap-2">
                  <History className="text-[#295e61]/40" size={24} /> Activity
                  Log
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Tracking updates for {showHistory.deviceBS}
                </p>
              </div>
              <button
                data-analytics=""
                data-cta=""
                onClick={() => setShowHistory(null)}
                className="p-2 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* CONTENT / TIMELINE */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {showHistory.history?.length > 0 ? (
                <div className="relative">
                  {/* The Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#295e61]/20 via-[#295e61]/10 to-transparent" />

                  <ul className="space-y-8">
                    {showHistory.history.map((h, index) => (
                      <li key={h._id || index} className="relative pl-10 group">
                        {/* Timeline Dot with Action Icon Background */}
                        <span
                          className={`absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center
                    ${
                      h.action?.toLowerCase().includes("return")
                        ? "bg-orange-500"
                        : h.action?.toLowerCase().includes("assign")
                          ? "bg-[#295e61]"
                          : "bg-blue-500"
                    }`}
                        />

                        <div className="bg-white border-2 border-[#f0f2f3] rounded-2xl p-4 transition-all group-hover:border-[#295e61]/30 group-hover:shadow-md">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-black text-gray-800 text-sm uppercase tracking-tight">
                              {h.action}
                            </p>
                            <time className="text-[9px] font-bold text-gray-400 uppercase">
                              {new Date(h.date).toLocaleDateString()}
                            </time>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <User size={12} className="text-[#295e61]" />
                            <span>
                              Modified by{" "}
                              <b className="text-gray-700">{h.user}</b>
                            </span>
                          </div>

                          {h.employee && (
                            <div className="bg-[#295e61]/5 rounded-lg px-3 py-2 border border-[#295e61]/10">
                              <p className="text-[10px] text-[#295e61] font-black uppercase leading-none mb-1">
                                Target Employee
                              </p>
                              <p className="text-sm font-bold text-[#295e61]">
                                {h.employee}
                              </p>
                            </div>
                          )}

                          <p className="text-[10px] text-gray-400 mt-2 italic">
                            {new Date(h.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
                    <History size={32} className="text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold italic">
                    No history found for this device.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <Button
                data-analytics=""
                data-cta=""
                onClick={() => setShowHistory(null)}
              >
                Close History
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={1600} />
    </div>
  );
}
const DetailItem = ({ label, value, isMono, className = "" }) => (
  <div>
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none block mb-1">
      {label}
    </span>
    <span
      className={`text-sm font-bold text-gray-700 ${isMono ? "font-mono text-[#295e61]" : ""} ${className}`}
    >
      {value || "—"}
    </span>
  </div>
);
