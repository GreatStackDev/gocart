"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import { CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon, StoreIcon, UserIcon, ShieldCheckIcon } from "lucide-react";

export default function CreateStore() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    logoUrl: "",
    idDocUrl: "",
  });

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchSellerStatus();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  const fetchSellerStatus = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/create", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.status) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!storeInfo.name || !storeInfo.username || !storeInfo.description || !storeInfo.logoUrl) {
        return toast.error("Please fill in all store profile fields including the logo.");
      }
    }
    if (currentStep === 2) {
      if (!storeInfo.email || !storeInfo.contact || !storeInfo.address) {
        return toast.error("Please fill in all contact and location fields.");
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const onSubmitHandler = async () => {
    if (!storeInfo.idDocUrl) {
      return toast.error("Please upload your SA ID document for verification.");
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      await axios.post("/api/store/create", storeInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Store application submitted successfully!");
      setStatus("pending");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <StoreIcon className="w-16 h-16 text-[#E5E7EB] mb-4" />
        <h1 className="text-2xl font-bold text-[#1E1B4B]">Start Selling on tradrsAvenue</h1>
        <p className="text-[#6B7280] mt-2 mb-6 max-w-md">You need to be logged in to create a store and start selling your products.</p>
        <button onClick={() => router.push('/sign-in')} className="bg-[#1E1B4B] text-white px-6 py-2.5 rounded-[8px] font-medium hover:bg-[#2D286E] transition-colors">
          Sign In to Continue
        </button>
      </div>
    );
  }

  // If already submitted (pending, approved, rejected)
  if (status && status !== "not_found") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
        <Card className="max-w-md w-full p-8 flex flex-col items-center text-center">
          {status === "approved" && (
            <>
              <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-8 h-8 text-[#065F46]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-2">Store Approved!</h2>
              <p className="text-[#6B7280] mb-6">Your store has been verified. You can now access your seller dashboard.</p>
              <button onClick={() => router.push('/store')} className="bg-[#1E1B4B] text-white w-full py-2.5 rounded-[8px] font-medium">
                Go to Dashboard
              </button>
            </>
          )}
          {status === "pending" && (
            <>
              <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mb-4">
                <StoreIcon className="w-8 h-8 text-[#92400E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-2">Application Under Review</h2>
              <p className="text-[#6B7280] mb-6">We are currently reviewing your store application and verifying your ID. We'll notify you once approved.</p>
              <button onClick={() => router.push('/')} className="border border-[#E5E7EB] text-[#374151] w-full py-2.5 rounded-[8px] font-medium hover:bg-gray-50">
                Return Home
              </button>
            </>
          )}
          {status === "rejected" && (
            <>
              <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-[#991B1B]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-2">Application Rejected</h2>
              <p className="text-[#6B7280] mb-6">Unfortunately, your store application could not be verified. Please contact support for more information.</p>
              <button onClick={() => window.location.href='mailto:support@tradrsavenue.co.za'} className="bg-[#1E1B4B] text-white w-full py-2.5 rounded-[8px] font-medium">
                Contact Support
              </button>
            </>
          )}
        </Card>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Store Profile", icon: StoreIcon },
    { num: 2, title: "Contact Details", icon: UserIcon },
    { num: 3, title: "Verification", icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
            Create Your Store
          </h1>
          <p className="mt-2 text-[#6B7280]">Join tradrsAvenue and start selling to thousands of buyers.</p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E5E7EB] z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#F59E0B] z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.num;
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center bg-[#FAFAF7] px-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#FAFAF7] transition-colors duration-300 ${isActive ? 'bg-[#F59E0B] text-white' : 'bg-[#E5E7EB] text-[#9CA3AF]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-[#1E1B4B]' : 'text-[#9CA3AF]'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#1E1B4B] border-b border-[#E5E7EB] pb-3">Store Identity</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Store Name</label>
                  <input
                    type="text"
                    name="name"
                    value={storeInfo.name}
                    onChange={onChangeHandler}
                    placeholder="e.g. Vintage Vault"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Unique Username</label>
                  <input
                    type="text"
                    name="username"
                    value={storeInfo.username}
                    onChange={onChangeHandler}
                    placeholder="e.g. vintagevault"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition-shadow"
                  />
                  <p className="text-[11px] text-[#9CA3AF]">This will be your unique store URL.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Store Description</label>
                <textarea
                  name="description"
                  value={storeInfo.description}
                  onChange={onChangeHandler}
                  rows="4"
                  placeholder="Tell buyers what you sell and why they should buy from you..."
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition-shadow resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Store Logo</label>
                <ImageUpload 
                  folder="/store_logos" 
                  buttonText="Upload Store Logo" 
                  onSuccess={(url) => setStoreInfo(prev => ({ ...prev, logoUrl: url }))}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#1E1B4B] border-b border-[#E5E7EB] pb-3">Contact & Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    value={storeInfo.email}
                    onChange={onChangeHandler}
                    placeholder="contact@store.com"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#374151]">Contact Number</label>
                  <input
                    type="tel"
                    name="contact"
                    value={storeInfo.contact}
                    onChange={onChangeHandler}
                    placeholder="+27 82 123 4567"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Physical Address / City</label>
                <input
                  type="text"
                  name="address"
                  value={storeInfo.address}
                  onChange={onChangeHandler}
                  placeholder="e.g. 123 Main St, Cape Town, 8001"
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition-shadow"
                />
                <p className="text-[11px] text-[#9CA3AF]">Helps us calculate localized shipping rates accurately.</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#1E1B4B] border-b border-[#E5E7EB] pb-3">Identity Verification</h2>
              
              <div className="bg-[#EEF2FF] p-4 rounded-[8px] border border-[#C7D2FE] flex gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-[#1E1B4B] shrink-0" />
                <div className="text-sm text-[#374151]">
                  <p className="font-semibold text-[#1E1B4B] mb-1">Why do we need this?</p>
                  To keep tradrsAvenue safe and secure, we require all sellers to upload a clear photo of their valid South African ID card or book. Your data is encrypted and only used for verification purposes.
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#374151]">Upload SA ID Document</label>
                <ImageUpload 
                  folder="/verification_docs" 
                  buttonText="Upload ID Document" 
                  onSuccess={(url) => setStoreInfo(prev => ({ ...prev, idDocUrl: url }))}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
            {currentStep > 1 ? (
              <button 
                onClick={prevStep}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E7EB] rounded-[8px] text-[#374151] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div> // Empty div for flex spacing
            )}

            {currentStep < 3 ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E1B4B] text-white rounded-[8px] font-medium hover:bg-[#2D286E] transition-colors"
              >
                Continue <ArrowRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={onSubmitHandler}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#F59E0B] text-white rounded-[8px] font-medium hover:bg-[#D97706] transition-colors disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application <CheckCircleIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
