// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Button, Select, Form, Typography, Modal } from 'antd';
// import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
// import { useGetInventorySnapshotReportQuery, useGetCurrentInventorySnapshotReportQuery } from '../../redux/api/inventorySnapshotSlice';
// import Loading from "../../utils/Loading";
// import Error500 from "../../utils/Error500";
// import useDocumentTitle from '../../utils/UseDocumentTitle';
// import * as ExcelJS from 'exceljs';
// import styled from 'styled-components';

// const { Title, Paragraph } = Typography;
// const { Option } = Select;

// const StyledTable = styled.div`
//   display: block;
//   overflow-x: auto;
//   .tr {
//     display: flex;
//   }
//   .th,
//   .td {
//     flex: 1;
//     padding: 8px;
//     border: 1px solid #ddd;
//   }
// `;

// const ReportComponent = () => {
//   useDocumentTitle('Report');
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [triggerDownload, setTriggerDownload] = useState(false);
//   const [triggerPreview, setTriggerPreview] = useState(false);
//   const [previewData, setPreviewData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [warehouseFilter, setWarehouseFilter] = useState('');
//   const [productNameFilter, setProductNameFilter] = useState('');
//   const [zoneNameFilter, setZoneNameFilter] = useState('');

//   const userInfo = useSelector((state) => state.auth.userInfo);
//   const authToken = userInfo?.data?.token;

//   const { data, error, isLoading } = useGetInventorySnapshotReportQuery(
//     { year, month, authToken },
//     { skip: !(triggerDownload || triggerPreview) || !authToken }
//   );

//   const handlePreview = () => {
//     setTriggerPreview(true);
//     setTriggerDownload(false);
//   };

//   useEffect(() => {
//     if (data) {
//       const workbook = new ExcelJS.Workbook();
//       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       workbook.xlsx.load(blob).then(() => {
//         const worksheet = workbook.worksheets[0];
//         const jsonData = [];

//         worksheet.eachRow((row, rowNumber) => {
//           if (rowNumber === 1) return; // Skip header row
//           const rowValues = row.values;
//           const rowObject = {};
//           worksheet.getRow(1).values.forEach((header, index) => {
//             rowObject[header] = rowValues[index];
//           });
//           jsonData.push(rowObject);
//         });

//         setPreviewData(jsonData);

//         if (triggerDownload) {
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = `inventory_snapshot_${year}_${month}.xlsx`;
//           document.body.appendChild(a);
//           a.click();
//           a.remove();
//           setTriggerDownload(false); // Reset trigger after download
//         } else if (triggerPreview) {
//           setIsModalOpen(true);
//           setTriggerPreview(false);
//         }
//       });
//     }
//   }, [data, triggerDownload, triggerPreview, year, month]);

//   const filteredData = previewData.filter(item => 
//     (warehouseFilter === '' || item['Warehouse'] === warehouseFilter) &&
//     (productNameFilter === '' || item['Product Name'] === productNameFilter) &&
//     (zoneNameFilter === '' || item['Zone Name'] === zoneNameFilter)
//   );

//   const getDistinctValues = (key) => {
//     const values = previewData.map(item => item[key]);
//     return [...new Set(values)];
//   };

