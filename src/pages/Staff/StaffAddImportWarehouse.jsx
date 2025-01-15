import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  List,
  Card,
  Grid,
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
import {
  useGetAllExportsQuery,
  useUpdateExportWithRequestMutation,
} from "../../redux/api/exportApiSlice";
import { useGetAllExportDetailsQuery } from "../../redux/api/exportDetailApiSlice";
import { useSelector } from "react-redux";
import { useAddImportMutation } from "../../redux/api/importApiSlice";
import { useAddCustomerMutation } from "../../redux/api/customersApiSlice";
import { useCreateImportDetailsMutation } from "../../redux/api/importDetailApiSlice";

const { Option } = Select;
const { Step } = Steps;
const { useBreakpoint } = Grid;

const generateRandomString = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const StaffAddImportWarehouse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const warehouseId = userInfo.userInfo.data.warehouseId;
  const [addImport, { isLoading: isImportCreating }] = useAddImportMutation();
  const [addCustomer, { isLoading: isCustomerCreating }] =
    useAddCustomerMutation();
  const [createImportDetails, { isLoading: isImportDetailsCreating }] =
    useCreateImportDetailsMutation();
  const [updateExportWithRequest] = useUpdateExportWithRequestMutation();

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
  const {
    data: exports,
    isFetching: isExportLoading,
    error: exportError,
  } = useGetAllExportsQuery(authToken);
  const {
    data: exportDetailsData,
    isFetching: isExportDetailsLoading,
    error: exportDetailsError,
  } = useGetAllExportDetailsQuery(authToken);

  const [exportDetails, setExportDetails] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productZones, setProductZones] = useState({});
  const [selectedExport, setSelectedExport] = useState(null);

  const warehousesData = warehouses?.data || [];
  const zonesData =
    zones?.data.filter((zone) => zone.warehouseId === warehouseId) || [];
  const productsData = products?.data || [];
  const customersData = customers?.data || [];
  const inventoriesData = inventories?.data || [];
  const exportsData = exports?.data || [];
  const exportDetailsDataList = exportDetailsData?.data || [];

  const filteredExports = exportsData.filter(
    (exp) =>
      exp.exportType === "WAREHOUSE" &&
      exp.warehouseTo.id === warehouseId &&
      exp.warehouseFrom.id !== warehouseId &&
      !exp.transferKey
  );

  const [formData, setFormData] = useState({
    description: "",
    status: "SUCCEED",
    importType: "WAREHOUSE",
    transferKey: "",
    warehouseIdFrom: null,
    warehouseIdTo: warehouseId,
  });

  const handleFormChange = (changedValues) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...changedValues,
    }));
  };

  const handleExportSelect = (exportItem) => {
    setSelectedExport(exportItem);

    const updatedFormData = {
      ...formData,
      description: exportItem.description,
      warehouseIdFrom: exportItem.warehouseFrom.id,
    };

    setFormData(updatedFormData);
    form.setFieldsValue(updatedFormData);

    const newSelectedProducts = exportDetailsDataList
      .filter((detail) => detail.export.id === exportItem.id)
      .map((detail) => ({
        productId: detail.product.id,
        name: detail.product.name,
        expiredAt: detail.expiredAt.split("T")[0], // Chuyển đổi định dạng ngày
        quantity: detail.quantity,
      }));

    setSelectedProducts(newSelectedProducts);
    setProductZones({});

    // Console log the export details data
    console.log("Export Details for selected export:", newSelectedProducts);
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

  const handleStepChange = async (current) => {
    if (currentStep === 0 && current === 1) {
      try {
        await form.validateFields();
        console.log("Form Data:", formData);
        setCurrentStep(current);
      } catch (error) {
        message.error("Please fill out all required fields.");
      }
    } else if (currentStep === 1 && (current === 2 || current === 0)) {
      if (selectedProducts.length === 0 && current === 2) {
        message.error("Please add at least one product.");
      } else if (
        current === 2 &&
        selectedProducts.some((product, index) => {
          const totalQuantity = (productZones[index] || []).reduce(
            (sum, zone) => sum + (zone.quantity || 0),
            0
          );
          return totalQuantity !== product.quantity;
        })
      ) {
        message.error(
          "The total quantity in zones must equal the product quantity."
        );
      } else {
        console.log("Selected Products:", selectedProducts);
        console.log("Product Zones:", productZones);
        setCurrentStep(current);
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

  const updateExportTransferKey = async (exportId, transferKey) => {
    const updateExportData = {
      transferKey: transferKey,
    };

    await updateExportWithRequest({
      data: updateExportData,
      exportId: exportId,
      authToken,
    }).unwrap();
  };

  const createImport = async (importData) => {
    const response = await addImport({
      data: importData,
      authToken,
    }).unwrap();

    message.success("Import created successfully!");
    console.log("Response from create import:", response);

    return response.data.id;
  };

  const createImportDetail = async (importId) => {
    const importDetails = selectedProducts.flatMap((product, productIndex) =>
      productZones[productIndex].map((zone) => ({
        productId: product.productId,
        importId: importId,
        quantity: zone.quantity,
        zoneId: zone.zoneId,
        expiredAt: product.expiredAt,
      }))
    );

    console.log("Import details to be sent:", importDetails);
    const detailsResponse = await createImportDetails({
      data: importDetails,
      authToken,
    }).unwrap();
    console.log("Import details created:", detailsResponse);
    message.success("Import details created successfully!");
    setSelectedProducts([]);
    setProductZones({});
  };

  const handleCreateImport = async () => {
    try {
      const transferKey = generateRandomString(); // Tạo giá trị transferKey bất kỳ

      // Cập nhật export với transferKey
      await updateExportTransferKey(selectedExport.id, transferKey);

      let importData = {
        description: formData.description,
        status: formData.status,
        importType: formData.importType,
        transferKey: transferKey,
        warehouseIdFrom: formData.warehouseIdFrom || null,
        warehouseIdTo: formData.warehouseIdTo,
      };

      console.log("Import Data to be sent:", importData);
      if (!importData.warehouseIdTo) {
        throw new Error("warehouseIdTo must not be null");
      }

      const importId = await createImport(importData);

      await createImportDetail(importId);

      // Reset trạng thái
      setSelectedExport(null);
      setSelectedProducts([]);
      setProductZones({});
      setFormData({
        description: "",
        status: "SUCCEED",
        importType: "WAREHOUSE",
        transferKey: "",
        warehouseIdFrom: null,
        warehouseIdTo: warehouseId,
      });
      form.resetFields();

      navigate("/staff/order/import");
    } catch (error) {
      console.error("Error creating import:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      message.error("Failed to create import. Please try again.");
    }
  };

  const getAvailableZones = (productIndex) => {
    const selectedZoneIds = (productZones[productIndex] || []).map(
      (zone) => zone.zoneId
    );
    return zonesData.filter((zone) => !selectedZoneIds.includes(zone.id));
  };

  const screens = useBreakpoint();

  useEffect(() => {
    if (location.state) {
      const { exportItem, exportDetails } = location.state;
      handleExportSelect(exportItem, exportDetails);
    }
  }, [location.state]);

  if (
    isWarehouseLoading ||
    isZoneLoading ||
    isProductLoading ||
    isCustomerLoading ||
    isInventoryLoading ||
    isExportLoading ||
    isExportDetailsLoading
  )
    return <Loading />;
  if (
    warehouseError ||
    zoneError ||
    productError ||
    customerError ||
    inventoryError ||
    exportError ||
    exportDetailsError
  )
    return <Error500 />;

  return (
    <div>
      <Breadcrumbs />
      <div className=" relative">
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <h1
              className="font-bold text-3xl py-4"
              style={{ textAlign: "center" }}
            >
              Import from Warehouse
            </h1>
            <Steps
              current={currentStep}
              onChange={handleStepChange}
              labelPlacement="vertical"
              style={{ marginBottom: 24, maxWidth: "80%", margin: "0 auto" }}
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
                style={{ maxWidth: "80%", margin: "0 auto", marginTop: "20px" }}
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
                  <Input value="WAREHOUSE" readOnly />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={handleNext}
                  style={{ width: "100%" }}
                >
                  Next
                </Button>
              </Form>
            )}
            {currentStep === 1 && (
              <div
                style={{
                  maxWidth: "80%",
                  margin: "0 auto",
                  border: "1px solid black",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
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
                          <Form.Item label="Product Name">
                            <Input value={product.name} readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Expired At">
                            <Input
                              type="date"
                              value={product.expiredAt}
                              readOnly
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Quantity">
                            <Input value={product.quantity} readOnly />
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
                                  >
                                    <Select
                                      placeholder="Select zone"
                                      value={zone.name}
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
                                      {getAvailableZones(productIndex).map(
                                        (zone) => (
                                          <Option key={zone.id} value={zone.id}>
                                            {zone.name}
                                          </Option>
                                        )
                                      )}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={10}>
                                  <Form.Item
                                    label="Quantity"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
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
                          <Button
                            type="dashed"
                            onClick={() => handleAddZone(productIndex)}
                            style={{ width: "100%", marginTop: "10px" }}
                          >
                            <PlusOutlined /> Add Zone
                          </Button>
                        </Col>
                      </Row>
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
                  <Button
                    type="primary"
                    onClick={handleNext}
                    style={{ width: "100%" }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div
                style={{
                  maxWidth: "80%",
                  margin: "0 auto",
                  minHeight: "600px",
                }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                  className="font-bold"
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
                    pagination={{ pageSize: 5, position: ["bottomCenter"] }}
                  />
                </div>
                <div
                  className="flex justify-end mt-4"
                  style={{ width: "100%" }}
                >
                  <Button onClick={handlePrev} style={{ marginRight: "8px" }}>
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleCreateImport}
                    style={{ width: "100%" }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </Col>
          <Col xs={24} lg={8}>
            <div className="container">
              <h2 style={{ textAlign: "center" }} className="font-bold">
                Available Exports
              </h2>
              <List
                itemLayout="horizontal"
                dataSource={filteredExports}
                renderItem={(exportItem) => (
                  <List.Item
                    className=""
                    onClick={() => handleExportSelect(exportItem)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card className="w-full shadow-md hover:shadow-lg">
                      <h3 className="text-xl text-indigo-500">
                        {exportItem.description}
                      </h3>
                      <p>{`From Warehouse: ${exportItem.warehouseFrom.name}`}</p>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StaffAddImportWarehouse;
