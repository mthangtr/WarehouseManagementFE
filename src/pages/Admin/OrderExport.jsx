// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Table, Button, Modal, Input, Select, message, Spin } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import { Link } from 'react-router-dom'; 
// import { useGetAllExportsForAdminQuery, useGetExportByIdQuery } from '../../redux/api/exportApiSlice';
// import Loading from '../../utils/Loading';
// import Error500 from '../../utils/Error500';

// const { Option } = Select;

// const OrderExport = () => {
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [searchParams, setSearchParams] = useState({ status: '', sortBy: 'id', direction: 'asc', pageNo: 1 });
//   const [pageSize, setPageSize] = useState(5);

//   const userInfo = useSelector((state) => state.auth);
//   const authToken = userInfo?.userInfo?.data?.token;

//   useEffect(() => {
//     if (!authToken) {
//       message.error('Authorization token is missing. Please log in again.');
//     }
//   }, [authToken]);

//   const {
//     data: exportsData,
//     error: exportsError,
//     isLoading: exportsLoading,
//     isFetching: exportsFetching,
//   } = useGetAllExportsForAdminQuery({ authToken, ...searchParams }, { skip: !authToken });

//   const {
//     data: exportDetailsData,
//     error: exportDetailsError,
//     isLoading: exportDetailsLoading,
//     isFetching: exportDetailsFetching,
//   } = useGetExportByIdQuery({ exportId: selectedOrderId, authToken }, { skip: !selectedOrderId || !authToken });

//   const handleRowClick = (record) => {
//     setSelectedOrderId(record.id);
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setSelectedOrderId(null);
//   };

//   if (!authToken) {
//     return <Error500 message="Authorization token is missing." />;
//   }

//   if (exportsLoading || exportsFetching) return <Loading />;
//   if (exportsError) {
//     message.error('Failed to load export data');
//     return <Error500 />;
//   }

