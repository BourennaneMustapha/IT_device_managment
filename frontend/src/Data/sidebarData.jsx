import {
  Building,
  FolderKanban,
  LayoutDashboard,
  User2,
  Laptop,
  CornerDownRight,
  Replace,
  Share,
  MoveRight,
  NetworkIcon,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={16} />,
    path: "/dashboard",
  },
  {
    title: "Employee",
    icon: <User2 size={16} />,
    path: "/employee",
  },
 {
  title: "Organigram",
  icon: <NetworkIcon size={16} />,
  path: "/organigram", // ✅ REQUIRED
  
},
  {
    title: "Devices",
    icon: <Laptop size={16} />,
    path: "/devices",
  },
  {
    title: "Affectation",
    icon: <MoveRight size={16} />,
    path: "/affectation",
  },
];
