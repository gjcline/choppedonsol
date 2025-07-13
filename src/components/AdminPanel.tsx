import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Settings, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { initializeRaffle, devMint, DEV_MINT_AMOUNT } from '../utils/solana';
import { useAppContext } from '../contexts/AppContext';

export const AdminPanel: React.FC = () => {
  const { connected } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { raffleStatus, isDevWallet, refreshData } = useAppContext();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isDevMinting, setIsDevMinting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!connected || !isDevWallet) {
    return null;
  }

  const handleInitializeRaffle = async () => {
    setIsInitializing(true);
    setMessage(null);
    
    try {
      const txId = await initializeRaffle(connection, wallet);
      setMessage({ type: 'success', text: `Raffle initialized! Transaction: ${txId}` });
      await refreshData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to initialize raffle' });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDevMint = async () => {
    setIsDevMinting(true);
    setMessage(null);
    
    try {
      const txId = await devMint(connection, wallet);
      setMessage({ type: 'success', text: `Dev mint completed! Transaction: ${txId}` });
      await refreshData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to execute dev mint' });
    } finally {
      setIsDevMinting(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-amber-400/30 bg-amber-500/5">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-amber-400" />
        <h3 className="text-xl font-orbitron font-bold text-amber-300">
          Admin Controls
        </h3>
        <div className="px-3 py-1 bg-amber-400/20 rounded-full text-xs font-medium text-amber-300">
          DEV WALLET
        </div>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-orbitron font-bold text-white mb-1">
            {raffleStatus.totalMinted.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Minted</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            {raffleStatus.isInitialized ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div className="text-xs text-gray-400">
            {raffleStatus.isInitialized ? 'Initialized' : 'Not Initialized'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-orbitron font-bold text-white mb-1">
            {raffleStatus.currentPhase}
          </div>
          <div className="text-xs text-gray-400">Current Phase</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            {raffleStatus.devMintDone ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-orange-400" />
            )}
          </div>
          <div className="text-xs text-gray-400">
            Dev Mint (6,250)
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleInitializeRaffle}
          disabled={isInitializing || raffleStatus.isInitialized}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-orbitron font-bold text-white transition-all duration-300 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          <span>
            {isInitializing ? 'Initializing...' : 
             raffleStatus.isInitialized ? 'Already Initialized' : 
             'Initialize Raffle'}
          </span>
        </button>

        <button
          onClick={handleDevMint}
          disabled={isDevMinting || raffleStatus.devMintDone}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-orbitron font-bold text-white transition-all duration-300 hover:from-green-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDevMinting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          <span>
            {isDevMinting ? 'Minting...' : 
             raffleStatus.devMintDone ? 'Dev Mint Complete' :
            `Dev Mint (6,250)`}
          </span>
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-300' 
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};