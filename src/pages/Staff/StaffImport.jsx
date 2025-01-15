import "../../assets/styles/MainDash.css";
import Breadcrumbs from "../../utils/Breadcumbs";
import { Button, Input, message } from "antd";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import StaffImportTable from "../../components/Orders/StaffImportTable";
import { useState } from "react";
import useDebounce from "../../utils/useDebounce";
import { useGetAllExportsQuery } from "../../redux/api/exportApiSlice";
import { useSelector } from "react-redux";

const { Search } = Input;

function StaffImportPage() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const warehouseId = userInfo.userInfo.data.warehouseId;

  const { data: exports, isFetching, error } = useGetAllExportsQuery(authToken);
  const exportsData = exports?.data || [];

  const handleImportFromWarehouse = () => {
    const filteredExports = exportsData.filter(
      (exp) =>
        exp.exportType === "WAREHOUSE" &&
        exp.warehouseTo.id === warehouseId &&
        exp.warehouseFrom.id !== warehouseId &&
        !exp.transferKey
    );

    if (filteredExports.length === 0) {
      message.warning("Không có đơn export nào cả.");
    } else {
      navigate("/staff/import/from-warehouse");
    }
  };

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>Error loading exports.</p>;

  return (
    <div>
      <Breadcrumbs />
      <div className="p-5">
        <h1 className="font-bold text-3xl text-center mb-4">Import</h1>
        <div className="flex flex-col sm:flex-row items-center mb-4 justify-between w-full">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="w-full sm:w-auto bg-black text-white flex items-center justify-center">
              <Link
                to="/staff/import/new"
                className="text-white flex items-center"
              >
                <AddIcon className="mr-2" sx={{ fontSize: 18 }} />
                New Import
              </Link>
            </Button>
            <Button
              className="w-full sm:w-auto bg-black text-white flex items-center justify-center"
              onClick={handleImportFromWarehouse}
            >
              Import from Warehouse
            </Button>
          </div>
          <Search
            className="w-full sm:w-auto max-w-xs ml-auto"
            placeholder="Search import..."
            onChange={(e) => setSearchValue(e.target.value)}
            enterButton
          />
        </div>
        <StaffImportTable searchValue={debouncedSearchTerm} />
      </div>
    </div>
  );
}

export default StaffImportPage;
