import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Shield, AlertTriangle, Settings, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { devMint, DEV_MINT_AMOUNT } from '../utils/solana';
import { DEV_WALLET } from '../utils/solana';
import { useAppContext } from '../contexts/AppContext';

export const DevMint: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const wallet = useWallet();
  const { raffleStatus, refreshData } = useAppContext();
  const [isDevMinting, setIsDevMinting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isDevWallet = connected && publicKey && publicKey.equals(DEV_WALLET);

  const handleDevMint = async () => {
    setIsDevMinting(true);
    setMessage(null);
    
    try {
      const txId = await devMint(wallet);
      setMessage({ type: 'success', text: `Dev mint completed! Transaction: ${txId}` });
      await refreshData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to execute dev mint' });
    } finally {
      setIsDevMinting(false);
    }
  };

  // Only show if dev wallet is connected
  if (!connected || !isDevWallet) {
    return (
      <div className="min-h-screen bg-black text-white font-inter pt-16">
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: 'url(/backgroundbling.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
          <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-red-400/30 bg-red-500/5 text-center">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-orbitron font-bold text-red-300 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-400 mb-4">
              This page is only accessible to authorized development wallets.
            </p>
            {!connected && (
              <p className="text-sm text-gray-500">Please connect your wallet.</p>
            )}
            {connected && !isDevWallet && (
              <div className="text-xs text-gray-500">
                <p>Connected wallet is not authorized for development access.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: 'url(/backgroundbling.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80"></div>
      </div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl md:text-6xl font-black mb-4">
            <span className="text-amber-400">DEV</span>
            <br />
            <span className="holographic-text">CONTROLS</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Administrative controls for CHOP raffle management
          </p>
        </div>

        {/* Current Raffle Stats */}
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-amber-400/30 bg-amber-500/5 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-orbitron font-bold text-amber-300">
              Current Raffle Stats
            </h3>
            <div className="px-3 py-1 bg-amber-400/20 rounded-full text-xs font-medium text-amber-300">
              DEV WALLET CONNECTED
            </div>
          </div>

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
                Dev Mint Status
              </div>
            </div>
          </div>

          {/* Dev Mint Button */}
          <div className="text-center">
            <button
              onClick={handleDevMint}
              disabled={isDevMinting || raffleStatus.devMintDone}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-orbitron font-bold text-white text-lg transition-all duration-300 hover:from-green-500 hover:to-blue-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-2">
                {isDevMinting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                <span>
                  {isDevMinting ? 'Minting 6,250...' : 
                   raffleStatus.devMintDone ? 'Dev Mint Complete' :
                  `Dev Mint 6,250 NFTs`}
                </span>
              </div>
            </button>
            
            {!raffleStatus.devMintDone && (
              <p className="text-sm text-gray-400 mt-2">
                This will mint {DEV_MINT_AMOUNT} NFTs to the project wallet
              </p>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg border ${
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

        {/* Technical Details */}
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-amber-400/30 bg-amber-500/5">
          <h3 className="text-lg font-orbitron font-bold text-amber-300 mb-4">
            ⚠️ Development Notes
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• This route is only accessible to wallet: {DEV_WALLET.toString()}</p>
            <p>• Dev mint will execute the dev_mint instruction on the program</p>
            <p>• {DEV_MINT_AMOUNT} NFTs will be minted to the project wallet</p>
            <p>• Uses discriminator [195, 67, 168, 135, 89, 61, 7, 232] with amount 6250</p>
            <p>• All transactions are executed on Solana mainnet</p>
          </div>
        </div>
      </div>
    </div>
  );
};