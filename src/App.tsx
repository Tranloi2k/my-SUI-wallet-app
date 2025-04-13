import {
  SuiClientProvider,
  ConnectButton,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import ListTokenComponent from "./components/ListTokenComponent";
import TransactionComponent from "./components/TransactionComponent";
import MainLayout from "./layout/MainLayout";
import { CoinMetaDataProvider } from "./CoinMetaDataContext";
import { useState } from "react";

const queryClient = new QueryClient();

const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<
    "testnet" | "mainnet" | "devnet"
  >("testnet");

  const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNetwork(event.target.value as "testnet" | "mainnet" | "devnet");
  };

  return (
    <CoinMetaDataProvider>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork={selectedNetwork}>
          <WalletProvider>
            <div className="App p-6 bg-gradient-to-r from-sky-500 from-10% to-cyan-200 to-90% h-auto min-h-[100vh]">
              <MainLayout>
                <header className="App-header flex w-full justify-between items-center">
                  <select
                    value={selectedNetwork}
                    onChange={handleNetworkChange}
                    className="bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 transition-colors duration-200 hover:border-blue-400"
                  >
                    <option value="testnet">Testnet</option>
                    <option value="mainnet">Mainnet</option>
                    <option value="devnet">Devnet</option>
                  </select>
                  <ConnectButton />
                </header>
                <TransactionComponent />
                <ListTokenComponent />
              </MainLayout>
            </div>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </CoinMetaDataProvider>
  );
}

export default App;
