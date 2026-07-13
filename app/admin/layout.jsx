import AdminLayout from "@/components/admin/AdminLayout";
import { Show, SignIn} from "@clerk/nextjs"

export const metadata = {
    title: "Admin Dashboard | tradrsAvenue",
    description: "tradrsAvenue platform administration",
};

export default function RootAdminLayout({ children }) {

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
