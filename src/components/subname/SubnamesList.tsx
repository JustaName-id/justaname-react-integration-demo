"use client";
import { useAccountSubnames } from "@justaname.id/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * SubnamesList Component
 *
 * This component displays all subnames owned by the connected wallet.
 * It provides:
 * - A list view of all user's subnames
 * - Summary information about each subname's records
 * - Total count of subnames
 * - Visual indicators for subname status
 *
 * Note: This component only renders when the user has at least one subname.
 * If no subnames exist, it returns null to avoid showing an empty state.
 */
export function SubnamesList() {
  // Hook from JustaName SDK to fetch all subnames owned by the connected account
  const { accountSubnames } = useAccountSubnames();

  // Early return if user has no subnames - prevents showing empty state
  if (accountSubnames.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Subnames</CardTitle>
            <CardDescription>All your claimed ENS subnames</CardDescription>
          </div>
          {/* Display total count of subnames */}
          <Badge variant="outline">{accountSubnames.length} total</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Map through each subname and display its information */}
          {accountSubnames.map((subname, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
            >
              <div className="flex-1">
                {/* Display the full ENS subname (e.g., "alice.eth") */}
                <div className="font-mono text-sm font-medium">
                  {subname.ens}
                </div>
                {/* Show summary of records attached to this subname */}
                <div className="text-xs text-muted-foreground mt-1">
                  {/* Display text record count if any exist */}
                  {subname.records?.texts &&
                  Object.keys(subname.records.texts).length > 0
                    ? `${
                        Object.keys(subname.records.texts).length
                      } text record(s)`
                    : "No text records"}
                  {/* Display address record count if any exist */}
                  {subname.records?.coins &&
                    Object.keys(subname.records.coins).length > 0 &&
                    ` • ${
                      Object.keys(subname.records.coins).length
                    } address record(s)`}
                </div>
              </div>
              {/* Status badge indicating the subname is active */}
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200"
              >
                Active
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
