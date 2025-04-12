import {
  SuiClientProvider,
  ConnectButton,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import MyComponent from "./components/MyComponent";
import TransactionComponent from "./components/TransactionComponent";
import MainLayout from "./layout/MainLayout";

const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider>
          <div className="App p-6 bg-gradient-to-r from-sky-500 from-10% to-cyan-200 to-90% h-screen">
            <MainLayout>
              <header className="App-header flex w-full justify-end">
                <ConnectButton />
              </header>
              <MyComponent />
              <TransactionComponent />
            </MainLayout>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
