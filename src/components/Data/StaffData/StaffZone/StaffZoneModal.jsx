import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, List } from 'antd';
import { useGetInventoriesByZoneIdQuery } from '../../../../redux/api/inventoryApiSlice';
import Loading from '../../../../utils/Loading';
import Error500 from '../../../../utils/Error500';

const StaffZoneModal = ({ visible, handleOk, handleCancel, handleDelete, selectedZone, form, authToken }) => {
  const { data: inventories, isLoading, error } = useGetInventoriesByZoneIdQuery({ id: selectedZone?.id, authToken });

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
      title="Inventory List"
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
        <>
          
          {isLoading ? (
            <Loading/>
          ) : error ? (
            <Error500/>
          ) : (
            <List
              header={<div>Inventory List</div>}
              bordered
              dataSource={inventories || []}
              renderItem={item => (
                <List.Item>
                  {item.product.name} - {item.quantity}
                </List.Item>
              )}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default StaffZoneModal;
