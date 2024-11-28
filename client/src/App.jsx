// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "~/pages/Login";
import Dashboard from "~/pages/Dashboard";

function App() {
  const ProtectedRoute = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return <Navigate to="/login" replace={true} />;
    }
    return <Outlet />;
  };
  const UnauthorizedRoute = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return <Navigate to="/dashboard" replace={true} />;
    }
    return <Outlet />;
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace={true} />} />

      <Route element={<UnauthorizedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
