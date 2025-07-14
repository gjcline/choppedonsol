import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sword, 
  Coins, 
  Trophy, 
  Clock, 
  Sparkles, 
  Shield, 
  Zap,
  ChevronRight,
  Diamond,
  Gem
} from 'lucide-react';
import { LiveStats } from '../components/LiveStats';
import { AdminPanel } from '../components/AdminPanel';
import { useAppContext } from '../contexts/AppContext';

export const Home: React.FC = () => {
  const { isDevWallet, raffleStatus } = useAppContext();
  
  // Target date: July 15, 2025 at 9 PM EST
  const targetDate = new Date('2025-07-15T21:00:00-05:00');
  
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  const isLive = raffleStatus.isInitialized;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-x-hidden pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: 'url(/backgroundbling.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      </div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="fixed bottom-1/4 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Main Title */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl -m-4"></div>
            <div className="relative z-10 p-4">
            <h1 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black mb-4">
              <span className="holographic-text">SURVIVE</span>
              <br />
              <span className="text-white">THE</span>
              <br />
              <span className="holographic-text">CHOP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Mint a ticket. Survive the rounds. Win big.
            </p>
            </div>
          </div>

          {/* Live Stats */}
          <LiveStats />

          {/* Holographic Ticket */}
          <div className="relative mb-12 flex justify-center">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Normal Blue Ticket */}
              <div className="relative w-80 h-48 md:w-96 md:h-56">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-500/10 to-blue-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* NFT Image */}
                  <div className="absolute left-4 top-4 bottom-4 w-32">
                    <img 
                      src="/chop.png" 
                      alt="CHOP NFT" 
                      className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  
                  {/* Rolex Overlay */}
                  <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <Gem className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center ml-36">
                    <div className="font-orbitron text-2xl font-bold mb-2 holographic-text">CHOP</div>
                    <div className="text-sm text-gray-400 mb-4">STANDARD TICKET</div>
                    <div className="text-xs text-blue-400 mb-1">COMPRESSED NFT</div>
                    <div className="text-xs text-gray-500">98% OF SUPPLY</div>
                    <div className="text-xs text-blue-400">BLUE VARIANT</div>
                  </div>
                </div>
              </div>

              {/* Rare Red Ticket */}
              <div className="relative w-80 h-48 md:w-96 md:h-56">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-2xl"></div>
                <div className="relative glass-card p-8 rounded-2xl backdrop-blur-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-500 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-orange-500/10 to-red-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Rare Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs font-bold text-white">
                      RARE
                    </div>
                  </div>
                  
                  {/* NFT Image */}
                  <div className="absolute left-4 top-4 bottom-4 w-32">
                    <img 
                      src="/optimized_chop1rare.png" 
                      alt="CHOP Rare NFT" 
                      className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  
                  {/* Rolex Overlay with red tint */}
                  <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400/30 to-red-600/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                        <Diamond className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center ml-36">
                    <div className="font-orbitron text-2xl font-bold mb-2 text-red-400">CHOP</div>
                    <div className="text-sm text-gray-400 mb-4">RARE TICKET</div>
                    <div className="text-xs text-red-400 mb-1">COMPRESSED NFT</div>
                    <div className="text-xs text-gray-500">2% OF SUPPLY</div>
                    <div className="text-xs text-red-400">RED VARIANT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Button */}
          <div className="text-center mb-12">
            <Link
              to="/how-it-works"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 rounded-xl hover:border-white/40 transition-all duration-300 backdrop-blur-xl group"
            >
              <span className="text-lg font-orbitron font-medium text-white group-hover:text-purple-200 transition-colors duration-300">
                HOW IT WORKS
              </span>
              <ChevronRight className="w-5 h-5 text-white group-hover:text-purple-200 transition-colors duration-300" />
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-4 font-orbitron">
              {isLive ? 'MINT IS LIVE!' : 'MINT STARTS IN'}
            </div>
            <div className="mb-4">
              <div className="flex justify-center space-x-4">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="glass-card p-4 rounded-xl backdrop-blur-xl border border-white/20">
                    <div className="text-2xl md:text-3xl font-orbitron font-bold holographic-text">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">{unit}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">
              Tuesday, July 15th at 9:00 PM EST
            </div>
          </div>

          {/* Mint Button */}
          <div className="mb-8">
            <div 
              to="/mint"
              className="inline-block group relative px-12 py-4 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-orbitron font-bold text-xl transition-all duration-300 cursor-not-allowed opacity-60"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/10 to-gray-500/10 rounded-xl blur-xl transition-all duration-300"></div>
              <span className="relative flex items-center space-x-2">
                <Clock className="w-6 h-6" />
                <span>MINT COMING SOON</span>
              </span>
            </div>
          </div>

          {/* Admin Panel (only visible to dev wallet) */}
          {isDevWallet && (
            <div className="mt-8">
              <AdminPanel />
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 holographic-text">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Coins className="w-8 h-8" />,
                title: "Mint",
                description: "Purchase compressed NFT raffle tickets (~0.00015 SOL each + ticket cost)"
              },
              {
                icon: <Sword className="w-8 h-8" />,
                title: "Chop Rounds",
                description: "Systematic elimination rounds reduce the supply"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Final 10",
                description: "Only 10 NFTs survive from the original 250,000"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Payout",
                description: "Winners receive SOL rewards via smart contract"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto glass-card rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-all duration-500">
                    <div className="text-white transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="font-orbitron text-xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-white text-base leading-relaxed font-medium">
                  {step.description}
                </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 holographic-text">
            Collection Stats
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Total Supply", value: "250K", unit: "NFTs" },
              { label: "Survivors", value: "10", unit: "Final" },
              { label: "Early Bird Price", value: "0.005", unit: "SOL" },
              { label: "cNFT Creation", value: "~0.00015", unit: "SOL" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all duration-500 mb-4">
                  <div className="text-3xl md:text-4xl font-orbitron font-bold holographic-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white uppercase tracking-wide font-medium">
                    {stat.unit}
                  </div>
                </div>
                <div className="text-lg font-medium text-white">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Finalist Showcase */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 holographic-text">
            Final 10 Showcase
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="aspect-square group">
                <div className="relative w-full h-full glass-card rounded-2xl backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all duration-500 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-gray-600 mb-2 mx-auto" />
                    <div className="text-xs text-gray-500 font-orbitron">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-green-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};