"use client";
import BreadCrumb from "@/components/breadcrumb";
import { BillingClient } from "@/components/tables/billing-tables/client";
import { users } from "@/constants/data";
import { useSuppliersQuery, useTransactionsQuery } from "@/redux/features/api/apiSlice";
import { Warehouse } from "lucide-react";

const breadcrumbItems = [{ title: "Billing", link: "/dashboard/billing" }];
export default function page() {
    const { data: allTransactionsData } = useTransactionsQuery({});
    const { data: allSuppliersData } = useSuppliersQuery({});

    const modifiedData: any[] = allTransactionsData?.map((i: any) => {
        const findName = allSuppliersData.find(
            (j: any) => j.id === i.supplierName
        );

        return (
            {
                supplierId: i.supplierName,
                supplierName: findName?.name || "",
                batch: i.batch,
                Warehouse: i.warehouse,
                quantity: i.quantity,
                rate: i.rate,
                discount: i.discount,
                amount: i.amount,
                note: i.note,
                conditions: i.conditions
            }
        )
    })

    console.log("modifiedData->", typeof modifiedData, modifiedData)

    return (
        <>
            <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <BillingClient data={modifiedData} />
            </div>
        </>
    );
}
