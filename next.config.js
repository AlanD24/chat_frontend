/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXT_APP_API_LOCAL: "http://localhost:8080/api",
        NEXT_APP_API_URL: "https://chat-backend-phi.vercel.app:8080/api"
    },
    images: {
        domains: ['localhost']
    },
}

module.exports = nextConfig