
import { Modal, Button, Form, Input, Select } from "antd";
import { useEffect } from "react";

const { Option } = Select;

const ProductModal = ({
  isModalVisible,
  handleOk,
  handleCancel,
  handleDelete,
  selectedProduct,
  form,
  categories,
}) => {
  useEffect(() => {
    if (selectedProduct) {
      form.setFieldsValue({
        name: selectedProduct.name,
        description: selectedProduct.description,
        categoryId: selectedProduct.category.id,
      });
    }
  }, [selectedProduct, form]);

  return (
    <Modal
      title="Product Details"
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
      {selectedProduct && (
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the product name!' }]}>
            <Input placeholder="Product Name" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the product description!' }]}>
            <Input placeholder="Product Description" />
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
      )}
    </Modal>
  );
};

export default ProductModal;
