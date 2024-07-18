import { apiSlice } from "./apiSlice";
import { EXPORT_URL } from "../constants";

export const exportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllExportsForAdmin: builder.query({
      query: ({ authToken, page = 1 }) => ({
        url: `${EXPORT_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          page,
        },
      }),
      providesTags: ["Export"],
      keepUnusedDataFor: 5,
    }),
    getAllExportsByWarehouseid: builder.query({
      query: ({
        warehouseId,
        authToken,
        pageNo,
        sortBy,
        direction,
        status,
        search
      }) => ({
        url: `${EXPORT_URL}/by-warehouse/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          pageNo,
          sortBy,
          direction,
          status,
          search
        },
      }),
      providesTags: ["Export"],
      keepUnusedDataFor: 5,
    }),
    getTotalExportsByWarehouseidAndFilterByStatus: builder.query({
      query: ({ warehouseId, authToken, status, search }) => ({
        url: `${EXPORT_URL}/by-warehouse/total/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          status,
          search
        },
      }),
    }),
    addExport: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${EXPORT_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Export"],
    }),
    getAllExports: builder.query({
      query: (authToken) => ({
        url: `${EXPORT_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Export"],
      keepUnusedDataFor: 5,
    }),
    deleteExport: builder.mutation({
      query: ({ exportId, authToken }) => ({
        url: `${EXPORT_URL}/${exportId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Export"],
    }),
    getExportById: builder.query({
      query: ({ exportId, authToken }) => ({
        url: `${EXPORT_URL}/${exportId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Export"],
    }),
    updateExportById: builder.mutation({
      query: ({ data, exportId, authToken }) => ({
        url: `${EXPORT_URL}/${exportId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Export"],
    }),
  }),
});

export const {
  useGetAllExportsForAdminQuery,
  useGetAllExportsByWarehouseidQuery,
  useGetTotalExportsByWarehouseidAndFilterByStatusQuery,
  useAddExportMutation,
  useGetAllExportsQuery,
  useDeleteExportMutation,
  useGetExportByIdQuery,
  useUpdateExportByIdMutation
} = exportApiSlice;



