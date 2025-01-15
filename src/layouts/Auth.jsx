import { useSelector } from "react-redux";
import LoginComponent from "../components/Auth/LoginComponent";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const userInfo = useSelector((state) => state.auth);
  if (userInfo && userInfo?.userInfo?.data) {
    const decoded = jwtDecode(userInfo.userInfo.data.token);
    console.log(decoded);
    if (decoded && decoded.role.includes("ADMIN")) {
      return <Navigate to="/dashboard" replace />;
    } else if (decoded && decoded.role.includes("STAFF")) {
      return <Navigate to="/staff/dashboard" replace />;
    }
  }
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }
  return <LoginComponent />;
};
export default Auth;
