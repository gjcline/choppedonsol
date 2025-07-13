import React, { useState } from 'react';
import { Calculator, TrendingUp, Target, Award, DollarSign } from 'lucide-react';
import { calculateOdds } from '../utils/oddsCalculator';

export const OddsCalculator: React.FC = () => {
  const [ticketAmount, setTicketAmount] = useState(250);
  const [results, setResults] = useState(() => calculateOdds(250));

  const handleCalculate = (amount: number) => {
    const newAmount = Math.max(1, Math.min(10000, amount));
    setTicketAmount(newAmount);
    setResults(calculateOdds(newAmount));
  };

  const formatOdds = (percentage: number) => {
    if (percentage < 0.001) return '< 0.001%';
    return `${percentage.toFixed(3)}%`;
  };

  const formatRatio = (percentage: number) => {
    const ratio = Math.round(100 / percentage);
    return `1 in ${ratio.toLocaleString()}`;
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('Consider more')) return 'text-orange-400';
    if (recommendation.includes('Good balance')) return 'text-green-400';
    if (recommendation.includes('High roller')) return 'text-blue-400';
    return 'text-purple-400';
  };

  return (
    <div className="space-y-6">
      {/* Calculator Input */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <h3 className="text-2xl font-orbitron font-bold mb-6 holographic-text">
          🎯 ODDS CALCULATOR
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tickets to analyze
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={ticketAmount}
              onChange={(e) => handleCalculate(parseInt(e.target.value) || 1)}
              min="1"
              max="10000"
              className="flex-1 px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none font-orbitron text-lg"
            />
            <div className="flex space-x-2">
              {[100, 250, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleCalculate(amount)}
                  className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200 text-sm font-medium"
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg text-gray-300 mb-2">
            With <span className="font-orbitron font-bold holographic-text">{ticketAmount}</span> tickets, you have:
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
          <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Prize Odds</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Grand Prize (Watch)</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-yellow-400">
                  {formatOdds(results.grandPrize)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.grandPrize)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-300">Top 10 Prize</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-purple-400">
                  {formatOdds(results.top10Prize)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.top10Prize)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">Lucky Loser</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-green-400">
                  {formatOdds(results.luckyLoser)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.luckyLoser)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Make Final Round</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-blue-400">
                  {formatOdds(results.makesFinalRound)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.makesFinalRound)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
          <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Investment Analysis</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Total Cost</span>
              <span className="font-orbitron font-bold text-white">
                ${results.totalCost.toFixed(0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Expected Value</span>
              <span className="font-orbitron font-bold text-green-400">
                ${results.expectedValue.toFixed(0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Risk/Reward Ratio</span>
              <span className="font-orbitron font-bold text-blue-400">
                {(results.expectedValue / results.totalCost).toFixed(2)}x
              </span>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="text-sm text-gray-300 mb-2">Recommendation:</div>
              <div className={`font-medium ${getRecommendationColor(results.recommendation)}`}>
                {results.recommendation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};