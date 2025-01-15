import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: ({ newCategory, authToken }) => ({
        url: `${CATEGORY_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory, authToken }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: ({ categoryId, authToken }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],

    }),

    getCategories: builder.query({
      query: (authToken) => ({
        url: `${CATEGORY_URL}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),
    getCategoryById: builder.query({
      query: ({ id, authToken }) => ({
        url: `${CATEGORY_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      keepUnusedDataFor: 5,

    }),
  }),
});

export const {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery
} = categoryApiSlice;
