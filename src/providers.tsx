import { WagmiProvider} from "wagmi";
import {QueryClientProvider} from "@tanstack/react-query";
import {JustaNameProvider} from "@justaname.id/react";
import {QueryClient} from "@tanstack/query-core";
import {getConfig} from "@/wagmi/config";
import { useState} from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { origin, domain, mainnetApiKey, mainnetEnsDomain, mainnetProviderUrl } from "@/config/constants";
import type { JustaNameProviderConfig } from "@justaname.id/react";

export interface ProviderProps {
    children?: React.ReactNode;
}

export const Providers: React.FC<ProviderProps> = ({ children }) => {
    // Create query client with error handling
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    console.error('Query failed:', error);
                    return failureCount < 3;
                },
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
        },
    }));

    const [config] = useState(() => getConfig())

    // Check if required constants are properly set
    const missingVars = [];
    if (!mainnetProviderUrl) missingVars.push('MAINNET_PROVIDER_URL');
    if (!mainnetApiKey) missingVars.push('MAINNET_API_KEY');
    if (!mainnetEnsDomain) missingVars.push('MAINNET_ENS_DOMAIN');
    
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
        ensDomains:[{
            ensDomain: mainnetEnsDomain,
            chainId: 1,
            apiKey:  mainnetApiKey,
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
