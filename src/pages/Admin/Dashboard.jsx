import MainDash from "./MainDash";
import useDocumentTitle from "../../utils/UseDocumentTitle";

const Dashboard = () => {
  useDocumentTitle('Dashboard');
  return (
    <div>
       <MainDash />
    </div>
  );
};
export default Dashboard;

