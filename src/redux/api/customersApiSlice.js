import { apiSlice } from "./apiSlice";
import { CUSTOMER_URL } from "../constants";

export const customersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: (authToken) => ({
        url: `${CUSTOMER_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Customer"],
      keepUnusedDataFor: 5,
    }),
    getCustomerById: builder.query({
      query: ({ id, authToken }) => ({
        url: `${CUSTOMER_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Customer"],
      keepUnusedDataFor: 5,
    }),
    addCustomer: builder.mutation({
      query: ({ customerData, authToken }) => ({
        url: `${CUSTOMER_URL}`,
        method: "POST",
        body: customerData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation({
      query: ({ customerId, formData, authToken }) => ({
        url: `${CUSTOMER_URL}/${customerId}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomerById: builder.mutation({
      query: ({ customerId, authToken }) => ({
        url: `${CUSTOMER_URL}/${customerId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Customer"],
    }),
    
  }),
});

export const {
 useGetAllCustomersQuery,useGetCustomerByIdQuery,useAddCustomerMutation,useUpdateCustomerMutation,useDeleteCustomerByIdMutation
} = customersApiSlice;
