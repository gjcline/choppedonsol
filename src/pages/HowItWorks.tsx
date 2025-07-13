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
  ArrowRight
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const phases = [
    {
      title: "Phase 1: Mint",
      description: "Purchase your CHOP raffle tickets",
      details: [
        "250,000 total supply",
        "Minimum 2 tickets per transaction", 
        "Compressed NFTs for low fees",
        "Early Bird: 0.005 SOL (first 100k)",
        "Regular: 0.01 SOL (remaining 150k)",
        "cNFT creation: ~0.00015 SOL per ticket",
        "6,250 special edition red variants"
      ],
      icon: <Coins className="w-8 h-8" />
    },
    {
      title: "Phase 2: Chop Rounds",
      description: "Systematic elimination reduces the supply",
      details: [
        "Multiple elimination rounds",
        "Transparent on-chain process",
        "Automated smart contract execution",
        "Compressed NFTs stored efficiently",
        "Artwork randomly assigned (blue/red)",
        "Real-time updates on survivors"
      ],
      icon: <Sword className="w-8 h-8" />
    },
    {
      title: "Phase 3: Final 10",
      description: "Only 10 NFTs survive from 250,000",
      details: [
        "Winners are automatically selected",
        "No human intervention required",
        "Provably fair algorithm",
        "Immediate winner announcement"
      ],
      icon: <Trophy className="w-8 h-8" />
    },
    {
      title: "Phase 4: Payout",
      description: "Winners receive SOL rewards",
      details: [
        "Automatic SOL distribution",
        "No claiming required",
        "Instant payouts via smart contract",
        "Winner NFTs remain as proof",
        "Transparent prize pool allocation"
      ],
      icon: <Sparkles className="w-8 h-8" />
    }
  ];

  const features = [
    {
      title: "Provably Fair",
      description: "All elimination rounds use verifiable randomness",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Instant Payouts",
      description: "Winners receive SOL automatically via smart contract",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Transparent",
      description: "Every step is recorded on the Solana blockchain",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Real-time Updates",
      description: "Live tracking of eliminations and survivor count",
      icon: <Clock className="w-6 h-6" />
    }
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
            CHOP is a revolutionary NFT raffle system where 250,000 tickets are systematically 
            eliminated until only 10 winners remain. Here's how the process works:
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

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-12 holographic-text">
            Key Features
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

        {/* Prize Pool */}
        <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-8 holographic-text">
            Prize Pool Distribution
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold holographic-text mb-2">
                70%
              </div>
              <div className="text-lg font-medium text-white mb-2">
                Winner Rewards
              </div>
              <div className="text-sm text-gray-400">
                Distributed among final 10 survivors, $d3vcav3 holders,$GIVE holders and random 'lucky losers'
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold holographic-text mb-2">
                20%
              </div>
              <div className="text-lg font-medium text-white mb-2">
                Development
              </div>
              <div className="text-sm text-gray-400">
                Platform development and maintenance
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold holographic-text mb-2">
                10%
              </div>
              <div className="text-lg font-medium text-white mb-2">
                Operations
              </div>
              <div className="text-sm text-gray-400">
                Marketing and community building
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};