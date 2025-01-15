import { Modal, Button, Form, Input } from "antd";

const AddWarehouseModal = ({
  addNewVisible,
  handleOkAdd,
  handleCancelAdd,
  formAdd,
}) => {
  return (
    <Modal
      title="New Warehouse"
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
        <Form.Item label="Name" name="name">
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="description" />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input placeholder="address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddWarehouseModal;
