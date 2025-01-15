import Breadcrumbs from "../../utils/Breadcumbs";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllWarehousesQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useAddWarehouseMutation,
} from "../../redux/api/warehousesApiSlice";
import WarehouseTable from "../../components/Data/Warehouse/WarehouseTable";
import WarehouseModal from "../../components/Data/Warehouse/WarehouseModal";
import AddWarehouseModal from "../../components/Data/Warehouse/AddWarehouseModal";
import { Button, message, Form } from "antd";
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import "../../assets/styles/MainDash.css";
import useDocumentTitle from "../../utils/UseDocumentTitle";
const DataWarehouse = () => {
  useDocumentTitle('Warehouses')
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const {
    data: warehouses,
    isLoading,
    error,
  } = useGetAllWarehousesQuery(authToken);
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const [deleteWarehouse] = useDeleteWarehouseMutation();
  const [addWarehouse] = useAddWarehouseMutation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [addNewVisible, setAddNewVisible] = useState(false);

  const showModal = (warehouseId) => {
    const warehouse = warehouses.data.find((w) => w.id === warehouseId);
    setSelectedWarehouse(warehouse);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = { ...values, id: selectedWarehouse.id };
    await updateWarehouse({
      warehouseId: selectedWarehouse.id,
      formData: data,
      authToken,
    });
    setIsModalVisible(false);
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouse({ warehouseId: selectedWarehouse.id, authToken });
      setIsModalVisible(false);
      message.success("Warehouse deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOkAdd = async () => {
    const values = await formAdd.validateFields();
    const data = { ...values };
    await addWarehouse({ warehouseData: data, authToken });
    message.success("Warehouse added successfully");
    setAddNewVisible(false);
    formAdd.resetFields();
  };

  const handleCancelAdd = () => {
    setAddNewVisible(false);
  };

  if (isLoading) {
    return (
      <div className="">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error500 />;
  }

  return (
    <div className="">
      <Breadcrumbs />
      <div
        className="flex justify-between"
        style={{ paddingLeft: "3rem", paddingTop: "1rem" }}
      >
        <h1 class="mb-2 text-2xl font-semibold text-dark">Warehouses</h1>
        <Button
          type="primary"
          style={{ background: "#40A578" }}
          onClick={() => setAddNewVisible(true)}
        >
          Add new warehouse
        </Button>
      </div>
      <AddWarehouseModal
        addNewVisible={addNewVisible}
        handleOkAdd={handleOkAdd}
        handleCancelAdd={handleCancelAdd}
        formAdd={formAdd}
      />
      <WarehouseTable
        warehouseList={warehouses.data}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        showModal={showModal}
      />
      <WarehouseModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        selectedWarehouse={selectedWarehouse}
        form={form}
      />
    </div>
  );
};

export default DataWarehouse;
