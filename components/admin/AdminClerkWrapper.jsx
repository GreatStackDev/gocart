'use client';

import { Show, SignIn } from "@clerk/nextjs";
import AdminLayout from "./AdminLayout";

export default function AdminClerkWrapper({ children }) {
    return (
        <>
            <Show when="signed-in">
                <AdminLayout>
                    {children}
                </AdminLayout>
            </Show>
            <Show when="signed-out">
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/admin" routing="hash"/>
                </div>
            </Show>
        </>
    );
}
