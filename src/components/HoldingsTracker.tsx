import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { WalletHoldings } from '../types/wallet';

interface HoldingsTrackerProps {
  holdings: WalletHoldings;
}

export const HoldingsTracker: React.FC<HoldingsTrackerProps> = ({ holdings }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'survival'>('id');

  const displayedTickets = showAll ? holdings.tickets : holdings.tickets.slice(0, 10);

  const sortedTickets = [...displayedTickets].sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return a.id - b.id;
      case 'status':
        return a.status === 'active' ? -1 : 1;
      case 'survival':
        return b.survivalChance - a.survivalChance;
      default:
        return 0;
    }
  });

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getStatusText = (ticket: any) => {
    if (ticket.status === 'active') {
      return (
        <span className="text-green-400">
          Active ({ticket.survivalChance.toFixed(1)}% survival chance)
        </span>
      );
    } else {
      return (
        <span className="text-red-400">
          Chopped Round {ticket.round}
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-orbitron font-bold holographic-text">
            📋 YOUR TICKETS
          </h3>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'id' | 'status' | 'survival')}
              className="px-3 py-2 bg-white/10 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none text-sm"
            >
              <option value="id">Sort by ID</option>
              <option value="status">Sort by Status</option>
              <option value="survival">Sort by Survival</option>
            </select>
            
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              {showAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">
                {showAll ? 'Show Less' : `Show All (${holdings.tickets.length})`}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                ticket.status === 'active'
                  ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                  : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(ticket.status)}
                  <span className="font-orbitron font-bold text-white">
                    #{ticket.id.toLocaleString()}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-sm">
                    {getStatusText(ticket)}
                  </div>
                  {ticket.status === 'active' && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending up</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && holdings.tickets.length > 10 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 backdrop-blur-xl"
            >
              <span className="text-sm font-medium">
                Show {holdings.tickets.length - 10} more tickets
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Quick Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 backdrop-blur-xl">
            <div className="text-sm font-medium text-white">Check Another Wallet</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 backdrop-blur-xl">
            <div className="text-sm font-medium text-white">Calculate More Tickets</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 backdrop-blur-xl">
            <div className="text-sm font-medium text-white">View Odds Chart</div>
          </button>
        </div>
      </div>
    </div>
  );
};