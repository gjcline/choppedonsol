import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Plus, Minus, Zap, Loader2, AlertCircle, Clock, CheckCircle, Layers } from 'lucide-react';
import { mintTickets, calculatePrice, MIN_MINT_AMOUNT } from '../utils/solana';
import { useAppContext } from '../contexts/AppContext';

export const MintSection: React.FC = () => {
  const { connected } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { raffleStatus, refreshData } = useAppContext();
  const [amount, setAmount] = useState(MIN_MINT_AMOUNT);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintProgress, setMintProgress] = useState<{
    step: string;
    current: number;
    total: number;
  } | null>(null);
  const [mintResults, setMintResults] = useState<any>(null);
  
  const isLive = raffleStatus.isInitialized;
  const totalCost = calculatePrice(amount, raffleStatus.totalMinted);

  // Show mint when raffle is initialized (for demo/testing purposes)
  const isPublicMintLive = raffleStatus.isInitialized;

  const handleAmountChange = (newAmount: number) => {
    const clampedAmount = Math.max(MIN_MINT_AMOUNT, Math.min(1000, newAmount));
    setAmount(clampedAmount);
    setError(null);
  };

  const handleMint = async () => {
    if (!connected || !isLive || !wallet.publicKey) return;
    
    setIsMinting(true);
    setError(null);
    setMintProgress(null);
    setMintResults(null);
    
    try {
      const results = await mintTickets(connection, wallet, amount, (step, current, total) => {
        setMintProgress({ step, current, total });
      });
      
      console.log('Mint successful:', results);
      setMintResults(results);
      await refreshData();
    } catch (error) {
      console.error('Mint failed:', error);
      setError(error instanceof Error ? error.message : 'Mint failed');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mb-8">
      {isPublicMintLive && (
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-orbitron font-bold mb-2">Mint Your Tickets</h3>
            <p className="text-sm text-gray-400">Minimum {MIN_MINT_AMOUNT} tickets per transaction</p>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => handleAmountChange(amount - MIN_MINT_AMOUNT)}
              disabled={amount <= MIN_MINT_AMOUNT}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(parseInt(e.target.value) || MIN_MINT_AMOUNT)}
                min={MIN_MINT_AMOUNT}
                max="1000"
                step={MIN_MINT_AMOUNT}
                className="w-20 px-3 py-2 bg-white/10 rounded-lg text-center font-orbitron font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-400">tickets</span>
            </div>
            
            <button
              onClick={() => handleAmountChange(amount + MIN_MINT_AMOUNT)}
              disabled={amount >= 1000}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-2xl font-orbitron font-bold holographic-text mb-2">
              {totalCost.toFixed(3)} SOL
            </div>
            <div className="text-sm text-gray-400">
              {amount} tickets × {raffleStatus.pricePerNFT} SOL each
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Progress Display */}
          {isMinting && mintProgress && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm text-blue-300">{mintProgress.step}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(mintProgress.current / mintProgress.total) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Step {mintProgress.current} of {mintProgress.total}
              </div>
            </div>
          )}

          {/* Results Display */}
          {mintResults && !isMinting && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-green-300 font-medium">Compressed NFTs Minted!</span>
              </div>
              <div className="text-xs text-gray-300 space-y-1">
                <p>• Raffle Transaction: {mintResults.raffleTransaction}</p>
                <p>• Tickets #{mintResults.startingNumber} - #{mintResults.startingNumber + mintResults.totalMinted - 1}</p>
                <p>• Compressed NFTs Created: {mintResults.successfulNfts}/{mintResults.totalMinted}</p>
                <p>• cNFT Creation Cost: ~{mintResults.estimatedCost?.toFixed(4) || '0.00'} SOL</p>
                <p>• Artwork randomly assigned by metadata API</p>
                <p>• Standard blue or special red edition variants</p>
                {mintResults.failedNfts > 0 && (
                  <p className="text-orange-300">• Failed NFTs: {mintResults.failedNfts} (tickets still valid)</p>
                )}
              </div>
              <button
                onClick={() => setMintResults(null)}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                Dismiss
              </button>
            </div>
          )}

          <button
            onClick={handleMint}
            disabled={!connected || isMinting}
            className="w-full group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-orbitron font-bold text-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <span className="relative flex items-center justify-center space-x-2">
              {isMinting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              <span>
                {isMinting ? 'Minting...' : 
                 !connected ? 'Connect Wallet' : 
                 'MINT NOW'}
              </span>
            </span>
          </button>
        </div>
      )}

      {!isPublicMintLive && (
        <div className="text-center">
          <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-blue-400/30 bg-blue-500/5 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="font-orbitron font-bold text-blue-300">Preparing Launch</span>
            </div>
            <p className="text-sm text-gray-400">
              The CHOP raffle with compressed NFTs is being prepared for public launch. Stay tuned!
            </p>
            <div className="text-xs text-green-400 mt-2">
              ✨ Live metadata API ready • 6,250 special editions available • 100x cheaper than regular NFTs
            </div>
          </div>
          
          <button 
            className="group relative px-12 py-4 rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 text-white font-orbitron font-bold text-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-xl"></div>
            <span className="relative flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>COMING SOON</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};