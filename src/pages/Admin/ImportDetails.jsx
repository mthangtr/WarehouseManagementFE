import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, Spin, message } from 'antd';
import { useGetImportDetailsByImportIdQuery } from '../../redux/api/importDetailApiSlice';
import Loading from '../../utils/Loading';
import Error500 from '../../utils/Error500';
import useDocumentTitle from '../../utils/UseDocumentTitle';

const ImportDetails = () => {
  useDocumentTitle('Import Details');
  const { id } = useParams();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const authToken = userInfo?.data?.token;

  const {
    data: importDetailsData,
    error: importDetailsError,
    isLoading: importDetailsLoading,
    isFetching: importDetailsFetching,
  } = useGetImportDetailsByImportIdQuery({ importId: id, authToken }, { skip: !id || !authToken });

  if (!authToken) {
    return <Error500 message="Authorization token is missing." />;
  }

  if (importDetailsLoading || importDetailsFetching) return <Loading />;
  if (importDetailsError) {
    message.error('Failed to load import details');
    return <Error500 />;
  }

  const importData = importDetailsData?.data?.[0]?.importResponse || {};
  const products = importDetailsData?.data || [];

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
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 class="mb-2 text-2xl font-semibold text-dark">Import Details</h2>
      <p><strong>Description:</strong> {importData.description}</p>
      <p><strong>Status:</strong> {importData.status}</p>
      <p><strong>Received Date:</strong> {new Date(importData.receivedDate).toLocaleString()}</p>
      <p><strong>Import Type:</strong> {importData.importType}</p>
      <p><strong>Transfer Key:</strong> {importData.transferKey}</p>
      <p><strong>Warehouse To:</strong> {importData.warehouseTo?.name}</p>
      <p><strong>Warehouse Address:</strong> {importData.warehouseTo?.address}</p>
      <p><strong>Customer Name:</strong> {importData.customer?.name}</p>
      <p><strong>Customer Email:</strong> {importData.customer?.email}</p>
      <p><strong>Customer Phone:</strong> {importData.customer?.phone}</p>
      <p><strong>Customer Address:</strong> {importData.customer?.address}</p>

      <Table
        columns={columns}
        dataSource={products}
        rowKey='id'
        pagination={false}
      />
    </div>
  );
};

export default ImportDetails;
