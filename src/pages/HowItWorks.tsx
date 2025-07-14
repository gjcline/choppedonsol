import React from 'react';
import { 
  Coins, 
  Sword, 
  Trophy, 
  Sparkles, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  ArrowRight,
  Gamepad2,
  Target,
  Award,
  Gift
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const phases = [
    {
      title: "Phase 1: Entry",
      description: "Purchase your CHOP game tickets",
      details: [
        "250,000 total tickets available",
        "Each ticket enters you in the elimination game",
        "Minimum 2 tickets per transaction", 
        "Early Bird Price: 0.005 SOL (first 100k)",
        "Standard Price: 0.01 SOL (remaining 150k)",
        "10% chance of special edition artwork"
      ],
      icon: <Coins className="w-8 h-8" />
    },
    {
      title: "Phase 2: Elimination Rounds",
      description: "15 rounds of thrilling eliminations",
      details: [
        "Each round eliminates 50% of remaining tickets",
        "Transparent on-chain randomness",
        "Live tracking of survivors",
        "Only ~7-8 tickets survive from 250,000",
        "Survival rate: 0.00305% (1 in 32,768)"
      ],
      icon: <Sword className="w-8 h-8" />
    },
    {
      title: "Phase 3: Champions",
      description: "The ultimate survivors compete for grand prize",
      details: [
        "Final survivors determined by smart contract",
        "No human intervention",
        "Provably fair selection",
        "Instant winner announcement"
      ],
      icon: <Trophy className="w-8 h-8" />
    },
    {
      title: "Phase 4: Rewards",
      description: "Winners receive amazing prizes",
      details: [
        "Grand Prize: $75,000 luxury watch or cash",
        "Runner-up rewards for Top 10",
        "Lucky Loser prizes from eliminated tickets",
        "Community giveaways throughout",
        "All rewards distributed transparently"
      ],
      icon: <Sparkles className="w-8 h-8" />
    }
  ];

  const features = [
    {
      title: "Provably Fair",
      description: "All eliminations use verifiable on-chain randomness",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "NFT Collectibles",
      description: "Your tickets are tradeable NFTs with unique artwork",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Transparent",
      description: "Every elimination recorded on Solana blockchain",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Entertainment Focus",
      description: "Gamified experience inspired by popular elimination games",
      icon: <Gamepad2 className="w-6 h-6" />
    }
  ];

  const prizeBreakdown = [
    { category: "Grand Prize", amount: "$75,000", description: "Luxury watch or cash equivalent" },
    { category: "Top 10", amount: "$5,000", description: "Total for runner-up rewards" },
    { category: "Lucky Losers", amount: "$8,100", description: "Prizes from eliminated tickets" },
    { category: "Community", amount: "$30,000", description: "Giveaways throughout game" },
    { category: "Mystery Prizes", amount: "$10,000", description: "Surprise rewards" },
    { category: "Operations", amount: "Remaining", description: "Platform development" }
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-4">
            <span className="holographic-text">HOW IT</span>
            <br />
            <span className="text-white">WORKS</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CHOPPED is an innovative elimination game on Solana where 250,000 NFT tickets compete in survival rounds until champions emerge. Here's how the game works:
          </p>
        </div>

        {/* Phases */}
        <div className="mb-24">
          <div className="grid gap-8">
            {phases.map((phase, index) => (
              <div key={index} className="group">
                <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all duration-500">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 glass-card rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center">
                        <div className="text-purple-400 group-hover:text-white transition-colors duration-300">
                          {phase.icon}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-orbitron text-2xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors duration-300">
                        {phase.title}
                      </h3>
                      <p className="text-gray-300 mb-4 text-lg">
                        {phase.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Features */}
        <div className="mb-24">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-12 holographic-text">
            Game Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all duration-500 mb-4">
                  <div className="text-purple-400 group-hover:text-white transition-colors duration-300 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-orbitron text-lg font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prize Structure */}
        <div className="mb-12">
          <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20">
            <h2 className="text-3xl font-orbitron font-bold text-center mb-8 holographic-text">
              Prize Structure
            </h2>
            
            <div className="text-center mb-8">
              <div className="text-2xl font-orbitron font-bold holographic-text mb-2">
                Total Prize Pool: $150,000
              </div>
              <div className="text-sm text-gray-400">
                Predetermined rewards for gameplay entertainment
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prizeBreakdown.map((prize, index) => (
                <div key={index} className="text-center">
                  <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500">
                    <div className="text-2xl font-orbitron font-bold holographic-text mb-2">
                      {prize.amount}
                    </div>
                    <div className="text-lg font-medium text-white mb-2">
                      {prize.category}
                    </div>
                    <div className="text-sm text-gray-400">
                      {prize.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            CHOPPED is an entertainment experience with predetermined prizes. 
            Play responsibly and enjoy the thrill of the game.
          </p>
        </div>
      </div>
    </div>
  );
};