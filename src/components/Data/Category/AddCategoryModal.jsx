import { Modal, Button, Form, Input } from "antd";

const AddCategoryModal = ({
  addNewVisible,
  handleOkAdd,
  handleCancelAdd,
  formAdd,
}) => {
  return (
    <Modal
      title="New Category"
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
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the category name!' }]}>
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
