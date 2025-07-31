const origin = import.meta.env.VITE_APP_ORIGIN || 'http://localhost:3000';
const domain = import.meta.env.VITE_APP_DOMAIN || 'localhost';
const signInTtl = 1000 * 60 * 60 * 24;
const mainnetProviderUrl = import.meta.env.VITE_APP_MAINNET_PROVIDER_URL || '';
const mainnetEnsDomain = import.meta.env.VITE_APP_MAINNET_ENS_DOMAIN || '.eth';
const mainnetApiKey = import.meta.env.VITE_APP_MAINNET_API_KEY || '';

export { origin, domain, signInTtl, mainnetProviderUrl, mainnetEnsDomain, mainnetApiKey };
