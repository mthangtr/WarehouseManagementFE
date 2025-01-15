import { Modal, Button, Form, Input } from "antd";

const AddCustomerModal = ({
  addNewVisible,
  handleOkAdd,
  handleCancelAdd,
  formAdd,
}) => {
  return (
    <Modal
      title="New Customer"
      visible={addNewVisible}
      onOk={handleOkAdd}
      onCancel={handleCancelAdd}
      footer={[
        <Button key="cancel" onClick={handleCancelAdd}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOkAdd}>
          Save
        </Button>,
      ]}
    >
      <Form form={formAdd} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the customer name!' }]}>
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the customer email!' }]}>
          <Input placeholder="email" />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input the customer phone number!' }]}>
          <Input placeholder="phone" />
        </Form.Item>
        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the customer address!' }]}>
          <Input placeholder="address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
