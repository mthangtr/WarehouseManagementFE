import React from 'react';
import { Modal, Button, Form, Input } from 'antd';

const ZoneAddModal = ({ visible, handleOk, handleCancel, form }) => {
  return (
    <Modal
      title="New Zone"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the zone name!' }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ZoneAddModal;
