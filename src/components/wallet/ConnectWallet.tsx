"use client"
import { useAccount } from 'wagmi'
import { Account } from './Account'
import { WalletOptions } from './WalletOptions'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export function ConnectWallet() {
  const { isConnected, isConnecting, isReconnecting } = useAccount()
  
  if (isConnecting || isReconnecting) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Spinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">
            {isReconnecting ? 'Reconnecting...' : 'Connecting...'}
          </p>
        </CardContent>
      </Card>
    )
  }
  
  if (isConnected) {
    return <Account />
  }
  
  return <WalletOptions />
}