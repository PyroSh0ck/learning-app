import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // partial pre rendering :P
  // incremental means I can enable it and disable it on specific routes
  // by typing export const experimental_ppr = true (or false)
  // it defaults to false
  // but it applies to all child routes
  // experimental: {
  //   ppr: 'incremental',
  // },
};

export default nextConfig;
