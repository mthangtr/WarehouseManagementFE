import { apiSlice } from "./apiSlice";
import { ZONE_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllZones: builder.query({
      query: (authToken) => ({
        url: `${ZONE_URL}/all`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Zone"],
      keepUnusedDataFor: 5,
    }),
    getZoneById: builder.query({
      query: ({ id, authToken }) => ({
        url: `${ZONE_URL}/${id}`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    addZone: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${ZONE_URL}/add`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Zone"],
    }),
    deleteZone: builder.mutation({
      query: ({ id, authToken }) => ({
        url: `${ZONE_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Zone"],
    }),
    updateZone: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${ZONE_URL}/${data.trackingId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Zone"],
    }),
    getZoneByWarehouseId: builder.query({
      query: ({ id, authToken }) => ({
        url: `${ZONE_URL}/warehouse/${id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Zone"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetAllZonesQuery,
  useGetZoneByIdQuery,
  useAddZoneMutation,
  useDeleteZoneMutation,
  useUpdateZoneMutation,
  useGetZoneByWarehouseIdQuery,
} = userApiSlice;
