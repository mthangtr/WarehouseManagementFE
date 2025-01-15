import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Table, Space, Result } from "antd";
import {
  useGetAllImportsByWarehouseIdQuery,
  useGetTotalImportsByWarehouseIdQuery,
} from "../../redux/api/importApiSlice";
import { FormatTime } from "../../utils/FormatTime";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const { Search } = Input;

function StaffImportTable({ searchValue }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const authToken = userInfo?.data?.token;
  const warehouseId = userInfo?.data?.warehouseId;

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const {
    data: importsData = {},
    isLoading: importsLoading,
    error: importsError,
  } = useGetAllImportsByWarehouseIdQuery({
    warehouseId,
    authToken,
    pageNo,
    pageSize,
    sortBy: sortField,
    direction: sortOrder,
    status: filterStatus,
    search: searchText,
  });
  const { data: totalImportItemData = 0 } =
    useGetTotalImportsByWarehouseIdQuery({
      warehouseId,
      authToken,
      status: filterStatus,
      search: searchText,
    });
  const imports = importsData.data || [];
  const totalImportItem = totalImportItemData;

  useEffect(() => {
    setSearchText(searchValue);
  }, [searchValue]);

  const navigate = useNavigate();

  const handleTableChange = (pagination, filters, sorter) => {
    setPageNo(pagination.current);
    setPageSize(pagination.pageSize);

    if (sorter.order === undefined) {
      setSortField("");
      setSortOrder("");
    } else {
      setSortField(sorter.field);
      const order = sorter.order === "ascend" ? "asc" : "desc";
      setSortOrder(order);
    }
    if (filters.status && filters.status.length > 0) {
      setFilterStatus(filters.status[0]);
    } else {
      setFilterStatus("");
    }
  };

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
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
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
      title: "Received Date",
      dataIndex: "receivedDate",
      key: "receivedDate",
      sorter: (a, b) => new Date(a.receivedDate) - new Date(b.receivedDate),
      ellipsis: true,
      width: 150,
      render: (text) => FormatTime(text),
      ...getColumnSearchProps("receivedDate"),
    },
    {
      title: "Type",
      dataIndex: "importType",
      key: "importType",
      filters: [
        { text: "Customer", value: "CUSTOMER" },
        { text: "Warehouse", value: "WAREHOUSE" }
      ],
      filterMultiple: false,
      width: 120,
      onFilter: (value, record) => record.importType === value,
    },
    {
      title: "From",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      render: (_, record) => {
        if (record?.importType === "WAREHOUSE") {
          return record?.warehouseFrom ? record?.warehouseFrom?.name : "N/A";
        }
        return record?.customer ? record?.customer?.name : "N/A";
      },
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Address",
      dataIndex: "fromAddress",
      key: "fromAddress",
      ellipsis: true,
      width: 250,
      render: (_, record) => {
        if (record.importType === "WAREHOUSE") {
          return record.warehouseFrom ? record.warehouseFrom.address : "N/A";
        }
        return record.customer ? record.customer.address : "N/A";
      },
      ...getColumnSearchProps("fromAddress"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a
            className="text-blue-500 no-underline bg-transparent cursor-pointer transition duration-300"
            onClick={() => navigate(`/staff/import/detail/${record.id}`)}
          >
            View
          </a>
        </Space>
      ),
    },
  ];

  if (importsLoading) return <div>Loading...</div>;
  if (importsError)
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

  // Transform data to include customerName and fromAddress for search
  const transformedData = imports?.map((item) => ({
    ...item,
    customerName: item.importType === "WAREHOUSE" ? item.warehouseFrom?.name : item.customer?.name,
    fromAddress:
      item.importType === "WAREHOUSE"
        ? item.warehouseFrom?.address
        : item.customer?.address,
  }));

  // Apply search filtering
  const filteredData = transformedData.filter(
    (item) =>
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.fromAddress?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.receivedDate.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Table
      className="no-select"
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{
        current: pageNo,
        pageSize: pageSize, // Ensure 10 imports per page
        total: totalImportItem,
        position: ["bottomCenter"],
      }}
      onChange={handleTableChange}
      loading={importsLoading}
    />
  );
}

export default StaffImportTable;
