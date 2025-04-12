import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useState } from "react";
import SuiIcon from "../assets/SuiIcon";

const MyComponent = () => {
  const account = useCurrentAccount();
  const [tokenList, setTokenList] = useState<any>([]);

  const {
    data: tokensData,
    isPending,
    isError,
    error,
    refetch,
  } = useSuiClientQuery(
    "getAllBalances",
    {
      owner: account?.address || "",
    },
    {
      gcTime: 10000,
    }
  );

  const { data } = useSuiClientQuery("getCoinMetadata", {
    coinType: "0x2::sui::SUI",
  });

  // Format dữ liệu token
  const formattedTokens =
    tokensData?.map((token) => ({
      ...token,
      formattedBalance: formatBalance(BigInt(token.totalBalance), 9), // SUI có 9 decimals
      metadata: {
        symbol: token.coinType === "0x2::sui::SUI" ? "SUI" : "TOKEN",
        name: token.coinType === "0x2::sui::SUI" ? "Sui" : "Unknown Token",
        iconUrl: <SuiIcon />,
      },
    })) || [];

  if (!account) {
    return (
      <div className="p-4 mt-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        <p>Please connect your wallet to view tokens</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="p-4 text-center mt-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading tokens...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg mt-4">
        <p>Error loading tokens: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Tokens</h3>
        <div className="text-sm text-gray-500">
          {formattedTokens.length} token(s)
        </div>
      </div>

      {formattedTokens.length === 0 ? (
        <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
          No tokens found in your wallet
        </div>
      ) : (
        <div className="space-y-3">
          {formattedTokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Token Icon */}
              {token.metadata.iconUrl ? (
                <div className="w-[28px] h-[28px] rounded-[50%] bg-blue-400 flex justify-center items-center">
                  {token.metadata.iconUrl}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium text-gray-600">
                    {token.metadata.symbol}
                  </span>
                </div>
              )}

              {/* Token Info */}
              <div className="flex-1 min-w-0 ml-2">
                <div className="flex items-center">
                  <h4 className="font-medium truncate mr-2">
                    {token.metadata.name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {token.metadata.symbol}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {token.coinType.split("::")[0]}
                </p>
              </div>

              {/* Token Balance */}
              <div className="text-right">
                <p className="font-semibold">{token.formattedBalance}</p>
                <p className="text-sm text-gray-500">
                  ≈ ${(parseFloat(token.formattedBalance) * 0.5).toFixed(2)}{" "}
                  {/* Giả sử 1 SUI = $0.5 */}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// File utils.ts
export function formatBalance(balance: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = balance / divisor;
  const fractional = balance % divisor;

  return fractional > BigInt(0)
    ? `${whole}.${fractional.toString().padStart(decimals, "0").slice(0, 4)}`
    : whole.toString();
}

export default MyComponent;
