import React, { useEffect, useState } from "react";
import { useGetImportByIdQuery } from "../../redux/api/importApiSlice";
import { useGetImportDetailsByImportIdQuery } from "../../redux/api/importDetailApiSlice";
import { useGetAllCustomersQuery } from "../../redux/api/customersApiSlice";
import { useGetAllWarehousesQuery } from "../../redux/api/warehousesApiSlice";
import { useUpdateImportMutation } from "../../redux/api/importApiSlice";
import { useGetLatestImportQuery } from "../../redux/api/importApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../utils/Breadcumbs";
import moment from "moment/moment";
import {
  Table,
  Input,
  Button,
  Modal,
  Select,
  message,
  DatePicker,
} from "antd";
import { Description, EditTwoTone, PictureAsPdf } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/images/FPT_logo_2010.png";

const { TextArea } = Input;

function StaffImportDetail() {
  const { id } = useParams();

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth);

  if (!userInfo) {
    navigate("/", { replace: true });
    return null;
  }

  const authToken = userInfo?.userInfo?.data?.token;
  const wid = userInfo?.userInfo?.data?.warehouseId;

  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
  const [detailFormData, setDetailFormData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const { data: importResponse } = useGetImportByIdQuery({
    importId: id,
    authToken,
  });
  const { data: importDetailResponse, isLoading: importDetailResponseLoading } =
    useGetImportDetailsByImportIdQuery({ authToken, importId: id });
  const { data: customerResponse } = useGetAllCustomersQuery(authToken);
  const { data: warehouseResponse } = useGetAllWarehousesQuery(authToken);
  const { data: latestImportResponse } = useGetLatestImportQuery({
    authToken,
    warehouseId: wid,
  });

  const [updateImport] = useUpdateImportMutation();

  const importData = importResponse?.data;
  const importDetailData = importDetailResponse?.data;

  useEffect(() => {
    if (importData) {
      const flattenedData = {
        ...importData,
        warehouseFromDescription: importData.warehouseFrom?.description,
        warehouseFromName: importData.warehouseFrom?.name,
        warehouseFromAddress: importData.warehouseFrom?.address,
        warehouseToName: importData.warehouseTo?.name,
        warehouseToDescription: importData.warehouseTo?.description,
        warehouseToAddress: importData.warehouseTo?.address,
        customerName: importData.customer?.name,
        customerEmail: importData.customer?.email,
        customerPhone: importData.customer?.phone,
        customerAddress: importData.customer?.address,
        customerId: importData.customer?.id,
        warehouseIdTo: importData.warehouseTo?.id,
      };
      setFormData(flattenedData);
      setInitialFormData(flattenedData);
    }
  }, [importData]);

  useEffect(() => {
    if (importDetailData) {
      const detailsWithKeys = importDetailData.map((item) => ({
        ...item,
        key: item.id,
      }));
      setDetailFormData(detailsWithKeys);
    }
  }, [importDetailData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleSave = async () => {
    try {
      const bodyRequest = {
        description: formData?.description,
        customerId: formData?.customerId,
        receivedDate: formData?.receivedDate,
      };
      console.log(bodyRequest);
      await updateImport({ id: id, data: bodyRequest, authToken }).unwrap();
      message.success("Import updated successfully!");
      setIsEditing(false);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update import!");
    }
  };

  const handleDateChange = (date, dateString) => {
    setFormData({
      ...formData,
      receivedDate: dateString,
    });
  };

  const handleCancel = () => {
    setFormData(initialFormData); // Reset form data to the initial data
    setIsEditing(false); // Close editing mode
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["product", "name"],
      key: "productName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: ["product", "description"],
      key: "description",
    },
    {
      title: "Category",
      dataIndex: ["product", "category", "name"],
      key: "category",
    },
    {
      title: "Expiration Date",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (text) => (
        <span>{text ? moment(text).format("YYYY-MM-DD") : "None"}</span>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <span>{text}</span>,
    },
  ];

  const generatePDFData = () => {
    const doc = new jsPDF();

    // Add company logo
    doc.addImage(logo, "PNG", 10, 10, 20, 0, undefined, false);

    // Add invoice title and number
    doc.setFontSize(20);
    doc.text("IMPORT INVOICE", 105, 30, null, null, "center");
    doc.setFontSize(10);
    doc.text(`No. ${formData.id}`, 180, 20);

    // Add date
    doc.setFontSize(12);
    doc.text(`Date: ${moment().format("DD MMMM, YYYY")}`, 10, 50);

    // Add billed to and from information
    doc.setFontSize(10);
    doc.text("From:", 10, 60);
    if (formData.importType === "WAREHOUSE") {
      doc.text(formData.warehouseFromName || "N/A", 10, 65);
      doc.text(formData.warehouseFromAddress || "N/A", 10, 70);
      doc.text(formData.warehouseFromDescription || "N/A", 10, 75);
    } else if (formData.importType === "CUSTOMER") {
      doc.text(formData.customerName || "N/A", 10, 65);
      doc.text(formData.customerAddress || "N/A", 10, 70);
      doc.text(formData.customerEmail || "N/A", 10, 75);
      doc.text(formData.customerPhone || "N/A", 10, 80);
    }

    doc.text("To:", 105, 60);
    doc.text(formData.warehouseToName || "N/A", 105, 65);
    doc.text(formData.warehouseToAddress || "N/A", 105, 70);
    doc.text(formData.warehouseToDescription || "N/A", 105, 75);

    // Add table
    const tableColumn = ["Product Name", "Description", "Category", "Expiration Date", "Quantity"];
    const tableRows = [];

    detailFormData.forEach((item) => {
      const itemData = [
        item.product.name,
        item.product.description,
        item.product.category.name,
        item.expiredAt ? moment(item.expiredAt).format("YYYY-MM-DD") : "None",
        item.quantity,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 90 });

    // Create a blob from the PDF and generate a data URI
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfData(pdfUrl);
    setIsPreviewVisible(true);
  };

  return (
    <div className="p-4">
      <Breadcrumbs />
      <div className="flex justify-center items-center">
        <h1 className="font-bold text-3xl py-4 mt-2">Import {id}</h1>
      </div>
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <>
            <Button
              size="medium"
              style={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                borderColor: "#ff4d4f",
              }}
              onClick={generatePDFData}
            >
              <PictureAsPdf /> Preview
            </Button>
            {latestImportResponse?.data?.id === importData?.id && (
              <Button
                size="medium"
                type="primary"
                className="flex justify-center items-center mr-4"
                onClick={() => setIsEditing(true)}
              >
                <EditTwoTone /> Edit
              </Button>
            )}
          </>
        ) : (
          <>
            <Button size="medium" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="medium"
              type="primary"
              disabled={!isFormChanged()}
              onClick={() => setIsModalVisible(true)}
            >
              Save
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <h2 className="font-bold text-xl mb-2">Import Invoice:</h2>
          <div className="mb-2">
            <label className="block font-medium">Description:</label>
            <TextArea
              size="large"
              autoSize={{ minRows: 3 }}
              value={formData?.description}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="h-[80%]"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">Import Type:</label>
            <Select
              size="large"
              value={formData?.importType}
              disabled
              className="w-full h-[80%]"
            >
              <Select.Option value="WAREHOUSE">Warehouse</Select.Option>
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="WASTE">Waste</Select.Option>
            </Select>
          </div>
          <div className="mb-2">
            <label className="block font-medium">Import Date:</label>
            <DatePicker
              size="large"
              value={formData?.receivedDate ? dayjs(formData.receivedDate, "YYYY-MM-DD") : null}
              className="w-full h-[80%]"
              disabled={true}
            />
          </div>
          <h2 className="font-bold text-xl mb-2">From Warehouse:</h2>
          <div className="mb-2">
            <label className="block font-medium">Warehouse Description:</label>
            <Input
              size="large"
              value={formData?.warehouseFromDescription}
              disabled
              className="h-[80%]"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">Warehouse Name:</label>
            <Input
              size="large"
              value={formData?.warehouseFromName}
              disabled
              className="h-[80%]"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">Warehouse Address:</label>
            <Input
              size="large"
              value={formData?.warehouseFromAddress}
              disabled
              className="h-[80%]"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[300px]">
          {formData?.importType === "WAREHOUSE" && importData ? (
            <>
              <h2 className="font-bold text-xl mb-2">To Warehouse:</h2>
              <div className="mb-2">
                <label className="block font-medium">Name:</label>
                <Select
                  size="large"
                  showSearch
                  value={formData.warehouseToName}
                  disabled
                  className="w-full h-[80%]"
                >
                  {warehouseResponse?.data
                    .filter(
                      (warehouse) =>
                        warehouse.id !== importData?.warehouseFrom?.id
                    )
                    .map((warehouse) => (
                      <Select.Option key={warehouse.id} value={warehouse.name}>
                        {warehouse.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
              <div className="mb-2">
                <label className="block font-medium">Description:</label>
                <Input
                  size="large"
                  value={formData?.warehouseToDescription}
                  disabled
                  className="h-[80%]"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Address:</label>
                <Input
                  size="large"
                  value={formData?.warehouseToAddress}
                  disabled
                  className="h-[80%]"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="font-bold text-xl mb-2">From Customer:</h2>
              <div className="mb-2">
                <label className="block font-medium">Name:</label>
                <Select
                  size="large"
                  showSearch
                  value={formData.customerName}
                  disabled={!isEditing}
                  onChange={(value) =>
                    handleInputChange("customerId", value)
                  }
                  className="w-full h-[80%]"
                >
                  {customerResponse?.data.map((customer) => (
                    <Select.Option key={customer.id} value={customer.id}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="mb-2">
                <label className="block font-medium">Email:</label>
                <Input
                  size="large"
                  value={formData?.customerEmail}
                  disabled
                  className="h-[80%]"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Phone:</label>
                <Input
                  size="large"
                  value={formData?.customerPhone}
                  disabled
                  className="h-[80%]"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Address:</label>
                <Input
                  size="large"
                  value={formData?.customerAddress}
                  disabled
                  className="h-[80%]"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={detailFormData}
          rowKey="id"
          loading={importDetailResponseLoading}
          pagination={false}
        />
      </div>
      <Modal
        title="Confirm Update"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to update this import?</p>
      </Modal>
      <Modal
        title="PDF Preview"
        visible={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPreviewVisible(false)}>
            Cancel
          </Button>,
          <Button key="download" type="primary" onClick={() => setIsPreviewVisible(false)}>
            Download
          </Button>,
        ]}
        width={"80%"}
      >
        <iframe
          src={pdfData}
          width="100%"
          height="700px"
          style={{ border: "none" }}
        ></iframe>
      </Modal>
    </div>
  );
}

export default StaffImportDetail;
