import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, Spin, message } from 'antd';
import { useGetExportDetailsByExportIdQuery } from '../../redux/api/exportDetailApiSlice';
import Loading from '../../utils/Loading';
import Error500 from '../../utils/Error500';
import useDocumentTitle from '../../utils/UseDocumentTitle';

const ExportDetails = () => {
  useDocumentTitle('Export Details');
  const { id } = useParams();
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo?.userInfo?.data?.token;

  const {
    data: exportDetailsData,
    error: exportDetailsError,
    isLoading: exportDetailsLoading,
    isFetching: exportDetailsFetching,
  } = useGetExportDetailsByExportIdQuery({ exportId: id, authToken }, { skip: !authToken });

  if (!authToken) {
    return <Error500 message="Authorization token is missing." />;
  }

  if (exportDetailsLoading || exportDetailsFetching) return <Loading />;
  if (exportDetailsError) {
    message.error('Failed to load export details');
    return <Error500 />;
  }

  const exportDetails = exportDetailsData?.data || [];

  const columns = [
    {
      title: 'Product Name',
      dataIndex: ['product', 'name'],
      key: 'productName',
    },
    {
      title: 'Product Description',
      dataIndex: ['product', 'description'],
      key: 'productDescription',
    },
    {
      title: 'Category',
      dataIndex: ['product', 'category', 'name'],
      key: 'categoryName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Expired At',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  const exportData = exportDetails.length > 0 ? exportDetails[0].export : {};

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="mb-2 text-2xl font-semibold text-dark">Export Details</h2>
      <p><strong>Order ID:</strong> {exportData?.id || 'N/A'}</p>
      <p><strong>Description:</strong> {exportData?.description || 'N/A'}</p>
      <p><strong>Status:</strong> {exportData?.status || 'N/A'}</p>
      <p><strong>Export Date:</strong> {new Date(exportData?.exportDate).toLocaleString() || 'N/A'}</p>
      <p><strong>Export Type:</strong> {exportData?.exportType || 'N/A'}</p>
      <p><strong>Transfer Key:</strong> {exportData?.transferKey || 'N/A'}</p>
      <p><strong>Warehouse From:</strong> {exportData?.warehouseFrom?.name || 'N/A'}</p>
      <p><strong>Warehouse Address:</strong> {exportData?.warehouseFrom?.address || 'N/A'}</p>
      <p><strong>Customer Name:</strong> {exportData?.customer?.name || 'N/A'}</p>
      <p><strong>Customer Email:</strong> {exportData?.customer?.email || 'N/A'}</p>
      <p><strong>Customer Phone:</strong> {exportData?.customer?.phone || 'N/A'}</p>
      <p><strong>Customer Address:</strong> {exportData?.customer?.address || 'N/A'}</p>
      <Table
        columns={columns}
        dataSource={exportDetails}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default ExportDetails;
