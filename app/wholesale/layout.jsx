import WStoreLayout from "@/components/wholesale/WStoreLayout";

export const metadata = {
    title: "GoCart. - Store Dashboard",
    description: "GoCart. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <WStoreLayout>
                {children}
            </WStoreLayout>
        </>
    );
}
