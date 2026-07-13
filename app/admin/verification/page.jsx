import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Store Verification Requests
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Manage your store verification requests settings and configuration.</p>
            </div>

            <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#1E1B4B] mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                </div>
                <h2 className="text-xl font-semibold text-[#111827]">Coming Soon</h2>
                <p className="text-[#6B7280] max-w-md">
                    This module is currently under development. It will be available in an upcoming phase of the platform update.
                </p>
                <Badge variant="warning">Phase Work In Progress</Badge>
            </Card>
        </div>
    )
}
