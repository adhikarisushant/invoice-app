import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    suppliers: builder.query({
      query: () => ({
        url: "suppliers",
        method: "GET",
      }),
    }),
    products: builder.query({
      query: () => ({
        url: "products",
        method: "GET",
      }),
    }),
    transactions: builder.query({
      query: () => ({
        url: "transactions",
        method: "GET",
      }),
      transformResponse: (res: any) =>
        res.sort((a: any, b: any) => b.referenceNo - a.referenceNo),
      providesTags: ["Transactions"],
    }),
    addTransaction: builder.mutation({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useSuppliersQuery,
  useProductsQuery,
  useTransactionsQuery,
  useAddTransactionMutation,
} = apiSlice;
