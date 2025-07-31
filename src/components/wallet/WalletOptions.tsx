"use client"
import { useConnect } from 'wagmi'
import { WalletOption } from './WalletOption'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export function WalletOptions() {
  const { connectors, connect, isPending } = useConnect()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription>
          Choose a wallet to connect to the application
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">

        <div className="flex flex-col gap-3">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() =>{ 
                console.log("connecting")
                connect({ connector })}}
            />
          ))}
        </div>
        
        {isPending && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            <div className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              <span>Establishing connection...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}