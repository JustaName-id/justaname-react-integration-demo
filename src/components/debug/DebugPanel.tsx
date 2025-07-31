"use client"
import { useAccount, useConnect } from 'wagmi'
import { useAccountSubnames } from "@justaname.id/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { origin, domain, mainnetEnsDomain, mainnetProviderUrl, mainnetApiKey } from "@/config/constants"

export function DebugPanel() {
  const { isConnected, isConnecting, address, connector } = useAccount()
  const { connectors } = useConnect()
  const { accountSubnames } = useAccountSubnames()

  if (import.meta.env.VITE_APP_ENV !== 'development') {
    return null
  }

  return (
    <Card className="mt-8 bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">🐛 Debug Panel</CardTitle>
        <CardDescription>
          Development information (only visible in dev mode)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Wallet Status</h4>
          <div className="space-y-1">
            <div>Connected: <Badge variant={isConnected ? "secondary" : "outline"}>{isConnected ? "Yes" : "No"}</Badge></div>
            <div>Connecting: <Badge variant={isConnecting ? "destructive" : "outline"}>{isConnecting ? "Yes" : "No"}</Badge></div>
            <div>Address: <code className="text-xs">{address || "Not connected"}</code></div>
            <div>Connector: <code className="text-xs">{connector?.name || "None"}</code></div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Available Connectors</h4>
          <div className="space-y-1">
            {connectors.map((c, i) => (
              <div key={i}>
                <Badge variant="outline">{c.name}</Badge> - {c.type}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Environment Variables</h4>
          <div className="space-y-1 text-xs">
            <div>ORIGIN: {origin || "❌ Missing"}</div>
            <div>DOMAIN: {domain || "❌ Missing"}</div>
            <div>MAINNET_ENS_DOMAIN: {mainnetEnsDomain || "❌ Missing"}</div>
            <div>PROVIDER_URL: {mainnetProviderUrl ? "✅ Set" : "❌ Missing"}</div>
            <div>API_KEY: {mainnetApiKey ? "✅ Set" : "❌ Missing"}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Account Subnames</h4>
          <div>
            Count: <Badge variant="outline">{accountSubnames.length}</Badge>
          </div>
          {accountSubnames.length > 0 && (
            <div className="space-y-1">
              {accountSubnames.map((subname, i) => (
                <div key={i} className="text-xs">
                  <code>{subname.ens}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}