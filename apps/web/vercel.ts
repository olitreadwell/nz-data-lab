// Vercel project config. The CSP is generated at build time by
// scripts/generate-csp.mjs into out/_headers, which Vercel applies to the
// static export, so no headers block is needed here.
const config = {
  buildCommand: 'next build && node scripts/generate-csp.mjs',
};

export default config;
