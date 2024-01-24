"use client";
import * as z from "zod";
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns"
import React, { useEffect, useState } from "react";
import { Heading } from "../ui/heading";
import { Button } from "../ui/button";
import { Trash, Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useProductsQuery, useSuppliersQuery } from "@/redux/features/api/apiSlice";
import ProductComboBox from "./ProductComboBox";
import { useToast } from "@/components/ui/use-toast"

interface InvoiceData {
    index: number | null;
    productId: string | null;
    quantity: number | null;
    rate: number | null;
    discount: number | null;
}

interface Supplier {
    id: string;
    name: string
}

interface Product {
    id: string;
    name: string;
    batch: string;
    warehouse: string;
    rate: number;
}

interface BillFormProps {
    initialData: any | null;
}

const ProductSchema = z.object({
    productId: z.string().min(1, { message: "Product is Required" }),
    batch: z.string(),
    warehouse: z.string(),
    quantity: z.number().min(1, { message: "Quantity is Required" }),
    rate: z.number(),
    discount: z.number(),
    amount: z.number().min(1, { message: "Amount is Required" })
})

const formSchema = z.object({
    supplierName: z.string().min(1, { message: "Supplier Name is Required" }),
    deliveryDate: z.date({ required_error: "Delivery Date is Required." }),
    referenceNo: z.string().min(2, { message: "Reference No. must be more than 2 characters." }).max(30),
    invoiceItems: z.array(ProductSchema),
    note: z.string(),
    conditions: z.string()
});

