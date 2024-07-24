import React, { useState, useEffect } from "react";
import {
  useGetExportByIdQuery,
  useGetLatestExportQuery,
  useUpdateExportByIdMutation,
  useDeleteExportMutation
} from "../../redux/api/exportApiSlice";
import {
  useGetAllExportDetailsByExportIdQuery,
  useUpdateAndAddExportDetailsMutation,
  useDeleteExportDetailsMutation,
  useCheckQuantityForUpdateMutation,
} from "../../redux/api/exportDetailApiSlice";
import { useGetAllCustomersQuery } from "../../redux/api/customersApiSlice";
import { useGetAllWarehousesQuery } from "../../redux/api/warehousesApiSlice";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice";
import { useGetAllInventoriesQuery } from "../../redux/api/inventoryApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../utils/Breadcumbs";
import {
  Table,
  Input,
  Button,
  Modal,
  Select,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import { EditTwoTone } from "@mui/icons-material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/images/FPT_logo_2010.png";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const { TextArea } = Input;

function StaffExportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth);

  if (!userInfo) {
    navigate("/", { replace: true });
    return null;
  }

  const authToken = userInfo?.userInfo?.data?.token;
  const wid = userInfo?.userInfo?.data?.warehouseId;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [detailFormData, setDetailFormData] = useState([]);
  const [initialDetailData, setInitialDetailData] = useState([]);
  const [editedDetails, setEditedDetails] = useState([]);
  const [deletedDetails, setDeletedDetails] = useState([]);
  const [newDetails, setNewDetails] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [isDetailSaved, setIsDetailSaved] = useState(false);
  const [isRowAdding, setIsRowAdding] = useState(false);
  const [filteredInventory, setFilteredInventory] = useState([]);

  const { data: exportResponse } = useGetExportByIdQuery({
    exportId: id,
    authToken,
  });
  const { data: exportDetailResponse, isLoading: exportDetailResponseLoading } =
    useGetAllExportDetailsByExportIdQuery({ authToken, exportId: id });
  const { data: latestExportResponse } = useGetLatestExportQuery({
    authToken,
    warehouseId: wid,
  });
  const { data: customerResponse } = useGetAllCustomersQuery(authToken);
  const { data: warehouseResponse } = useGetAllWarehousesQuery(authToken);
  const { data: productResponse } = useGetAllProductsQuery(authToken);
  const { data: inventoryResponse } = useGetAllInventoriesQuery(authToken);

  const [deleteExport, { isLoading: isDeleting }] = useDeleteExportMutation();
  const [updateExport] = useUpdateExportByIdMutation();
  const [checkQuantityForUpdate] = useCheckQuantityForUpdateMutation();
  const [updateAndAddExportDetails] = useUpdateAndAddExportDetailsMutation();
  const [deleteExportDetails] = useDeleteExportDetailsMutation();

  const exportData = exportResponse?.data;
  const exportDetailData = exportDetailResponse?.data;
  const latestExportData = latestExportResponse?.data;

  const filteredProducts = productResponse?.data.filter((product) =>
    filteredInventory.some(
      (inv) => inv.product.id === product.id && inv.zone.warehouse.id === wid
    )
  );

  useEffect(() => {
    if (inventoryResponse?.data) {
      const filteredData = inventoryResponse.data.filter(inv => inv.quantity > 0);
      setFilteredInventory(filteredData);
    }
  }, [inventoryResponse]);

  useEffect(() => {
    if (exportData) {
      const flattenedData = {
        ...exportData,
        warehouseFromDescription: exportData.warehouseFrom?.description,
        warehouseFromName: exportData.warehouseFrom?.name,
        warehouseFromAddress: exportData.warehouseFrom?.address,
        warehouseToName: exportData.warehouseTo?.name,
        warehouseToDescription: exportData.warehouseTo?.description,
        warehouseToAddress: exportData.warehouseTo?.address,
        customerName: exportData.customer?.name,
        customerEmail: exportData.customer?.email,
        customerPhone: exportData.customer?.phone,
        customerAddress: exportData.customer?.address,
        customerId: exportData.customer?.id,
        warehouseIdTo: exportData.warehouseTo?.id,
      };
      setFormData(flattenedData);
      setInitialData(flattenedData);
    }
  }, [exportData]);

  useEffect(() => {
    if (exportDetailData) {
      const detailsWithKeys = exportDetailData.map((item) => ({
        ...item,
        key: item.id,
        originalQuantity: item.quantity,
        isRowEditing: false,
      }));
      setDetailFormData(detailsWithKeys);
      setInitialDetailData(detailsWithKeys);
    }
  }, [exportDetailData]);

  const handleInputChange = (e, key) => {
    setFormData({
      ...formData,
      [key]: e.target.value,
    });
  };

  const handleDateChange = (date, dateString) => {
    setFormData({
      ...formData,
      exportDate: dateString,
    });
  };

  const handleSelectChange = (value, entity, field) => {
    const update = { ...formData };
    update[field] = value;

    const selectedEntity = (
      entity === "customer" ? customerResponse : warehouseResponse
    )?.data.find((item) => item.name === value);

    if (selectedEntity) {
      if (entity === "customer") {
        update.customerId = selectedEntity.id;
        update.customerEmail = selectedEntity.email || "";
        update.customerPhone = selectedEntity.phone || "";
        update.customerAddress = selectedEntity.address || "";
        if (formData.exportType !== "WAREHOUSE") {
          update.warehouseIdTo = null;
        }
      } else {
        if (formData.exportType === "WAREHOUSE") {
          update.warehouseIdTo = selectedEntity.id;
          update.warehouseToDescription = selectedEntity.description || "";
          update.warehouseToAddress = selectedEntity.address || "";
        } else {
          update.warehouseIdTo = null;
        }
      }
    }

    setFormData(update);
  };

  const handleCancelEdit = () => {
    if (
      JSON.stringify(formData) !== JSON.stringify(initialData) ||
      JSON.stringify(detailFormData) !== JSON.stringify(initialDetailData)
    ) {
      Modal.confirm({
        title: "Unsaved Changes",
        content: "You have unsaved changes. Do you really want to cancel?",
        onOk: () => {
          setIsEditing(false);
          setFormData(initialData);
          setDetailFormData(initialDetailData);
          setEditedDetails([]);
          setDeletedDetails([]);
          setNewDetails([]);
        },
      });
    } else {
      setIsEditing(false);
    }
  };

  const handleDeleteDetail = (recordId) => {
    const isNewDetail = newDetails.some((detail) => detail.id === recordId);
    if (isNewDetail) {
      setNewDetails(newDetails.filter((detail) => detail.id !== recordId));
      setDetailFormData(detailFormData.filter((item) => item.id !== recordId));
    } else {
      setDeletedDetails([...deletedDetails, recordId]);
      setDetailFormData(detailFormData.filter((item) => item.id !== recordId));
    }
    message.success("Saved change");
  };

  const handleConfirmDelete = () => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this export?",
      onOk: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      const detailIdsToDelete = exportDetailData.map(detail => detail.id);

      const deletedDetailsResult = await deleteExportDetails({
        data: detailIdsToDelete,
        authToken,
      });

      if (deletedDetailsResult.error) {
        throw new Error('Failed to delete export details');
      }

      const result = await deleteExport({ exportId: id, authToken });

      if (result?.data) {
        message.success('Export deleted successfully!');
        navigate('/staff/order/export');
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      console.error('Deletion error:', error);
      message.error('Failed to delete export: ' + error.message);
    }
  };

  const handleUpdateExport = async () => {
    try {
      const formattedDate = formData.exportDate
        ? new Date(formData.exportDate).toISOString()
        : null;

      const updatedData = {
        description: formData.description,
        type: formData.exportType,
        exportDate: formattedDate,
        warehouseIdTo:
          formData.exportType === "WAREHOUSE" ? formData.warehouseIdTo : null,
        customerId:
          formData.exportType !== "WAREHOUSE" ? formData.customerId : null,
      };

      const result = await updateExport({
        data: updatedData,
        exportId: id,
        authToken,
      });

      if (deletedDetails.length > 0) {
        const deletedDetailsResult = await deleteExportDetails({
          data: deletedDetails,
          authToken
        });
        if (deletedDetailsResult.error) {
          throw new Error('Failed to delete export details');
        }
      }

      if (result?.data) {
        message.success("Export updated successfully!");
        setIsEditing(false);
        setInitialData(formData);

        if (
          editedDetails.length > 0 ||
          newDetails.length > 0 ||
          deletedDetails.length > 0
        ) {
          await handleUpdateExportDetails();
        }
      } else {
        throw new Error("Failed to update export");
      }
    } catch (error) {
      console.error("Save error:", error);
      message.error("Failed to update export: " + error.message);
    }
  };

  const handleUpdateExportDetails = async () => {
    try {
      const requests = detailFormData.map((detail) => {
        let expiredAt = detail.expiredAt;
        if (expiredAt && !expiredAt.includes("T")) {
          const [date, time] = expiredAt.split(" ");
          expiredAt = `${date}T${time.replace(".0", ".000+00:00")}`;
        }
        return {
          productId: detail.product.id,
          exportId: id,
          quantity: detail.quantity,
          expiredAt,
          zoneId: detail.zone.id,
        };
      });

      console.log(requests);

      const result = await updateAndAddExportDetails({
        data: requests,
        exportId: id,
        authToken,
      });

      if (result?.data) {
        message.success("Export details updated successfully!");
        setEditedDetails([]);
        setNewDetails([]);
        setDeletedDetails([]);
      } else {
        throw new Error("Failed to update export details");
      }
    } catch (error) {
      console.error("Update details error:", error);
      message.error("Failed to update export details: " + error.message);
    }
  };

  const handleSaveEdit = () => {
    if (hasUnsavedChanges()) {
      message.warning("Please save or cancel your changes before saving.");
      return;
    }

    Modal.confirm({
      title: "Confirm Save",
      content: "Are you sure you want to save the changes?",
      onOk: () => {
        handleUpdateExport();
      },
    });
  };

  const handleCancelDetail = (recordId) => {
    if (newDetails.find(detail => detail.id === recordId)) {
      setDetailFormData(detailFormData.filter(item => item.id !== recordId));
      setNewDetails(newDetails.filter(detail => detail.id !== recordId));
      setIsRowAdding(false);
    } else {
      setDetailFormData(
        detailFormData.map((item) =>
          item.id === recordId
            ? {
              ...item,
              quantity: initialDetailData.find(
                (initialItem) => initialItem.id === recordId
              ).quantity,
              isRowEditing: false,
            }
            : item
        )
      );
    }
    setEditedDetails((editedDetails) =>
      editedDetails.filter((detail) => detail.id !== recordId)
    );
    message.info("Cancel changes");
  };

  const handleSaveDetail = async (recordId) => {
    const detail = detailFormData.find((item) => item.id === recordId);
    const stockQuantity = getStockQuantity(detail.product.id, detail.zone.name, detail.expiredAt);
    if (detail.quantity > stockQuantity) {
      message.error("Quantity exceeds available stock.");
      return;
    } else {
      message.success("Saved change");
    }

    setDetailFormData(
      detailFormData.map((item) =>
        item.id === recordId
          ? { ...item, isRowEditing: false }
          : item
      )
    );
    setEditedDetails((editedDetails) => {
      const existingIndex = editedDetails.findIndex((detail) => detail.id === recordId);
      const updatedDetails = [...editedDetails];
      if (existingIndex >= 0) {
        updatedDetails[existingIndex] = {
          ...updatedDetails[existingIndex],
          quantity: detail.quantity,
        };
      } else {
        updatedDetails.push({ id: recordId, quantity: detail.quantity });
      }
      return updatedDetails;
    });

    setIsRowAdding(false);
    setIsDetailSaved(true);
  };

  const handleQuantityChange = (value, recordId) => {
    if (value < 1) {
      message.error("Quantity must be greater than 0.");
      return;
    }
    setDetailFormData(
      detailFormData.map((item) =>
        item.id === recordId
          ? { ...item, quantity: value, isRowEditing: value !== item.originalQuantity }
          : item
      )
    );
  };

  const hasUnsavedChanges = () => {
    return detailFormData.some((detail) => detail.isRowEditing);
  };

  const handleAddProduct = () => {
    if (isRowAdding) {
      message.error("Please complete adding product before adding another.");
      return;
    }
    setIsRowAdding(true);

    const newProduct = {
      id: Date.now().toString(),
      product: { name: "", description: "", category: { name: "" } },
      zone: { id: null, name: "" },
      expiredAt: null,
      quantity: 1,
      isRowEditing: true,
      isNew: true
    };
    setDetailFormData([...detailFormData, newProduct]);
    setNewDetails([...newDetails, newProduct]);
  };

  const getStockQuantity = (productId, zoneName, expiredAt) => {
    const inventoryQuantity = filteredInventory
      .filter(
        (inv) =>
          inv.product.id === productId &&
          inv.zone.name === zoneName &&
          inv.expiredAt === expiredAt
      )
      .reduce((acc, inv) => acc + inv.quantity, 0);

    const exportDetailQuantity = exportDetailData
      .filter(
        (detail) =>
          detail.product.id === productId &&
          detail.zone.name === zoneName &&
          detail.expiredAt === expiredAt
      )
      .reduce((acc, detail) => acc + detail.quantity, 0);

    return (inventoryQuantity || 0) + (exportDetailQuantity || 0);
  };

  const handleDetailSelectChange = (value, key, recordId) => {
    if (key === "productName") {
      const selectedProduct = productResponse?.data.find(
        (product) => product.name === value
      );
      const selectedProductId = selectedProduct?.id;

      setSelectedProductId(selectedProductId);

      setDetailFormData(
        detailFormData.map((item) =>
          item.id === recordId
            ? {
              ...item,
              product: {
                ...item.product,
                name: value,
                description: selectedProduct?.description || "",
                category: {
                  ...item.product.category,
                  name: selectedProduct?.category?.name || "",
                },
              },
            }
            : item
        )
      );
    } else if (key === "zone") {
      const selectedZone = filteredInventory.find(
        (zone) => zone.zone.name === value
      );
      setDetailFormData(
        detailFormData.map((item) =>
          item.id === recordId ? { ...item, zone: selectedZone.zone } : item
        )
      );
    } else {
      setDetailFormData(
        detailFormData.map((item) =>
          item.id === recordId ? { ...item, [key]: value } : item
        )
      );
    }
  };

  const hasQuantityChanged = (record) => {
    return record.quantity !== record.originalQuantity;
  };

  const handleZoneChange = (value, index) => {
    const zone = filteredInventory.find((z) => z.zone.id === value).zone;
    const newDetails = [...detailFormData];
    newDetails[index].zone = zone;
    newDetails[index].expiredAt = null;
    setDetailFormData(newDetails);
  };

  const handleExpiredAtChange = (value, index) => {
    const newDetails = [...detailFormData];
    newDetails[index].expiredAt = value;
    setDetailFormData(newDetails);
  };

  const getUniqueExpiredAt = (productId, zoneId) => {
    const filteredDates = [
      ...new Set(
        filteredInventory
          .filter(
            (inv) => inv.product.id === productId && inv.zone.id === zoneId
          )
          .map((inv) => inv.expiredAt)
      ),
    ];
    return filteredDates;
  };

  const handleProductSelectChange = (value, index) => {
    const product = filteredProducts?.find((p) => p.id === value);
    const newDetails = [...detailFormData];
    newDetails[index].product = {
      ...newDetails[index].product,
      id: product.id,
      name: product.name,
      description: product.description,
      category: { name: product.category.name },
    };
    newDetails[index].zone = { id: null, name: "" };
    newDetails[index].expiredAt = null;
    setDetailFormData(newDetails);
    setSelectedProductId(product.id);
  };

  const getUniqueZones = (productId, excludedZone) => {
    const filteredZones = filteredInventory
      .filter(
        (inv) =>
          inv.product.id === productId && inv.zone.id !== excludedZone
      )
      .map((inv) => inv.zone);

    const uniqueZones = Array.from(new Set(filteredZones.map(zone => JSON.stringify(zone))))
      .map(str => JSON.parse(str));

    return uniqueZones;
  };

  const isRowValid = (row) => {
    return row.product.id && row.zone.id && row.expiredAt;
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["product", "name"],
      key: "productName",
      width: 250,
      render: (text, record, index) => {
        if (record.isRowEditing && record.isNew) {
          return (
            <Select
              showSearch
              value={record.product.id}
              onChange={(value) => handleProductSelectChange(value, index)}
              style={{ width: "100%" }}
            >
              {filteredProducts?.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          );
        } else {
          if (record.isNew) {
            return (
              <span>
                {text || ""}<span className="text-red-500">*</span>
              </span>
            )
          } else {
            return text || "";
          }
        }
      }
    },
    {
      title: "Description",
      dataIndex: ["product", "description"],
      key: "description",
      width: 250,
    },
    {
      title: "Category",
      dataIndex: ["product", "category", "name"],
      key: "category",
      width: 150,
    },
    {
      title: "Zone",
      dataIndex: ["zone", "name"],
      key: "zone",
      width: 100,
      render: (text, record, index) => {
        if (record.isRowEditing && record.isNew) {
          return (
            <Select
              showSearch
              notFoundContent="No zones found"
              defaultValue={"Select Zone"}
              value={record.zone.name}
              onChange={(value) => handleZoneChange(value, index)}
              style={{ width: "100%" }}
              disabled={!record.product.id}
            >
              {getUniqueZones(record.product.id, record.zone.id).map((zone) => (
                <Select.Option key={zone.id} value={zone.id}>
                  {zone.name}
                </Select.Option>
              ))}
            </Select>
          );
        } else {
          return text || "";
        }
      }
    },
    {
      title: "Expiration Date",
      dataIndex: "expiredAt",
      key: "expiredAt",
      width: 150,
      render: (text, record, index) => {
        if (record.isRowEditing && record.isNew) {
          const formattedDate = text ? moment(text).format("YYYY-MM-DD") : null; // Có thể gây ra lỗi
          return (
            <Select
              showSearch
              value={formattedDate}
              onChange={(value) => handleExpiredAtChange(value, index)}
              style={{ width: "100%" }}
              disabled={!record.zone.id}
            >
              {getUniqueExpiredAt(record.product.id, record.zone.id).map((date) => (
                <Select.Option key={date} value={date}>
                  {formattedDate}
                </Select.Option>
              ))}
            </Select>
          );
        } else {
          return text ? moment(text).format("YYYY-MM-DD") : "None";
        }
      }
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (text, record) =>
        isEditing ? (
          <span className="flex items-center justify-center gap-1">
            {!isRowAdding ? (<InputNumber
              disabled={isRowAdding && !record.isNew}
              min={1}
              value={text}
              onChange={(value) => handleQuantityChange(value, record.id)}
              style={{ width: "100%" }}
            />) : (
              <InputNumber
                disabled={!record.expiredAt}
                min={1}
                value={text}
                onChange={(value) => handleQuantityChange(value, record.id)}
                style={{ width: "100%" }}
              />
            )}
          </span>
        ) : (
          text
        ),
    },
  ];

  if (isEditing) {
    columns.push(
      {
        title: "Available",
        key: "Available",
        width: 40,
        render: (text, record, index) =>
          <div>
            {getStockQuantity(
              record.product.id,
              record.zone.name,
              record.expiredAt
            )}
          </div>
      },
      {
        title: "Actions",
        key: "actions",
        width: 150,
        render: (text, record, index) =>
          record.isRowEditing ? (
            <div className="flex items-center gap-2 w-full">
              <a
                className="text-blue-500 no-underline cursor-pointer transition duration-300"
                onClick={() => handleSaveDetail(record.id)}
              >
                Save
              </a>
              <a
                className="text-red-500 hover:text-red-300 no-underline cursor-pointer transition duration-300"
                onClick={() => handleCancelDetail(record.id)}
              >
                Cancel
              </a>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              {hasQuantityChanged(record) && (
                record.isNew === false ? (<a
                  className="text-blue-500 hover:text-blue-300 no-underline cursor-pointer transition duration-300"
                  onClick={() => handleCancelDetail(record.id)}
                >
                  Reset
                </a>) : (
                  null
                )
              )}
              <a
                className="text-red-500 hover:text-red-300 no-underline cursor-pointer transition duration-300"
                onClick={() => handleDeleteDetail(record.id)}
              >
                Delete
              </a>
            </span>
          ),
      });
  }

  return (
    <>
      <Breadcrumbs />
      <div className="flex justify-center items-center">
        <h1 className="font-bold text-3xl py-4 mt-2">Export {id}</h1>
      </div>
      <div className="px-4 overflow-auto">
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
              >
                <PictureAsPdfIcon /> Preview
              </Button>
              {exportData?.id === latestExportData?.id && (
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
              <Button size="medium" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                size="medium"
                type="primary"
                danger
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                Delete
              </Button>
              <Button
                size="medium"
                type="primary"
                onClick={handleSaveEdit}
                disabled={
                  JSON.stringify(formData) === JSON.stringify(initialData) &&
                  !isDetailSaved
                }
              >
                Save
              </Button>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 mb-6">
          <div className="ml-4">
            <table>
              <tr>
                <td colSpan={2}><p className="mt-3 mb-1 font-bold text-xl">Export Invoice:</p></td>
              </tr>
              <tr>
                <td>
                  <p className="font-medium">Description:</p>
                </td>
                <td className="w-3/4">
                  <TextArea
                    className="mb-2"
                    size="large"
                    autoSize={{ minRows: 3 }}
                    value={formData?.description}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange(e, "description")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p className="font-medium">Export Type:</p>
                </td>
                <td className="w-3/4">
                  <Select
                    className="mb-2 w-full"
                    size="large"
                    value={formData?.exportType}
                    disabled={!isEditing}
                    onChange={(value) =>
                      handleSelectChange(value, "exportType", "exportType")
                    }
                  >
                    <Select.Option value="WAREHOUSE">Warehouse</Select.Option>
                    <Select.Option value="CUSTOMER">Customer</Select.Option>
                    <Select.Option value="WASTE">Waste</Select.Option>
                  </Select>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="font-medium">Export Date:</p>
                </td>
                <td className="w-3/4">
                  <DatePicker
                    className="mb-2 w-full"
                    size="large"
                    value={
                      formData.exportDate ? moment(formData.exportDate) : null
                    }
                    onChange={handleDateChange}
                    disabled={!isEditing}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <p className="mt-3 mb-1 font-bold text-xl">Warehouse From:</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="font-medium">Warehouse Description:</p>
                </td>
                <td className="w-3/4">
                  <TextArea
                    className="mb-2"
                    size="large"
                    autoSize={{ minRows: 3 }}
                    value={formData?.warehouseFromDescription}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p className="font-medium">Warehouse Name:</p>
                </td>
                <td className="w-3/4">
                  <Input
                    className="mb-2"
                    size="large"
                    value={formData?.warehouseFromName}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p className="font-medium">Warehouse Address:</p>
                </td>
                <td className="w-3/4">
                  <Input
                    className="mb-2"
                    size="large"
                    value={formData?.warehouseFromAddress}
                    disabled
                  />
                </td>
              </tr>
            </table>
          </div>
          <div className="ml-4">
            {formData?.exportType === "WAREHOUSE" ? (
              <table>
                <tr>
                  <td colSpan={2}>
                    <p className="mt-3 font-bold text-xl">Warehouse To:</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="font-medium">Name:</p>
                  </td>
                  <td className="w-full">
                    <Select
                      className="w-full mb-2"
                      size="large"
                      showSearch
                      value={formData.warehouseToName}
                      onChange={(value) =>
                        handleSelectChange(
                          value,
                          "warehouse",
                          "warehouseToName"
                        )
                      }
                      disabled={!isEditing}
                    >
                      {warehouseResponse?.data
                        .filter(
                          (warehouse) =>
                            warehouse.id !== exportData.warehouseFrom.id
                        )
                        .map((warehouse) => (
                          <Select.Option
                            key={warehouse.id}
                            value={warehouse.name}
                          >
                            {warehouse.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="font-medium">Description:</p>
                  </td>
                  <td className="w-3/4">
                    <Input
                      className="mb-2"
                      size="large"
                      value={formData?.warehouseToDescription}
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="font-medium">Address:</p>
                  </td>
                  <td className="w-3/4">
                    <Input
                      size="large"
                      value={formData?.warehouseToAddress}
                      disabled
                    />
                  </td>
                </tr>
              </table>
            ) : (
              formData?.exportType === "CUSTOMER" && (
                <table>
                  <tr>
                    <td colSpan={2}>
                      <p className="mt-3 font-bold text-xl">Customer:</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="font-medium">Name:</p>
                    </td>
                    <td className="w-full">
                      <Select
                        className="w-full mb-2"
                        size="large"
                        showSearch
                        value={formData.customerName}
                        onChange={(value) =>
                          handleSelectChange(value, "customer", "customerName")
                        }
                        disabled={!isEditing}
                      >
                        {customerResponse?.data.map((customer) => (
                          <Select.Option key={customer.id} value={customer.name}>
                            {customer.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="font-medium">Email:</p>
                    </td>
                    <td className="w-full">
                      <Input
                        className="mb-2"
                        size="large"
                        value={formData?.customerEmail}
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="font-medium">Phone:</p>
                    </td>
                    <td className="w-full">
                      <Input
                        className="mb-2"
                        size="large"
                        value={formData?.customerPhone}
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="font-medium">Address:</p>
                    </td>
                    <td className="w-full">
                      <Input
                        className="mb-2"
                        size="large"
                        value={formData?.customerAddress}
                        disabled
                      />
                    </td>
                  </tr>
                </table>
              )
            )}
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={detailFormData}
            rowKey="id"
            loading={exportDetailResponseLoading}
            pagination={false}
          />
          {isEditing && (
            <div className="w-full flex items-center justify-center mt-2">
              <Button
                type="dashed"
                onClick={handleAddProduct}
                block
                style={{ marginBottom: "20px", width: "10%" }}
                disabled={isRowAdding}
              >
                <AddOutlinedIcon /> Product
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StaffExportDetail;
