import { apiSlice } from "./apiSlice";
import { INVENTORY_SNAPSHOT_URL } from "../constants";

export const inventorySnapshotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventorySnapshotReport: builder.query({
      query: ({ authToken }) => ({
        url: `${INVENTORY_SNAPSHOT_URL}/warehouse-report`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        responseHandler: (response) => response.blob(), // Handling as blob for file download
      }),
    }),
    getCurrentInventorySnapshotReport: builder.query({
      query: ({ authToken }) => ({
        url: `${INVENTORY_SNAPSHOT_URL}/current-warehouse-report`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        responseHandler: (response) => response.blob(), // Handling as blob for file download
      }),
    }),
  }),
  
});

export const {useGetInventorySnapshotReportQuery, useGetCurrentInventorySnapshotReportQuery } = inventorySnapshotApiSlice;

