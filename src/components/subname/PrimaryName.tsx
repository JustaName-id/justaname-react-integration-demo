"use client";
import { usePrimaryName, useSetPrimaryName, useAccountSubnames } from "@justaname.id/react";
import { useAccount } from "wagmi";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Star, Check } from "lucide-react";
import { toast } from "sonner";

/**
 * PrimaryName Component
 *
 * Displays the connected wallet's current primary ENS name
 * and allows setting one of the user's subnames as primary.
 */
export function PrimaryName() {
  const { address } = useAccount();
  const [settingName, setSettingName] = useState<string | null>(null);

  const { primaryName, isPrimaryNameLoading } = usePrimaryName({
    address,
    enabled: !!address,
  });

  const { setPrimaryName, isSetPrimaryNamePending } = useSetPrimaryName();
  const { accountSubnames } = useAccountSubnames();

  const handleSetPrimary = async (name: string) => {
    try {
      setSettingName(name);
      await setPrimaryName({ name });
      toast.success(`Primary name set to ${name}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to set primary name";
      toast.error(message);
    } finally {
      setSettingName(null);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star size={20} />
          Primary Name
        </CardTitle>
        <CardDescription>
          Your primary ENS name is used as your on-chain identity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Primary Name */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Current Primary Name
          </p>
          {isPrimaryNameLoading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : primaryName ? (
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono font-semibold bg-primary/10 px-3 py-1.5 rounded-md">
                {primaryName}
              </code>
              <Badge variant="default">Active</Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">No primary name set</span>
              <Badge variant="secondary">Not Set</Badge>
            </div>
          )}
        </div>

        {/* Set Primary Name from owned subnames */}
        {accountSubnames.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Set Primary Name
              </p>
              <div className="grid gap-2">
                {accountSubnames.map((subname) => {
                  const isCurrent = primaryName === subname.ens;
                  const isSetting = settingName === subname.ens;

                  return (
                    <div
                      key={subname.ens}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                    >
                      <span className="font-mono text-sm">{subname.ens}</span>
                      {isCurrent ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Check size={12} />
                          Primary
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isSetPrimaryNamePending}
                          onClick={() => handleSetPrimary(subname.ens)}
                        >
                          {isSetting ? (
                            <Spinner size="sm" />
                          ) : (
                            "Set as Primary"
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center">
          <p>Your primary name is what others see when they look up your address.</p>
        </div>
      </CardContent>
    </Card>
  );
}
