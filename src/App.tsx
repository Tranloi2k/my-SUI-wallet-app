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

const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

function App() {
  return (
    <CoinMetaDataProvider>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
          <WalletProvider>
            <div className="App p-6 bg-gradient-to-r from-sky-500 from-10% to-cyan-200 to-90% h-auto">
              <MainLayout>
                <header className="App-header flex w-full justify-end">
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
