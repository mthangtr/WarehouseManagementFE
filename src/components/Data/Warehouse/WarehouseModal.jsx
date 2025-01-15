

// import { Modal, Button, Form, Input } from "antd";
// import { useEffect } from "react";

// const WarehouseModal = ({
//   isModalVisible,
//   handleOk,
//   handleCancel,
//   handleDelete,
//   selectedWarehouse,
//   form,
// }) => {
//   useEffect(() => {
//     if (selectedWarehouse) {
//       form.setFieldsValue({
//         name: selectedWarehouse.name,
//         description: selectedWarehouse.description,
//         address: selectedWarehouse.address,
//       });
//     }
//   }, [selectedWarehouse, form]);

//   return (
//     <Modal
//       title="Warehouse Details"
//       visible={isModalVisible}
//       onOk={handleOk}
//       onCancel={handleCancel}
//       footer={[
//         <Button key="delete" type="primary" danger onClick={handleDelete}>
//           Delete
//         </Button>,
//         <Button key="cancel" onClick={handleCancel}>
//           Cancel
//         </Button>,
//         <Button key="submit" type="primary" onClick={handleOk}>
//           Save
//         </Button>,
//       ]}
//     >
//       {selectedWarehouse && (
//         <Form form={form} layout="vertical">
//           <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the warehouse name!' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the warehouse description!' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the warehouse address!' }]}>
//             <Input />
//           </Form.Item>
//         </Form>
//       )}
//     </Modal>
//   );
// };

// export default WarehouseModal;

import { Modal, Button, Form, Input } from "antd";
import { useEffect } from "react";

const WarehouseModal = ({
  isModalVisible,
  handleOk,
  handleCancel,
  handleDelete,
  selectedWarehouse,
  form,
}) => {
  useEffect(() => {
    if (selectedWarehouse) {
      form.setFieldsValue({
        name: selectedWarehouse.name,
        description: selectedWarehouse.description,
        address: selectedWarehouse.address,
      });
    }
  }, [selectedWarehouse, form]);

  const onFinish = (values) => {
    handleOk(values);
  };

  return (
    <Modal
      title="Warehouse Details"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="delete" type="primary" danger onClick={handleDelete}>
          Delete
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      {selectedWarehouse && (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the warehouse name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the warehouse description!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the warehouse address!' }]}>
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default WarehouseModal;



