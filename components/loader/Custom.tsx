"use client"

import { useProductsQuery, useSuppliersQuery, useTransactionsQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader";
import ServerError from "../server-error";

export const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading: supplierLoading, isError: supplierIsError } = useSuppliersQuery({});
    const { isLoading: productsLoading, isError: productsIsError } = useProductsQuery({});
    const { isLoading: transactionsLoading, isError: transactionsIsError } = useTransactionsQuery({});

    if (supplierIsError) {
        return (
            <ServerError />
        )
    }
    if (productsIsError) {
        return (
            <ServerError />
        )
    }
    if (transactionsIsError) {
        return (
            <ServerError />
        )
    }
    if (supplierLoading) {
        return (
            <Loader />
        )
    } else if (productsLoading) {
        return (
            <Loader />
        )
    } else if (transactionsLoading) {
        return (
            <Loader />
        )
    }
    else {
        return (
            <>{children}</>
        )

    }
}