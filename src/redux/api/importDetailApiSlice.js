import { apiSlice } from "./apiSlice";
import { IMPORT_DETAIL_URL } from "../constants";

export const importDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImportDetailsByImportId: builder.query({
      query: ({ importId, authToken }) => ({
        url: `${IMPORT_DETAIL_URL}/import/${importId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["ImportDetail"],
      keepUnusedDataFor: 5,
    }),
    createImportDetails: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${IMPORT_DETAIL_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ImportDetail"],
    }),
  }),
});

export const {
  useGetImportDetailsByImportIdQuery,
  useCreateImportDetailsMutation,
} = importDetailApiSlice;
