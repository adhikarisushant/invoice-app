"use client"

import { useProductsQuery, useSuppliersQuery, useTransactionsQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader";

export const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading: supplierLoading } = useSuppliersQuery({});
    const { isLoading: productsLoading } = useProductsQuery({});
    const { isLoading: transactionsLoading } = useTransactionsQuery({});
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