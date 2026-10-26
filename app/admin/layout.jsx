import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "e-buy - Admin Dashboard",
    description: "e-buy - Admin Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
