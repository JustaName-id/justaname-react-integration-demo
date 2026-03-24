"use client";
import { usePrimaryName } from "@justaname.id/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftRight, Copy, Check, User } from "lucide-react";

/**
 * ReverseResolveEns Component
 *
 * This component allows users to reverse resolve an Ethereum address to an ENS name
 * using the usePrimaryName hook to look up the primary name for a given address.
 */
export function ReverseResolveEns() {
  const [address, setAddress] = useState<string>("");
  const [resolvedAddress, setResolvedAddress] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const {
    primaryName: ensName,
    isPrimaryNameFetching,
    isPrimaryNameLoading,
  } = usePrimaryName({
    address: resolvedAddress,
    enabled: !!resolvedAddress,
  });

  const isLoading = isPrimaryNameFetching || isPrimaryNameLoading;
  const hasResult = resolvedAddress && !isLoading;
  const notFound = hasResult && !ensName;

  /**
   * Validate Ethereum address format
   */
  const isValidAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  /**
   * Handle reverse resolution
   */
  const handleResolve = () => {
    const trimmedAddress = address.trim();
    if (isValidAddress(trimmedAddress)) {
      setResolvedAddress(trimmedAddress);
    }
  };

  /**
   * Handle Enter key press for quick resolution
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleResolve();
    }
  };

  /**
   * Copy ENS name to clipboard
   */
  const handleCopy = async () => {
    if (ensName) {
      await navigator.clipboard.writeText(ensName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Format address for display (truncate middle)
   */
  const formatAddress = (addr: string): string => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight size={20} />
          Reverse Resolve Address
        </CardTitle>
        <CardDescription>
          Enter an Ethereum address to find its associated ENS name
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Address Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ethAddress">Ethereum Address</Label>
            <div className="flex gap-2">
              <Input
                id="ethAddress"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0x1234...abcd"
                className="flex-1 font-mono"
              />
              <Button
                onClick={handleResolve}
                disabled={!isValidAddress(address.trim()) || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <ArrowLeftRight size={16} />
                )}
                Resolve
              </Button>
            </div>
            {address && !isValidAddress(address.trim()) && (
              <p className="text-sm text-destructive">
                Please enter a valid Ethereum address (0x followed by 40 hex characters)
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {resolvedAddress && (
          <>
            <Separator />

            <div className="space-y-4">
              {/* Address Display */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <code className="text-sm font-mono bg-muted px-3 py-1.5 rounded-md">
                  {formatAddress(resolvedAddress)}
                </code>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <Spinner size="lg" />
                  <p className="text-muted-foreground mt-2">
                    Reverse resolving address...
                  </p>
                </div>
              ) : ensName ? (
                <div className="space-y-4">
                  {/* Success Result */}
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User size={24} className="text-primary" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        ENS Name
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="text-2xl font-bold font-mono">
                          {ensName}
                        </h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </div>
                      <Badge variant="default" className="mt-3">
                        Resolved
                      </Badge>
                    </div>
                  </div>

                  {/* Resolution Details */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-3">Resolution Details</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address</span>
                        <code className="font-mono text-xs">
                          {formatAddress(resolvedAddress)}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ENS Name</span>
                        <span className="font-mono">{ensName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network</span>
                        <Badge variant="outline" className="text-xs">
                          Mainnet
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : notFound ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="p-4 bg-muted/50 rounded-lg border inline-block mb-4">
                    <User size={32} className="text-muted-foreground/50" />
                  </div>
                  <p className="font-medium">No ENS name found</p>
                  <p className="text-sm mt-1">
                    This address doesn't have an associated ENS name on this network.
                  </p>
                  <Badge variant="secondary" className="mt-3">
                    Not Registered
                  </Badge>
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>Enter any Ethereum address to find its primary ENS name.</p>
          <p className="opacity-75">
            Uses ENSIP-19 multichain resolution with offchain fallback.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