//   const handleDownload = () => {
//     setTriggerDownload(true);
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//       <Title level={2}>Report Monthly</Title>
//       <Paragraph>
//         Here is the inventory report for all products in all warehouses. The report is compiled from the 1st to the last day of each month. This feature is currently in the finalization stage. If you have any feedback, please let me know. Please select the month you want to view the report and download it!
//       </Paragraph>
//       <Form layout="vertical">
//         {/* <Form.Item label="Year">
//           <Select value={year} onChange={(value) => setYear(value)}>
//             {[...Array(10)].map((_, index) => (
//               <Option key={index} value={new Date().getFullYear() - index}>
//                 {new Date().getFullYear() - index}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item label="Month">
//           <Select value={month} onChange={(value) => setMonth(value)}>
//             {[...Array(12)].map((_, index) => (
//               <Option key={index} value={index + 1}>
//                 {index + 1}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item> */}
//         <Form.Item>
//           <Button
//             type="default"
//             icon={<EyeOutlined />}
//             onClick={handlePreview}
//             disabled={isLoading}
//             loading={isLoading}
//           >
//             {isLoading ? 'Loading...' : 'Preview Report'}
//           </Button>
//         </Form.Item>
//       </Form>
//       {error && (
//         <Error500>
//           <p style={{ color: 'red' }}>{error.toString()}</p>
//         </Error500>
//       )}
//       {isLoading && <Loading />}
//       <Modal
//         title="Report Preview"
//         visible={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={[
//           <Button key="close" onClick={() => setIsModalOpen(false)}>
//             Close
//           </Button>,
//           <Button
//             key="download"
//             type="primary"
//             icon={<DownloadOutlined />}
//             onClick={handleDownload}
//             disabled={isLoading}
//             loading={isLoading}
//           >
//             {isLoading ? 'Loading...' : 'Download Report'}
//           </Button>
//         ]}
//         width="80%"
//       >
//         <div style={{ marginBottom: '16px' }}>
//           <Select
//             placeholder="Filter by Warehouse"
//             onChange={(value) => setWarehouseFilter(value)}
//             style={{ width: '30%', marginRight: '10px' }}
//           >
//             <Option value="">All</Option>
//             {getDistinctValues('Warehouse').map((value, index) => (
//               <Option key={index} value={value}>
//                 {value}
//               </Option>
//             ))}
//           </Select>
//           <Select
//             placeholder="Filter by Product Name"
//             onChange={(value) => setProductNameFilter(value)}
//             style={{ width: '30%', marginRight: '10px' }}
//           >
//             <Option value="">All</Option>
//             {getDistinctValues('Product Name').map((value, index) => (
//               <Option key={index} value={value}>
//                 {value}
//               </Option>
//             ))}
//           </Select>
//           <Select
//             placeholder="Filter by Zone Name"
//             onChange={(value) => setZoneNameFilter(value)}
//             style={{ width: '30%' }}
//           >
//             <Option value="">All</Option>
//             {getDistinctValues('Zone Name').map((value, index) => (
//               <Option key={index} value={value}>
//                 {value}
//               </Option>
//             ))}
//           </Select>
//         </div>
//         <StyledTable>
//           <div>
//             <div className="tr">
//               {filteredData.length > 0 && Object.keys(filteredData[0]).map((key) => (
//                 <div className="th" key={key}>{key}</div>
//               ))}
//             </div>
//             {filteredData.map((row, rowIndex) => (
//               <div className="tr" key={rowIndex}>
//                 {Object.values(row).map((value, cellIndex) => (
//                   <div className="td" key={cellIndex}>{value}</div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </StyledTable>
//       </Modal>
//     </div>
//   );
// };

// export default ReportComponent;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Select, Form, Typography, Modal } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useGetInventorySnapshotReportQuery, useGetCurrentInventorySnapshotReportQuery } from '../../redux/api/inventorySnapshotSlice';
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import useDocumentTitle from '../../utils/UseDocumentTitle';
import * as ExcelJS from 'exceljs';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const StyledTable = styled.div`
  display: block;
  overflow-x: auto;
  .tr {
    display: flex;
  }
  .th,
  .td {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
  }
`;

