import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/turbo
  // dev 启用 --turbopack 时，走如下配置
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  experimental: {
    // to use Lingui macros
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

if (process.env.NODE_ENV === 'development') {
  // Object.assign(nextConfig, {
  //   output: undefined,
  //   async rewrites() {
  //     return [
  //       {
  //         source: '/:path*',
  //         has: [
  //           {
  //             type: 'header',
  //             key: 'X-Fetch-Type',
  //             value: 'API',
  //           },
  //         ],
  //         destination: `https://api.seed.xyz/:path*`,
  //       },
  //     ]
  //   },
  // })
}

export default nextConfig
