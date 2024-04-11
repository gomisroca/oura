/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist', // Changes the build output directory to `./dist/`.  
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '4030',
            pathname: '/public/**',
          },
        ],
    },
}
   
export default nextConfig