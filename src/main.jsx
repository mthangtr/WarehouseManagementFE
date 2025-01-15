import ReactDOM from "react-dom/client";
import App from "./layouts/App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Orders from "./pages/Admin/Orders.jsx";
import Staffs from "./pages/Admin/Staffs.jsx";
import Products from "./pages/Admin/Products.jsx";
import Data from "./pages/Admin/Data.jsx";
import Auth from "./layouts/Auth.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import AdminRoute from "./components/Routes/AdminRoute.jsx";
import StaffRoute from "./components/Routes/StaffRoute.jsx";
import DataWarehouse from "./pages/Admin/DataWarehouse.jsx";
import DataZone from "./pages/Admin/DataZone.jsx";
import DataCategory from "./pages/Admin/DataCategory.jsx";
import Error404 from "./utils/Error404.jsx";
import WarehouseZone from "./pages/Admin/WarehouseZone.jsx";
import Staff from "./layouts/Staff.jsx";
import StaffOrder from "./pages/Staff/StaffOrder.jsx";
import StaffData from "./pages/Staff/StaffData.jsx";
import StaffZone from "./pages/Staff/StaffZone.jsx";
import StaffProduct from "./pages/Staff/StaffProduct.jsx";
import StaffCustomer from "./pages/Staff/StaffCustomer.jsx";
import StaffExpport from "./pages/Staff/StaffExport.jsx";
import StaffImport from "./pages/Staff/StaffImport.jsx";
import StaffNewExport from "./pages/Staff/StaffAddExport.jsx";
import StaffExportDetail from "./pages/Staff/StaffExportDetail.jsx";
import StaffAddImport from "./pages/Staff/StaffAddImport.jsx";

import DataCustomers from "./pages/Admin/DataCustomers.jsx";
import StaffZoneInventory from "./pages/Staff/StaffZoneInventory.jsx";
import StaffDashboard from "./pages/Staff/StaffDashboard.jsx";
import MainDash from "./pages/Admin/MainDash.jsx";
import OrdersComponent from "./pages/Admin/OrdersComponent.jsx";
import DataComponent from "./pages/Admin/DataComponent.jsx";
import StaffsComponent from "./pages/Admin/StaffsComponent.jsx";
import ProductComponent from "./pages/Admin/ProductsComponent.jsx";
import OrderImport from "./pages/Admin/OrderImport.jsx";
import OrderExport from "./pages/Admin/OrderExport.jsx";
import ExportDetails from "./pages/Admin/ExportDetails.jsx";
import ImportDetails from "./pages/Admin/ImportDetails.jsx";
import ReportComponent from "./pages/Admin/ReportComponent.jsx";
import StaffTransfer from "./pages/Staff/StaffTransfer.jsx";
import StaffAddImportWarehouse from "./pages/Staff/StaffAddImportWarehouse.jsx";
import StaffImportDetail from "./pages/Staff/StaffImportDetail.jsx";
import { WebSocketProvider } from './components/WebSocket/WebSocketProvider.jsx';
import ListenerWrapper from "./components/WebSocket/ListenerWrapper.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* AUTH  */}
      <Route path="/" element={<Auth />} />
      {/* ADMIN  */}
      <Route path="/" element={<App />}>
        <Route path="" element={<AdminRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/data" element={<DataComponent />} />
          <Route path="/staffs" element={<StaffsComponent />} />
          <Route path="/products" element={<ProductComponent />} />
          <Route path="/data/warehouse" element={<DataWarehouse />} />
          <Route path="/data/zone" element={<DataZone />} />
          <Route path="/data/zone/warehouseId/:id" element={<WarehouseZone />} />
          <Route path="/data/category" element={<DataCategory />} />
          <Route path="/data/customer" element={<DataCustomers />} />
          <Route path="/order/import" element={<OrderImport />} />
          <Route path="/order/export" element={<OrderExport />} />
          <Route path="/order/export/:id" element={<ExportDetails />} />
          <Route path="/order/import/:id" element={<ImportDetails />} />
          <Route path="/report" element={<ReportComponent />} />
        </Route>
      </Route>
      {/* STAFF  */}
      <Route path="/staff" element={<Staff />}>
        <Route path="" element={<StaffRoute />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/orders" element={<StaffOrder />} />
          <Route path="/staff/data" element={<StaffProduct />} />
          <Route path="/staff/data/zone" element={<StaffZone />} />
          <Route path="/staff/data/zone/:zoneid/inventory" element={<StaffZoneInventory />} />
          {/* <Route path="/staff/data/products" element={<StaffProduct />} /> */}
          <Route path="/staff/data/customers" element={<StaffCustomer />} />
          <Route path="/staff/order/export" element={<StaffExpport />} />
          <Route path="/staff/order/import" element={<StaffImport />} />
          <Route path="/staff/export/new" element={<StaffNewExport />} />
          <Route path="/staff/import/new" element={<StaffAddImport />} />
          <Route path="/staff/import/from-warehouse" element={<StaffAddImportWarehouse />} />
          <Route path="/staff/export/detail/:id" element={<StaffExportDetail />} />
          <Route path="/staff/import/detail/:id" element={<StaffImportDetail />} />
        </Route>
      </Route>
      {/* Route 404 cho tất cả các route khác */}
      <Route path="*" element={<Error404 />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <WebSocketProvider>
      <ListenerWrapper>
        <RouterProvider router={router} />
      </ListenerWrapper>
    </WebSocketProvider>
  </Provider>
);
