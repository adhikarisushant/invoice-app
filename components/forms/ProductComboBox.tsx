import React, { useEffect, useState } from 'react'
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
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface Product {
    id: string;
    name: string;
    batch: string;
    warehouse: string;
    rate: number;
}

type Props = {
    index: number;
    allProductsData: any[];
    handleSelectProduct: (index: number, value: string) => any;
}

const ProductComboBox: React.FC<Props> = ({ handleSelectProduct, index, allProductsData }) => {
    const [openPop, setOpenPop] = useState(false)
    const [productValue, setProductValue] = useState("");
    const [width, setWidth] = useState<number | null>();

    useEffect(() => {
        // @ts-ignore
        setWidth(document.getElementById('productButtonId').getBoundingClientRect().width);
    }, [])






    return (
        <Popover open={openPop} onOpenChange={setOpenPop}>
            <PopoverTrigger asChild>
                <Button
                    id="productButtonId"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPop}
                    className="w-full justify-between"
                >
                    {productValue
                        ? allProductsData.find((product: Product) => product.id === productValue)?.name
                        : "Add Code or Product"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: `${width}px` }}>
                <Command>
                    <CommandInput placeholder="Search Products..." />
                    <CommandEmpty>No Product found.</CommandEmpty>
                    <ScrollArea className="h-72 rounded-md border">
                        <CommandGroup>
                            {allProductsData.map((product: Product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.id}
                                    onSelect={(currentValue) => {
                                        setProductValue(currentValue)
                                        setOpenPop(false)
                                        handleSelectProduct(index, currentValue)
                                    }}
                                    className="h-24 cursor-pointer !pr-4"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            productValue === product.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />

                                    <div className="w-full flex items-center justify-between">
                                        <div className="self-start flex-col">
                                            <p className="text-sm font-medium text-slate-800 dark:text-white">{product.name}</p>
                                            <div className="flex items-end justify-start space-x-12 space-y-4">
                                                <p className="text-sm font-medium text-slate-700 dark:text-white">Bottles</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-white">Batch: <span className="text-green-700 dark:text-green-500">{product.batch}</span></p>
                                            </div>
                                        </div>
                                        <div className="self-end flex-col space-y-4">
                                            <p className="text-right text-sm font-medium text-slate-800 dark:text-white">{product.warehouse}</p>
                                            <p className="text-right text-sm font-medium text-slate-700 dark:text-white">Rs.{product.rate}</p>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover >
    )
}

export default ProductComboBox