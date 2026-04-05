import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User2Icon, Lock, Loader2, LayoutDashboard } from "lucide-react";
import Dashboard_Login from "../assets/Dashboard_Login.png";
import logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
  });

  const { username, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(username, password);

      if (res.success) {
        toast.success(res.message || "Welcome back!", { 
          position: "bottom-left",
          theme: "colored" 
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error(res.message || "Invalid credentials", {
          position: "bottom-left",
          theme: "colored" 
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full font-montserrat overflow-hidden">
      {/* Background image with fixed overlay */}
      <div className="absolute inset-0">
        <img
          src={Dashboard_Login}
          alt="Login Background"
          className="h-full w-full object-cover transition-transform duration-[10s] scale-110 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-[#295e61]/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full flex-col gap-6 px-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-24 h-auto drop-shadow-2xl animate-bounce-subtle" 
          />
          <div className="text-center">
            <h1 className="text-white text-4xl font-black uppercase tracking-[0.2em] drop-shadow-lg">
              Parc IT
            </h1>
            <p className="text-teal-200 text-xs font-bold tracking-[0.4em] uppercase opacity-80">
              Management System
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col gap-6"
        >
          <div className="space-y-4">
            {/* Username Field */}
            <div className="relative group">
              <User2Icon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200 group-focus-within:text-white transition-colors"
              />
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleOnChange}
                required
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-teal-100/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm font-medium"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200 group-focus-within:text-white transition-colors"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                required
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-teal-100/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button
 data-analytics="" data-cta=""
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-white hover:bg-teal-50 text-[#295e61] rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LayoutDashboard size={16} />
                Access Dashboard
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-teal-100/40 uppercase tracking-widest font-bold">
            Authorized Personnel Only
          </p>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}