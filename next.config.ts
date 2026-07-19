import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder project covers. Remove picsum once real screenshots live in /public.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "trxsutzqybrkeporwmcx.supabase.co" },
    ],
  },
};

export default nextConfig;
