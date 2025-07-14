import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CrossmintProvider, CrossmintHostedCheckout } from '@crossmint/client-sdk-react-ui';
import { CreditCard, Wallet, ArrowLeft, Zap, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { EARLY_BIRD_PRICE, REGULAR_PRICE, EARLY_BIRD_THRESHOLD } from '../utils/solana';

export const Mint: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { raffleStatus } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  
  // Get Crossmint API key from environment
  const clientApiKey = import.meta.env.VITE_CROSSMINT_CLIENT_API_KEY;
  
  // Validate API key format
  const isValidApiKey = clientApiKey && (clientApiKey.startsWith('ck_') || clientApiKey.startsWith('sk_'));
  
  // Determine current price based on total minted
  const currentPrice = raffleStatus.totalMinted < EARLY_BIRD_THRESHOLD ? EARLY_BIRD_PRICE : REGULAR_PRICE;
  const totalPrice = (currentPrice * quantity).toFixed(3);

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-4">
            <span className="holographic-text">MINT</span>
            <br />
            <span className="text-white">CHOP</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Choose your payment method and mint your CHOP raffle tickets
          </p>
        </div>

        {/* Current Stats */}
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-orbitron font-bold holographic-text mb-1">
                {raffleStatus.totalMinted.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Minted</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-orbitron font-bold text-white mb-1">
                {raffleStatus.currentPhase}
              </div>
              <div className="text-sm text-gray-400">Current Phase</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-orbitron font-bold holographic-text mb-1">
                {currentPrice} SOL
              </div>
              <div className="text-sm text-gray-400">Price Per Ticket</div>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20 mb-8">
          <h3 className="text-xl font-orbitron font-bold mb-4 text-center">Select Quantity</h3>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <span className="text-xl font-bold">-</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                min="1"
                max="100"
                className="w-20 px-3 py-2 bg-white/10 rounded-lg text-center font-orbitron font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-400">tickets</span>
            </div>
            
            <button
              onClick={() => setQuantity(Math.min(100, quantity + 1))}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <span className="text-xl font-bold">+</span>
            </button>
          </div>

          <div className="text-center">
            <div className="text-3xl font-orbitron font-bold holographic-text mb-2">
              {totalPrice} SOL
            </div>
            <div className="text-sm text-gray-400">
              {quantity} ticket{quantity > 1 ? 's' : ''} × {currentPrice} SOL each
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Crossmint Payment */}
          <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-orbitron font-bold text-white">
                Pay with Card/Crypto
              </h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Credit/Debit Card</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cryptocurrency</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No wallet required</span>
              </div>
            </div>

            {isValidApiKey ? (
              <CrossmintProvider apiKey={clientApiKey}>
                <CrossmintHostedCheckout
                  lineItems={{
                    collectionLocator: `crossmint:8c0f06c1-0d99-4619-aeb2-88c318a7d66f`,
                    callData: {
                      totalPrice: totalPrice,
                      quantity: quantity,
                    },
                  }}
                  payment={{
                    crypto: { enabled: true },
                    fiat: { enabled: true },
                  }}
                />
              </CrossmintProvider>
            ) : (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Crossmint integration pending. Use wallet mint for now.
                </p>
              </div>
            )}
          </div>

          {/* Wallet Payment */}
          <div className="glass-card p-6 rounded-2xl backdrop-blur-xl border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-orbitron font-bold text-white">
                Pay with Wallet
              </h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Direct from wallet</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Phantom, Solflare, etc.</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Instant minting</span>
              </div>
            </div>

            {connected ? (
              <button className="w-full group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-orbitron font-bold transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>MINT WITH WALLET</span>
                </span>
              </button>
            ) : (
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl font-orbitron font-bold text-white opacity-75 cursor-not-allowed">
                Connect Wallet First
              </button>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 glass-card p-4 rounded-xl backdrop-blur-xl border border-blue-400/30 bg-blue-500/5">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">
              Secure Payment Processing
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            All payments are processed securely. NFTs are minted directly to your wallet or Crossmint custodial wallet.
          </p>
        </div>
      </div>
    </div>
  );
};