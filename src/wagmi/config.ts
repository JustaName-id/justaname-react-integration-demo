import { mainnetProviderUrl, reownProjectId, mainnetApiKey } from '@/config/constants'
import { createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet } from '@reown/appkit/networks'
import { jaw } from '@jaw.id/wagmi'

const jawConnector = jaw({
  apiKey: mainnetApiKey,
  appName: 'JustaName Demo',
  defaultChainId: mainnet.id,
})

export const networks = [mainnet]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: localStorage }),
  projectId: reownProjectId,
  networks,
  connectors: [jawConnector],
  transports: {
    [mainnet.id]: http(mainnetProviderUrl || undefined),
  },
})

export const config = wagmiAdapter.wagmiConfig
