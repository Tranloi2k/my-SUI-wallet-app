import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface CoinMetaDataContextType {
  coinMetaData: any[];
  setUpCoinMetaData: (metaData: any[]) => void;
}

// Create a context with a default value
const CoinMetaDataContext = createContext<CoinMetaDataContextType>({
  coinMetaData: [],
  setUpCoinMetaData: () => {},
});

export const CoinMetaDataProvider = ({ children }: { children: ReactNode }) => {
  const [coinMetaData, setCoinMetaData] = useState<any[]>([]);

  const setUpCoinMetaData = (metaData: any[]) => {
    setCoinMetaData(metaData);
  };

  return (
    <CoinMetaDataContext.Provider value={{ coinMetaData, setUpCoinMetaData }}>
      {children}
    </CoinMetaDataContext.Provider>
  );
};

// Custom hook to use the CoinMetaDataContext
export const useCoinMetaData = () => useContext(CoinMetaDataContext);
