'use client';

import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import AdminLayout from "./AdminLayout";

export default function AdminClerkWrapper({ children }) {
    return (
        <>
            <SignedIn>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/admin" routing="hash"/>
                </div>
            </SignedOut>
        </>
    );
}
