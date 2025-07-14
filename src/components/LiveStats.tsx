import React from 'react';
import { TrendingUp, Users, Coins, Package } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { MAX_SUPPLY } from '../utils/solana';

export const LiveStats: React.FC = () => {
  const { raffleStatus, userHoldings, isLoading } = useAppContext();
  const progressPercentage = (raffleStatus.totalMinted / MAX_SUPPLY) * 100;

  return (
    <div className="mb-12">
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total Minted */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm text-gray-400">Total Minted</span>
            </div>
            <div className="text-2xl font-orbitron font-bold holographic-text">
              {isLoading ? '...' : '0'}
            </div>
            <div className="text-xs text-gray-500">/ {MAX_SUPPLY.toLocaleString()}</div>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Current Phase */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm text-gray-400">Current Phase</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-white">
              Preparing Launch
            </div>
            <div className="text-xs text-gray-500">Stay Tuned</div>
          </div>

          {/* User Holdings */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm text-gray-400">Your Holdings</span>
            </div>
            <div className="text-2xl font-orbitron font-bold holographic-text">
              {isLoading ? '...' : userHoldings}
            </div>
            <div className="text-xs text-gray-500">NFTs</div>
          </div>
        </div>
      </div>
    </div>
  );
};