import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Custom } from "@/components/loader/Custom";
import type { Metadata } from "next";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Bhawani Info Tech Dashboard",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ScrollArea>
                <Header />
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <main className="w-full pt-16">
                        <Custom>
                            {children}
                        </Custom>
                    </main>
                </div>
                <ScrollBar orientation="horizontal" />

            </ScrollArea>
        </>
    );
}

