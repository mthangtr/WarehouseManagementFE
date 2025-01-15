import { apiSlice } from "./apiSlice";
import { WAREHOUSE_URL } from "../constants";

export const warehousesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWarehouses: builder.query({
      query: (authToken) => ({
        url: `${WAREHOUSE_URL}/all`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Warehouse"],
      keepUnusedDataFor: 5,
    }),
    getWarehouseById: builder.query({
      query: ({ id, authToken }) => ({
        url: `${WAREHOUSE_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Warehouse"],
      keepUnusedDataFor: 5,
    }),
    addWarehouse: builder.mutation({
      query: ({ warehouseData, authToken }) => ({
        url: `${WAREHOUSE_URL}/add`,
        method: "POST",
        body: warehouseData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Warehouse"],
    }),
    updateWarehouse: builder.mutation({
      query: ({ warehouseId, formData, authToken }) => ({
        url: `${WAREHOUSE_URL}/${warehouseId}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Warehouse"],
    }),
    deleteWarehouse: builder.mutation({
      query: ({ warehouseId, authToken }) => ({
        url: `${WAREHOUSE_URL}/${warehouseId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Warehouse"],
    }),
    getWarehousesByUserId: builder.query({
      query: (id) => ({
        url: `${WAREHOUSE_URL}/user/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetAllWarehousesQuery,
  useGetWarehouseByIdQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehousesByUserIdQuery,
} = warehousesApiSlice;
