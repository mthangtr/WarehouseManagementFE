import { Outlet } from "react-router-dom";
import "./App.css";

import Sidebar from "../components/Sidebar/Sidebar";
import RightSide from "../components/RigtSide/RightSide";
const App = () => {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <Outlet />
        <RightSide />
      </div>
    </div>
  );
};
export default App;
