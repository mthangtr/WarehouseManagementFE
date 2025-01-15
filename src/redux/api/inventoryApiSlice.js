import { apiSlice } from "./apiSlice";
import { INVENTORY_URL } from "../constants";

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInventories: builder.query({
      query: (authToken) => ({
        url: `${INVENTORY_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Inventory"],
      keepUnusedDataFor: 5,
    }),
    getInventoryById: builder.query({
      query: (id) => ({
        url: `${INVENTORY_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addInventory: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${INVENTORY_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),
    deleteInventory: builder.mutation({
      query: ({ id, authToken }) => ({
        url: `${INVENTORY_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
    updateInventory: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${INVENTORY_URL}/${data.trackingId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),
    getInventoriesByZoneId: builder.query({
      query: ({ id, authToken }) => ({
        url: `${INVENTORY_URL}/zones/${id}/inventory`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Inventory"],
      keepUnusedDataFor: 5,
    }),
    // transferProduct: builder.mutation({
    //   query: ({ productId, fromZoneId, toZoneId, quantity, authToken }) => {
    //     const url = `${INVENTORY_URL}/transfer?productId=${productId}&fromZoneId=${fromZoneId}&toZoneId=${toZoneId}&quantity=${quantity}`;
    //     console.log('Request URL:', url); // Log the URL
    //     return {
    //       url,
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${authToken}`,
    //       },
    //     };
    //   },
    //   invalidatesTags: ["Inventory"],
    //   keepUnusedDataFor: 5,
    // }),
    getInventoriesByWarehouseId: builder.query({
      query: ({ warehouseId, authToken }) => ({
        url: `${INVENTORY_URL}/allByWarehouseId/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Inventory"],
      keepUnusedDataFor: 5,
    }),
    transferProduct: builder.mutation({
      query: ({ transferRequests, authToken }) => ({
        url: `${INVENTORY_URL}/transfer`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferRequests),
      }),
      invalidatesTags: ["Inventory"],
      keepUnusedDataFor: 5,
    }),
    getAllInventoriesByWarehouseIdAndProductId: builder.query({
      query: ({ warehouseId, productId, authToken }) => ({
        url: `${INVENTORY_URL}/by-product/${productId}/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Inventory"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetAllInventoriesQuery,
  useGetInventoryByIdQuery,
  useGetInventoriesByWarehouseIdQuery,
  useAddInventoryMutation,
  useDeleteInventoryMutation,
  useUpdateInventoryMutation,
  useGetInventoriesByZoneIdQuery,
  useTransferProductMutation,
  useGetAllInventoriesByWarehouseIdAndProductIdQuery,
} = inventoryApiSlice;
