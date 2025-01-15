import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../redux/api/usersApiSlice";
import { useGetAllWarehousesQuery } from "../../redux/api/warehousesApiSlice";
import { useAddStaffMutation } from "../../redux/api/authApiSlice";
import StaffTable from "../../components/Staffs/StaffTable";
import StaffModal from "../../components/Staffs/StaffModal";
import AddStaffModal from "../../components/Staffs/AddStaffModal";
import { Button, message, Form } from "antd";
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import useDocumentTitle from "../../utils/UseDocumentTitle";

const StaffsComponent = () => {
  useDocumentTitle('Staffs')
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const { data: staffs, isLoading, error } = useGetAllUsersQuery(authToken);
  const {
    data: warehouses,
    isLoading2,
    error2,
  } = useGetAllWarehousesQuery(authToken);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addStaff] = useAddStaffMutation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [addNewVisible, setAddNewVisible] = useState(false);

  const showModal = (staffId) => {
    const staff = staffs.data.find((s) => s.id === staffId);
    setSelectedStaff(staff);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = { ...values, trackingId: selectedStaff.id };
    const res = await updateUser({ data, authToken });
    console.log(res);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ userId: selectedStaff.id, authToken });
      setIsModalVisible(false);
      message.success("User deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOkAdd = async () => {
    const values = await formAdd.validateFields();
    const data = { ...values };
    await addStaff({ data, authToken });
    message.success("User added successfully");
    setAddNewVisible(false);
    formAdd.resetFields();
  };

  const handleCancelAdd = () => {
    setAddNewVisible(false);
  };

  if (isLoading || isLoading2) {
    return (
      <div className="">
        <Loading />
      </div>
    );
  }

  if (error || error2) {
    return <Error500 />;
  }

  return (
    <div className="">
      <div className="flex justify-between" style={{paddingLeft:"3rem", paddingTop:"0.5rem"}}>
        <h1 class="mb-2 text-2xl font-semibold text-dark">Staffs</h1>
        <Button
          type="primary"
          style={{ background: "#40A578" }}
          onClick={() => setAddNewVisible(true)}
        >
          Add new staff
        </Button>
      </div>

      <AddStaffModal
        addNewVisible={addNewVisible}
        handleOkAdd={handleOkAdd}
        handleCancelAdd={handleCancelAdd}
        formAdd={formAdd}
        warehouses={warehouses}
      />
      <StaffTable
        staffList={staffs.data}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        showModal={showModal}
      />
      <StaffModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        selectedStaff={selectedStaff}
        form={form}
        warehouses={warehouses}
      />
    </div>
  );
};

export default StaffsComponent;
