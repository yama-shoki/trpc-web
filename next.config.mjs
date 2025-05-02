/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // バックエンドのTypeScriptファイルを処理するための設定
    config.module.rules.push({
      test: /\.ts$/,
      use: "ts-loader",
      include: [/trcp-back\/src/],
    });

    // サーバーサイドとクライアントサイドで異なる設定を適用する例
    if (isServer) {
      // サーバーサイド特有の設定
      console.log("Server-side compilation");
    } else {
      // クライアントサイド特有の設定
      console.log("Client-side compilation");
    }

    return config;
  },
};

export default nextConfig;
