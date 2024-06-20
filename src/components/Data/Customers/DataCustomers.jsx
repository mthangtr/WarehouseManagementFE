import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../utils/Breadcumbs";
import { useSelector } from "react-redux";
import {
  useGetAllCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerByIdMutation,
  useAddCustomerMutation,
} from "../../../redux/api/customersApiSlice";
import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";
import AddCustomerModal from "./AddCustomerModal";
import { Button, message, Form } from "antd";
import Loading from "../../../utils/Loading";
import Error500 from "../../../utils/Error500";
import './MainDash.css';

const DataCustomers = () => {
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const { data: customers, isLoading, error } = useGetAllCustomersQuery(authToken);
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerByIdMutation();
  const [addCustomer] = useAddCustomerMutation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [addNewVisible, setAddNewVisible] = useState(false);

  const showModal = (customerId) => {
    const customer = customers.data.find((c) => c.id === customerId);
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = { ...values, id: selectedCustomer.id };
    await updateCustomer({ customerId: selectedCustomer.id, formData: data, authToken });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer({ customerId: selectedCustomer.id, authToken });
      setIsModalVisible(false);
      message.success("Customer deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOkAdd = async () => {
    const values = await formAdd.validateFields();
    const data = { ...values };
    await addCustomer({ customerData: data, authToken });
    message.success("Customer added successfully");
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
      <h1>Customers</h1>
      <Button
        type="primary"
        style={{ background: "#40A578" }}
        onClick={() => setAddNewVisible(true)}
      >
        Add new customer
      </Button>
      <AddCustomerModal
        addNewVisible={addNewVisible}
        handleOkAdd={handleOkAdd}
        handleCancelAdd={handleCancelAdd}
        formAdd={formAdd}
      />
      <CustomerTable
        customerList={customers.data}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        showModal={showModal}
      />
      <CustomerModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        selectedCustomer={selectedCustomer}
        form={form}
      />
    </div>
  );
};

export default DataCustomers;
