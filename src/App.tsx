import {useAccount} from "wagmi";
import {useMemo} from "react";
import {mainnetEnsDomain} from "./config/constants";
import {ConnectWallet} from "./components/wallet/ConnectWallet";
import {SubnameDisplay} from "./components/subname/SubnameDisplay";
import {SubnameForm} from "./components/subname/SubnameForm";
import {SubnamesList} from "./components/subname/SubnamesList";
import {DebugPanel} from "./components/debug/DebugPanel";
import {useAccountSubnames} from "@justaname.id/react";

export default function App() {

    const {isConnected} = useAccount();
    const {accountSubnames} = useAccountSubnames();

    const claimedSubname = useMemo(() => {
        return accountSubnames.find((subname) =>
            subname.ens.endsWith(mainnetEnsDomain as string)
        );
    }, [accountSubnames]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        JustAName Demo
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Connect your wallet and claim your personalized ENS subname with custom metadata.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Wallet Connection */}
                    <div className="flex justify-center">
                        <ConnectWallet/>
                    </div>

                    {/* Subnames List */}
                    {isConnected && (
                        <div className="flex justify-center">
                            <SubnamesList />
                        </div>
                    )}

                    {/* Subname Management */}
                    {isConnected && (
                        <div className="flex justify-center">
                            {claimedSubname ? (
                                <SubnameDisplay subname={claimedSubname}/>
                            ) : (
                                <SubnameForm/>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>Powered by JustAName.id • Built with Next.js & Wagmi</p>
                </div>

                {/* Debug Panel (dev only) */}
                <DebugPanel/>
            </div>
        </div>
    )
}