import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const StaffRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const role = localStorage.getItem('role')
  return userInfo && (role.includes('STAFF')) ? <Outlet /> : <Navigate to="/login" replace />;

};

export default StaffRoute;
