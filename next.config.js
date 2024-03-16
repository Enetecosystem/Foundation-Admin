// const { fileURLToPath } = import("node:url");
// // import createJiti from "jiti";
// const createJiti = await import("jiti");
// const jiti = createJiti(fileURLToPath(import.meta.url));

// jiti("./env");
//
await import("./env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
