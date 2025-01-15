
import { Modal, Button, Form, Input } from "antd";
import { useEffect } from "react";

const CategoryModal = ({
  isModalVisible,
  handleOk,
  handleCancel,
  handleDelete,
  selectedCategory,
  form,
}) => {
  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    }
  }, [selectedCategory, form]);

  return (
    <Modal
      title="Edit Category"
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
      {selectedCategory && (
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the category name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the category description!' }]}>
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default CategoryModal;
