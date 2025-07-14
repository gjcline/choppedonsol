import React, { useState } from 'react';
import { Search, Wallet, Loader2, BarChart3, Calculator } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { WalletPortfolio } from '../components/WalletPortfolio';
import { OddsCalculator } from '../components/OddsCalculator';
import { HoldingsTracker } from '../components/HoldingsTracker';
import { generateMockHoldings, mockWalletAddresses } from '../utils/mockData';
import { getUserHoldings } from '../utils/solana';
import { useAppContext } from '../contexts/AppContext';

export const CheckWallet: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { refreshData } = useAppContext();
  const [walletAddress, setWalletAddress] = useState('');
  const [holdings, setHoldings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'calculator' | 'tracker'>('portfolio');

  const handleCheck = async (address?: string) => {
    const targetAddress = address || walletAddress;
    if (!targetAddress) return;

    setIsLoading(true);
    
    try {
      // For now, still use mock data since we need actual NFT parsing
      // In production, you'd fetch real NFT data here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockHoldings = generateMockHoldings(targetAddress);
      setHoldings(mockHoldings);
      
      // Refresh app data as well
      await refreshData();
    } catch (error) {
      console.error('Error checking wallet:', error);
    }
    setIsLoading(false);
  };

  const handleCheckConnected = () => {
    if (connected && publicKey) {
      handleCheck(publicKey.toString());
      setWalletAddress(publicKey.toString());
    }
  };

  const handleQuickCheck = (address: string) => {
    setWalletAddress(address);
    handleCheck(address);
  };

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
    { id: 'calculator', label: 'Odds Calculator', icon: Calculator },
    { id: 'tracker', label: 'Holdings Tracker', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-x-hidden pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: 'url(/backgroundbling.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80"></div>
      </div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-4">
            <span className="holographic-text">WALLET</span>
            <br />
            <span className="text-white">ANALYZER (demo)</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Enter any wallet address to analyze CHOP holdings, calculate odds, and track performance.
          </p>
        </div>

        {/* Wallet Input */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Manual Entry */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter Solana wallet address..."
                    className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none font-mono text-sm"
                  />
                  <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
                </div>
                
                <button
                  onClick={() => handleCheck()}
                  disabled={!walletAddress || isLoading}
                  className="w-full mt-4 group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-orbitron font-bold transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>ANALYZE WALLET</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Connected Wallet */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Connected Wallet
                </label>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
                  {connected && publicKey ? (
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-green-400" />
                      <span className="font-mono text-sm text-white">
                        {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400">No wallet connected</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleCheckConnected}
                  disabled={!connected || isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium">
                    {connected ? 'Check My Wallet' : 'Connect Wallet First'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Demo Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-sm text-gray-400 mb-3">Quick Demo (Sample Wallets):</div>
              <div className="flex flex-wrap gap-2">
                {mockWalletAddresses.map((address, index) => (
                  <button
                    key={address}
                    onClick={() => handleQuickCheck(address)}
                    className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200 text-xs font-mono"
                  >
                    Demo {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {holdings && (
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'portfolio' && (
                <WalletPortfolio holdings={holdings} walletAddress={walletAddress} />
              )}
              {activeTab === 'calculator' && <OddsCalculator />}
              {activeTab === 'tracker' && <HoldingsTracker holdings={holdings} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};