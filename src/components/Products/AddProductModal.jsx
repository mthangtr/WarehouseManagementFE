import { Modal, Button, Form, Input, Select } from "antd";
const { Option } = Select;

const AddProductModal = ({
  addNewVisible,
  handleOkAdd,
  handleCancelAdd,
  formAdd,
  categories,
}) => {
  return (
    <Modal
      title="New Product"
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
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the product name!' }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the product description!' }]}>
          <Input placeholder="Description" />
        </Form.Item>
        <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