const ReportComponent = () => {
  useDocumentTitle('Report');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [triggerPreview, setTriggerPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [zoneNameFilter, setZoneNameFilter] = useState('');

  const userInfo = useSelector((state) => state.auth.userInfo);
  const authToken = userInfo?.data?.token;

  const { data, error, isLoading } = useGetInventorySnapshotReportQuery(
    { year, month, authToken },
    { skip: !(triggerDownload || triggerPreview) || !authToken }
  );

  const { data: currentFileData, error: currentError, isLoading: isCurrentLoading } = useGetCurrentInventorySnapshotReportQuery(
    { authToken },
    { skip: !authToken }
  );

  const handlePreview = () => {
    setTriggerPreview(true);
    setTriggerDownload(false);
  };

  useEffect(() => {
    if (currentFileData) {
      const workbook = new ExcelJS.Workbook();
      const blob = new Blob([currentFileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      workbook.xlsx.load(blob).then(() => {
        const worksheet = workbook.worksheets[0];
        const jsonData = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          const rowValues = row.values;
          const rowObject = {};
          worksheet.getRow(1).values.forEach((header, index) => {
            rowObject[header] = rowValues[index];
          });
          jsonData.push(rowObject);
        });

        setCurrentData(jsonData);
      });
    }
  }, [currentFileData]);

  useEffect(() => {
    if (data) {
      const workbook = new ExcelJS.Workbook();
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      workbook.xlsx.load(blob).then(() => {
        const worksheet = workbook.worksheets[0];
        const jsonData = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          const rowValues = row.values;
          const rowObject = {};
          worksheet.getRow(1).values.forEach((header, index) => {
            rowObject[header] = rowValues[index];
          });
          jsonData.push(rowObject);
        });

        setPreviewData(jsonData);

        if (triggerDownload) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `inventory_snapshot_${year}_${month}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTriggerDownload(false); // Reset trigger after download
        } else if (triggerPreview) {
          setIsModalOpen(true);
          setTriggerPreview(false);
        }
      });
    }
  }, [data, triggerDownload, triggerPreview, year, month]);

  const filteredData = previewData.filter(item => 
    (warehouseFilter === '' || item['Warehouse'] === warehouseFilter) &&
    (productNameFilter === '' || item['Product Name'] === productNameFilter) &&
    (zoneNameFilter === '' || item['Zone Name'] === zoneNameFilter)
  );

  const filteredCurrentData = Array.isArray(currentData) ? currentData.filter(item => 
    (warehouseFilter === '' || item['Warehouse'] === warehouseFilter) &&
    (productNameFilter === '' || item['Product Name'] === productNameFilter) &&
    (zoneNameFilter === '' || item['Zone Name'] === zoneNameFilter)
  ) : [];

  const getDistinctValues = (key, data) => {
    if (!Array.isArray(data)) return [];
    const values = data.map(item => item[key]);
    return [...new Set(values)];
  };

  const handleDownload = () => {
    setTriggerDownload(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Report Monthly</Title>
      <Paragraph>
        Here is the inventory report for all products in all warehouses. The report is compiled from the 1st to the last day of each month. This feature is currently in the finalization stage. If you have any feedback, please let me know. Please select the month you want to view the report and download it!
      </Paragraph>
      <Form layout="vertical">
        <Form.Item>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={handlePreview}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Loading...' : 'Preview Report'}
          </Button>
        </Form.Item>
      </Form>
      {currentError && (
        <Error500>
          <p style={{ color: 'red' }}>{currentError.toString()}</p>
        </Error500>
      )}
      {isCurrentLoading && <Loading />}
      <div style={{ marginBottom: '16px' }}>
        <Select
          placeholder="Filter by Warehouse"
          onChange={(value) => setWarehouseFilter(value)}
          style={{ width: '30%', marginRight: '10px' }}
        >
          <Option value="">All</Option>
          {currentData && getDistinctValues('Warehouse', currentData).map((value, index) => (
            <Option key={index} value={value}>
              {value}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Product Name"
          onChange={(value) => setProductNameFilter(value)}
          style={{ width: '30%', marginRight: '10px' }}
        >
          <Option value="">All</Option>
          {currentData && getDistinctValues('Product Name', currentData).map((value, index) => (
            <Option key={index} value={value}>
              {value}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Zone Name"
          onChange={(value) => setZoneNameFilter(value)}
          style={{ width: '30%' }}
        >
          <Option value="">All</Option>
          {currentData && getDistinctValues('Zone Name', currentData).map((value, index) => (
            <Option key={index} value={value}>
              {value}
            </Option>
          ))}
        </Select>
      </div>
      <StyledTable>
        <div>
          <div className="tr">
            {filteredCurrentData.length > 0 && Object.keys(filteredCurrentData[0]).map((key) => (
              key !== 'snapshotdate' && <div className="th" key={key}>{key}</div>
            ))}
          </div>
          {filteredCurrentData.map((row, rowIndex) => (
            <div className="tr" key={rowIndex}>
              {Object.keys(row).map((key, cellIndex) => (
                key !== 'snapshotdate' && <div className="td" key={cellIndex}>{row[key]}</div>
              ))}
            </div>
          ))}
        </div>
      </StyledTable>
      <Modal
        title="Report Preview"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Loading...' : 'Download Report'}
          </Button>
        ]}
        width="80%"
      >
        <div style={{ marginBottom: '16px' }}>
          <Select
            placeholder="Filter by Warehouse"
            onChange={(value) => setWarehouseFilter(value)}
            style={{ width: '30%', marginRight: '10px' }}
          >
            <Option value="">All</Option>
            {getDistinctValues('Warehouse', previewData).map((value, index) => (
              <Option key={index} value={value}>
                {value}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Product Name"
            onChange={(value) => setProductNameFilter(value)}
            style={{ width: '30%', marginRight: '10px' }}
          >
            <Option value="">All</Option>
            {getDistinctValues('Product Name', previewData).map((value, index) => (
              <Option key={index} value={value}>
                {value}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Zone Name"
            onChange={(value) => setZoneNameFilter(value)}
            style={{ width: '30%' }}
          >
            <Option value="">All</Option>
            {getDistinctValues('Zone Name', previewData).map((value, index) => (
              <Option key={index} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </div>
        <StyledTable>
          <div>
            <div className="tr">
              {filteredData.length > 0 && Object.keys(filteredData[0]).map((key) => (
                <div className="th" key={key}>{key}</div>
              ))}
            </div>
            {filteredData.map((row, rowIndex) => (
              <div className="tr" key={rowIndex}>
                {Object.values(row).map((value, cellIndex) => (
                  <div className="td" key={cellIndex}>{value}</div>
                ))}
              </div>
            ))}
          </div>
        </StyledTable>
      </Modal>
    </div>
  );
};

export default ReportComponent;



