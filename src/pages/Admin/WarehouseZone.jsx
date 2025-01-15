import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../utils/Breadcumbs';
import { useGetZoneByWarehouseIdQuery, useAddZoneMutation, useUpdateZoneMutation, useDeleteZoneMutation } from '../../redux/api/zoneApiSlice';
import ZoneTable from '../../components/Data/Zone/ZoneTable';
import ZoneModal from '../../components/Data/Zone/ZoneModal';
import ZoneAddModal from '../../components/Data/Zone/ZoneAddModal';
import { Button, message, Form } from 'antd';
import { useSelector } from 'react-redux';
import useDocumentTitle from '../../utils/UseDocumentTitle';

const WarehouseZone = () => {
    useDocumentTitle('WZ')
    const { id } = useParams();
    const userInfo = useSelector((state) => state.auth);
    const authToken = userInfo.userInfo.data.token;
    const { data: zones, isLoading, error } = useGetZoneByWarehouseIdQuery({ id, authToken });
    const [addZone] = useAddZoneMutation();
    const [updateZone] = useUpdateZoneMutation();
    const [deleteZone] = useDeleteZoneMutation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [form] = Form.useForm();
    const [formAdd] = Form.useForm();
    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    const showModal = (zoneId) => {
        const zone = zones.data.find((z) => z.id === zoneId);
        setSelectedZone(zone);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        const data = { ...values, trackingId: selectedZone.id };
        await updateZone({ data, authToken });
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = async () => {
        const response = await deleteZone({ id: selectedZone.id, authToken });
        setIsModalVisible(false);
        // message.success("Zone deleted successfully");
        message.info(response.data.message);
    };

    const handleOkAdd = async () => {
        const values = await formAdd.validateFields();
        const data = { ...values, warehouseId: id };
        await addZone({ data, authToken });
        message.success("Zone added successfully");
        setIsAddModalVisible(false);
        formAdd.resetFields();
    };

    const handleCancelAdd = () => {
        setIsAddModalVisible(false);
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading zones</div>;
    }

    return (
        <div>
            <Breadcrumbs />
            <div
        className="flex justify-between"
        style={{ paddingLeft: "3rem", paddingTop: "1rem" }}
      >
            <h1 class="mb-2 text-2xl font-semibold text-dark">Warehouse Zones</h1>
            <Button type="primary" style={{ background: "#40A578" }} onClick={() => setIsAddModalVisible(true)}>
                Add new zone
            </Button></div>
            <ZoneAddModal
                visible={isAddModalVisible}
                handleOk={handleOkAdd}
                handleCancel={handleCancelAdd}
                form={formAdd}
            />
            <ZoneTable
                zones={zones.data}
                showModal={showModal}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
            />
            <ZoneModal
                visible={isModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
                selectedZone={selectedZone}
                form={form}
            />
        </div>
    );
};

export default WarehouseZone;
