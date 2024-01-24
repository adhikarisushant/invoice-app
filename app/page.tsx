import { redirect } from 'next/navigation'
// import { Button } from "@/components/ui/button";
// import { useDispatch } from "react-redux";
// import { AppDispatch, useAppSelector } from "@/redux/store";
// import { clear } from "@/redux/features/userSlice";

export default function Home() {

  // const username = useAppSelector((state) => state.user.value.username)

  // const dispatch = useDispatch<AppDispatch>();


  redirect("/dashboard");
}
