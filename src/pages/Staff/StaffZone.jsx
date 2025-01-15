import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../utils/Breadcumbs';
import { useGetZoneByWarehouseIdQuery, useUpdateZoneMutation, useDeleteZoneMutation } from '../../redux/api/zoneApiSlice';
import ZoneTable from '../../components/Data/StaffData/StaffZone/StaffZoneTable';
import ZoneModal from '../../components/Data/StaffData/StaffZone/StaffZoneModal';
import { Button, message, Form } from 'antd';
import { useSelector } from 'react-redux';
import Loading from '../../utils/Loading';
import Error500 from '../../utils/Error500';
import useDocumentTitle from '../../utils/UseDocumentTitle';

const StaffZone = () => {
  useDocumentTitle('Zone')
  const { id } = useParams();
  const userInfo = useSelector((state) => state.auth);
  let authToken;
  let wid;
  if (userInfo && userInfo.userInfo && userInfo.userInfo.data) {
    authToken = userInfo.userInfo.data.token;
    wid = userInfo.userInfo.data.warehouseId;
  }
  console.log(wid);
  const { data: zones, isLoading, error } = useGetZoneByWarehouseIdQuery({ id: wid, authToken });
  const [updateZone] = useUpdateZoneMutation();
  const [deleteZone] = useDeleteZoneMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const showModal = (zoneId) => {
    const zone = zones.data.find((z) => z.id === zoneId);
    setSelectedZone(zone);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = { ...values, id: selectedZone.id };
    await updateZone({ data, authToken });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    await deleteZone({ id: selectedZone.id, authToken });
    setIsModalVisible(false);
    message.success("Zone deleted successfully");
  };

  const updateZoneStatus = async (zoneId, newStatus) => {
    const data = { id: zoneId, zoneStatus: newStatus };
    await updateZone({ data, authToken });
    message.success("Zone status updated successfully");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error500 />;
  }

  return (
    <div>
      <Breadcrumbs />
      <ZoneTable
        zones={zones.data}
        showModal={showModal}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        updateZoneStatus={updateZoneStatus}
      />
      <ZoneModal
        visible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        selectedZone={selectedZone}
        form={form}
        authToken={authToken}
      />
    </div>
  );
};

export default StaffZone;
