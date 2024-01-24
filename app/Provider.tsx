"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

interface ProviderProps {
    children: ReactNode;
}

export function ReduxProvider({ children }: ProviderProps) {
    return <Provider store={store}>{children}</Provider>
}   