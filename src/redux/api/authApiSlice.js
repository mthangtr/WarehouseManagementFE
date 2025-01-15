import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    addStaff: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${AUTH_URL}/signup`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useAddStaffMutation } = authApiSlice;
