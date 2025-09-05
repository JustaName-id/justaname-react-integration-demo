# JustaName React Integration Demo

A comprehensive demonstration of how to integrate [JustaName](https://justaname.id) into a React application for ENS subname management. This demo showcases the complete workflow of claiming, managing, and revoking ENS subnames with a modern, user-friendly interface.

## 🚀 Features

### Core Functionality

- **Subname Claiming**: Create new ENS subnames with real-time availability checking
- **Metadata Management**: Add and edit text records (email, Twitter, URLs, etc.)
- **Address Records**: Manage cryptocurrency addresses for different chains
- **Content Hash**: Set IPFS/Swarm content hashes for decentralized content
- **Subname Revocation**: Permanently delete subnames when no longer needed

### User Experience

- **Real-time Validation**: Instant feedback on subname availability
- **Debounced Input**: Optimized API calls with 500ms debouncing
- **Loading States**: Clear visual feedback during blockchain operations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **React Hooks**: Custom hooks for debouncing and mobile detection
- **Wagmi Integration**: Ethereum wallet connection and transaction handling
- **Error Handling**: Comprehensive error handling for blockchain operations

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Wagmi + JustaName SDK
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/justaname-aurora-integration-demo.git
   cd justaname-aurora-integration-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the demo in action.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: JustaName API configuration
VITE_APP_ORIGIN=http://localhost:3000
VITE_APP_DOMAIN=localhost
VITE_APP_MAINNET_PROVIDER_URL=https://eth.drpc.org
VITE_APP_MAINNET_ENS_DOMAIN=ens_domain
VITE_APP_MAINNET_API_KEY=your_justaname_api_key_here
```

### JustaName SDK Configuration

The demo uses the JustaName React SDK which is configured in `src/providers.tsx`. Key configuration points:

- **Network**: Mainnet Ethereum (chainId: 1)
- **ENS Domain**: `.eth` (configurable)
- **Wallet Connection**: Supports all major wallets via Wagmi
- **JustANameProvider**: Wraps the app to provide JustaName functionality

## 📖 Usage Examples

### 1. Claiming a Subname

```tsx
import { useAddSubname } from "@justaname.id/react";

function MyComponent() {
  const { addSubname, isAddSubnamePending } = useAddSubname();

  const handleClaim = () => {
    addSubname({
      username: "alice",
      text: {
        email: "alice@example.com",
        twitter: "@alice",
      },
      addresses: {
        2147492101: address,
        // Note: For EVM chains other than Ethereum, coinType = chainId + 2147483648
        // Ethereum uses coinType 60
        // Example: Base (chainId 8453) = 8453 + 2147483648 = 2147492101
      },
    });
  };

  return (
    <button onClick={handleClaim} disabled={isAddSubnamePending}>
      {isAddSubnamePending ? "Claiming..." : "Claim Subname"}
    </button>
  );
}
```

### 2. Checking Availability

```tsx
import { useIsSubnameAvailable } from "@justaname.id/react";

function AvailabilityChecker() {
  const { isSubnameAvailable, isSubnameAvailablePending } =
    useIsSubnameAvailable({
      username: "alice",
      ensDomain: "example.eth",
    });

  if (isSubnameAvailablePending) return <div>Checking...</div>;

  return (
    <div>
      {isSubnameAvailable?.isAvailable ? "Available!" : "Already taken"}
    </div>
  );
}
```

### 3. Listing User's Subnames

```tsx
import { useAccountSubnames } from "@justaname.id/react";

function SubnamesList() {
  const { accountSubnames } = useAccountSubnames();

  if (accountSubnames.length === 0) {
    return <div>No subnames found</div>;
  }

  return (
    <div>
      <h3>Your Subnames ({accountSubnames.length})</h3>
      {accountSubnames.map((subname, index) => (
        <div key={index}>
          <div>{subname.ens}</div>
          {/* Display record counts */}
          {subname.records?.texts && (
            <span>
              {Object.keys(subname.records.texts).length} text records
            </span>
          )}
          {subname.records?.coins && (
            <span>{Object.keys(subname.records.coins).length} addresses</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 4. Resolving ENS Names

```tsx
import { useRecords } from "@justaname.id/react";
import { useState } from "react";

function ENSResolver() {
  const [ensName, setEnsName] = useState("");
  const { records, isRecordsFetching } = useRecords({
    ens: ensName,
    chainId: 1,
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Enter ENS name (e.g., vitalik.eth)"
        value={ensName}
        onChange={(e) => setEnsName(e.target.value)}
      />

      {isRecordsFetching && <p>Resolving...</p>}

      {records && (
        <div>
          {/* Text Records */}
          {records.records.texts &&
            Object.entries(records.records.texts).map(([, value]) => (
              <div key={value.key}>
                <strong>{value.key}:</strong> {value.value}
              </div>
            ))}

          {/* Address Records */}
          {records.records.coins &&
            Object.entries(records.records.coins).map(([coinType, address]) => (
              <div key={coinType}>
                <strong>
                  {coinType === "60" ? "ETH" : `Coin ${coinType}`}:
                </strong>{" "}
                {address.value}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Managing Records

```tsx
import { useUpdateSubname } from "@justaname.id/react";

function RecordManager() {
  const { updateSubname, isUpdateSubnamePending } = useUpdateSubname();

  const updateRecords = () => {
    updateSubname({
      ens: "alice.example.eth",
      chainId: 1,
      text: {
        email: "newemail@example.com",
        website: "https://alice.com",
      },
      addresses: {
        "60": "0x1234...", // ETH address
        "0": "bc1...", // BTC address
      },
      contentHash: "ipfs://QmYourHashHere",
    });
  };

  return (
    <button onClick={updateRecords} disabled={isUpdateSubnamePending}>
      Update Records
    </button>
  );
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── subname/
│   │   ├── SubnameForm.tsx      # Subname creation form
│   │   ├── SubnamesList.tsx     # List of user's subnames
│   │   └── SubnameDisplay.tsx   # Individual subname management
│   ├── wallet/
│   │   ├── ConnectWallet.tsx    # Wallet connection
│   │   └── Account.tsx          # Account display
│   └── ui/                      # shadcn/ui components
├── config/
│   └── constants.ts             # App constants
├── hooks/
│   ├── use-debounce.ts         # Custom debounce hook
│   └── use-mobile.ts           # Mobile detection hook
├── wagmi/
│   └── config.ts               # Wagmi configuration
└── App.tsx                     # Main application component
```

## 🔍 Key Components Explained

### SubnameForm

- **Purpose**: Create new ENS subnames
- **Features**: Real-time availability checking, metadata configuration
- **Validation**: Ensures subname availability and proper metadata format

### SubnamesList

- **Purpose**: Display all user's subnames
- **Features**: Record count display, status indicators
- **Behavior**: Only renders when user has subnames

### SubnameDisplay

- **Purpose**: Manage individual subname records
- **Features**: Text records, address records, content hash management
- **Actions**: Update records, revoke subname

### JustANameProvider

- **Purpose**: Provides JustaName functionality to the entire app
- **Configuration**: Handles API keys, network settings, and ENS domain configuration
- **Required**: Must wrap your app for all JustaName hooks to work

## 🎯 Integration Guide

### 1. Install Dependencies

```bash
bun install @justaname.id/react wagmi viem @tanstack/react-query
```

### 2. Configure Wagmi

```tsx
// src/wagmi/config.ts
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected(), walletConnect()],
  transports: {
    [mainnet.id]: http(),
  },
});
```

### 3. Wrap Your App with JustANameProvider

```tsx
// src/providers.tsx
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JustaNameProvider } from "@justaname.id/react";
import { config } from "./wagmi/config";

const queryClient = new QueryClient();

const justanameConfig = {
  config: {
    origin: "http://localhost:3000",
    domain: "localhost",
  },
  networks: [
    {
      chainId: 1,
      providerUrl: "https://eth.drpc.org",
    },
  ],
  ensDomains: [
    {
      ensDomain: "ens-domain",
      chainId: 1,
      apiKey: "your_justaname_api_key_here",
    },
  ],
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <JustaNameProvider config={justanameConfig}>
          {children}
        </JustaNameProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 4. Use JustaName Hooks

```tsx
import { useAddSubname, useAccountSubnames } from "@justaname.id/react";

function MyApp() {
  const { accountSubnames } = useAccountSubnames();

  return (
    <div>
      <h1>My Subnames: {accountSubnames.length}</h1>
      {/* Your components here */}
    </div>
  );
}
```

**Important**: The JustaNameProvider must wrap your app for all hooks to work properly.

## 🚨 Important Notes

### Security Considerations

- **Private Keys**: Never expose private keys in client-side code
- **Transaction Signing**: All transactions require user wallet approval
- **Network Selection**: Ensure users are on the correct network (Mainnet)

### Best Practices

- **JustANameProvider**: Always wrap your app with JustANameProvider for hooks to work
- **Debouncing**: Always debounce user input for availability checks
- **Loading States**: Provide clear feedback during blockchain operations
- **Error Handling**: Implement comprehensive error handling
- **Validation**: Validate all user inputs before submission
- **API Keys**: Keep your JustaName API key secure and leverage the domain allow list to secure it

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [JustaName Documentation](https://docs.justaname.id)
- [ENS Documentation](https://docs.ens.domains)
- [Wagmi Documentation](https://wagmi.sh)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [JustaName documentation](https://docs.justaname.id)
2. Review the [ENS documentation](https://docs.ens.domains)
3. Open an issue in this repository

---

**Built with ❤️ using JustaName, React, Wagmi, and modern web technologies.**
