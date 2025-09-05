"use client";
import {
  splitDomain,
  useRevokeSubname,
  useUpdateSubname,
  type Records,
} from "@justaname.id/react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

/**
 * Props interface for SubnameDisplay component
 *
 * @param subname - The ENS subname records object containing all metadata
 *                 including text records, address records, and content hash
 */
interface SubnameDisplayProps {
  subname: Records;
}

/**
 * Interface for text records (key-value pairs)
 * Examples: email -> user@example.com, twitter -> @username
 */
interface TextRecord {
  id: string; // Unique identifier for the record
  key: string; // Record key (e.g., "email", "twitter", "url")
  value: string; // Record value (e.g., "user@example.com", "@username")
}

/**
 * Interface for address records (cryptocurrency addresses)
 * Examples: ETH -> 0x123..., BTC -> bc1...
 */
interface AddressRecord {
  id: string; // Unique identifier for the record
  coinType: string; // Cryptocurrency type (e.g., "ETH", "BTC", "60", "0")
  address: string; // The actual cryptocurrency address
}

/**
 * SubnameDisplay Component
 *
 * This component provides a comprehensive interface for managing an individual ENS subname.
 * It allows users to:
 * - View and edit text records (key-value metadata)
 * - View and edit address records (cryptocurrency addresses)
 * - Set content hash (IPFS/Swarm links)
 * - Update all records at once
 * - Revoke (delete) the subname entirely
 *
 * The component maintains local state for all records and only updates
 * the blockchain when the user explicitly saves changes.
 */
