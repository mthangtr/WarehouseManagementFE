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
import Breadcrumbs from "../../utils/Breadcumbs";
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import { useGetAllWarehousesQuery } from "../../redux/api/warehousesApiSlice";
import { useGetAllZonesQuery } from "../../redux/api/zoneApiSlice";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice";
import { useGetAllCustomersQuery } from "../../redux/api/customersApiSlice";
import { useGetAllInventoriesQuery } from "../../redux/api/inventoryApiSlice";
import { useSelector } from "react-redux";
import { useAddExportMutation } from "../../redux/api/exportApiSlice";
import { useAddCustomerMutation } from "../../redux/api/customersApiSlice";
import { useCreateExportDetailsMutation } from "../../redux/api/exportDetailApiSlice";
import AutoSelectModal from "../../components/Orders/AutoSelectModal";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import moment from "moment";

const { Option } = Select;
const { Step } = Steps;

export const FormatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

const StaffAddExport = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const warehouseId = userInfo.userInfo.data.warehouseId;
  const [addExport, { isLoading: isExportCreating }] = useAddExportMutation();
  const [addCustomer, { isLoading: isCustomerCreating }] =
    useAddCustomerMutation();
  const [createExportDetails, { isLoading: isExportDetailsCreating }] =
    useCreateExportDetailsMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [filteredInventories, setFilteredInventories] = useState([]);

  const warehousesData = warehouses?.data || [];
  const zonesData = zones?.data || [];
  const productsData = products?.data || [];
  const customersData = customers?.data || [];
  const inventoriesData = inventories?.data || [];

  const [formData, setFormData] = useState({
    description: "",
    status: "PENDING",
    exportDate: "",
    exportType: "",
    warehouseIdFrom: userInfo.userInfo.data.warehouseId || null,
    warehouseIdTo: null,
    customerId: null,
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!isInventoryLoading && inventories) {
      const filteredInventories = inventoriesData.filter((inv) =>
        zonesData.find(
          (zone) => zone.id === inv.zone.id && zone.warehouseId === warehouseId
        )
      );
      setFilteredInventories(filteredInventories);

      const productIdsInInventory = new Set(
        filteredInventories.map((inv) => inv.product.id)
      );
      const filteredProductsList = productsData.filter((product) =>
        productIdsInInventory.has(product.id)
      );
      setFilteredProducts(filteredProductsList);
    }
  }, [
    isInventoryLoading,
    inventoriesData,
    warehouseId,
    zonesData,
    productsData,
  ]);

  const handleFormChange = (changedValues) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...changedValues,
    }));
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
      } else {
        let isValid = true;
        for (let i = 0; i < selectedProducts.length; i++) {
          const product = selectedProducts[i];
          if (
            !product.id ||
            !product.zoneId ||
            !product.expiredAt ||
            !product.quantity
          ) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          setCurrentStep(current);
        } else {
          message.error("Please fill out all product fields.");
        }
      }
    } else {
      setCurrentStep(current);
    }
  };

  const handleNext = () => {
    handleStepChange(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateExport = async () => {
    try {
      let exportData = {
        description: formData.description,
        status: formData.status,
        exportDate: formData.exportDate,
        exportType: formData.exportType,
        warehouseIdFrom: formData.warehouseIdFrom,
        warehouseIdTo: formData.warehouseIdTo,
        customerId: formData.customerId,
      };

      const response = await addExport({
        data: exportData,
        authToken,
      }).unwrap();
      message.success("Export created successfully!");
      const exportId = response.data.id;
      await handleCreateExportDetails(exportId);
      navigate("/staff/order/export");
    } catch (error) {
      message.error("Failed to create export. Please try again.");
    }
  };

  const handleCreateExportDetails = async (exportId) => {
    try {
      const selectedProductDetails = selectedProducts.map((product) => {
        const item = inventoriesData.find(
          (inv) =>
            inv.product.id === product.id &&
            inv.zone.id === product.zoneId &&
            inv.expiredAt === product.expiredAt
        );
        return {
          productId: item.product.id,
          exportId: exportId,
          quantity: product.quantity,
          expiredAt: item.expiredAt,
          zoneId: item.zone.id,
        };
      });
      await createExportDetails({
        data: selectedProductDetails,
        authToken,
      }).unwrap();

      message.success("Export details created successfully!");
      setSelectedProducts([]);
    } catch (error) {
      message.error("Failed to create export details. Please try again.");
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { id: null, name: "", zoneId: null, expiredAt: null, quantity: 1 },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  const handleDropdownChange = (value, index, type) => {
    const newSelectedProducts = [...selectedProducts];

    if (type === "product") {
      const product = productsData.find((p) => p.id === value);
      newSelectedProducts[index].id = product.id;
      newSelectedProducts[index].name = product.name;
      newSelectedProducts[index].zoneId = null;
      newSelectedProducts[index].expiredAt = null;
      newSelectedProducts[index].quantity =
        newSelectedProducts[index].quantity || 1;
    } else if (type === "zone") {
      newSelectedProducts[index].zoneId = value;
      newSelectedProducts[index].expiredAt = null;
    } else if (type === "expiredAt") {
      newSelectedProducts[index].expiredAt = value;
    }

    setSelectedProducts(newSelectedProducts);
  };

  const handleProductSelectChange = (autoSelectedProducts) => {
    const newSelectedProducts = autoSelectedProducts.map((product) => ({
      id: product.product.id,
      name: product.product.name,
      zoneId: product.zone.id,
      zoneName: product.zone.name,
      expiredAt: product.expiredAt,
      quantity: product.quantity,
    }));
    console.log("newSelectedProducts", newSelectedProducts);
    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (value, index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = value;
    setSelectedProducts(newSelectedProducts);
  };

  const getUniqueZones = (productId) => {
    return zonesData.filter((zone) =>
      inventoriesData.some(
        (inv) =>
          inv.product.id === productId &&
          inv.zone.id === zone.id &&
          zone.warehouseId === warehouseId &&
          !selectedProducts.some(
            (sp) => sp.zoneId === zone.id && sp.expiredAt === inv.expiredAt
          )
      )
    );
  };

  const getUniqueExpiredAt = (productId, zoneId) => {
    return inventoriesData
      .filter((inv) => inv.product.id === productId && inv.zone.id === zoneId)
      .map((inv) => inv.expiredAt)
      .filter(
        (expiredAt) =>
          !selectedProducts.some(
            (sp) => sp.zoneId === zoneId && sp.expiredAt === expiredAt
          )
      );
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

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

  const dataSource = selectedProducts.map((product, index) => {
    const productItem = productsData.find((p) => p.id === product.id);
    const zoneItem = zonesData.find((z) => z.id === product.zoneId);
    return {
      key: index,
      name: productItem?.name,
      zone: zoneItem?.name,
      expiredAt: FormatTime(product.expiredAt),
      quantity: product.quantity,
    };
  });

  return (
    <div>
      <Breadcrumbs />
      <div className="relative">
        <h1 className="font-bold text-3xl text-center py-4">New Export</h1>
        <Row justify="center">
          <Col xs={24} md={20} lg={16}>
            <Steps
              current={currentStep}
              onChange={handleStepChange}
              labelPlacement="vertical"
              style={{ marginBottom: 24 }}
            >
              <Step description="Export Information" />
              <Step description="Select Products" />
              <Step description="Review and Confirm" />
            </Steps>
            {currentStep === 0 && (
              <Form
                form={form}
                layout="vertical"
                initialValues={{ formData, exportDate: currentDate }}
                onValuesChange={handleFormChange}
              >
                <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
                  Export Information
                </h2>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input the export description!",
                    },
                  ]}
                >
                  <Input placeholder="Product Description" />
                </Form.Item>
                <Form.Item
                  label="Export Type"
                  name="exportType"
                  rules={[
                    { required: true, message: "Please select export type!" },
                  ]}
                >
                  <Select placeholder="Select export type...">
                    <Option value="CUSTOMER">CUSTOMER</Option>
                    <Option value="WAREHOUSE">WAREHOUSE</Option>
                    <Option value="WASTE">WASTE</Option>
                  </Select>
                </Form.Item>
                {formData.exportType === "CUSTOMER" && (
                  <Form.Item
                    label="Customer"
                    name="customerId"
                    rules={[
                      { required: true, message: "Please select customer!" },
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
                )}
                {formData.exportType === "WAREHOUSE" && (
                  <Form.Item
                    label="To:"
                    name="warehouseIdTo"
                    rules={[
                      {
                        required: true,
                        message: "Please select warehouse to transfer!",
                      },
                    ]}
                  >
                    <Select placeholder="Select warehouse to...">
                      {warehousesData
                        .filter(
                          (warehouse) =>
                            warehouse.id !== formData.warehouseIdFrom
                        )
                        .map((warehouse) => (
                          <Option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}
                <Form.Item
                  label="Export Date"
                  name="exportDate"
                  rules={[
                    { required: true, message: "Please select export date!" },
                  ]}
                >
                  <Input disabled={true} type="date" />
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
                <div className="flex justify-start gap-1 mb-2">
                  <Button
                    type="default"
                    size="middle"
                    style={{
                      backgroundColor: "#2A2A2A",
                      color: "#ffffff",
                    }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <AutorenewOutlinedIcon /> Auto Select
                  </Button>
                  <Button
                    size="middle"
                    type="primary"
                    onClick={handleAddProduct}
                  >
                    <AddOutlinedIcon /> Product
                  </Button>
                  <AutoSelectModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onProductSelect={handleProductSelectChange}
                  />
                </div>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {selectedProducts.map((product, index) => {
                    const uniqueZones = getUniqueZones(product.id);
                    const uniqueExpiredAt = getUniqueExpiredAt(
                      product.id,
                      product.zoneId
                    );

                    return (
                      <div
                        key={index}
                        style={{
                          marginBottom: "20px",
                          border: "1px solid black",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Product Name">
                              <Select
                                showSearch
                                placeholder="Select product"
                                value={product.id}
                                onChange={(value) =>
                                  handleDropdownChange(value, index, "product")
                                }
                                style={{ width: "100%" }}
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                optionFilterProp="children"
                              >
                                {filteredProducts.map((p) => (
                                  <Option key={p.id} value={p.id}>
                                    {p.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Zone">
                              <Select
                                placeholder="Select zone"
                                value={product.zoneId}
                                onChange={(value) =>
                                  handleDropdownChange(value, index, "zone")
                                }
                                style={{ width: "100%" }}
                                disabled={!product.id}
                              >
                                {uniqueZones.map((zone) => (
                                  <Option key={zone.id} value={zone.id}>
                                    {zone.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item label="Expired Date">
                          <Select
                            placeholder="Select expired date"
                            value={FormatTime(product.expiredAt)}
                            onChange={(value) =>
                              handleDropdownChange(value, index, "expiredAt")
                            }
                            style={{ width: "100%" }}
                            disabled={!product.zoneId}
                          >
                            {uniqueExpiredAt.map((expiredAt) => (
                              <Option key={expiredAt} value={expiredAt}>
                                {FormatTime(expiredAt)}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Quantity">
                              <InputNumber
                                min={1}
                                max={
                                  inventoriesData.find(
                                    (inv) =>
                                      inv.product.id === product.id &&
                                      inv.zone.id === product.zoneId &&
                                      inv.expiredAt === product.expiredAt
                                  )?.quantity || 1
                                }
                                value={product.quantity}
                                onChange={(value) =>
                                  handleQuantityChange(value, index)
                                }
                                style={{ width: "100%" }}
                                disabled={
                                  !product.id ||
                                  !product.zoneId ||
                                  !product.expiredAt
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Inventory Quantity">
                              <Input
                                value={
                                  inventoriesData.find(
                                    (inv) =>
                                      inv.product.id === product.id &&
                                      inv.zone.id === product.zoneId &&
                                      inv.expiredAt === product.expiredAt
                                  )?.quantity || 0
                                }
                                readOnly
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button
                          type="link"
                          danger
                          onClick={() => handleRemoveProduct(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-4 items-center gap-2">
                  <Button size="large" onClick={handlePrev}>
                    Previous
                  </Button>
                  <Button size="large" type="primary" onClick={handleNext}>
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
                      <Form.Item label="Export Type">
                        <Input value={formData.exportType} readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Export Date">
                        <Input
                          value={FormatTime(formData.exportDate)}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    {formData.exportType === "CUSTOMER" && (
                      <Col span={12}>
                        <Form.Item label="Customer">
                          <Input
                            value={
                              customersData.find(
                                (customer) =>
                                  customer.id === formData.customerId
                              )?.name
                            }
                            readOnly
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {formData.exportType === "WAREHOUSE" && (
                      <Col span={12}>
                        <Form.Item label="To">
                          <Input
                            value={
                              warehousesData.find(
                                (warehouse) =>
                                  warehouse.id === formData.warehouseIdTo
                              )?.name
                            }
                            readOnly
                          />
                        </Form.Item>
                      </Col>
                    )}
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
                        title: "Zone",
                        dataIndex: "zone",
                        key: "zone",
                      },
                      {
                        title: "Expired At",
                        dataIndex: "expiredAt",
                        key: "expiredAt",
                        render: (text) => <span>{FormatTime(text)}</span>,
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                    ]}
                    dataSource={dataSource}
                    pagination={false}
                  />
                </div>
                <div
                  className="flex justify-end mt-4"
                  style={{ width: "100%" }}
                >
                  <Button onClick={handlePrev} style={{ marginRight: "8px" }}>
                    Previous
                  </Button>
                  <Button type="primary" onClick={handleCreateExport} block>
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

export default StaffAddExport;
