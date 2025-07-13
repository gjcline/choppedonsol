import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getRaffleStatus, getUserHoldings, DEV_WALLET } from '../utils/solana';

interface AppState {
  raffleStatus: {
    totalMinted: number;
    isInitialized: boolean;
    currentPhase: 'Early Bird' | 'Regular';
    devMintDone: boolean;
    pricePerNFT: number;
  };
  userHoldings: number;
  isDevWallet: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  
  const [raffleStatus, setRaffleStatus] = useState({
    totalMinted: 0,
    isInitialized: false,
    currentPhase: 'Early Bird' as const,
    devMintDone: false,
    pricePerNFT: 0.005,
  });
  
  const [userHoldings, setUserHoldings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const isDevWallet = connected && publicKey && publicKey.equals(DEV_WALLET);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Fetch raffle status
      const status = await getRaffleStatus();
      setRaffleStatus(status);
      
      // Fetch user holdings if wallet connected
      if (connected && publicKey) {
        const holdings = await getUserHoldings(publicKey);
        setUserHoldings(holdings);
      } else {
        setUserHoldings(0);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load and periodic updates
  useEffect(() => {
    refreshData();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(refreshData, 5000);
    
    return () => clearInterval(interval);
  }, [connected, publicKey, connection]);

  const value: AppState = {
    raffleStatus,
    userHoldings,
    isDevWallet: Boolean(isDevWallet),
    isLoading,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};