import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const role = localStorage.getItem('role')
  return userInfo && (role.includes('ADMIN')) ? (
    <Outlet />
  ) : (
    <Navigate to="*" replace />

  );
};
export default AdminRoute;
