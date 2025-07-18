import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletConnectionProvider } from './components/WalletProvider';
import { AppProvider } from './contexts/AppContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { CheckWallet } from './pages/CheckWallet';
import { HowItWorks } from './pages/HowItWorks';
import { DevMint } from './pages/DevMint';
import { Mint } from './pages/Mint';
import { CandyMint } from './pages/CandyMint';

function App() {
  return (
    <WalletConnectionProvider>
      <AppProvider>
      <Router>
        <div className="min-h-screen bg-black text-white font-inter">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/candy-mint" element={<CandyMint />} />
            <Route path="/check" element={<CheckWallet />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dev-mint" element={<DevMint />} />
          </Routes>
          
          {/* Footer */}
          <footer className="relative z-10 py-12 px-4 border-t border-white/10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="font-orbitron text-2xl font-bold holographic-text mb-2">CHOP</div>
                <div className="text-sm text-gray-400">
                  Built on Solana • Fair Launch • No Presale
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
      </AppProvider>
    </WalletConnectionProvider>
  );
}

export default App;