import React, { useState } from 'react';
import { Calculator, TrendingUp, Target, Award, DollarSign, Skull, Crown } from 'lucide-react';
import { calculateOdds, calculateRoundSurvival } from '../utils/oddsCalculator';

export const OddsCalculator: React.FC = () => {
  const [ticketAmount, setTicketAmount] = useState(250);
  const [results, setResults] = useState(() => calculateOdds(250));

  const handleCalculate = (amount: number) => {
    const newAmount = Math.max(1, Math.min(243750, amount)); // Max is public tickets available
    setTicketAmount(newAmount);
    setResults(calculateOdds(newAmount));
  };

  const formatOdds = (percentage: number) => {
    if (percentage < 0.001) return '< 0.001%';
    if (percentage < 1) return `${percentage.toFixed(4)}%`;
    return `${percentage.toFixed(3)}%`;
  };

  const formatRatio = (percentage: number) => {
    if (percentage < 0.001) return '1 in 1M+';
    const ratio = Math.round(100 / percentage);
    return `1 in ${ratio.toLocaleString()}`;
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('Low survival')) return 'text-red-400';
    if (recommendation.includes('Decent position')) return 'text-yellow-400';
    if (recommendation.includes('Strong position')) return 'text-green-400';
    return 'text-purple-400';
  };

  return (
    <div className="space-y-6">
      {/* Calculator Input */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <h3 className="text-2xl font-orbitron font-bold mb-6 holographic-text">
          🎯 CHOP SURVIVAL CALCULATOR
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of tickets to analyze (Max: 243,750 public tickets)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={ticketAmount}
              onChange={(e) => handleCalculate(parseInt(e.target.value) || 1)}
              min="1"
              max="243750"
              className="flex-1 px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none font-orbitron text-lg"
            />
            <div className="flex space-x-2">
              {[100, 500, 1000, 5000].map(amount => (
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

        {/* Raffle Mechanics Info */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-orbitron font-bold text-blue-300 mb-2">⚡ CHOP Mechanics</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• 15 elimination rounds, 50% chopped each round</p>
            <p>• Survival rate per ticket: 0.5¹⁵ = 1 in 32,768</p>
            <p>• Only ~10 tickets survive from 243,750 public tickets</p>
            <p>• Grand Prize: $75,000 Rolex (1 winner from survivors)</p>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg text-gray-300 mb-2">
            With <span className="font-orbitron font-bold holographic-text">{ticketAmount}</span> tickets:
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
          <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Survival & Prize Odds</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Grand Prize ($75K Rolex)</span>
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
                <span className="text-sm text-gray-300">Survive All 15 Rounds</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-purple-400">
                  {formatOdds(results.makesFinalRound)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.makesFinalRound)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Top 10 Prize ($500)</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-blue-400">
                  {formatOdds(results.top10Prize)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.top10Prize)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skull className="w-5 h-5 text-red-400" />
                <span className="text-sm text-gray-300">Lucky Loser Prize</span>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-bold text-red-400">
                  {formatOdds(results.luckyLoser)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRatio(results.luckyLoser)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
          <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Investment Analysis</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Total Cost (Est.)</span>
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
              <span className="text-sm text-gray-300">Expected Survivors</span>
              <span className="font-orbitron font-bold text-blue-400">
                {(ticketAmount * Math.pow(0.5, 15)).toFixed(4)}
              </span>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="text-sm text-gray-300 mb-2">Strategy Assessment:</div>
              <div className={`font-medium text-sm ${getRecommendationColor(results.recommendation)}`}>
                {results.recommendation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Round-by-Round Survival */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <h4 className="text-lg font-orbitron font-bold mb-4 text-white">
          Round-by-Round Survival Simulation
        </h4>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 15 }, (_, i) => {
            const roundNum = i + 1;
            const survivors = calculateRoundSurvival(ticketAmount, roundNum);
            return (
              <div key={roundNum} className="text-center">
                <div className="text-sm text-gray-400 mb-1">Round {roundNum}</div>
                <div className="font-orbitron font-bold text-white">
                  {survivors >= 1 ? survivors.toFixed(1) : survivors.toFixed(4)}
                </div>
                <div className="text-xs text-gray-500">tickets</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          Expected ticket survival after each 50% elimination round
        </div>
      </div>

      {/* Prize Breakdown */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <h4 className="text-lg font-orbitron font-bold mb-4 text-white">
          Complete Prize Structure
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-green-400 mb-3">Major Prizes</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Grand Prize (Rolex)</span>
                <span className="text-white font-bold">$75,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Top 10 Prizes</span>
                <span className="text-white font-bold">$500 each</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cartier Sunglasses</span>
                <span className="text-white font-bold">$1,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Lucky Loser (5x)</span>
                <span className="text-white font-bold">$1,000 each</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-400 mb-3">Additional Prizes</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Community Giveaways</span>
                <span className="text-white font-bold">$20,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Mystery Prizes</span>
                <span className="text-white font-bold">$10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cuban Cigars Box</span>
                <span className="text-white font-bold">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Small Lucky Losers (5x)</span>
                <span className="text-white font-bold">$100 each</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};