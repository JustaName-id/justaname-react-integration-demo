"use client";
import { useAddSubname, useIsSubnameAvailable } from "@justaname.id/react";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
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
import { mainnetEnsDomain } from "@/config/constants";
import { useAccount } from "wagmi";

/**
 * SubnameForm Component
 *
 * This component handles the creation of new ENS subnames. It provides:
 * - Real-time availability checking for subnames
 * - Optional metadata (text records) configuration
 * - Form validation and submission handling
 * - Visual feedback for availability status and loading states
 */
export function SubnameForm() {
  // Hook from JustAName SDK to handle subname creation
  const { addSubname, isAddSubnamePending } = useAddSubname();
  const { address } = useAccount();
  // Form state management
  const [key, setKey] = useState<string>(""); // Metadata key (e.g., "twitter", "email")
  const [value, setValue] = useState<string>(""); // Metadata value (e.g., "@username", "user@email.com")
  const [username, setUsername] = useState<string>(""); // The subname part (e.g., "alice" for "alice.eth")

  // Debounce username input to avoid excessive API calls while typing
  // Waits 500ms after user stops typing before checking availability
  const debouncedUsername = useDebounce(username, 500);

  // Hook to check if the subname is available for registration
  // Only checks when there's a debounced username value
  const {
    isSubnameAvailable,
    isSubnameAvailablePending: isCheckingAvailability,
  } = useIsSubnameAvailable({
    username: debouncedUsername.debouncedValue,
    ensDomain: mainnetEnsDomain,
  });

  /**
   * Form validation logic
   *
   * The form is valid when:
   * 1. The subname is available (not already taken)
   * 2. User has entered a username (length > 0)
   * 3. If metadata is provided, both key AND value must be present
   *    (can't have key without value or vice versa)
   */
  const isFormValid = useMemo(() => {
    return (
      isSubnameAvailable?.isAvailable &&
      debouncedUsername.debouncedValue.length > 0 &&
      !(key.length > 0 && value === "") &&
      !(key === "" && value.length > 0)
    );
  }, [isSubnameAvailable, debouncedUsername.debouncedValue, key, value]);

  /**
   * Handle form submission
   *
   * Creates the subname with optional metadata if provided.
   * The metadata is structured as text records that can be queried
   * by other applications (e.g., wallet apps, dApps).
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isAddSubnamePending) return;

    // signature can be overriden if needed by passing `overrideSignatureCheck: true`
    addSubname({
      username: debouncedUsername.debouncedValue,
      text:
        key && value
          ? {
              [key]: value,
            }
          : undefined,
      addresses: {
        2147492101: address, // Base address, can be changed to any other cointype, computed by base chain ID (8453) + SLIP44_MSB (2147483648)
      },
    });
  };

  /**
   * Get availability status badge
   *
   * Returns different badges based on the current state:
   * - null: No username entered
   * - "Checking...": Currently checking availability
   * - "Available": Subname is available for registration
   * - "Not Available": Subname is already taken
   */
  const getAvailabilityStatus = () => {
    if (!debouncedUsername.debouncedValue) return null;
    if (isCheckingAvailability)
      return <Badge variant="outline">Checking...</Badge>;
    if (isSubnameAvailable?.isAvailable)
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-200"
        >
          Available
        </Badge>
      );
    return <Badge variant="destructive">Not Available</Badge>;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Claim Your Subname</CardTitle>
        <CardDescription>
          Create your personalized ENS subname with optional metadata
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div onSubmit={handleSubmit} className="space-y-6">
          {/* Subname Input Section */}
          <div className="space-y-2">
            <Label htmlFor="username">Choose your subname</Label>
            <div className="relative">
              {/* Username input with ENS domain suffix display */}
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="pr-24"
              />
              {/* Display the full ENS domain (e.g., ".eth") */}
              <div className="absolute top-0 right-0 h-full px-3 flex items-center bg-muted/50 rounded-r-md border-l">
                <span className="text-sm text-muted-foreground">
                  {mainnetEnsDomain}
                </span>
              </div>
            </div>
            {/* Show full subname and availability status */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {username && `${username}.${mainnetEnsDomain}`}
              </div>
              {getAvailabilityStatus()}
            </div>
          </div>

          {/* Optional Metadata Section */}
          <div className="space-y-4">
            <Label>Optional Metadata</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Metadata Key Input */}
              <div className="space-y-2">
                <Label htmlFor="key" className="text-sm">
                  Key
                </Label>
                <Input
                  id="key"
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="twitter"
                />
              </div>
              {/* Metadata Value Input */}
              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm">
                  Value
                </Label>
                <Input
                  id="value"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full"
            disabled={!isFormValid || isAddSubnamePending}
            onClick={handleSubmit}
          >
            {isAddSubnamePending ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Claiming Subname...</span>
              </div>
            ) : (
              "Claim Subname"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
