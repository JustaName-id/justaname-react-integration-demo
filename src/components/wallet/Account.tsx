"use client"
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAccountSubnames } from '@justaname.id/react'
import { mainnetEnsDomain } from '@/config/constants'

export function Account() {
  const { address } = useAccount()
  const { accountSubnames } = useAccountSubnames()

  const ensName = useMemo(() => {
    return accountSubnames.find((subname) => subname.ens.endsWith(mainnetEnsDomain as string))?.ens
  }, [accountSubnames])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white text-xl font-bold">
              {address ? address.slice(2, 4).toUpperCase() : '??'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              Connected
            </Badge>

            {ensName ? (
              <div>
                <div className="text-lg font-semibold">
                  {ensName}
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {address && formatAddress(address)}
                </div>
              </div>
            ) : (
              <div className="text-lg font-mono">
                {address && formatAddress(address)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex justify-center">
        <appkit-button />
      </CardContent>
    </Card>
  )
}
