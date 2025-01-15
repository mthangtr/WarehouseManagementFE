import "../../assets/styles/MainDash.css";
import Breadcrumbs from "../../utils/Breadcumbs";
import { Button, Input } from "antd";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import StaffExportTable from "../../components/Orders/StaffExportTable";
import { useState } from "react";
import useDebounce from "../../utils/useDebounce";

const { Search } = Input;

function StaffExportPage() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  return (
    <div>
      <Breadcrumbs />
      <div className="p-5">
        <h1 className="font-bold text-3xl text-center mb-4">Export</h1>
        <div className="flex flex-col sm:flex-row items-center mb-4 justify-between w-full">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              style={{
                backgroundColor: "#2A2A2A",
                color: "#ffffff",
              }}
              size="medium"
              className="w-full sm:w-auto flex items-center justify-center">
              <Link
                to="/staff/export/new"
                className="text-white flex items-center"
              >
                <AddIcon className="mr-2" sx={{ fontSize: 18 }} />
                New Export
              </Link>
            </Button>
          </div>
          <Search
            size="medium"
            className="w-full sm:w-auto max-w-xs ml-auto"
            placeholder="Search export..."
            onChange={(e) => setSearchValue(e.target.value)}
            enterButton
          />
        </div>
        <StaffExportTable searchValue={debouncedSearchTerm} />
      </div>
    </div>
  );
}

export default StaffExportPage;
