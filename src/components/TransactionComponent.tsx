import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import {
  SerialTransactionExecutor,
  Transaction,
} from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { useCoinMetaData } from "../CoinMetaDataContext";

const TransactionComponent = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [executor, setExecutor] = useState<SerialTransactionExecutor>();
  const tx1 = new Transaction();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const privateKey = process.env.REACT_APP_SUI_PRIVATE_KEY;
  const { coinMetaData } = useCoinMetaData();

  useEffect(() => {
    const setUp = async () => {
      const keypair = Ed25519Keypair.fromSecretKey(privateKey || "");

      const executor = new SerialTransactionExecutor({
        client,
        signer: keypair,
      });

      setExecutor(executor);
    };
    setUp();
  }, [client, privateKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && parseFloat(amount) > 0) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    sendToken(recipient, parseFloat(amount));
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const closeNotification = () => {
    setNotification(null);
    setIsSuccess(null);
  };

  const formatAmount = (value: string) => {
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts[1] && parts[1].length > 9) {
      parts[1] = parts[1].slice(0, 9);
    }
    return parts.join(".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(value)) || value === "") {
      setAmount(formatAmount(value));
    }
  };

  const sendToken = async (address: string, amount: number) => {
    if (executor) {
      try {
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
        const result = await executor.executeTransaction(tx1);
        console.log(result);
        setNotification(
          `Transaction successful! Sent ${amount} SUI to ${address.slice(
            0,
            3
          )}...${address.slice(-4, -1)}.`
        );
        setIsSuccess(true);
      } catch (error) {
        setNotification("Transaction failed. Please try again.");
        setIsSuccess(false);
      }
    }
  };

  if (!account) return null;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded-lg shadow-md mt-4 border-gray-100"
      >
        <h3 className="text-lg font-semibold mb-4">Send SUI Tokens</h3>
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
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Confirm Transaction</h4>
            <p>
              Are you sure you want to send {amount} SUI to{" "}
              {recipient.slice(0, 3)}...{recipient.slice(-4, -1)}?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <h4 className="text-lg font-semibold mb-4">Notification</h4>
            <p>{notification}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeNotification}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionComponent;