//   const columns = [
//     {
//       title: 'Order ID',
//       dataIndex: 'id',
//       key: 'id',
//       sorter: true,
//     },
//     {
//       title: 'Warehouse Name',
//       dataIndex: ['warehouseFrom', 'name'],
//       key: 'warehouseName',
//       sorter: true,
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//       sorter: true,
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       sorter: true,
//       render: (text) => {
//         let color;
//         switch (text) {
//           case 'PENDING':
//             color = 'orange';
//             break;
//           case 'SHIPPING':
//             color = 'blue';
//             break;
//           case 'SUCCEED':
//             color = 'green';
//             break;
//           case 'CANCEL':
//             color = 'red';
//             break;
//           default:
//             color = 'grey';
//         }
//         return <span style={{ color }}>{text}</span>;
//       },
//     },
//     {
//       title: 'Type',
//       key: 'type',
//       render: (text, record) => {
//         return record.warehouseTo ? 'Inside' : 'Outside';
//       },
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (text, record) => (
//         <Link to={`/order/export/${record.id}`}>
//           <Button type='link'>View Details</Button>
//         </Link>
//       ),
//     },
//   ];

//   const sortOptions = [
//     { label: 'ID Ascending', value: 'id-asc' },
//     { label: 'ID Descending', value: 'id-desc' },
//     { label: 'Warehouse Name Ascending', value: 'warehouseName-asc' },
//     { label: 'Warehouse Name Descending', value: 'warehouseName-desc' },
//     { label: 'Status Ascending', value: 'status-asc' },
//     { label: 'Status Descending', value: 'status-desc' },
//   ];

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2 class="mb-2 text-2xl font-semibold text-dark">Admin Export</h2>
//       <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
//         <Input
//           placeholder='Search by Status'
//           onChange={(e) => setSearchParams((prev) => ({ ...prev, status: e.target.value, pageNo: 1 }))}
//           style={{ width: '200px' }}
//           prefix={<SearchOutlined />}
//         />
//         <Select
//           placeholder='Sort By'
//           onChange={(value) => {
//             const [field, order] = value.split('-');
//             setSearchParams((prev) => ({ ...prev, sortBy: field, direction: order, pageNo: 1 }));
//           }}
//           style={{ width: '200px' }}
//           value={`${searchParams.sortBy}-${searchParams.direction}`}
//         >
//           {sortOptions.map((option) => (
//             <Option key={option.value} value={option.value}>
//               {option.label}
//             </Option>
//           ))}
//         </Select>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={exportsData?.content}
//         rowKey='id'
//         pagination={{
//           current: searchParams.pageNo,
//           pageSize,
//           total: exportsData?.totalElements,
//           onChange: (page, pageSize) => setSearchParams((prev) => ({ ...prev, pageNo: page })),
//         }}
//         onChange={(pagination, filters, sorter) => {
//           if (sorter.order) {
//             const field = sorter.field;
//             const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
//             setSearchParams((prev) => ({ ...prev, sortBy: field, direction, pageNo: 1 }));
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default OrderExport;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Input, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; 
import { useGetAllExportsForAdminQuery, useGetExportByIdQuery } from '../../redux/api/exportApiSlice';
import Loading from '../../utils/Loading';
import Error500 from '../../utils/Error500';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import useDocumentTitle from '../../utils/UseDocumentTitle';

const { Option } = Select;

const OrderExport = () => {
  useDocumentTitle('Export')
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({ status: '', sortBy: 'id', direction: 'asc', pageNo: 1 });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo?.userInfo?.data?.token;

  useEffect(() => {
    if (!authToken) {
      message.error('Authorization token is missing. Please log in again.');
    }
  }, [authToken]);

  const {
    data: exportsData,
    error: exportsError,
    isLoading: exportsLoading,
    isFetching: exportsFetching,
  } = useGetAllExportsForAdminQuery({ authToken, ...searchParams }, { skip: !authToken });

  const {
    data: exportDetailsData,
    error: exportDetailsError,
    isLoading: exportDetailsLoading,
    isFetching: exportDetailsFetching,
  } = useGetExportByIdQuery({ exportId: selectedOrderId, authToken }, { skip: !selectedOrderId || !authToken });

  const handleRowClick = (record) => {
    setSelectedOrderId(record.id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrderId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSearchParams((prev) => ({ ...prev, pageNo: newPage }));
  };

  if (!authToken) {
    return <Error500 message="Authorization token is missing." />;
  }

  if (exportsLoading || exportsFetching) return <Loading />;
  if (exportsError) {
    message.error('Failed to load export data');
    return <Error500 />;
  }

  const paginatedRows = exportsData?.data.slice((page - 1) * pageSize, page * pageSize);

  const sortOptions = [
    { label: 'ID Ascending', value: 'id-asc' },
    { label: 'ID Descending', value: 'id-desc' },
    { label: 'Warehouse Name Ascending', value: 'warehouseName-asc' },
    { label: 'Warehouse Name Descending', value: 'warehouseName-desc' },
    { label: 'Status Ascending', value: 'status-asc' },
    { label: 'Status Descending', value: 'status-desc' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="mb-2 text-2xl font-semibold text-dark">Admin Export</h2>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder='Search by Status'
          onChange={(e) => setSearchParams((prev) => ({ ...prev, status: e.target.value, pageNo: 1 }))}
          style={{ width: '200px' }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder='Sort By'
          onChange={(value) => {
            const [field, order] = value.split('-');
            setSearchParams((prev) => ({ ...prev, sortBy: field, direction: order, pageNo: 1 }));
          }}
          style={{ width: '200px' }}
          value={`${searchParams.sortBy}-${searchParams.direction}`}
        >
          {sortOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#ffffff" }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell align="left">Warehouse Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows && paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: index % 2 === 0 ? "#e0e0e0" : "#ffffff",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.warehouseFrom.name}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.exportType}</TableCell>
                  <TableCell align="left" className="Details">
                    <Link to={`/order/export/${row.id}`}>
                      <Button type="primary" style={{ backgroundColor: "#1976d2", color: "#fff" }}>
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(exportsData?.totalElements / pageSize)}
        page={page}
        onChange={handleChangePage}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default OrderExport;
