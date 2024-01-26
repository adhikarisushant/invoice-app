"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useSuppliersQuery, useTransactionsQuery } from "@/redux/features/api/apiSlice";
import { useEffect, useState } from "react";



export const BillingClient = () => {
  const router = useRouter();

  const { data: allTransactionsData } = useTransactionsQuery({});
  const { data: allSuppliersData } = useSuppliersQuery({});

  const [tData, setTData] = useState([]);

  function modifiedData() {
    const mod = allTransactionsData?.map((i: any) => {
      const findName = allSuppliersData.find(
        (j: any) => j.id === i.supplierName
      );

      return (
        {
          supplierId: i.supplierName,
          supplierName: findName?.name || "",
          referenceNo: i.referenceNo,
          batch: i.batch,
          warehouse: i.warehouse,
          quantity: i.quantity,
          rate: i.rate,
          discount: i.discount,
          amount: i.amount,
          note: i.note,
          conditions: i.conditions
        }
      )
    })

    if (mod.length > 0) {

      setTData(mod)

      return mod;
    }

    return null

  }

  useEffect(() => {
    if (allTransactionsData.length > 0) {
      modifiedData();
    }

  }, [allTransactionsData])

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Transactions (${tData?.length})`}
          description="Manage Transactions."
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/billing/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {tData.length > 0 ? <DataTable searchKey="supplierName" columns={columns} data={tData} /> : null}

    </>
  );
};
