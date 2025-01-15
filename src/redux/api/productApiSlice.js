import { PRODUCT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: ({ productData, authToken }) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    getAllProducts: builder.query({
      query: (authToken) => ({
        url: `${PRODUCT_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductById: builder.query({
      query: ({ productId, authToken }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    updateProduct: builder.mutation({
      query: ({ productId, formData, authToken }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: ({ productId, authToken }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    getProductListsForAutoSelect: builder.query({
      query: ({ authToken, warehouseId, pageNo, sortBy, direction, categoryId, search }) => ({
        url: `${PRODUCT_URL}/product-list-for-auto-select/${warehouseId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          pageNo,
          sortBy,
          direction,
          categoryId,
          search,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductListsForAutoSelectQuery
} = productApiSlice;
