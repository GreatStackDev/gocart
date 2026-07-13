import fs from 'fs';
import path from 'path';

const routes = [
    { path: 'app/admin/products', title: 'Products Management', role: 'Admin' },
    { path: 'app/admin/users', title: 'All Users', role: 'Admin' },
    { path: 'app/admin/verification', title: 'Store Verification Requests', role: 'Admin' },
    { path: 'app/admin/messages', title: 'Moderation Messages', role: 'Admin' },
    { path: 'app/store/categories', title: 'Store Categories', role: 'Store' },
    { path: 'app/store/analytics', title: 'Analytics & Reports', role: 'Store' },
    { path: 'app/store/messages', title: 'Customer Chat', role: 'Store' },
    { path: 'app/store/store-profile', title: 'Store Profile Settings', role: 'Store' },
    { path: 'app/store/social-share', title: 'Social Share Links', role: 'Store' },
    { path: 'app/store/verification', title: 'Get Verified', role: 'Store' },
];

for (const route of routes) {
    const dir = path.join(process.cwd(), route.path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const content = `import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    ${route.title}
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Manage your ${route.title.toLowerCase()} settings and configuration.</p>
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
`;
    
    fs.writeFileSync(path.join(dir, 'page.jsx'), content);
    console.log(`Created ${route.path}/page.jsx`);
}
