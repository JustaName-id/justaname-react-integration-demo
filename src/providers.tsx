import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { JustaNameProvider } from "@justaname.id/react";
import { QueryClient } from "@tanstack/query-core";
import { wagmiAdapter, config, networks } from "@/wagmi/config";
import { useState } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { origin, domain, mainnetApiKey, mainnetEnsDomain, mainnetProviderUrl, reownProjectId } from "@/config/constants";
import type { JustaNameProviderConfig } from "@justaname.id/react";
import { createAppKit } from "@reown/appkit/react";

const metadata = {
    name: "JustaName Demo",
    description: "JustaName React Integration Demo",
    url: origin,
    icons: [],
};

createAppKit({
    adapters: [wagmiAdapter],
    projectId: reownProjectId,
    networks: [networks[0], ...networks.slice(1)],
    defaultNetwork: networks[0],
    metadata,
    features: { analytics: true },
});

export interface ProviderProps {
    children?: React.ReactNode;
}

export const Providers: React.FC<ProviderProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    console.error('Query failed:', error);
                    return failureCount < 3;
                },
                staleTime: 1000 * 60 * 5,
            },
        },
    }));

    const missingVars = [];
    if (!mainnetProviderUrl) missingVars.push('MAINNET_PROVIDER_URL');
    if (!mainnetApiKey) missingVars.push('MAINNET_API_KEY');
    if (!mainnetEnsDomain) missingVars.push('MAINNET_ENS_DOMAIN');
    if (!reownProjectId) missingVars.push('REOWN_PROJECT_ID');

    if (missingVars.length > 0) {
        console.warn('Missing configuration variables:', missingVars);
    }

    const justanameConfig: JustaNameProviderConfig = {
        config: {
            origin,
            domain: domain || 'localhost',
        },
        networks: [
            {
                chainId: 1,
                providerUrl: mainnetProviderUrl || '',
            },
        ],
        ensDomains: [{
            ensDomain: mainnetEnsDomain,
            chainId: 1,
            apiKey: mainnetApiKey,
        }],
    };

    return (
        <ErrorBoundary>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <JustaNameProvider config={justanameConfig}>
                        {children}
                    </JustaNameProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ErrorBoundary>
    )
}
