/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXT_APP_API_URL: "http://localhost:8080/api"
    },
}

module.exports = nextConfig