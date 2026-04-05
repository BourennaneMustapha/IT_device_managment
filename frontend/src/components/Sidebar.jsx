import { ArrowLeft, ArrowRight, UserCircle2Icon, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { sidebarItems } from "../Data/sidebarData";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./UI/Button";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div
      className={`${
        expanded ? "w-64" : "w-20"
      } bg-gradient-to-r from-[#295e61] via-[#409195] to-[#98a7a3] shadow-2xl flex flex-col transition-all duration-300 h-screen`}
    >
      {/* HEADER */}
      <div
        className={`p-4 pt-10 flex items-center ${
          expanded ? "justify-between" : "justify-center"
        }`}
      >
        {expanded && (
          <img src={logo} alt="Logo" className="w-32 object-contain" />
        )}

        <button
 data-analytics="" data-cta=""
          onClick={() => setExpanded((curr) => !curr)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          {expanded ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 mt-8 space-y-2 font-mono">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
 data-analytics="" data-cta=""
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                ${expanded ? "justify-start" : "justify-center"}
                ${
                  isActive
                    ? "bg-white text-[#295e61] font-semibold shadow"
                    : "text-white hover:bg-white/10"
                }
              `}
            >
              <span className="flex items-center justify-center w-5 h-5">
                {item.icon}
              </span>

              {expanded && (
                <span className="text-sm truncate">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <footer className="p-4 border-t border-white/10 flex flex-col gap-3">
        {expanded && (
          <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
            <UserCircle2Icon size={24} className="text-white" />
            <div className="overflow-hidden">
              <p className="text-xs text-white/60">User</p>
              <p className="text-sm text-white truncate font-medium">
                {user?.name || "Guest User"}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="danger"
          onClick={logout}
          className={`flex items-center gap-2 justify-center w-full ${
            !expanded && "p-2"
          }`}
        >
          <LogOut size={16} />
          {expanded && <span>Logout</span>}
        </Button>
      </footer>
    </div>
  );
}