import { Outlet } from "react-router-dom";
import '../assets/styles/MainDash.css';

import Sidebar from "../components/Sidebar/Sidebar";
import RightSide from "../components/RigtSide/RightSide";
const App = () => {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <div className="MainDash">
        <Outlet />
        </div>
      </div>
    </div>
  );
};
export default App;
