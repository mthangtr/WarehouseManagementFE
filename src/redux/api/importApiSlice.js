import { apiSlice } from "./apiSlice";
import { IMPORT_URL } from "../constants";

export const importApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllImports: builder.query({
      query: ({ authToken, page = 1 }) => ({
        url: `${IMPORT_URL}/import`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          page,
        },
      }),
      providesTags: ["Import"],
      keepUnusedDataFor: 5,
    }),
    getAllImports2: builder.query({
      query: ({ authToken }) => ({
        url: `${IMPORT_URL}/import`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },

      }),
      providesTags: ["Import"],
      keepUnusedDataFor: 5,
    }),
    getImportById: builder.query({
      query: ({ importId, authToken }) => ({
        url: `${IMPORT_URL}/${importId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Import"],
    }),
    addImport: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${IMPORT_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Import"],
    }),
    getAllImportsByWarehouseId: builder.query({
      query: ({
        warehouseId,
        authToken,
        pageNo,
        sortBy,
        direction,
        status,
        search
      }) => ({
        url: `${IMPORT_URL}/by-warehouse/${warehouseId}`,
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
      providesTags: ["Import"],
      keepUnusedDataFor: 5,
    }),
    getTotalImportsByWarehouseId: builder.query({
      query: ({ warehouseId, authToken, status, search }) => ({
        url: `${IMPORT_URL}/by-warehouse/total/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          status,
          search
        },
      }),
    }),
    getLatestImport: builder.query({
      query: ({ authToken, warehouseId }) => ({
        url: `${IMPORT_URL}/by-warehouse/get-latest/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Import"],
      keepUnusedDataFor: 5,
    }),
    updateImport: builder.mutation({
      query: ({ id, data, authToken }) => ({
        url: `${IMPORT_URL}/${id}`,
        headers: { Authorization: `Bearer ${authToken}` },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Import"],
    }),
  }),
});

export const {
  useGetAllImportsQuery,
  useGetAllImports2Query,
  useGetImportByIdQuery,
  useAddImportMutation,
  useGetAllImportsByWarehouseIdQuery,
  useGetTotalImportsByWarehouseIdQuery,
  useGetLatestImportQuery,
  useUpdateImportMutation,
} = importApiSlice;
