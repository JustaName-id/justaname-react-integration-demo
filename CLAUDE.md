# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Run linter
bun run lint

# Preview production build
bun run preview
```

## Architecture Overview

This is a React + TypeScript demo application showcasing JustAName SDK integration for ENS subname management. The application allows users to:
- Connect Ethereum wallets via Wagmi
- Claim and manage ENS subnames
- Update text records, addresses, and content hashes
- Resolve ENS names to addresses

### Key Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Blockchain**: Wagmi + @justaname.id/react SDK
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React Query (TanStack Query)

### Project Structure
- `src/providers.tsx`: Wraps app with JustANameProvider, WagmiProvider, and QueryClientProvider
- `src/wagmi/config.ts`: Wagmi configuration for wallet connections
- `src/config/constants.ts`: Environment variables and configuration
- `src/components/subname/`: ENS subname management components
- `src/components/wallet/`: Wallet connection components
- `src/components/ui/`: shadcn/ui components library

### Critical Configuration

The app requires environment variables in `.env` file:
```env
VITE_APP_ORIGIN=http://localhost:5173
VITE_APP_DOMAIN=localhost:5173
VITE_APP_MAINNET_PROVIDER_URL=<ethereum-rpc-provider-url>
VITE_APP_MAINNET_ENS_DOMAIN=<ens-domain>
VITE_APP_MAINNET_API_KEY=<justaname-api-key>
```

### JustAName SDK Integration

The JustANameProvider must wrap the entire application. Key hooks include:
- `useAddSubname`: Claim new subnames
- `useAccountSubnames`: List user's subnames
- `useUpdateSubname`: Update subname records
- `useRevokeSubname`: Delete subnames
- `useIsSubnameAvailable`: Check availability
- `useLookupAddress`: Resolve ENS names

### Important Notes

1. **Cointype for addresses**: When setting addresses, use the appropriate cointype (e.g., 2147492101 for Base chain)
2. **Provider Wrapping**: JustANameProvider must wrap the app for hooks to function
3. **Path Aliases**: Use `@/` for imports from `src/` directory
4. **Toast Notifications**: Use sonner for user feedback on subname operations