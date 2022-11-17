/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@avs/vrm-avatar']);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl)$/,
      use: {
        loader: 'raw-loader',
      }
    })
    return config
  }
}

module.exports = withTM(nextConfig);
