import StaffsComponent from "../Staff/StaffsComponent";
import useDocumentTitle from "../../utils/UseDocumentTitle";

const Staffs = () => {
  useDocumentTitle('Staffs')
  return (
    <div>
     <StaffsComponent />
    </div>
  );
};
export default Staffs;
