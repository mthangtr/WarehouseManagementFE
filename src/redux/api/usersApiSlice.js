import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (authToken) => ({
        url: `${USER_URL}/all`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: ({userId,authToken}) => ({
        url: `${USER_URL}/${userId}`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({data, authToken}) => ({
        url: `${USER_URL}/${data.trackingId}`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApiSlice;
