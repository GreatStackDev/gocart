'use client';

import React, { useRef, useState } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { Loader2Icon, UploadCloudIcon, XIcon } from 'lucide-react';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(\`Request failed with status \${response.status}: \${errorText}\`);
        }
        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(\`Authentication request failed: \${error.message}\`);
    }
};

export default function ImageUpload({ 
    onSuccess, 
    onError, 
    folder = "/gocart_uploads",
    buttonText = "Upload Image",
    className = ""
}) {
    const ikUploadRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleUploadStart = () => {
        setUploading(true);
    };

    const handleSuccess = (res) => {
        setUploading(false);
        setPreviewUrl(res.url);
        if (onSuccess) onSuccess(res.url);
    };

    const handleError = (err) => {
        setUploading(false);
        console.error("Upload Error:", err);
        if (onError) onError(err);
    };

    const triggerUpload = (e) => {
        e.preventDefault();
        ikUploadRef.current?.click();
    };

    const clearPreview = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewUrl(null);
        if (onSuccess) onSuccess(null);
    }

    if (!urlEndpoint || !publicKey) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                ImageKit environment variables are missing.
            </div>
        );
    }

    return (
        <IKContext
            urlEndpoint={urlEndpoint}
            publicKey={publicKey}
            authenticator={authenticator}
        >
            <div className={\`flex flex-col gap-2 \${className}\`}>
                <div 
                    onClick={!uploading ? triggerUpload : undefined}
                    className={\`
                        relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[12px] transition-all cursor-pointer overflow-hidden
                        \${previewUrl ? 'border-[#1E1B4B] bg-[#F9FAFB]' : 'border-[#E5E7EB] hover:border-[#F59E0B] hover:bg-[#FEF3C7]/20'}
                        \${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                    \`}
                >
                    {/* Hidden actual file input */}
                    <div className="hidden">
                        <IKUpload
                            fileName="upload.jpg"
                            folder={folder}
                            useUniqueFileName={true}
                            onUploadStart={handleUploadStart}
                            onSuccess={handleSuccess}
                            onError={handleError}
                            ref={ikUploadRef}
                            accept="image/*"
                        />
                    </div>

                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
                            <Loader2Icon className="w-8 h-8 text-[#F59E0B] animate-spin mb-2" />
                            <span className="text-sm font-medium text-[#1E1B4B]">Uploading...</span>
                        </div>
                    )}

                    {previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Preview" className="w-full h-32 object-contain rounded-md" />
                            <button 
                                onClick={clearPreview}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-sm border border-red-100 transition-colors"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center mb-3">
                                <UploadCloudIcon className="w-6 h-6 text-[#1E1B4B]" />
                            </div>
                            <span className="text-sm font-medium text-[#1E1B4B] mb-1">{buttonText}</span>
                            <span className="text-[11px] text-[#6B7280]">Click to browse or drag and drop</span>
                            <span className="text-[10px] text-[#9CA3AF] mt-2">Supports JPG, PNG, WEBP (Max 5MB)</span>
                        </div>
                    )}
                </div>
            </div>
        </IKContext>
    );
}
