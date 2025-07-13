import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const { connected, connecting, disconnect, publicKey, select, wallet } = useWallet();

  const handleConnect = async () => {
    if (connected) {
      await disconnect();
    } else {
      try {
        await select('Phantom');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-xl"
    >
      <Wallet className="w-4 h-4" />
      <span className="text-sm font-medium">
        {connecting ? 'Connecting...' : 
         connected && publicKey ? formatAddress(publicKey.toString()) : 
         'Connect Wallet'}
      </span>
    </button>
  );
};