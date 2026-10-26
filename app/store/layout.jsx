import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "e-buy - Store Dashboard",
    description: "e-buy - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
