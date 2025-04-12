import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import {
  SerialTransactionExecutor,
  Transaction,
} from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const TransactionComponent = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [executor, setExecutor] = useState<SerialTransactionExecutor>();
  const tx1 = new Transaction();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const privateKey = process.env.REACT_APP_SUI_PRIVATE_KEY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && amount > 0) {
      sendToken(recipient, amount);
    }
  };
  useEffect(() => {
    const setUp = async () => {
      console.log(privateKey);
      const keypair = Ed25519Keypair.fromSecretKey(privateKey || "");

      const executor = new SerialTransactionExecutor({
        client,
        signer: keypair,
      });

      setExecutor(executor);
    };
    setUp();
  }, [client, privateKey]);

  const sendToken = async (address: string, amount: number) => {
    if (executor) {
      console.log(account?.address);
      const coins = await client.getCoins({
        owner: account!.address,
        coinType: "0x2::sui::SUI",
      });
      tx1.setSender(account!.address);

      const coinData = coins.data.map((item) => {
        return {
          ...item,
          objectId: item.coinObjectId,
        };
      });

      tx1.setGasPayment([coinData[0]]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [coin1] = tx1.splitCoins(tx1.gas, [amount]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tx1.transferObjects([coin1], address);
      console.log(coin1);
      const { digest: digest1 } = await executor.executeTransaction(tx1);
    }
  };

  if (!account) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow-md mt-4"
    >
      <h3 className="text-lg font-semibold mb-4">Send Tokens</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          min="0"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Send
      </button>
    </form>
  );
};

export default TransactionComponent;
