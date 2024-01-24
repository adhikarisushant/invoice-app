"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function ServerError() {
    const router = useRouter();

    // Force refresh the page
    const handleReload = () => {
        // router.reload();
        console.log("reload")
    };

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
            <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
                500
            </span>
            <h2 className="my-2 font-heading text-2xl font-bold">
                Server&apos;s sleepingb
            </h2>
            <p>
                Sorry, the request you are making has failed due to Server Error. Please check if the JSON Server is running properly on watch mode.
            </p>
            <div className="mt-8 flex justify-center gap-2">
                <Button onClick={() => router.push("/dashboard")} variant="ghost" size="lg">
                    Back to Home
                </Button>
                <Button
                    onClick={handleReload}
                    variant="default"
                    size="lg"
                >
                    Retry
                </Button>
            </div>
        </div>
    );
}