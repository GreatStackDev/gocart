/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true
    }
    // 移除 output: 'export' 以支援動態路由
};

export default nextConfig;
