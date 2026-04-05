import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/Login.jsx";
import AuthProvider from "./context/AuthProvider";
import MasterLogin from "./pages/MasterLogin.jsx";
import Dashborad from "./pages/Dashborad.jsx";
import Employee from "./pages/Employee.jsx";
import Devices from "./pages/Devices.jsx";
import Affectation from "./pages/Affectation.jsx";
import OrgTree from "./pages/Organigram.jsx";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/masterLogin" element={<MasterLogin />} />
          <Route path="/adminLogin" element={<Login />} />

          <Route path="/dashboard" element={<Dashborad />} />
          <Route path="/employee" element={<Employee />} />
          {/* Organigram routes */}
          
          <Route path="/organigram" element={<OrgTree />} />
          {/* Devices main page */}
          <Route path="/devices" element={<Devices />} />
          <Route path="/affectation" element={<Affectation />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
