import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ShieldCheck, Lock, Loader2, Key, X } from "lucide-react";
import Dashboard_Login from "../assets/Dashboard_Login.png";

export default function MasterLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/master-login",
        { username, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Master Access Granted", { position: "top-center" });
        setTimeout(() => navigate("/Register"), 1000);
      }
    } catch (err) {
      toast.error("Invalid Master Credentials", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full font-montserrat overflow-hidden">
      {/* Background image shared with Login */}
      <div className="absolute inset-0">
        <img
          src={Dashboard_Login}
          alt="Master Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#295e61]/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="w-full max-w-md px-4">
          
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl border border-white/20 flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="p-3 bg-white/20 rounded-2xl text-white">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-white text-2xl font-black uppercase tracking-widest text-center">
                Master Access
              </h1>
            </div>

            <div className="space-y-4">
              {/* Master Username */}
              <div className="relative">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Master Username"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-teal-100/50 focus:outline-none focus:bg-white/20 transition-all text-sm font-medium"
                />
              </div>

              {/* Master Password */}
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Master Password"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-teal-100/50 focus:outline-none focus:bg-white/20 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
 data-analytics="" data-cta=""
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-teal-50 text-[#295e61] rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Unlock System"
              )}
            </button>

            <button 
 data-analytics="" data-cta=""
              type="button"
              onClick={() => navigate("/")}
              className="text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center justify-center gap-1"
            >
              <X size={12} /> Cancel Access
            </button>
          </form>
        </div>
      </div>
      <ToastContainer hideProgressBar autoClose={2000} />
    </div>
  );
}