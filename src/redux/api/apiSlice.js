import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Product",
    "Order",
    "User",
    "Warehouse",
    "Auth",
    "Category",
    "Zone",
    "Export",
    "Customer",
    "Inventory",
    "ExportDetail",
    "Import",
    "ImportDetail",
  ],
  endpoints: () => ({}),
});
