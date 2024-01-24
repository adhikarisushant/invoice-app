"use client";
import BreadCrumb from "@/components/breadcrumb";
import { BillingClient } from "@/components/tables/billing-tables/client";
import { users } from "@/constants/data";
import { useTransactionsQuery } from "@/redux/features/api/apiSlice";

const breadcrumbItems = [{ title: "Billing", link: "/dashboard/billing" }];
export default function page() {
    const { data: allTransactionsData } = useTransactionsQuery({});

    console.log('allTransactionsData-', allTransactionsData)
    return (
        <>
            <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <BillingClient data={allTransactionsData ? allTransactionsData : []} />
            </div>
        </>
    );
}
