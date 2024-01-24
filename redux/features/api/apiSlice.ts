import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),
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
    }),
  }),
});

export const { useSuppliersQuery, useProductsQuery, useTransactionsQuery } =
  apiSlice;
