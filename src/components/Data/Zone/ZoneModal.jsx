
import React, { useEffect } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const ZoneModal = ({ visible, handleOk, handleCancel, handleDelete, selectedZone, form }) => {
  useEffect(() => {
    if (selectedZone) {
      form.setFieldsValue({
        name: selectedZone.name,
        description: selectedZone.description,
      });
    }
  }, [selectedZone, form]);

  return (
    <Modal
      title="Zone Details"
      visible={visible}
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
      {selectedZone && (
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the zone name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the zone description!' }]}>
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ZoneModal;
