import { Modal, Button, Form, Input } from "antd";
import { useEffect } from "react";

const CustomerModal = ({
  isModalVisible,
  handleOk,
  handleCancel,
  handleDelete,
  selectedCustomer,
  form,
}) => {
  useEffect(() => {
    if (selectedCustomer) {
      form.setFieldsValue({
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
      });
    }
  }, [selectedCustomer, form]);

  return (
    <Modal
      title="Edit Customer"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="delete" type="primary" danger onClick={handleDelete}>
          Delete
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      {selectedCustomer && (
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the customer name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the customer email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input the customer phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the customer address!' }]}>
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CustomerModal;
