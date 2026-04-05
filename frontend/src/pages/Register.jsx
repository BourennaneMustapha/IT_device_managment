import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, LogOut, Pencil, Trash2, X, Loader2, ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", password: "" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const API_URL = "http://localhost:5000/api/auth";

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API_URL}/register-admin`, { withCredentials: true });
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load registry");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenModal = (user = null) => {
    setEditingUserId(user ? user._id : null);
    setNewUser(user ? { name: user.name, password: "" } : { name: "", password: "" });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    if (!newUser.name || (!editingUserId && !newUser.password)) return toast.warning("Fields required");
    setLoading(true);
    try {
      if (editingUserId) {
        await axios.put(`${API_URL}/register-admin/${editingUserId}`, newUser, { withCredentials: true });
      } else {
        await axios.post(`${API_URL}/register`, newUser, { withCredentials: true });
      }
      toast.success("Done");
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      toast.error("Update failed");
    } finally { setLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete Admin?")) return;
    try {
      await axios.delete(`${API_URL}/register-admin/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (error) { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f6] flex flex-col items-center p-6 md:p-12 font-montserrat">
      <div className="w-full max-w-4xl">
        
        {/* SIMPLE HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#295e61] tracking-tight">Administrators</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Registry Management</p>
          </div>
          <div className="flex gap-3">
            <button data-analytics="" data-cta=""  onClick={() => handleOpenModal()} className="p-3 bg-[#295e61] text-white rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <Plus size={20} />
            </button>
            <button data-analytics="" data-cta=""  onClick={() => navigate("/masterLogin")} className="p-3 bg-white text-gray-400 rounded-2xl border border-gray-200 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="space-y-4">
          {fetching ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#295e61]" /></div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#295e61]/10 text-[#295e61] rounded-2xl flex items-center justify-center font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-700">{user.name}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button data-analytics="" data-cta=""  onClick={() => handleOpenModal(user)} className="p-2 text-gray-400 hover:text-[#295e61]"><Pencil size={18} /></button>
                  <button data-analytics="" data-cta=""  onClick={() => handleDeleteUser(user._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MINIMAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#295e61]/20 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white">
            <h2 className="text-xl font-black text-[#295e61] mb-6 tracking-tight text-center">
              {editingUserId ? "Edit User" : "New Admin"}
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#295e61]/20 transition-all font-bold text-sm"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#295e61]/20 transition-all font-bold text-sm"
              />
              <button 
 data-analytics="" data-cta=""
                onClick={handleSaveUser} 
                className="w-full bg-[#295e61] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-2 flex justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Confirm"}
              </button>
              <button data-analytics="" data-cta=""  onClick={() => setShowModal(false)} className="w-full text-gray-400 text-[10px] font-bold uppercase tracking-widest pt-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer hideProgressBar autoClose={1200} />
    </div>
  );
}