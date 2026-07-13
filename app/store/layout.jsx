import StoreLayout from "@/components/store/StoreLayout";
import { SignIn } from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";


export const metadata = {
  title: "Seller Dashboard | tradrsAvenue",
  description: "Manage your tradrsAvenue store, products, and orders.",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <Show when="signed-in">
        <StoreLayout>{children}</StoreLayout>
      </Show>

    <Show when="signed-out">
        <div className="min-h-screen flex items-center justify-center">
          <SignIn fallbackRedirectUrl="/store" routing="hash" />
        </div>
      </Show>
    </>
  );
}
