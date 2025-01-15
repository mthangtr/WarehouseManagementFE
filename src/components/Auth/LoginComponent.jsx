import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";
import animationData from "../../assets/log-bg.json";
import Lottie from "lottie-react";
const LoginComponent = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      dispatch(setCredentials({ ...res }));

      const decoded = jwtDecode(res.data.token);
      console.log(decoded.role);
      localStorage.setItem("role", decoded.role);
      if (decoded.role === "ADMIN") {
        navigate("/dashboard");
      } else if (decoded.role === "STAFF") {
        navigate("/staff/dashboard");
      }
      message.success("Login successfully");

      console.log("Login successful");
    } catch (err) {
      message.error("Login unsuccessfully");
      console.log("Login failed: ", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rememberMe" ? checked : value,
    });
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  return (
    <div className="bg-gray-2 flex items-center min-h-screen overflow-hidden">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap justify-center items-center min-h-screen">
          <form
            className="w-full px-4 md:w-1/2 xl:w-1/2"
            onSubmit={handleSubmit}
          >
            <div className="max-h-screen py-6 flex flex-col justify-center sm:py-12">
              <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <div className="max-w-md mx-auto">
                    <div>
                      <h1 className="text-2xl font-semibold">Sign in to WHA</h1>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="username"
                            name="username"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="username"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            Username
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="password"
                            name="password"
                            type="password"
                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="password"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            Password
                          </label>
                        </div>
                        <div className="relative">
                          <button
                            type="submit"
                            className="bg-blue-500 text-white rounded-md px-2 py-1"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="w-full px-4 md:w-1/2 xl:w-1/2 flex justify-center items-center">
            <Lottie
              animationData={animationData}
              className="flex justify-center items-center h-full"
              loop={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