export const BillForm: React.FC<BillFormProps> = ({ initialData }) => {
    const { toast } = useToast()
    const router = useRouter()
    const { data: allSuppliersData } = useSuppliersQuery({});
    const { data: allProductsData } = useProductsQuery({});

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [width, setWidth] = useState();
    const title = initialData ? "Edit Debit Note" : "New Debit Note";
    const description = initialData ? "Edit a Invoice." : "Add a new Invoice";
    const action = initialData ? "Save changes" : "Create";

    const [amount, setAmount] = useState<Number>(0);
    const [discount, setDiscount] = useState<Number>(0);
    const [nonTaxable, setNonTaxable] = useState<Number>(0);
    const [taxable, setTaxable] = useState<Number>(0);
    const [grandTotal, setGrandTotal] = useState<Number>(0);
    const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([])

    useEffect(() => {
        if (invoiceData.length > 0) {
            // Calculate the sum of rates
            // @ts-ignore
            const totalRate = invoiceData.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
            setAmount(totalRate)

            // Calculate the sum of discounts
            // @ts-ignore
            const totalDiscount = invoiceData.reduce((acc, item) => acc + item.discount, 0);
            setDiscount(totalDiscount)

            // @ts-ignore
            setNonTaxable(amount + discount)

            // @ts-ignore
            setTaxable(nonTaxable * 0.13)

            // @ts-ignore
            setGrandTotal(nonTaxable + taxable)
        }

    }, [invoiceData])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supplierName: "",
            referenceNo: "",
            invoiceItems: [{ productId: "", batch: "", warehouse: "", quantity: 0, rate: 0, discount: 0, amount: 0 }],
            note: "",
            conditions: ""
        }
    })

    const { register, control, handleSubmit, formState, setValue, getValues, reset } = form;

    const { errors } = formState;

    // console.log("error->", errors);

    const { fields, append, remove } = useFieldArray({
        name: "invoiceItems",
        control,
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            console.log("data->", { values })
        } catch (error: any) {
            reset()
            console.log("error")
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
            setLoading(false);
        } finally {
            reset()
            setLoading(false);
            toast({
                variant: "success",
                title: "Success.",
                description: "POST Request was Successful.",
            });
            router.push("/dashboard");
        }
    }

    const handleSelectProduct = (index: number, value: string) => {

        const found = allProductsData.find((p: any) => p.id === value)

        let obj

        if (found) {
            obj = {
                productId: found.id,
                name: found.name,
                batch: found.batch,
                warehouse: found.warehouse,
                rate: found.rate,
            }
        }

        // @ts-ignore
        Object.entries(obj).forEach(entry => {
            const [key, value] = entry;
            // @ts-ignore
            setValue(`invoiceItems.${index}.${key}`, value);
        });

        calculateAmount(index);
    }

    const addOrUpdateInvoiceObject = (newObj: InvoiceData): void => {
        // Check if object with the same id exists in the array
        const existingObjIndex = invoiceData.findIndex(obj => obj.index === newObj.index);

        if (existingObjIndex !== -1) {
            // If object with the same id exists, replace it with the new object
            const newArray = [...invoiceData];
            newArray[existingObjIndex] = newObj;
            setInvoiceData(newArray);
        } else {
            // If object with the same id does not exist, add the new object to the array
            setInvoiceData(prevArray => [...prevArray, newObj]);
        }
    };



    let inputTimer: any;

    const calculateAmount = (index: any) => {

        // Clear previous timeout to avoid multiple rapid calls
        clearTimeout(inputTimer);

        // Set a new timeout for 5 seconds
        inputTimer = setTimeout(() => {
            const values = getValues([`invoiceItems.${index}.productId`, `invoiceItems.${index}.quantity`, `invoiceItems.${index}.rate`, `invoiceItems.${index}.discount`, `invoiceItems.${index}.amount`])
            // console.log("values->", values)
            // console.log("product->", values[0])
            // console.log("quantity->", values[1])
            // console.log("rate->", values[2])
            // console.log("discount->", values[3])

            const amount = (values[1] * values[2]) - values[3];

            const newObj: InvoiceData = {
                index: index,
                productId: values[0],
                quantity: values[1],
                rate: values[2],
                discount: values[3]
            }

            addOrUpdateInvoiceObject(newObj)

            setValue(`invoiceItems.${index}.amount`, amount);

            console.log("amount->", values[4])
        }, 100);
    }



    useEffect(() => {
        // @ts-ignore
        setWidth(document.getElementById('supplierButtonId').getBoundingClientRect().width);

    }, [width])



    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="md:grid md:grid-cols-3 gap-8">
                        {/* select supplier name */}
                        <FormField
                            control={form.control}
                            name="supplierName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel className="mt-2">Supplier Name<span className="text-red-500"> *</span></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    id="supplierButtonId"
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? allSuppliersData.find(
                                                            (supplier: Supplier) => supplier.id === field.value
                                                        )?.name
                                                        : "Select Supplier"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent id="supplierButton2Id" className="p-0" style={{ width: `${width}px` }}>
                                            <Command>
                                                <CommandInput placeholder="Search Supplier..." />
                                                <CommandEmpty>No Supplier found.</CommandEmpty>
                                                <ScrollArea className="h-52 rounded-md border">
                                                    <CommandGroup>
                                                        {allSuppliersData.map((supplier: Supplier) => (
                                                            <>
                                                                <CommandItem
                                                                    value={supplier.name}
                                                                    key={supplier.id}
                                                                    onSelect={() => {
                                                                        form.setValue("supplierName", supplier.id);

                                                                    }}
                                                                    className="h-10 cursor-pointer"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            supplier.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {supplier.name}
                                                                </CommandItem>
                                                                <Separator />
                                                            </>
                                                        ))}
                                                    </CommandGroup>
                                                </ScrollArea>
                                            </Command>
                                        </PopoverContent>

                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* date picker */}
                        <FormField
                            control={form.control}
                            name="deliveryDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="mt-2">Delivery date<span className="text-red-500"> *</span></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* reference no. */}
                        <FormField
                            control={form.control}
                            name="referenceNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice reference no.<span className="text-red-500"> *</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Select Invoice reference"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />

                    <Table>
                        <TableCaption onClick={() => append({ productId: "", batch: "", warehouse: "", quantity: 0, rate: 0, discount: 0, amount: 0 })} className="!max-w-80 cursor-pointer hover:text-green-700 hover:underline underline-offset-4">Add code or product</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Item/Product</TableHead>
                                <TableHead className="w-[10%]">Batch</TableHead>
                                <TableHead className="w-[10%]">Warehouse</TableHead>
                                <TableHead className="text-right w-[10%]">Qty</TableHead>
                                <TableHead className="w-[10%]">Rate</TableHead>
                                <TableHead className="w-[10%]">Discount</TableHead>
                                <TableHead className="w-[10%]">Amount</TableHead>
                                <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {fields.map((field, index) => {
                                return (

                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <ProductComboBox
                                                index={index}
                                                handleSelectProduct={handleSelectProduct}
                                                allProductsData={allProductsData}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Input type="text" disabled placeholder="" {...register(`invoiceItems.${index}.batch` as const)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input type="text" disabled placeholder="" {...register(`invoiceItems.${index}.warehouse` as const)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input min="0" className="text-right" type="number" placeholder="" {...register(`invoiceItems.${index}.quantity` as const, { valueAsNumber: true })} onInput={(event) => calculateAmount(index)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input className="text-right" disabled type="number" placeholder="" {...register(`invoiceItems.${index}.rate` as const)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input min="0" className="text-right" type="number" placeholder="" {...register(`invoiceItems.${index}.discount` as const, { valueAsNumber: true })} onInput={(event) => calculateAmount(index)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input className="text-right w-full" disabled type="number" placeholder="" {...register(`invoiceItems.${index}.amount` as const, { valueAsNumber: true })} />
                                        </TableCell>
                                        <TableCell><X onClick={() => remove(index)} color="#FF0000" className="cursor-pointer hover:scale-125" /></TableCell>
                                    </TableRow>

                                );
                            })}




                        </TableBody>
                    </Table>
                    <Separator />
                    <div className="flex items-start justify-between space-x-28 px-6">
                        <div className="w-1/2">
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter notes"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            *This will appear on print
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/2">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Total</TableCell>
                                        <TableCell className="text-right">Rs. {amount.toString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Total Excise Duty</TableCell>
                                        <TableCell className="text-right">0</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Discount</TableCell>
                                        <TableCell className="text-right">Rs. {discount.toString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Non Taxable Total</TableCell>
                                        <TableCell className="text-right">Rs. {nonTaxable.toString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Taxable Total</TableCell>
                                        <TableCell className="text-right">Rs. {taxable.toString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">VAT</TableCell>
                                        <TableCell className="text-right">13%</TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell>Grand Total</TableCell>
                                        <TableCell className="text-right">Rs. {grandTotal.toString()}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                    <Separator />
                    <FormField
                        control={form.control}
                        name="conditions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Terms & Conditions</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter notes"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    *This will appear on print
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-36 ml-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                        {action}
                    </Button>


                </form >
            </Form >
        </>
    )
}