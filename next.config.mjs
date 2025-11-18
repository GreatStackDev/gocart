/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true
    },
    output: 'export',  // 啟用靜態導出（Firebase Hosting 需要）
    distDir: 'out'     // 輸出目錄
};

export default nextConfig;
