import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Collapse, Badge, Button, Modal, Pagination, Table } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useGetAllExportsQuery } from "../../redux/api/exportApiSlice";
import { useGetAllExportDetailsQuery } from "../../redux/api/exportDetailApiSlice";
import LineChart from "../../components/CustomerReview/LineChart";
import BarChart from "../../components/CustomerReview/BarChart";
import { useGetAllImports2Query } from "../../redux/api/importApiSlice";
import { jwtDecode } from "jwt-decode";

const { Panel } = Collapse;

const MainDash = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const warehouseId = userInfo.userInfo.data.warehouseId;
  const decoded = jwtDecode(userInfo.userInfo.data.token);

  const { data: chartExports } = useGetAllExportsQuery(authToken);
  const { data: chartImports } = useGetAllImports2Query({ authToken });

  const { data: allExports } = useGetAllExportsQuery(authToken);
  const { data: allExportDetails } = useGetAllExportDetailsQuery(authToken);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeKey, setActiveKey] = useState(null);
  const pageSize = 3;

  const filteredExports =
    allExports?.data.filter(
      (exp) =>
        exp.exportType === "WAREHOUSE" &&
        exp.warehouseTo.id === warehouseId &&
        exp.warehouseFrom.id !== warehouseId &&
        !exp.transferKey
    ) || [];

  const paginatedExports = filteredExports?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleIconClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveKey(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePanelChange = (key) => {
    setActiveKey(key === activeKey ? null : key);
  };

  const handleImportClick = (exportItem, exportDetails) => {
    navigate("/staff/import/from-warehouse", {
      state: { exportItem, exportDetails },
    });
  };

  const exportDetailColumns = [
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Expired At",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (date) => new Date(date).toLocaleDateString("en-US"),
    },
  ];

  return (
    <div>
      {decoded.role === "STAFF" && filteredExports?.length > 0 && (
        <div className="flex justify-end items-center mb-4">
          <Badge count={filteredExports.length}>
            <BellOutlined
              onClick={handleIconClick}
              style={{ fontSize: 30, cursor: "pointer" }}
            />
            {/* <NotificationsIcon
              onClick={handleIconClick}
              style={{ fontSize: 30, cursor: "pointer" }}
            /> */}
          </Badge>
        </div>
      )}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
          <div className="flex text-6xl rounded-xl">
            <LineChart
              importData={chartImports?.data}
              exportData={chartExports?.data}
            />
          </div>
          <div className="flex justify-center text-6xl rounded-xl">
            <BarChart />
          </div>
        </div>
      </div>
      <Modal
        title="Import From Warehouse Orders"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Collapse activeKey={activeKey} onChange={handlePanelChange}>
            {paginatedExports?.map((exportItem) => {
              const exportDetails =
                allExportDetails?.data.filter(
                  (detail) => detail.export.id === exportItem.id
                ) || [];
              return (
                <Panel
                  header={
                    <div>
                      <h3 className="text-xl text-indigo-500">
                        {exportItem.description}
                      </h3>
                      <p>{`Export Date: ${new Date(
                        exportItem.exportDate
                      ).toLocaleDateString("en-US")}`}</p>
                      <p>{`From Warehouse: ${exportItem.warehouseFrom.name}`}</p>
                    </div>
                  }
                  key={exportItem.id}
                >
                  <Table
                    columns={exportDetailColumns}
                    dataSource={exportDetails}
                    rowKey="id"
                    pagination={false}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleImportClick(exportItem, exportDetails)}
                    style={{ marginTop: 16 }}
                  >
                    Import
                  </Button>
                </Panel>
              );
            })}
          </Collapse>
        </div>
        {filteredExports?.length > pageSize && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredExports.length}
            onChange={handlePageChange}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default MainDash;
