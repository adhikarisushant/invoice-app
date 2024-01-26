"use client";
import BreadCrumb from "@/components/breadcrumb";
import { BillingClient } from "@/components/tables/billing-tables/client";


const breadcrumbItems = [{ title: "Billing", link: "/dashboard/billing" }];
export default function page() {

    return (
        <>
            <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <BillingClient />
            </div>
        </>
    );
}
