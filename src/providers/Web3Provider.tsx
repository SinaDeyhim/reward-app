import React, { createContext, useContext, ReactNode } from "react";
import { Network, Alchemy } from "alchemy-sdk";

interface Web3ProviderType {
  provider: Alchemy;
}

const settings = {
  apiKey: "sLBKRBkrISN2du2D6omTTS-FK6Xtn25s",
  network: Network.BASE_SEPOLIA,
};

const Web3Context = createContext<Web3ProviderType | undefined>(undefined);

export const useWeb3Provider = (): Web3ProviderType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3Provider must be used within a Web3Provider");
  }
  return context;
};

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  // Create provider once
  const provider = React.useMemo(() => new Alchemy(settings), []);

  return (
    <Web3Context.Provider value={{ provider }}>{children}</Web3Context.Provider>
  );
};
