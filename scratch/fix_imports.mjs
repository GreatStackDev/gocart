import fs from 'fs';
import path from 'path';

const routes = [
    'app/admin/products',
    'app/admin/users',
    'app/admin/verification',
    'app/admin/messages',
    'app/store/categories',
    'app/store/analytics',
    'app/store/messages',
    'app/store/store-profile',
    'app/store/social-share',
    'app/store/verification',
];

for (const route of routes) {
    const file = path.join(process.cwd(), route, 'page.jsx');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace('import { Card } from "@/components/ui/Card"', 'import Card from "@/components/ui/Card"');
        content = content.replace('import { Badge } from "@/components/ui/Badge"', 'import Badge from "@/components/ui/Badge"');
        fs.writeFileSync(file, content);
        console.log(`Fixed imports in ${route}/page.jsx`);
    }
}
