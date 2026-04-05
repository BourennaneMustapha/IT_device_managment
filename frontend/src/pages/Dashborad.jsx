import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Users, Shield, Cpu, Code2, User } from "lucide-react";
import slide_hardware from "../assets/slide_hardware.jpg";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
  const [activeCount, setActiveCount] = useState(0);
  const { user } = useAuth();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/employees/getall",
        );
        const active = res.data.employees.filter(
          (emp) => emp.status === "active",
        ).length;
        setActiveCount(active);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#98a7a3]">
      <Sidebar />

      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full space-y-8">
          {/* SYSTEM DEFINITION CARD */}
          <div className="bg-gray-200 rounded-[3rem] p-10 shadow-[0_30px_100px_-20px_rgba(41,94,97,0.3)] border-2 border-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[#295e61]/5">
              <Shield size={180} />
            </div>

            <div className="relative z-10">
              <span className="bg-[#295e61] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em]">
                System Overview
              </span>

              <h1 className="text-5xl font-black text-[#295e61] mt-6 tracking-tighter">
                Parc IT Management
              </h1>

              <p className="text-xl text-gray-500 mt-4 leading-relaxed max-w-2xl font-medium">
                A professional-grade ecosystem designed to synchronize hardware
                lifecycle tracking, employee device affectations, and real-time
                inventory reconciliation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100">
                {/* ACTIVE EMPLOYEES */}
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-blue-50 text-green-500 flex items-center justify-center shadow-sm">
                    <Users size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Active Employee
                    </p>
                    <p className="text-4xl font-black text-gray-800">
                      {activeCount}
                    </p>
                  </div>
                </div>

                {/* LEAD DEVELOPER */}
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-[#295e61]/5 text-blue-500 flex items-center justify-center shadow-sm">
                    <User size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Active Admin
                    </p>
                    <p className="text-2xl font-black text-gray-800 tracking-tight">
                      {user?.name || "Guest User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM ARCHITECTURE TAGS */}

          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="h-[1px] w-12 bg-[#295e61] mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#293535]">
              © {new Date().getFullYear()} ENICAB
            </p>
            <p className="text-[9px] font-bold text-white uppercase tracking-widest">
              All Rights Reserved
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
