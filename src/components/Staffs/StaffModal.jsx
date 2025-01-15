
import { Modal, Button, Form, Input, Select } from "antd";
import { useEffect } from "react";

const StaffModal = ({
  isModalVisible,
  handleOk,
  handleCancel,
  handleDelete,
  selectedStaff,
  form,
  warehouses,
}) => {
  useEffect(() => {
    if (selectedStaff) {
      form.setFieldsValue({
        fullName: selectedStaff.fullName,
        email: selectedStaff.email,
        phone: selectedStaff.phone,
        address: selectedStaff.address,
        role: selectedStaff.role,
        warehouseId: selectedStaff.warehouse?.id,
      });
    }
  }, [selectedStaff, form]);

  return (
    <Modal
      title="Staff Details"
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
      {selectedStaff && (
        <Form form={form} layout="vertical">
          <Form.Item label="Full Name" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select>
              <Select.Option value="STAFF">STAFF</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Warehouse" name="warehouseId">
            <Select>
              {warehouses?.data?.map((warehouse) => (
                <Select.Option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default StaffModal;
