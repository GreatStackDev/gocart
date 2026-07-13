"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import { SaveIcon, StoreIcon, LinkIcon } from "lucide-react";

export default function StoreProfile() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    logoUrl: "",
  });

  const [currentLogo, setCurrentLogo] = useState("");

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/is-seller", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.storeInfo) {
        setStoreInfo({
          name: data.storeInfo.name || "",
          username: data.storeInfo.username || "",
          description: data.storeInfo.description || "",
          email: data.storeInfo.email || "",
          contact: data.storeInfo.contact || "",
          address: data.storeInfo.address || "",
          logoUrl: "", // Only set if they upload a new one
        });
        setCurrentLogo(data.storeInfo.logo || "");
      }
    } catch (error) {
      toast.error("Failed to load store profile");
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = await getToken();
      await axios.put("/api/store/profile", storeInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Store profile updated successfully!");
      if (storeInfo.logoUrl) {
        setCurrentLogo(storeInfo.logoUrl);
        setStoreInfo(prev => ({ ...prev, logoUrl: "" })); // Reset upload field
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
          Store Profile
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">Manage your public store identity and contact information.</p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        <Card className="p-6 md:p-8 space-y-8">
          
          {/* Identity Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-4 flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <StoreIcon className="w-5 h-5 text-[#F59E0B]" />
              Store Identity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Store Name</label>
                  <input
                    type="text"
                    name="name"
                    value={storeInfo.name}
                    onChange={onChangeHandler}
                    required
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Store Description</label>
                  <textarea
                    name="description"
                    value={storeInfo.description}
                    onChange={onChangeHandler}
                    rows="4"
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 resize-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Store Logo</label>
                {currentLogo && !storeInfo.logoUrl && (
                  <div className="mb-4 p-4 border border-[#E5E7EB] rounded-[8px] flex flex-col items-center">
                    <img src={currentLogo} alt="Current Logo" className="w-24 h-24 object-contain rounded-md bg-gray-50 border border-gray-100 mb-2" />
                    <span className="text-xs text-[#6B7280]">Current Logo</span>
                  </div>
                )}
                <ImageUpload 
                  folder="/store_logos" 
                  buttonText={currentLogo ? "Upload New Logo" : "Upload Logo"}
                  onSuccess={(url) => setStoreInfo(prev => ({ ...prev, logoUrl: url }))}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-4 flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <LinkIcon className="w-5 h-5 text-[#F59E0B]" />
              Contact & Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Business Email</label>
                <input
                  type="email"
                  name="email"
                  value={storeInfo.email}
                  onChange={onChangeHandler}
                  required
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={storeInfo.contact}
                  onChange={onChangeHandler}
                  required
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#374151]">Physical Address</label>
                <input
                  type="text"
                  name="address"
                  value={storeInfo.address}
                  onChange={onChangeHandler}
                  required
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                />
              </div>
            </div>
          </div>

        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#1E1B4B] text-white rounded-[8px] font-medium hover:bg-[#2D286E] transition-colors disabled:opacity-70"
          >
            {saving ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
            ) : (
              <><SaveIcon className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
