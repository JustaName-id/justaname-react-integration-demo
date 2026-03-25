"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function WalletOptions() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription>
          Choose a wallet to connect to the application
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        <appkit-button />
      </CardContent>
    </Card>
  )
}
