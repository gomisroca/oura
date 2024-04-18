/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist', // Changes the build output directory to `./dist/`.  
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'oura-blob.public.blob.vercel-storage.com',
            port: '',
          },
        ],
    },
}
   
export default nextConfig