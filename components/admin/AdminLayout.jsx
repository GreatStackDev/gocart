"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Button from "../ui/Button";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { useUser, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const AdminLayout = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: token,
        },
      });
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
    }
  }, [user]);

  return loading ? (
    <Loading />
  ) : isAdmin ? (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <AdminSidebar />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-10 max-w-sm w-full">
        <h1 className="font-[family-name:var(--font-heading)] font-bold text-xl text-[#111827]">
          Admin access only
        </h1>
        <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
          This area is restricted to platform administrators.
        </p>
        <div className="mt-6">
          <Button variant="outline" size="md" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
