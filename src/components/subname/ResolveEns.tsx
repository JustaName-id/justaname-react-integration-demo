"use client"
import { useRecords } from "@justaname.id/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { Search, ExternalLink } from 'lucide-react'

/**
 * ResolveEns Component
 * 
 * This component allows users to resolve any ENS name and view its records.
 * It displays all records (text, coins, contentHash) in a read-only format.
 * The component is always displayed regardless of wallet connection or subname ownership.
 */
export function ResolveEns() {
  const [ensName, setEnsName] = useState<string>('');
  const [resolvedEns, setResolvedEns] = useState<string>('');

  // Hook to resolve ENS records
  const { records, isRecordsFetching } = useRecords({
    ens: resolvedEns,
    chainId: 1,
  });

  console.log(isRecordsFetching);

  const error = resolvedEns && !isRecordsFetching && !records;

  // Type assertion to handle the records structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  /**
   * Handle ENS resolution
   * 
   * This function triggers the resolution of the entered ENS name
   * and displays all associated records.
   */
  const handleResolve = () => {
    if (ensName.trim()) {
      setResolvedEns(ensName.trim());
    }
  };

  /**
   * Handle Enter key press for quick resolution
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleResolve();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Resolve ENS Name</CardTitle>
        <CardDescription>
          Enter any ENS name to view its records and metadata
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* ENS Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ensName">ENS Name</Label>
            <div className="flex gap-2">
              <Input
                id="ensName"
                type="text"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter ENS name (e.g., alice.eth, vitalik.eth)"
                className="flex-1"
              />
              <Button
                onClick={handleResolve}
                disabled={!ensName.trim() || isRecordsFetching}
                className="flex items-center gap-2"
              >
                {isRecordsFetching ? (
                  <Spinner size="sm" />
                ) : (
                  <Search size={16} />
                )}
                Resolve
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {resolvedEns && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold font-mono">
                  {resolvedEns}
                </h3>
                {error && (
                  <Badge variant="destructive" className="mt-2">
                    Not found
                  </Badge>
                )}
              </div>

              {isRecordsFetching ? (
                <div className="text-center py-8">
                  <Spinner size="lg" />
                  <p className="text-muted-foreground mt-2">Resolving ENS records...</p>
                </div>
              ) : records ? (
                <div className="space-y-6">
                  {/* Text Records */}
                  {records.records.texts && Object.keys(records.records.texts).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">Text Records</h4>
                      <div className="grid gap-3">
                        {Object.entries(records.records.texts).map(([, value]: [string, any]) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                          <div key={value.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{value.key}</div>
                              <div className="text-sm text-muted-foreground break-all">
                                {typeof value === 'string' ? value : value?.value || ''}
                              </div>
                            </div>
                            {value.key === 'url' && typeof value === 'string' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(value, '_blank')}
                                className="ml-2"
                              >
                                <ExternalLink size={14} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Address Records */}
                  {records.records.coins && Object.keys(records.records.coins).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">Address Records</h4>
                      <div className="grid gap-3">
                        {Object.entries(records.records.coins).map(([coinType, address]: [string, any]) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                          <div key={coinType} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {coinType === '60' ? 'ETH' : 
                                 coinType === '0' ? 'BTC' : 
                                 coinType === '137' ? 'MATIC' :
                                 `Coin Type ${coinType}`}
                              </div>
                              <div className="text-sm text-muted-foreground font-mono break-all">
                                {typeof address === 'string' ? address : address?.value || ''}
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {coinType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Hash */}
                  {records.records.contentHash && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">Content Hash</h4>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <div className="text-sm font-mono break-all">
                          {typeof records.records.contentHash === 'string' 
                            ? records.records.contentHash 
                            : records.sanitizedRecords.contentHashUri}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No Records Message */}
                  {(!records.records.texts || Object.keys(records.records.texts || {}).length === 0) &&
                   (!records.records.coins || Object.keys(records.records.coins || {}).length === 0) &&
                   !records.records.contentHash && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No records found for this ENS name.</p>
                      <p className="text-sm mt-1">This ENS name exists but has no associated records.</p>
                    </div>
                  )}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Failed to resolve ENS name.</p>
                  <p className="text-sm mt-1">Please check the name and try again.</p>
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center">
          <p>Enter any ENS name to view its public records and metadata.</p>
          <p className="mt-1">This works for any ENS name, not just subnames.</p>
        </div>
      </CardContent>
    </Card>
  );
} 