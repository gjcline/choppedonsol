import React from 'react';
import { TrendingUp, TrendingDown, Trophy, Target, Percent } from 'lucide-react';
import { WalletHoldings } from '../types/wallet';
import { calculateCombinedOdds } from '../utils/oddsCalculator';

interface WalletPortfolioProps {
  holdings: WalletHoldings;
  walletAddress: string;
}

export const WalletPortfolio: React.FC<WalletPortfolioProps> = ({ holdings, walletAddress }) => {
  const activePercentage = (holdings.active / holdings.total) * 100;
  const choppedPercentage = (holdings.chopped / holdings.total) * 100;
  const anyPrizeOdds = calculateCombinedOdds(holdings.active);
  const grandPrizeOdds = anyPrizeOdds * 0.1; // 10% of any prize odds
  const top10Odds = anyPrizeOdds * 0.9; // 90% of any prize odds
  const luckyLoserOdds = anyPrizeOdds * 0.25; // 25% of any prize odds

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRoundColor = (round: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500'];
    return colors[round - 1] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-orbitron font-bold holographic-text">
            📊 WALLET ANALYSIS
          </h2>
          <div className="text-sm text-gray-400 font-mono">
            {formatAddress(walletAddress)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-orbitron font-bold holographic-text mb-1">
              {holdings.total}
            </div>
            <div className="text-sm text-gray-400">Total CHOP Tickets</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-2xl font-orbitron font-bold text-green-400">
                {holdings.active}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Active ({activePercentage.toFixed(1)}%)
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-2xl font-orbitron font-bold text-red-400">
                {holdings.chopped}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Chopped ({choppedPercentage.toFixed(1)}%)
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-orbitron font-bold holographic-text mb-1">
              {activePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Survival Rate</div>
          </div>
        </div>

        {/* Elimination Breakdown */}
        {holdings.chopped > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-orbitron font-bold mb-3 text-white">
              Round Eliminated
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(holdings.choppedDetails).map(([round, tickets]) => (
                <div
                  key={round}
                  className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getRoundColor(parseInt(round.replace('round', '')))}`}
                >
                  Round {round.replace('round', '')}: {tickets.length} tickets
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Odds Analysis */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <h3 className="text-2xl font-orbitron font-bold mb-6 holographic-text">
          🎯 YOUR ODDS
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm text-gray-400">Any Prize</span>
            </div>
            <div className="text-2xl font-orbitron font-bold text-blue-400">
              {anyPrizeOdds.toFixed(3)}%
            </div>
            <div className="text-xs text-gray-500">
              1 in {Math.round(100 / anyPrizeOdds).toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-400">Grand Prize</span>
            </div>
            <div className="text-2xl font-orbitron font-bold text-yellow-400">
              {grandPrizeOdds.toFixed(4)}%
            </div>
            <div className="text-xs text-gray-500">
              1 in {Math.round(100 / grandPrizeOdds).toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Percent className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm text-gray-400">Top 10</span>
            </div>
            <div className="text-2xl font-orbitron font-bold text-purple-400">
              {top10Odds.toFixed(3)}%
            </div>
            <div className="text-xs text-gray-500">
              1 in {Math.round(100 / top10Odds).toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm text-gray-400">Lucky Loser</span>
            </div>
            <div className="text-2xl font-orbitron font-bold text-green-400">
              {luckyLoserOdds.toFixed(3)}%
            </div>
            <div className="text-xs text-gray-500">
              1 in {Math.round(100 / luckyLoserOdds).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};