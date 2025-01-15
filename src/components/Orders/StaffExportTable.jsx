import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Space, Result, Input } from "antd";
import { useGetAllExportsByWarehouseidQuery } from "../../redux/api/exportApiSlice";
import { FormatTime } from "../../utils/FormatTime";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

function StaffExportTable({ searchValue }) {
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth);
  if (!userInfo) {
    return <navigate to={"/"} replace />;
  }
  let authToken;
  let wid;
  if (userInfo && userInfo.userInfo && userInfo.userInfo.data) {
    authToken = userInfo.userInfo.data.token;
    wid = userInfo.userInfo.data.warehouseId;
  }

  const {
    data: exportData,
    isLoading: exportDataLoading,
    error: exportDataError,
  } = useGetAllExportsByWarehouseidQuery({ warehouseId: wid, authToken });
  const exports = exportData?.data;

  const sortedExports = exports
    ? [...exports].sort((a, b) => b.id - a.id)
    : [];

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      ellipsis: true,
      width: 200,
      ...getColumnSearchProps("description"),
    },
    {
      title: "Export Date",
      dataIndex: "exportDate",
      key: "exportDate",
      sorter: (a, b) => new Date(a.exportDate) - new Date(b.exportDate),
      ellipsis: true,
      width: 150,
      render: (text) => new Date(text).toLocaleDateString(),
      ...getColumnSearchProps("exportDate"),
    },
    {
      title: "Type",
      dataIndex: "exportType",
      key: "exportType",
      filters: [
        { text: "Customer", value: "CUSTOMER" },
        { text: "Warehouse", value: "WAREHOUSE" },
        { text: "Waste", value: "WASTE" },
      ],
      filterMultiple: false,
      width: 120,
      onFilter: (value, record) => record.exportType === value,
    },
    {
      title: "To",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      ...getColumnSearchProps("customerName"),
      render: (_, record) => {
        if (record.exportType === "WAREHOUSE") {
          return record.warehouseTo ? record.warehouseTo.name : "N/A";
        }
        return record.customer ? record.customer.name : "N/A";
      },
    },
    {
      title: "Address",
      dataIndex: "toAddress",
      key: "toAddress",
      ellipsis: true,
      width: 250,
      render: (_, record) => {
        if (record.exportType === "WAREHOUSE") {
          return record.warehouseTo ? record.warehouseTo.address : "N/A";
        }
        return record.customer ? record.customer.address : "N/A";
      },
      ...getColumnSearchProps("toAddress"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a
            className="text-blue-500 no-underline bg-transparent cursor-pointer transition duration-300"
            onClick={() => navigate(`/staff/export/detail/${record.id}`)}
          >
            View
          </a>
        </Space>
      ),
    },
  ];

  if (exportDataError)
    return (
      <Result
        status="error"
        title="There are some problems with your operation."
        extra={
          <Button
            type="primary"
            key="console"
            onClick={() => navigate(`/staff/dashboard`)}
          >
            Go Dashboard
          </Button>
        }
      />
    );

  // Transform data to include customerName and toAddress for search
  const transformedData = sortedExports?.map((item) => ({
    ...item,
    customerName:
      item.exportType === "WAREHOUSE"
        ? item.warehouseTo?.name
        : item.customer?.name,
    toAddress:
      item.exportType === "WAREHOUSE"
        ? item.warehouseTo?.address
        : item.customer?.address,
  }));

  // Apply search filtering
  const filteredData = transformedData?.filter(
    (item) =>
      item.description.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.toAddress?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.exportDate.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Table
      className="no-select"
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{ pageSize: 10, position: ["bottomCenter"] }}
      loading={exportDataLoading}
    />
  );
}

export default StaffExportTable;