export function SubnameDisplay({ subname }: SubnameDisplayProps) {
  console.log("subname", subname);

  // Hooks from JustaName SDK for subname operations
  const { revokeSubname, isRevokeSubnamePending } = useRevokeSubname();
  const { updateSubname, isUpdateSubnamePending } = useUpdateSubname();

  // Local loading states for better UX
  const [isRevoking, setIsRevoking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State for managing records locally before saving to blockchain
  const [textRecords, setTextRecords] = useState<TextRecord[]>([]);
  const [addressRecords, setAddressRecords] = useState<AddressRecord[]>([]);
  const [contentHash, setContentHash] = useState<string>("");

  /**
   * Initialize records from subname data when component mounts or subname changes
   *
   * This effect converts the subname's records from the blockchain format
   * into the local state format that's easier to work with in the UI.
   */
  useEffect(() => {
    // Convert text records from blockchain format to local state
    if (subname.records.texts) {
      const records = Object.entries(subname.records.texts).map(
        ([, value], index) => ({
          id: `text-${index}`,
          key: value.key,
          value: typeof value === "string" ? value : value.value || "",
        })
      );
      console.log("records", records, subname.records.texts);
      setTextRecords(records);
    }

    // Convert address records from blockchain format to local state
    if (subname.records.coins) {
      const addresses = Object.entries(subname.records.coins).map(
        ([, address], index) => ({
          id: `addr-${index}`,
          coinType: address.id.toString(),
          address: typeof address === "string" ? address : address?.value || "",
        })
      );
      setAddressRecords(addresses);
    }

    // Set content hash if it exists
    if (subname.records.contentHash) {
      setContentHash(
        typeof subname.records.contentHash === "string"
          ? subname.records.contentHash
          : String(subname.records.contentHash || "")
      );
    }
  }, [subname]);

  /**
   * Handle subname revocation (permanent deletion)
   *
   * This function:
   * 1. Splits the ENS domain to get username and domain parts
   * 2. Calls the revocation function from the SDK
   * 3. Handles loading states and error handling
   */
  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      // Split the full ENS name (e.g., "alice.eth" -> ["alice", "eth"])
      const [username, ensDomain] = splitDomain(subname.ens);
      await revokeSubname({
        username,
        ensDomain,
        chainId: 1,
      });
      toast.success("Subname revoked successfully");
    } catch (error) {
      console.error("Failed to revoke subname:", error);
      toast.error(
        `Failed to revoke subname: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRevoking(false);
    }
  };

  /**
   * Handle updating all records on the blockchain
   *
   * This function:
   * 1. Converts local state back to blockchain format
   * 2. Filters out empty records
   * 3. Calls the update function from the SDK
   * 4. Handles loading states and error handling
   */
  const handleUpdateRecords = async () => {
    setIsUpdating(true);
    try {
      // Convert text records back to blockchain format
      const text = textRecords.reduce((acc, record) => {
        if (record.key.trim() && record.value.trim()) {
          acc[record.key] = record.value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Convert address records back to blockchain format
      const addresses = addressRecords.reduce((acc, record) => {
        if (record.coinType.trim() && record.address.trim()) {
          acc[record.coinType] = record.address;
        }
        return acc;
      }, {} as Record<string, string>);

      // Update the subname with all records
      await updateSubname({
        ens: subname.ens,
        chainId: 1,
        text: Object.keys(text).length > 0 ? text : undefined,
        addresses: Object.keys(addresses).length > 0 ? addresses : undefined,
        contentHash: contentHash.trim() || undefined,
      });
      toast.success("Records updated successfully");
    } catch (error) {
      console.error("Failed to update subname:", error);
      toast.error(
        `Failed to update records: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Text Record Management Functions
   * These functions handle adding, updating, and removing text records
   */

  // Add a new empty text record
  const addTextRecord = () => {
    const newRecord: TextRecord = {
      id: `text-${Date.now()}`,
      key: "",
      value: "",
    };
    setTextRecords([...textRecords, newRecord]);
  };

  // Update a specific field in a text record
  const updateTextRecord = (
    id: string,
    field: "key" | "value",
    value: string
  ) => {
    setTextRecords((records) =>
      records.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  // Remove a text record by ID
  const removeTextRecord = (id: string) => {
    setTextRecords((records) => records.filter((record) => record.id !== id));
  };

  /**
   * Address Record Management Functions
   * These functions handle adding, updating, and removing address records
   * Note: CoinType 60 (ETH) records cannot be edited or deleted
   */

  // Add a new empty address record
  const addAddressRecord = () => {
    const newRecord: AddressRecord = {
      id: `addr-${Date.now()}`,
      coinType: "",
      address: "",
    };
    setAddressRecords([...addressRecords, newRecord]);
  };

  // Update a specific field in an address record
  // CoinType 60 (ETH) records cannot be edited
  const updateAddressRecord = (
    id: string,
    field: "coinType" | "address",
    value: string
  ) => {
    setAddressRecords((records) =>
      records.map((record) => {
        if (record.id === id) {
          // Prevent editing coinType 60 (ETH) records
          if (record.coinType === "60" && field === "coinType") {
            toast.error("ETH address records cannot be modified");
            return record;
          }
          return { ...record, [field]: value };
        }
        return record;
      })
    );
  };

  // Remove an address record by ID
  // CoinType 60 (ETH) records cannot be deleted
  const removeAddressRecord = (id: string) => {
    const record = addressRecords.find((r) => r.id === id);
    if (record?.coinType === "60") {
      toast.error("ETH address records cannot be deleted");
      return;
    }
    setAddressRecords((records) =>
      records.filter((record) => record.id !== id)
    );
  };

  console.log("textRecords", textRecords);
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Subname</CardTitle>
            <CardDescription>
              Manage your ENS subname records and settings
            </CardDescription>
          </div>
          {/* Status badge showing the subname is active */}
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200"
          >
            ✓ Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Subname Display Section */}
        <div className="text-center">
          {/* Display the full ENS subname with gradient styling */}
          <div className="text-2xl font-bold font-mono bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {subname.ens}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your personalized ENS subname
          </p>
        </div>

        <Separator />

        {/* Two Column Layout for Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Records Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Text Records</h3>
              {/* Button to add new text record */}
              <Button
                size="sm"
                variant="outline"
                onClick={addTextRecord}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Record
              </Button>
            </div>

            <div className="space-y-3">
              {/* Map through all text records */}
              {textRecords.map((record) => (
                <div key={record.id} className="flex gap-2 items-center">
                  <div className="flex-1">
                    {/* Key input field */}
                    <Input
                      placeholder="Key (e.g., email, url)"
                      value={record.key}
                      onChange={(e) =>
                        updateTextRecord(record.id, "key", e.target.value)
                      }
                      className="mb-2"
                    />
                    {/* Value input field */}
                    <Input
                      placeholder="Value"
                      value={record.value}
                      onChange={(e) =>
                        updateTextRecord(record.id, "value", e.target.value)
                      }
                    />
                  </div>
                  {/* Delete button for this record */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeTextRecord(record.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {/* Empty state when no text records exist */}
              {textRecords.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No text records yet. Click "Add Record" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Address Records Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Address Records</h3>
              {/* Button to add new address record */}
              <Button
                size="sm"
                variant="outline"
                onClick={addAddressRecord}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Address
              </Button>
            </div>

            <div className="space-y-3">
              {/* Map through all address records */}
              {addressRecords.map((record) => {
                const isEthRecord = record.coinType === "60";
                return (
                  <div key={record.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      {/* Coin type input field */}
                      <Input
                        placeholder="Coin Type (e.g., ETH, BTC)"
                        value={record.coinType}
                        onChange={(e) =>
                          updateAddressRecord(
                            record.id,
                            "coinType",
                            e.target.value
                          )
                        }
                        className="mb-2"
                        disabled={isEthRecord}
                      />
                      {/* Address input field */}
                      <Input
                        placeholder="Address"
                        value={record.address}
                        onChange={(e) =>
                          updateAddressRecord(
                            record.id,
                            "address",
                            e.target.value
                          )
                        }
                        disabled={isEthRecord}
                      />
                      {/* Show indicator for ETH records */}
                      {isEthRecord && (
                        <div className="text-xs text-muted-foreground mt-1">
                          ETH address records cannot be modified
                        </div>
                      )}
                    </div>
                    {/* Delete button for this record */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeAddressRecord(record.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isEthRecord}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                );
              })}

              {/* Empty state when no address records exist */}
              {addressRecords.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No address records yet. Click "Add Address" to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Content Hash Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content Hash</h3>
          <div className="space-y-2">
            <Label htmlFor="contentHash">IPFS/Swarm Content Hash</Label>
            {/* Input for content hash (IPFS/Swarm links) */}
            <Input
              id="contentHash"
              placeholder="e.g., ipfs://QmYourHashHere or bzz://YourSwarmHash"
              value={contentHash}
              onChange={(e) => setContentHash(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Set the content hash for your ENS name to point to decentralized
              content
            </p>
          </div>
        </div>

        <Separator />

        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Update Records Button */}
          <Button
            size="lg"
            className="flex-1 flex items-center gap-2"
            disabled={isUpdating || isUpdateSubnamePending}
            onClick={handleUpdateRecords}
          >
            {isUpdating || isUpdateSubnamePending ? (
              <>
                <Spinner size="sm" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Update Records</span>
              </>
            )}
          </Button>

          {/* Revoke Subname Button */}
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            disabled={isRevoking || isRevokeSubnamePending}
            onClick={handleRevoke}
          >
            {isRevoking || isRevokeSubnamePending ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                <span>Revoking...</span>
              </div>
            ) : (
              "Revoke Subname"
            )}
          </Button>
        </div>

        {/* Warning about revocation */}
        <p className="text-xs text-muted-foreground text-center">
          Update your records anytime. Revoking will permanently remove your
          subname and cannot be undone.
        </p>
      </CardContent>
    </Card>
  );
}
