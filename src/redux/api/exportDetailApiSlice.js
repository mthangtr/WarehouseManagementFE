import { apiSlice } from "./apiSlice";
import { EXPORT_DETAIL_URL } from "../constants";

export const exportDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllExportDetails: builder.query({
      query: (authToken) => ({
        url: `${EXPORT_DETAIL_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["ExportDetail"],
      keepUnusedDataFor: 5,
    }),
    getExportDetailsByExportId: builder.query({
      query: ({ exportId, authToken }) => ({
        url: `${EXPORT_DETAIL_URL}/export/${exportId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["ExportDetail"],
      keepUnusedDataFor: 5,
    }),
    createExportDetails: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${EXPORT_DETAIL_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExportDetail"],
    }),
    getAllExportDetailsByExportId: builder.query({
      query: ({ authToken, exportId }) => ({
        url: `${EXPORT_DETAIL_URL}/export-products/${exportId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["ExportDetail"],
      keepUnusedDataFor: 5,
    }),
    deleteExportDetails: builder.mutation({
      query: ({ ids, authToken }) => ({
        url: `${EXPORT_DETAIL_URL}/list-delete`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: ids,
      }),
      invalidatesTags: ["ExportDetail"],
    }),
    updateExportDetails: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${EXPORT_DETAIL_URL}/list-update`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: ["ExportDetail"],
    }),
    checkAvailableQuantity: builder.mutation({
      query: ({ authToken, data }) => ({
        url: `${EXPORT_DETAIL_URL}/check-available-quantity`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExportDetail"],
    }),
  }),
});

export const {
  useGetAllExportDetailsQuery,
  useCreateExportDetailsMutation,
  useGetAllExportDetailsByExportIdQuery,
  useDeleteExportDetailsMutation,
  useUpdateExportDetailsMutation,
  useCheckAvailableQuantityMutation,
} = exportDetailApiSlice;
