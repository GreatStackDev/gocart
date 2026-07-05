import StoreLayout from "@/components/store/StoreLayout";
import { SignIn } from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";


export const metadata = {
  title: "GoCart. - Store Dashboard",
  description: "GoCart. - Store Dashboard",
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
