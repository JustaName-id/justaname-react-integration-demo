import { mainnetProviderUrl } from '@/config/constants'
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [mainnet],
    connectors: [
      injected(),
      metaMask()
    ],
    transports: {
      [mainnet.id]: http(mainnetProviderUrl),
    },
  })
}