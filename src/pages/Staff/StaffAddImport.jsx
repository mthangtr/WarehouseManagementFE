import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  InputNumber,
  Steps,
  Table,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Breadcrumbs from "../../utils/Breadcumbs";
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import { useGetAllWarehousesQuery } from "../../redux/api/warehousesApiSlice";
import { useGetAllZonesQuery } from "../../redux/api/zoneApiSlice";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice";
import { useGetAllCustomersQuery } from "../../redux/api/customersApiSlice";
import { useGetAllInventoriesQuery } from "../../redux/api/inventoryApiSlice";
import { useSelector } from "react-redux";
import { useAddImportMutation } from "../../redux/api/importApiSlice";
import { useAddCustomerMutation } from "../../redux/api/customersApiSlice";
import { useCreateImportDetailsMutation } from "../../redux/api/importDetailApiSlice";

const { Option } = Select;
const { Step } = Steps;

const StaffAddImport = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const warehouseId = userInfo.userInfo.data.warehouseId;
  const [addImport, { isLoading: isImportCreating }] = useAddImportMutation();
  const [addCustomer, { isLoading: isCustomerCreating }] =
    useAddCustomerMutation();
  const [createImportDetails, { isLoading: isImportDetailsCreating }] =
    useCreateImportDetailsMutation();

  const {
    data: warehouses,
    isFetching: isWarehouseLoading,
    error: warehouseError,
  } = useGetAllWarehousesQuery(authToken);
  const {
    data: zones,
    isFetching: isZoneLoading,
    error: zoneError,
  } = useGetAllZonesQuery(authToken);
  const {
    data: products,
    isFetching: isProductLoading,
    error: productError,
  } = useGetAllProductsQuery(authToken);
  const {
    data: customers,
    isFetching: isCustomerLoading,
    error: customerError,
  } = useGetAllCustomersQuery(authToken);
  const {
    data: inventories,
    isFetching: isInventoryLoading,
    error: inventoryError,
  } = useGetAllInventoriesQuery(authToken);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productZones, setProductZones] = useState({});

  const warehousesData = warehouses?.data || [];
  const zonesData =
    zones?.data.filter((zone) => zone.warehouseId === warehouseId) || [];
  const productsData = products?.data || [];
  const customersData = customers?.data || [];
  const inventoriesData = inventories?.data || [];

  const [formData, setFormData] = useState({
    description: "",
    status: "SUCCEED",
    importType: "CUSTOMER",
    transferKey: "",
    warehouseIdFrom: null,
    warehouseIdTo: warehouseId,
    customerId: null,
  });

  const handleFormChange = (changedValues) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...changedValues,
    }));
  };

  const handleProductSelectChange = (value, index) => {
    const product = productsData.find((p) => p.id === value);
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = {
      ...newSelectedProducts[index],
      productId: product.id,
      name: product.name,
    };
    setSelectedProducts(newSelectedProducts);
  };

  const handleZoneAllocationChange = (
    productIndex,
    zoneIndex,
    field,
    value
  ) => {
    const newProductZones = { ...productZones };
    if (!newProductZones[productIndex]) {
      newProductZones[productIndex] = [];
    }
    if (!newProductZones[productIndex][zoneIndex]) {
      newProductZones[productIndex][zoneIndex] = {};
    }
    newProductZones[productIndex][zoneIndex][field] = value;
    setProductZones(newProductZones);
  };

  const handleAddZone = (productIndex) => {
    const newProductZones = { ...productZones };
    if (!newProductZones[productIndex]) {
      newProductZones[productIndex] = [];
    }
    newProductZones[productIndex].push({ zoneId: null, quantity: 0 });
    setProductZones(newProductZones);
  };

  const handleRemoveZone = (productIndex, zoneIndex) => {
    const newProductZones = { ...productZones };
    if (newProductZones[productIndex]) {
      newProductZones[productIndex].splice(zoneIndex, 1);
      if (newProductZones[productIndex].length === 0) {
        delete newProductZones[productIndex];
      }
      setProductZones(newProductZones);
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: null,
        name: "",
        expiredAt: "",
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);

    const newProductZones = { ...productZones };
    delete newProductZones[index];
    setProductZones(newProductZones);
  };

  const handleStepChange = async (current) => {
    if (currentStep === 0 && current === 1) {
      try {
        await form.validateFields();
        setCurrentStep(current);
      } catch (error) {
        message.error("Please fill out all required fields.");
      }
    } else if (currentStep === 1 && current === 2) {
      if (selectedProducts.length === 0) {
        message.error("Please add at least one product.");
        return;
      }

      let isValid = true;
      for (let i = 0; i < selectedProducts.length; i++) {
        const product = selectedProducts[i];
        if (!product.productId || !product.expiredAt) {
          isValid = false;
          break;
        }
        const zones = productZones[i] || [];
        if (zones.length === 0) {
          isValid = false;
          break;
        }
        for (let j = 0; j < zones.length; j++) {
          const zone = zones[j];
          if (!zone.zoneId || !zone.quantity) {
            isValid = false;
            break;
          }
        }
      }

      if (isValid) {
        setCurrentStep(current);
      } else {
        message.error(
          "Please fill out all product fields and add at least one zone for each product."
        );
      }
    } else {
      setCurrentStep(current);
    }
  };

  const handleNext = () => {
    handleStepChange(currentStep + 1);
  };

  const handlePrev = () => {
    handleStepChange(currentStep - 1);
  };

  const handleCreateImport = async () => {
    try {
      let importData = {
        description: formData.description,
        status: formData.status,
        importType: formData.importType,
        transferKey: formData.transferKey || null,
        warehouseIdFrom: formData.warehouseIdFrom || null,
        warehouseIdTo: formData.warehouseIdTo,
        customerId: formData.customerId,
      };

      const response = await addImport({
        data: importData,
        authToken,
      }).unwrap();

      message.success("Import created successfully!");

      const importId = response.data.id;
      await handleCreateImportDetails(importId);
      navigate("/staff/order/import");
    } catch (error) {
      message.error("Failed to create import. Please try again.");
    }
  };

  const handleCreateImportDetails = async (importId = null) => {
    try {
      const importDetails = selectedProducts.flatMap((product, productIndex) =>
        productZones[productIndex].map((zone) => ({
          productId: product.productId,
          importId: importId,
          quantity: zone.quantity,
          zoneId: zone.zoneId,
          expiredAt: product.expiredAt,
        }))
      );

      const detailsResponse = await createImportDetails({
        data: importDetails,
        authToken,
      }).unwrap();
      message.success("Import details created successfully!");
      setSelectedProducts([]);
      setProductZones({});
    } catch (error) {
      message.error("Failed to create import details. Please try again.");
    }
  };

  const getAvailableProducts = () => {
    const selectedProductIds = selectedProducts.map(
      (product) => product.productId
    );
    return productsData.filter(
      (product) => !selectedProductIds.includes(product.id)
    );
  };

  const getAvailableZones = (productIndex) => {
    const selectedZoneIds = (productZones[productIndex] || []).map(
      (zone) => zone.zoneId
    );
    return zonesData.filter((zone) => !selectedZoneIds.includes(zone.id));
  };

  if (
    isWarehouseLoading ||
    isZoneLoading ||
    isProductLoading ||
    isCustomerLoading ||
    isInventoryLoading
  )
    return <Loading />;
  if (
    warehouseError ||
    zoneError ||
    productError ||
    customerError ||
    inventoryError
  )
    return <Error500 />;

  return (
    <div>
      <Breadcrumbs />
      <div className="relative">
        <h1 className="font-bold text-3xl text-center py-4">New Import</h1>
        <Row justify="center">
          <Col xs={24} md={20} lg={16}>
            <Steps
              current={currentStep}
              onChange={handleStepChange}
              labelPlacement="vertical"
              style={{ marginBottom: 24 }}
            >
              <Step description="Import Information" />
              <Step description="Select Products" />
              <Step description="Review and Confirm" />
            </Steps>
            {currentStep === 0 && (
              <Form
                form={form}
                layout="vertical"
                initialValues={formData}
                onValuesChange={handleFormChange}
                style={{ margin: "0 auto", marginTop: "20px" }}
              >
                <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
                  Import Information
                </h2>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input the import description!",
                    },
                  ]}
                >
                  <Input placeholder="Product Description" />
                </Form.Item>
                <Form.Item
                  label="Import Type"
                  name="importType"
                  rules={[
                    { required: true, message: "Please select import type!" },
                  ]}
                >
                  <Input value="CUSTOMER" readOnly />
                </Form.Item>
                <Form.Item
                  label="Customer"
                  name="customerId"
                  rules={[
                    { required: true, message: "Please select a customer!" },
                  ]}
                >
                  <Select placeholder="Select customer...">
                    {customersData.map((customer) => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button type="primary" onClick={handleNext} block>
                  Next
                </Button>
              </Form>
            )}
            {currentStep === 1 && (
              <div
                style={{
                  border: "1px solid black",
                  padding: "20px",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              >
                <Button
                  type="primary"
                  onClick={handleAddProduct}
                  block
                  style={{ marginBottom: "20px" }}
                >
                  Add Product
                </Button>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {selectedProducts.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      style={{
                        marginBottom: "20px",
                        border: "1px solid black",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Product Name"
                            name={`productId_${productIndex}`}
                            rules={[
                              {
                                required: true,
                                message: "Please select a product!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select product"
                              value={product.productId}
                              onChange={(value) =>
                                handleProductSelectChange(value, productIndex)
                              }
                              style={{ width: "100%" }}
                            >
                              {getAvailableProducts().map((p) => (
                                <Option key={p.id} value={p.id}>
                                  {p.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Expired At"
                            name={`expiredAt_${productIndex}`}
                            rules={[
                              {
                                required: true,
                                message: "Please select an expiration date!",
                              },
                            ]}
                          >
                            <Input
                              type="date"
                              value={product.expiredAt}
                              onChange={(e) => {
                                const newSelectedProducts = [
                                  ...selectedProducts,
                                ];
                                newSelectedProducts[productIndex].expiredAt =
                                  e.target.value;
                                setSelectedProducts(newSelectedProducts);
                              }}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={24}>
                          {productZones[productIndex]?.map(
                            (zone, zoneIndex) => (
                              <Row gutter={8} key={zoneIndex}>
                                <Col span={10}>
                                  <Form.Item
                                    label={`Zone`}
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    name={`zone_${productIndex}_${zoneIndex}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select a zone!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder="Select zone"
                                      value={zone.zoneId}
                                      onChange={(value) =>
                                        handleZoneAllocationChange(
                                          productIndex,
                                          zoneIndex,
                                          "zoneId",
                                          value
                                        )
                                      }
                                      style={{ width: "100%" }}
                                    >
                                      {zonesData.map((zone) => (
                                        <Option key={zone.id} value={zone.id}>
                                          {zone.name}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={10}>
                                  <Form.Item
                                    label="Quantity"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    name={`quantity_${productIndex}_${zoneIndex}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter a quantity!",
                                      },
                                    ]}
                                  >
                                    <InputNumber
                                      min={1}
                                      value={zone.quantity}
                                      onChange={(value) =>
                                        handleZoneAllocationChange(
                                          productIndex,
                                          zoneIndex,
                                          "quantity",
                                          value
                                        )
                                      }
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Button
                                    type="danger"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() =>
                                      handleRemoveZone(productIndex, zoneIndex)
                                    }
                                    style={{ width: "100%" }}
                                  />
                                </Col>
                              </Row>
                            )
                          )}
                        </Col>
                      </Row>
                      <Button
                        type="dashed"
                        onClick={() => handleAddZone(productIndex)}
                        style={{ width: "100%", marginTop: "10px" }}
                      >
                        <PlusOutlined /> Add Zone
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleRemoveProduct(productIndex)}
                        style={{ marginTop: "10px" }}
                      >
                        Remove Product
                      </Button>
                    </div>
                  ))}
                </div>
                <div
                  className="flex justify-end mt-4"
                  style={{ width: "100%" }}
                >
                  <Button onClick={handlePrev} style={{ marginRight: "8px" }}>
                    Previous
                  </Button>
                  <Button type="primary" onClick={handleNext} block>
                    Next
                  </Button>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div
                style={{
                  border: "1px solid black",
                  padding: "20px",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Review and Confirm
                </h1>
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Description">
                        <Input value={formData.description} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Import Type">
                        <Input value={formData.importType} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Customer">
                        <Input
                          value={
                            customersData.find(
                              (customer) => customer.id === formData.customerId
                            )?.name
                          }
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <h3
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Selected Products
                </h3>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table
                    columns={[
                      { title: "Product Name", dataIndex: "name", key: "name" },
                      {
                        title: "Expired At",
                        dataIndex: "expiredAt",
                        key: "expiredAt",
                      },
                      {
                        title: "Zone",
                        dataIndex: "zoneId",
                        key: "zoneId",
                        render: (zoneId) => {
                          const zone = zonesData.find((z) => z.id === zoneId);
                          return zone ? zone.name : "N/A";
                        },
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                    ]}
                    dataSource={selectedProducts.flatMap(
                      (product, productIndex) =>
                        productZones[productIndex].map((zone, zoneIndex) => ({
                          key: `${productIndex}-${zoneIndex}`,
                          name: product.name,
                          expiredAt: product.expiredAt,
                          zoneId: zone.zoneId,
                          quantity: zone.quantity,
                        }))
                    )}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                  />
                </div>
                <div
                  className="flex justify-end mt-4"
                  style={{ width: "100%" }}
                >
                  <Button onClick={handlePrev} style={{ marginRight: "8px" }}>
                    Previous
                  </Button>
                  <Button type="primary" onClick={handleCreateImport} block>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StaffAddImport;
