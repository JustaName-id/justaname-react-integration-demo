"use client"
import * as React from 'react'
import type { Connector } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface WalletOptionProps {
  connector: Connector
  onClick: () => void
}

export function WalletOption({ connector, onClick }: WalletOptionProps) {
  // const [ready, setReady] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // React.useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const provider = await connector.getProvider()
  //       setReady(!!provider)
  //     } catch (error) {
  //       console.error('Failed to get provider:', error)
  //       setReady(false)
  //     }
  //   })()
  // }, [connector])

  const handleClick = async (e: React.MouseEvent) => {
    console.log("handleClick")
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  console.log('connector', !isLoading)

  return (
    <Button
      disabled={isLoading}
      onClick={handleClick}
      onMouseDown={() => console.log("Mouse down!")}
      onMouseUp={() => console.log("Mouse up!")}
      style={{ zIndex: 1000 }}
      className={cn(
        "w-full max-w-sm h-12 relative overflow-hidden",
        "bg-gradient-to-r from-blue-500 to-blue-600",
        "hover:from-blue-600 hover:to-blue-700",
        "disabled:from-gray-400 disabled:to-gray-500",
        "text-white font-semibold rounded-lg shadow-lg cursor-pointer",
       !isLoading && "hover:scale-105",
        "transition-all duration-200"
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-md pointer-events-none z-10">
          <Spinner size="sm" className="text-white" />
        </div>
      )}
      <div className={cn("flex items-center gap-3", isLoading && "opacity-50")}>
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
        <span>{isLoading ? 'Connecting...' : `Connect ${connector.name}`}</span>
      </div>
    </Button>
  )
}