import React, { useState, useEffect, useRef } from 'react';
import { 
  Bomb, Wallet, ArrowRightLeft, Shield, Zap, 
  ChevronRight, Play, Hexagon, Trophy, Activity,
  LogOut, Lock, AlertTriangle, X, CheckCircle2,
  Flame, Skull, Coins, ArrowRight, Gamepad2, ChevronLeft,
  Timer, Plus, Eye, EyeOff, TrendingUp, Check, User,
  RotateCcw, Hourglass, AlertOctagon, Building2, Dices,
  Briefcase, Gavel, Gift, Banknote, PiggyBank, Landmark,
  RefreshCw, Percent, FastForward, ArrowDownUp, Download,
  Crosshair, Club, Ticket, CandlestickChart, ExternalLink,
  ChevronDown, ChevronUp, Globe, Repeat, Vote, Crown,
  PieChart, Sparkles
} from 'lucide-react';

// --- SYSTEM CONFIG ---
const GAME_TOKEN = "srUSD"; 
const GOV_TOKEN = "SVR";
const STABLE_COINS = ["USDT", "USDC"];
const CREATE_POOL_FEE = 50; 
const SERVICE_FEE_PERCENT = 0.01; 

// --- SAVER VAULT CONFIG ---
const VAULT_CONFIG = {
  APY: 0.20, // 20% APY
  LTV: 0.5, // Max borrow 50% of collateral
  YIELD_INTERVAL: 3000, // Yield update every 3s
};

// --- MONOPOLY CONFIG ---
const TYCOON_CONFIG = {
  START_BALANCE: 1500,
  PASS_GO_REWARD: 200,
  JAIL_FINE: 100,
};

// BOARD SLOTS
const BOARD_SLOTS = [
  { id: 0, type: 'GO', name: 'START', color: 'bg-green-600', icon: <ArrowRight/> },
  { 
    id: 1, type: 'PROPERTY', name: 'KAMINO', price: 60, rent: 10, color: 'bg-[#00D18C]', owner: null, 
    logo: 'https://pbs.twimg.com/profile_images/1556681237044666369/S7fC7m-K_400x400.jpg' 
  },
  { id: 2, type: 'CHANCE', name: 'LUCK', color: 'bg-purple-600', icon: <Gift/> },
  { 
    id: 3, type: 'PROPERTY', name: 'UNISWAP', price: 80, rent: 15, color: 'bg-[#FF007A]', owner: null, 
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png?v=029' 
  },
  { id: 4, type: 'TAX', name: 'GAS FEE', amount: 100, color: 'bg-slate-600', icon: <Flame/> },
  { 
    id: 5, type: 'PROPERTY', name: 'BASE', price: 150, rent: 30, color: 'bg-[#0052FF]', owner: null, 
    logo: 'https://avatars.githubusercontent.com/u/108554348?s=200&v=4' 
  },
  { id: 6, type: 'JAIL', name: 'SEC JAIL', color: 'bg-slate-800', icon: <Gavel/> },
  { 
    id: 7, type: 'PROPERTY', name: 'AAVE', price: 180, rent: 40, color: 'bg-[#B6509E]', owner: null, 
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png?v=029' 
  },
  { 
    id: 8, type: 'PROPERTY', name: 'BINANCE', price: 220, rent: 50, color: 'bg-[#F3BA2F]', owner: null, 
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=029' 
  },
  { id: 9, type: 'CHANCE', name: 'RISK', color: 'bg-red-600', icon: <AlertTriangle/> },
  { 
    id: 10, type: 'PROPERTY', name: 'ETHEREUM', price: 350, rent: 80, color: 'bg-[#627EEA]', owner: null, 
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029' 
  },
  { id: 11, type: 'GO_TO_JAIL', name: 'RUG PULL', color: 'bg-red-800', icon: <X/> },
];

const GAMES_LIST = [
  { 
    id: 'bomb-panic', 
    name: 'Bomb Panic', 
    desc: 'PvP Survival. Don\'t hold the bomb!', 
    imageUrl: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=600&auto=format&fit=crop', 
    icon: <Bomb size={32} className="text-red-500" />,
    status: 'ACTIVE'
  },
  { 
    id: 'crypto-tycoon', 
    name: 'Crypto Tycoon', 
    desc: 'Monopoly style trading board game.', 
    imageUrl: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=600&auto=format&fit=crop', 
    icon: <Building2 size={32} className="text-blue-400" />,
    status: 'ACTIVE' 
  },
  { 
    id: 'russian-roulette', 
    name: 'Russian Roulette', 
    desc: 'One bullet. Last man standing wins.', 
    imageUrl: 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=600&auto=format&fit=crop', 
    icon: <Crosshair size={32} className="text-slate-400" />,
    status: 'ACTIVE' 
  },
  { 
    id: 'binary-prediction', 
    name: 'Binary Market', 
    desc: 'Predict price Up/Down in 30s.', 
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=600&auto=format&fit=crop', 
    icon: <CandlestickChart size={32} className="text-green-500" />,
    status: 'COMING_SOON'
  },
  { 
    id: 'defi-poker', 
    name: 'DeFi Poker', 
    desc: 'Texas Hold\'em with crypto stakes.', 
    imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=600&auto=format&fit=crop', 
    icon: <Club size={32} className="text-purple-500" />,
    status: 'COMING_SOON'
  },
  { 
    id: 'lucky-lottery', 
    name: 'Jackpot Lotto', 
    desc: 'Daily draw. 1 winner takes all.', 
    imageUrl: 'https://images.unsplash.com/photo-1518688248740-75979b5dac0e?q=80&w=600&auto=format&fit=crop', 
    icon: <Ticket size={32} className="text-yellow-500" />,
    status: 'COMING_SOON'
  },
  { 
    id: 'chicken-race', 
    name: 'Mutant Run', 
    desc: 'Bet on mutant chickens racing.', 
    imageUrl: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=600&auto=format&fit=crop', 
    icon: <Zap size={32} className="text-orange-500" />,
    status: 'COMING_SOON'
  }
];

const INITIAL_ROOMS = [
  { id: 'pool-shark', name: 'Shark Tank', entry: 100, players: 4, color: 'text-blue-400', border: 'border-blue-500/50', difficulty: 'EASY', isPrivate: false },
  { id: 'pool-tiger', name: 'Tiger Cave', entry: 500, players: 5, color: 'text-orange-400', border: 'border-orange-500/50', difficulty: 'MEDIUM', isPrivate: false },
  { id: 'pool-dragon', name: 'Dragon Den', entry: 2000, players: 6, color: 'text-red-500', border: 'border-red-500/50', difficulty: 'HARD', isPrivate: false },
];

const MOCK_WALLET_BALANCE = {
  USDT: 5000,
  USDC: 3000
};

// -----------------------------------------------------------------------------
// COMPONENT: TOKENOMICS MODAL (NEW)
// -----------------------------------------------------------------------------
const TokenomicsModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-zoom-in overflow-y-auto">
            <div className="bg-slate-900 w-full max-w-5xl rounded-3xl border border-slate-700 shadow-2xl relative flex flex-col md:flex-row overflow-hidden my-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-20"><X/></button>
                
                {/* LEFT: HERO & BRANDING */}
                <div className="w-full md:w-4/12 bg-gradient-to-br from-yellow-600 to-yellow-900 p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full blur-[80px] opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1 rounded-full text-yellow-100 text-xs font-bold mb-6 border border-white/10">
                            <Crown size={12}/> GOVERNANCE TOKEN
                        </div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                            ${GOV_TOKEN}
                        </h2>
                        <p className="text-yellow-100 text-lg font-medium opacity-90">
                            The backbone of Saver Protocol. Stake to own the House.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6 mt-12">
                         <div className="bg-black/20 backdrop-blur rounded-xl p-4 border border-white/10">
                             <div className="text-yellow-200 text-xs font-bold uppercase mb-1">Max Supply</div>
                             <div className="text-2xl font-mono font-bold text-white">100,000,000</div>
                         </div>
                         <div className="bg-black/20 backdrop-blur rounded-xl p-4 border border-white/10">
                             <div className="text-yellow-200 text-xs font-bold uppercase mb-1">Emission</div>
                             <div className="text-2xl font-mono font-bold text-white">Deflationary</div>
                         </div>
                    </div>
                </div>

                {/* RIGHT: UTILITIES GRID */}
                <div className="w-full md:w-8/12 p-8 bg-slate-950 overflow-y-auto">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Hexagon className="text-yellow-500 fill-yellow-500/20"/> Utility Ecosystem
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* FEATURE 1 */}
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-yellow-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Banknote size={24}/>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">Real Yield Sharing</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Stakers receive <strong>50% of all protocol revenue</strong> (Game Fees & Withdrawal Fees). Be the "House" and earn like a casino.
                            </p>
                        </div>

                        {/* FEATURE 2 */}
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Vote size={24}/>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">Governance DAO</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Vote on critical parameters: <strong>Vault APY strategies</strong>, adding new games, and adjusting Risk factors (LTV).
                            </p>
                        </div>

                        {/* FEATURE 3 */}
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles size={24}/>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">Game Buffs</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Holders get <strong>Fee Discounts</strong> when creating private pools and access to exclusive "High Roller" VIP rooms.
                            </p>
                        </div>

                        {/* FEATURE 4 */}
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Shield size={24}/>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">Loss Insurance</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Tiered staking unlocks <strong>"Saver Shield"</strong>, rebating a small % of losses in high-risk games like Bomb Panic.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                             <span className="text-slate-400 text-sm font-bold uppercase">Token Distribution</span>
                             <span className="text-yellow-500 text-xs flex items-center gap-1"><PieChart size={12}/> Vesting Schedule active</span>
                        </div>
                        <div className="flex w-full h-4 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 w-[40%]" title="Community Rewards (40%)"></div>
                            <div className="bg-blue-500 w-[20%]" title="DAO Treasury (20%)"></div>
                            <div className="bg-green-500 w-[15%]" title="Team (15%)"></div>
                            <div className="bg-purple-500 w-[15%]" title="Investors (15%)"></div>
                            <div className="bg-slate-600 w-[10%]" title="Airdrop (10%)"></div>
                        </div>
                        <div className="flex gap-4 mt-3 text-[10px] text-slate-500 font-mono">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> 40% Rewards</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 20% Treasury</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> 15% Team</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> 15% Investors</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (SaverVaultModal code remains exactly the same as previous step) ...
const SaverVaultModal = ({ walletBalances, tokenBalance, vaultState, onDeposit, onBorrow, onRepay, onWithdraw, onClaim, onClose }) => {
  const [activeTab, setActiveTab] = useState('DEPOSIT'); 
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [expandedWithdraw, setExpandedWithdraw] = useState(null); 

  const InputGroup = ({ label, balance, value, onChange, onMax, tokenLabel, isDebt }) => (
    <div className={`p-4 rounded-xl border ${isDebt ? 'bg-red-900/10 border-red-500/30' : 'bg-slate-950 border-slate-800'}`}>
      <div className="flex justify-between mb-2">
        <span className="text-slate-400 text-xs font-bold uppercase">{label}</span>
        <span className="text-slate-400 text-xs">Balance: {balance}</span>
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="0.00" 
          className={`bg-transparent text-2xl font-mono font-bold w-full outline-none ${isDebt ? 'text-red-400' : 'text-white'}`}
        />
        <div className="flex items-center gap-2">
            <button onClick={onMax} className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition">MAX</button>
            <span className="font-bold text-slate-500">{tokenLabel}</span>
        </div>
      </div>
    </div>
  );

  const maxBorrowable = Math.max(0, (vaultState.deposited * VAULT_CONFIG.LTV) - vaultState.debt);
  const requiredCollateral = vaultState.debt / VAULT_CONFIG.LTV;
  const maxWithdrawable = Math.max(0, vaultState.deposited - requiredCollateral);

  const handleAction = () => {
     if (!amount || Number(amount) <= 0) return;
     const val = Number(amount);

     if (activeTab === 'DEPOSIT') {
         if (val > walletBalances[selectedCoin]) return alert("Insufficient balance");
         onDeposit(selectedCoin, val);
     } else if (activeTab === 'BORROW') {
         if (val > maxBorrowable) return alert("Exceeds credit limit (LTV)");
         onBorrow(val);
     } else if (activeTab === 'REPAY') {
        onRepay(val);
     }
     setAmount('');
  };

  const handleWithdrawAction = (coin) => {
    if (!amount || Number(amount) <= 0) return;
    const val = Number(amount);
    if(val > maxWithdrawable) return alert("Cannot withdraw collateral while debt is high.");
    onWithdraw(val);
    setAmount('');
  };

  const WithdrawStrategyRow = ({ id, name, icon, coin, apy, expanded, onToggle }) => {
      return (
          <div className={`border border-slate-700 bg-slate-900/50 rounded-xl overflow-hidden mb-4 transition-all ${expanded ? 'bg-slate-800/50 border-yellow-500/50 shadow-lg' : 'hover:border-slate-600'}`}>
              <div 
                onClick={onToggle}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 cursor-pointer gap-4 md:gap-0"
              >
                  <div className="flex items-center gap-3 w-full md:w-1/3">
                      <button className={`w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-colors hover:text-white ${expanded ? 'bg-yellow-500 text-black border-yellow-500' : ''}`}>
                          {expanded ? <ChevronUp size={16}/> : <Plus size={16}/>}
                      </button>
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shadow-lg">
                          {icon}
                      </div>
                      <div>
                          <div className="font-bold text-white text-sm">{name}</div>
                          <div className="text-[10px] text-slate-500">{coin} Strategy</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-3 w-full md:w-2/3 gap-4">
                       <div className="text-right md:text-center">
                           <div className="text-[10px] text-slate-400 uppercase font-bold">Deposited</div>
                           <div className="text-sm font-mono font-bold text-slate-200">
                               {coin === 'USDT' ? (vaultState.deposited * 0.6).toFixed(2) : (vaultState.deposited * 0.4).toFixed(2)}
                           </div>
                       </div>
                       <div className="text-right md:text-center">
                           <div className="text-[10px] text-slate-400 uppercase font-bold">Withdrawable</div>
                           <div className="text-sm font-mono font-bold text-white">
                               {maxWithdrawable.toFixed(2)}
                           </div>
                       </div>
                       <div className="text-right md:text-center">
                           <div className="text-[10px] text-slate-400 uppercase font-bold">APR</div>
                           <div className="text-sm font-mono font-bold text-green-400">{apy}%</div>
                       </div>
                  </div>
              </div>

              {expanded && (
                  <div className="p-4 bg-slate-950/50 border-t border-slate-700/50 animate-slide-down">
                      <div className="flex flex-col md:flex-row gap-4 items-end">
                          <div className="w-full">
                               <InputGroup 
                                  label={`Withdraw ${coin}`}
                                  balance={maxWithdrawable.toFixed(2)}
                                  value={amount}
                                  onChange={setAmount}
                                  onMax={() => setAmount(maxWithdrawable)}
                                  tokenLabel={coin}
                                  isDebt={false}
                               />
                          </div>
                          <button 
                            onClick={() => handleWithdrawAction(coin)}
                            className="w-full md:w-auto h-[88px] px-8 rounded-xl font-bold bg-slate-800 hover:bg-green-600 hover:text-white border border-slate-700 transition-all flex flex-col items-center justify-center gap-1"
                          >
                              <Download size={20}/>
                              <span>WITHDRAW</span>
                          </button>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-green-500"/> 
                          No lock-up period. Instant withdrawal to wallet.
                      </div>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 w-full max-w-5xl rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[600px] md:h-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"><X/></button>
        
        <div className="w-full md:w-3/12 bg-slate-800 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto">
           <div>
               <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                   <Landmark className="text-blue-400"/> SAVER Vault
               </h3>
               
               <div className="space-y-4">
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                       <div className="text-xs text-slate-400 uppercase font-bold mb-1">Your Collateral</div>
                       <div className="text-2xl font-mono font-bold text-white">${vaultState.deposited.toFixed(2)}</div>
                       <div className="text-[10px] text-green-400 flex items-center gap-1 mt-1">
                           <TrendingUp size={10}/> Yielding {VAULT_CONFIG.APY * 100}% APY
                       </div>
                   </div>

                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                       <div className="text-xs text-slate-400 uppercase font-bold mb-1">Future Yield Debt</div>
                       <div className="text-2xl font-mono font-bold text-red-400">-{vaultState.debt.toFixed(2)} {GAME_TOKEN}</div>
                       <div className="text-[10px] text-slate-500 mt-1">Self-repaying via yield</div>
                       <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500 h-full" 
                            style={{ width: `${Math.min(100, (vaultState.debt / (vaultState.deposited * VAULT_CONFIG.LTV)) * 100)}%` }}
                          ></div>
                       </div>
                       <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                          <span>Risk</span>
                          <span>Max LTV: 50%</span>
                       </div>
                   </div>

                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                       <div className="text-xs text-slate-400 uppercase font-bold mb-1">Claimable Yield</div>
                       <div className="flex justify-between items-center">
                           <div className="text-2xl font-mono font-bold text-yellow-400">+{vaultState.claimable.toFixed(4)}</div>
                           {vaultState.claimable > 1 && (
                               <button onClick={onClaim} className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded hover:bg-yellow-400 shadow">Claim</button>
                           )}
                       </div>
                   </div>
               </div>
           </div>
           
           <div className="mt-6 text-[10px] text-slate-500 text-center">
               *SAVER Mechanism: Deposit stablecoins to earn {GAME_TOKEN}. Borrow against your future yield to play instantly.
           </div>
        </div>

        <div className="w-full md:w-9/12 p-6 bg-slate-900 flex flex-col">
            <div className="flex bg-slate-950 rounded-xl p-1 mb-6 border border-slate-800 shrink-0">
                <button 
                    onClick={() => setActiveTab('DEPOSIT')}
                    className={`flex-1 py-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'DEPOSIT' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <PiggyBank size={16}/> Deposit
                </button>
                <button 
                    onClick={() => setActiveTab('BORROW')}
                    className={`flex-1 py-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'BORROW' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <FastForward size={16}/> Borrow
                </button>
                <button 
                    onClick={() => setActiveTab('WITHDRAW')}
                    className={`flex-1 py-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'WITHDRAW' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Download size={16}/> Withdraw
                </button>
                 <button 
                    onClick={() => setActiveTab('REPAY')}
                    className={`flex-1 py-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'REPAY' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <RotateCcw size={16}/> Repay
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'DEPOSIT' && (
                    <div className="animate-fade-in h-full flex flex-col">
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 mb-6">
                            <p className="text-xs text-slate-400">
                                Deposit <strong>USDT/USDC</strong>. Your deposit serves as collateral to mint {GAME_TOKEN}.
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex justify-end mb-2 gap-2">
                                {STABLE_COINS.map(coin => (
                                    <button 
                                        key={coin}
                                        onClick={() => setSelectedCoin(coin)}
                                        className={`px-3 py-1 rounded text-xs font-bold border ${selectedCoin === coin ? 'bg-white text-black border-white' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                                    >
                                        {coin}
                                    </button>
                                ))}
                            </div>
                            <InputGroup 
                                label="Deposit Amount" 
                                balance={walletBalances[selectedCoin]} 
                                value={amount} 
                                onChange={setAmount}
                                onMax={() => setAmount(walletBalances[selectedCoin])}
                                tokenLabel={selectedCoin}
                            />
                        </div>

                        <button onClick={handleAction} className="w-full py-4 rounded-xl font-bold text-lg bg-white text-black hover:bg-slate-200 transition-all shadow-lg mt-auto">
                            Confirm Deposit
                        </button>
                    </div>
                )}

                {activeTab === 'BORROW' && (
                    <div className="animate-fade-in h-full flex flex-col">
                         <div className="p-3 bg-blue-900/10 rounded-lg border border-blue-500/20 mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-blue-400 font-bold text-sm">Credit Line Available</span>
                                <span className="text-white font-mono font-bold">{maxBorrowable.toFixed(2)} {GAME_TOKEN}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{ width: `${(maxBorrowable / (vaultState.deposited * VAULT_CONFIG.LTV || 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <InputGroup 
                                label="Borrow Amount" 
                                balance={tokenBalance} 
                                value={amount} 
                                onChange={setAmount}
                                onMax={() => setAmount(maxBorrowable)}
                                tokenLabel={GAME_TOKEN}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-slate-500 mb-6 px-2">
                             <span>New LTV: {((Number(amount || 0) + vaultState.debt) / (vaultState.deposited || 1) * 100).toFixed(1)}%</span>
                             <span>Liquidation: None (Self-Repaying)</span>
                        </div>

                        <button 
                            disabled={Number(amount) > maxBorrowable}
                            onClick={handleAction} 
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all border mt-auto
                                ${Number(amount) > maxBorrowable ? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'}
                            `}
                        >
                            Borrow {GAME_TOKEN}
                        </button>
                    </div>
                )}

                {activeTab === 'REPAY' && (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col h-full">
                            <h4 className="text-red-400 font-bold flex items-center gap-2 mb-6">
                                <RotateCcw size={20}/> Repay Debt
                            </h4>
                            <div className="flex-1">
                                <InputGroup 
                                    label="Repay Amount"
                                    balance={tokenBalance}
                                    value={amount} 
                                    onChange={setAmount}
                                    onMax={() => setAmount(Math.min(tokenBalance, vaultState.debt))}
                                    tokenLabel={GAME_TOKEN}
                                    isDebt={true}
                                />
                                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Current Debt</span>
                                        <span className="text-red-400 font-mono font-bold">{vaultState.debt.toFixed(2)} {GAME_TOKEN}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Remaining after Repay</span>
                                        <span className="text-white font-mono font-bold">{Math.max(0, vaultState.debt - Number(amount)).toFixed(2)} {GAME_TOKEN}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleAction}
                                className="w-full py-4 mt-6 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white border border-transparent transition-all shadow-lg shadow-red-500/20"
                            >
                                Confirm Repayment
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'WITHDRAW' && (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="mb-6">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">External Swap Providers</div>
                            <div className="flex flex-wrap gap-2">
                                {['LlamaSwap', 'Paraswap', 'OpenOcean', 'Curve'].map((provider, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-lg px-4 py-2 cursor-pointer transition-all">
                                        <div className={`w-4 h-4 rounded-full ${['bg-orange-500','bg-blue-500','bg-purple-500','bg-red-500'][i]}`}></div>
                                        <span className="text-sm font-bold text-slate-300">{provider}</span>
                                        <ExternalLink size={12} className="text-slate-500"/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:flex">
                             <div className="w-1/3">Vault Strategy</div>
                             <div className="w-2/3 grid grid-cols-3 gap-4 text-center">
                                 <div>Deposited</div>
                                 <div>Withdrawable</div>
                                 <div>APR</div>
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            <WithdrawStrategyRow 
                                id="usdt-core"
                                name="Tether Core"
                                icon={<div className="text-green-500 font-bold text-xs">USDT</div>}
                                coin="USDT"
                                apy={20.5}
                                expanded={expandedWithdraw === 'USDT'}
                                onToggle={() => setExpandedWithdraw(expandedWithdraw === 'USDT' ? null : 'USDT')}
                            />
                            <WithdrawStrategyRow 
                                id="usdc-core"
                                name="Circle Core"
                                icon={<div className="text-blue-500 font-bold text-xs">USDC</div>}
                                coin="USDC"
                                apy={18.2}
                                expanded={expandedWithdraw === 'USDC'}
                                onToggle={() => setExpandedWithdraw(expandedWithdraw === 'USDC' ? null : 'USDC')}
                            />
                            <div className="border border-slate-800 bg-slate-950/30 rounded-xl p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600"><Lock size={14}/></div>
                                     <div>
                                         <div className="text-sm font-bold text-slate-500">DAI Strategy</div>
                                         <div className="text-[10px] text-slate-600">Coming Soon</div>
                                     </div>
                                </div>
                                <div className="text-xs text-slate-600">Locked</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// ... (CreatePoolModal, LandingPage, GameDashboard, RoomSelection, GameArena, CryptoTycoon remain unchanged) ...
const CreatePoolModal = ({ userBalance, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [entry, setEntry] = useState(100);
  const [players, setPlayers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    if (!name) return;
    if (userBalance < CREATE_POOL_FEE) {
        alert("Insufficient balance for Pool Creation Fee!");
        return;
    }
    onCreate({ name, entry: Number(entry), players: Number(players), isPrivate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X/></button>
        
        <div className="p-6 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="text-yellow-500" size={24}/> Create New Pool
          </h3>
          <p className="text-slate-400 text-sm">Creation Fee: <span className="text-yellow-400 font-bold">{CREATE_POOL_FEE} {GAME_TOKEN}</span></p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Pool Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Diamond Hands"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 transition"
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Entry Fee ({GAME_TOKEN})</label>
               <input 
                 type="number" 
                 value={entry}
                 onChange={(e) => setEntry(e.target.value)}
                 min={10}
                 className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 transition font-mono font-bold"
               />
            </div>
            <div>
               <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Players (2-10)</label>
               <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-2">
                  <button onClick={() => setPlayers(p => Math.max(2, p-1))} className="p-2 text-slate-400 hover:text-white">-</button>
                  <div className="flex-1 text-center font-bold text-white py-3">{players}</div>
                  <button onClick={() => setPlayers(p => Math.min(10, p+1))} className="p-2 text-slate-400 hover:text-white">+</button>
               </div>
            </div>
          </div>

          <div 
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
              ${isPrivate ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}
            `}
          >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${isPrivate ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                 {isPrivate ? <EyeOff size={20}/> : <Eye size={20}/>}
               </div>
               <div>
                 <div className={`font-bold ${isPrivate ? 'text-red-400' : 'text-white'}`}>
                    {isPrivate ? 'Private Pool' : 'Public Pool'}
                 </div>
                 <div className="text-xs text-slate-500">
                    {isPrivate ? 'Only visible with code.' : 'Visible in lobby.'}
                 </div>
               </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isPrivate ? 'border-red-500' : 'border-slate-500'}`}>
               {isPrivate && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!name || userBalance < CREATE_POOL_FEE}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg
               ${(!name || userBalance < CREATE_POOL_FEE) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 text-black hover:shadow-yellow-500/20'}
            `}
          >
            {userBalance < CREATE_POOL_FEE ? 'Insufficient Funds' : 'Create & Join'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onConnect, onShowTokenomics }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-20 pb-12 px-4 text-center animate-fade-in">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Zap size={16} fill="currentColor"/> Web3 Gaming Protocol
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
          SAVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">PROTOCOL</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Create Pools, set rules, and challenge the community. The most customizable GameFi PvP platform.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <button onClick={onConnect} className="group px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-3">
            <Wallet size={20}/> Connect Wallet
          </button>
           <button onClick={onShowTokenomics} className="group px-8 py-4 bg-slate-800 border border-slate-700 text-white font-bold text-lg rounded-xl hover:bg-slate-700 transition-all flex items-center gap-3">
            <Crown size={20} className="text-yellow-500"/> $SVR Token
          </button>
        </div>
      </div>
    </div>
  );
};

// ... (GameDashboard unchanged) ...
const GameDashboard = ({ onSelectGame }) => {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto w-full">
        <header className="mb-8 text-center md:text-left">
            <h2 className="text-4xl font-black text-white mb-2">GAME DASHBOARD</h2>
            <p className="text-slate-400">Choose a game to start earning.</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GAMES_LIST.map(game => (
                <div 
                  key={game.id} 
                  onClick={() => game.status === 'ACTIVE' && onSelectGame(game)} 
                  className={`group relative overflow-hidden rounded-2xl border border-slate-800 transition-all h-[320px] 
                    ${game.status === 'ACTIVE' ? 'cursor-pointer hover:border-yellow-500/50 hover:shadow-2xl hover:-translate-y-1' : 'opacity-60 grayscale cursor-not-allowed'}
                  `}
                >
                    <div className="absolute inset-0">
                        <img 
                          src={game.imageUrl} 
                          alt={game.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                        <div className="mb-auto pt-2">
                           {game.status === 'COMING_SOON' && (
                              <span className="inline-block px-2 py-1 rounded bg-black/60 text-[10px] font-bold text-slate-300 border border-slate-700">DEV MODE</span>
                           )}
                        </div>

                        <div className="mb-4">
                             <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner border border-white/20">
                                {game.icon}
                             </div>
                             <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-yellow-400 transition-colors">{game.name}</h3>
                             <p className="text-slate-400 text-xs line-clamp-2">{game.desc}</p>
                        </div>
                        
                        <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all
                           ${game.status === 'ACTIVE' 
                              ? 'bg-white text-black hover:bg-yellow-400' 
                              : 'bg-slate-800/50 text-slate-500 border border-slate-700'}
                        `}>
                            {game.status === 'ACTIVE' ? 'PLAY' : 'SOON'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

// ... (RoomSelection, GameArena, CryptoTycoon unchanged) ...
const RoomSelection = ({ game, rooms, userBalance, onEnterRoom, onBack, onShowVault, onOpenCreate }) => {
  return (
    <div className="animate-slide-up max-w-6xl mx-auto w-full">
        <button onClick={onBack} className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
            <ChevronLeft size={16}/> Back to Dashboard
        </button>

        <header className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    {game.icon}
                    <h2 className="text-3xl font-bold text-white">{game.name}</h2>
                </div>
                <p className="text-slate-400">Join an existing Pool or create your own.</p>
            </div>
            <div className="flex gap-3">
                {userBalance < 100 && (
                    <button onClick={onShowVault} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 px-4 py-2 rounded-lg font-bold text-sm animate-pulse flex items-center gap-2">
                        <PiggyBank size={16}/> + Deposit Chips
                    </button>
                )}
                <button 
                    onClick={onOpenCreate}
                    className="bg-white text-black border border-white hover:bg-slate-200 px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                    <Plus size={18} /> CREATE POOL ({CREATE_POOL_FEE} {GAME_TOKEN})
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map(room => {
                const canAfford = userBalance >= room.entry;
                return (
                    <div 
                        key={room.id} 
                        className={`group relative bg-slate-900 border ${room.border} p-6 rounded-3xl transition-all overflow-hidden
                            ${canAfford ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'}
                        `}
                        onClick={() => canAfford && onEnterRoom(room)}
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${room.color}`}>
                            {room.isPrivate ? <Lock size={100}/> : <Skull size={100} />}
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-800 ${room.color} border border-white/10`}>
                                    {room.difficulty}
                                </span>
                                {room.isPrivate && (
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-red-900 text-red-400 border border-red-500/30 flex items-center gap-1">
                                        <Lock size={10}/> PRIVATE
                                    </span>
                                )}
                            </div>

                            <h3 className={`text-2xl font-black uppercase italic ${room.color} mb-1 truncate`}>{room.name}</h3>
                            <div className="text-xs text-slate-500 mb-6">ID: #{room.id.split('-')[1] || 'USER'}</div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Entry</span>
                                    <span className="font-bold text-white">{room.entry} {GAME_TOKEN}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Players</span>
                                    <span className="font-bold text-white">{room.players} Slots</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total Pool</span>
                                    <span className="font-bold text-yellow-400">~{room.entry * room.players} {GAME_TOKEN}</span>
                                </div>
                            </div>

                            <button className={`w-full py-3 rounded-xl font-bold transition-colors
                                ${canAfford ? 'bg-slate-800 text-white group-hover:bg-white group-hover:text-black' : 'bg-slate-800 text-slate-500'}
                            `}>
                                {canAfford ? (room.isPrivate ? 'ENTER CODE' : 'JOIN NOW') : 'INSUFFICIENT FUNDS'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

const GameArena = ({ room, userBalance, onDeductBalance, onEndGame, onExit }) => {
  const [gameState, setGameState] = useState('WAITING');
  const [pool, setPool] = useState(0);
  const [players, setPlayers] = useState([]);
  const [bombHolder, setBombHolder] = useState(null);
  const [multiplier, setMultiplier] = useState(1);
  const [maxDuration, setMaxDuration] = useState(0);
  
  const playersRef = useRef([]);
  const poolRef = useRef(0);
  const gameTimeRef = useRef(0);
  const explodeTimeRef = useRef(0);
  const holdTimeRef = useRef(0);

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { poolRef.current = pool; }, [pool]);

  useEffect(() => {
    const botNames = ['Shark.eth', 'Degen_X', 'Satoshi_Fan', 'PepeLover', 'Whale0x', 'ElonMask', 'CZ_Binance', 'Vitalik_B', 'Justin_Sun', 'SBF_Jail'];
    const entryFee = room.entry;
    const initialBalance = Math.floor(entryFee * 0.1);

    const _players = Array.from({length: room.players}).map((_, i) => ({
      id: i === 0 ? 'me' : `bot-${i}`,
      name: i === 0 ? 'YOU' : botNames[i % botNames.length],
      avatar: i === 0 ? '😎' : ['🤖','👽','💀','👻','🤡', '😈', '👺', '💩', '👾'][i % 9],
      balance: initialBalance,
      status: 'alive',
      isReady: false
    }));
    
    setPlayers(_players);
    setGameState('WAITING'); 
    setPool(0);
    setMaxDuration(0);
  }, [room]);

  useEffect(() => {
    if (gameState !== 'WAITING') return;
    const interval = setInterval(() => {
        setPlayers(prev => {
            const updated = prev.map(p => {
                if (p.id !== 'me' && !p.isReady && Math.random() > 0.7) return { ...p, isReady: true };
                return p;
            });
            if (updated.every(p => p.isReady)) {
                clearInterval(interval);
                setTimeout(startGame, 1000); 
            }
            return updated;
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleUserReady = () => {
      const totalPool = room.entry * room.players;
      const serviceFee = Math.floor(totalPool * SERVICE_FEE_PERCENT);
      const totalRequired = room.entry + serviceFee;
      if (userBalance < totalRequired) {
          alert(`Insufficient funds! Need ${totalRequired} ${GAME_TOKEN}`);
          return;
      }
      setPlayers(prev => prev.map(p => p.id === 'me' ? { ...p, isReady: true } : p));
  };

  const startGame = () => {
    const entryFee = room.entry;
    const totalPoolValue = entryFee * room.players;
    const serviceFee = Math.floor(totalPoolValue * SERVICE_FEE_PERCENT);
    onDeductBalance(entryFee + serviceFee);
    const initialBalance = Math.floor(entryFee * 0.1);
    setPool((entryFee * room.players) - (initialBalance * room.players));
    setGameState('PLAYING');
    gameTimeRef.current = 0;
    holdTimeRef.current = 0;
    setMultiplier(1);
    const visibleDeadline = 30000; 
    setMaxDuration(visibleDeadline); 
    const actualExplosionTime = Math.random() * visibleDeadline; 
    explodeTimeRef.current = actualExplosionTime;
    const randomIdx = Math.floor(Math.random() * playersRef.current.length);
    setBombHolder(playersRef.current[randomIdx].id);
  };

  const handleReplay = () => {
     setPlayers(prev => prev.map(p => ({
         ...p,
         status: 'alive',
         isReady: false,
         balance: Math.floor(room.entry * 0.1) 
     })));
     setGameState('WAITING');
     setPool(0);
     setBombHolder(null);
     setMultiplier(1);
     setMaxDuration(0);
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      gameTimeRef.current += 1000;
      holdTimeRef.current += 1000; 
      const calculatedMultiplier = 1 + (holdTimeRef.current / 1000) * 0.1;
      setMultiplier(calculatedMultiplier);
      if (gameTimeRef.current >= explodeTimeRef.current) {
        finishGame('EXPLODED', bombHolder);
        return;
      }
      if (poolRef.current <= 0) {
        finishGame('DRAINED', bombHolder);
        return;
      }
      const drainRate = Math.floor(room.entry * 0.02 * calculatedMultiplier);
      const actualDrain = Math.min(drainRate, poolRef.current);
      if (actualDrain > 0) {
        setPlayers(prevPlayers => prevPlayers.map(p => {
            if (p.id === bombHolder) return { ...p, balance: p.balance + actualDrain };
            return p;
        }));
        setPool(prev => prev - actualDrain);
      }
      if (bombHolder && bombHolder.startsWith('bot')) {
         if (Math.random() > 0.6 + (calculatedMultiplier - 1)) passBomb(bombHolder);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, bombHolder, room]);

  const passBomb = (senderId) => {
      const currentPlayers = playersRef.current;
      const sender = currentPlayers.find(p => p.id === senderId);
      if (!sender || sender.balance <= 0) return;
      const passFee = Math.floor(sender.balance * 0.05);
      setPlayers(prev => prev.map(p => p.id === senderId ? { ...p, balance: p.balance - passFee } : p));
      setPool(prev => prev + passFee);
      const alive = currentPlayers.filter(p => p.status === 'alive' && p.id !== senderId);
      if (alive.length === 0) return;
      const receiver = alive[Math.floor(Math.random() * alive.length)];
      setBombHolder(receiver.id);
      setMultiplier(1); 
      holdTimeRef.current = 0; 
  };

  const finishGame = (reason, currentHolder) => {
      setGameState('ENDED');
      setPlayers(prev => {
          const survivors = prev.filter(p => p.id !== currentHolder && p.status === 'alive');
          const currentPool = poolRef.current;
          if (reason === 'EXPLODED') {
              const share = survivors.length > 0 ? Math.floor(currentPool / survivors.length) : 0;
              return prev.map(p => {
                  if (p.id === currentHolder) return { ...p, status: 'dead', balance: 0 };
                  else if (p.status === 'alive') return { ...p, balance: p.balance + share };
                  return p;
              });
          }
          return prev;
      });
      setTimeout(() => {
         const finalPlayers = playersRef.current;
         const me = finalPlayers.find(p => p.id === 'me');
         let winning = 0;
         if (reason === 'EXPLODED' && currentHolder !== 'me') {
             const survivorsCount = finalPlayers.filter(p => p.id !== currentHolder && p.status === 'alive').length;
             const share = Math.floor(poolRef.current / survivorsCount);
             winning = me.balance + share;
         } else if (reason === 'DRAINED') {
             winning = me.balance;
         }
         if (winning > 0) onEndGame(winning);
      }, 1000);
  };

  const getPos = (idx, total) => {
      const angle = 90 + (idx * (360 / total));
      const rad = angle * (Math.PI / 180);
      return { x: Math.cos(rad) * 160, y: Math.sin(rad) * 160 };
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[600px] animate-zoom-in w-full">
        <div className="flex justify-between w-full max-w-2xl mb-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-700 backdrop-blur">
            <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                <LogOut size={16}/> Leave Table
            </button>
            <div className="flex items-center gap-4">
                 <div className="text-slate-400 text-sm">Room: <span className={room.color}>{room.name}</span></div>
                 <div className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-yellow-500 flex items-center gap-2">
                    {gameState === 'WAITING' ? 'WAITING LOBBY' : <><Timer size={12}/> {(gameTimeRef.current / 1000).toFixed(1)}s</>}
                 </div>
            </div>
        </div>

        <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] rounded-full border-2 border-slate-700 bg-slate-900/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
            {gameState === 'PLAYING' && maxDuration > 0 && (
                <div className="absolute top-[-40px] w-56 md:w-72 flex flex-col items-center gap-1 z-20">
                    <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-lg relative">
                        <div 
                            className="h-full bg-red-600 transition-all duration-1000 ease-linear"
                            style={{ width: `${Math.max(0, ((maxDuration - gameTimeRef.current) / maxDuration) * 100)}%` }}
                        />
                        <div className="absolute inset-0 flex justify-between px-4 opacity-30">
                             <div className="w-0.5 h-full bg-black"></div>
                             <div className="w-0.5 h-full bg-black"></div>
                             <div className="w-0.5 h-full bg-black"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute z-10 w-32 h-32 md:w-40 md:h-40 bg-slate-950 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                {gameState === 'WAITING' ? (
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                        <div className="text-xl font-bold text-white animate-pulse">
                            {players.filter(p => p.isReady).length} / {players.length}
                        </div>
                        <div className="text-[10px] text-yellow-500">Ready</div>
                    </div>
                ) : gameState === 'ENDED' ? (
                    <div className="text-center animate-bounce">
                         <div className="text-slate-500 text-xs uppercase font-bold">Ended</div>
                         {players.find(p => p.id === 'me')?.balance > 0 
                            ? <span className="text-green-400 font-bold text-xl">BIG WIN</span> 
                            : <span className="text-red-500 font-bold text-xl">LOST ALL</span>}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1 font-bold tracking-widest">POOL</div>
                        <div className="text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-1">
                            <span className="text-yellow-500">$</span>{Math.floor(pool)}
                        </div>
                        {bombHolder && (
                            <div className="text-sm text-orange-400 mt-2 font-bold flex items-center justify-center gap-1 bg-orange-900/20 rounded-full px-2 py-0.5 border border-orange-500/30">
                                <TrendingUp size={14}/> Rate: x{multiplier.toFixed(1)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {players.map((p, i) => {
                const { x, y } = getPos(i, players.length);
                const isHolder = p.id === bombHolder;
                const isDead = p.status === 'dead';
                const me = p.id === 'me';
                return (
                    <div key={p.id} className="absolute w-24 h-24 flex flex-col items-center justify-center transition-all duration-500" style={{ transform: `translate(${x}px, ${y}px)` }}>
                        <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 
                            ${isDead ? 'bg-slate-800 grayscale opacity-50 scale-90' : isHolder ? 'bg-gradient-to-b from-red-600 to-red-900 scale-125 shadow-[0_0_30px_rgba(220,38,38,0.6)] z-20 border-2 border-white' : 'bg-slate-800 border border-slate-600'}
                        `}>
                            <span className="text-2xl md:text-3xl">{p.avatar}</span>
                            {isHolder && gameState === 'PLAYING' && <div className="absolute -top-6 animate-bounce z-30"><Bomb className="w-8 h-8 md:w-10 md:h-10 text-red-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] fill-red-600" /></div>}
                            {gameState === 'WAITING' && (
                                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 ${p.isReady ? 'bg-green-500' : 'bg-slate-600'}`}>
                                    {p.isReady ? <Check size={14} className="text-white"/> : <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>}
                                </div>
                            )}
                        </div>
                        <div className={`mt-2 px-2 py-1 rounded bg-black/60 backdrop-blur text-center border ${isHolder ? 'border-red-500' : 'border-slate-700'}`}>
                            <div className={`text-[10px] font-bold truncate max-w-[80px] ${me ? 'text-yellow-400' : 'text-slate-300'}`}>{p.name}</div>
                            {gameState === 'PLAYING' && <div className={`text-xs font-bold font-mono ${p.balance === 0 ? 'text-red-500' : 'text-green-400'}`}>${Math.floor(p.balance)}</div>}
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="mt-8 w-full max-w-md animate-slide-up z-30 h-24 flex items-center justify-center">
            {gameState === 'WAITING' && (
                !players.find(p => p.id === 'me')?.isReady ? (
                    <div className="flex flex-col items-center w-full">
                        <button onClick={handleUserReady} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl shadow-lg text-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                            <CheckCircle2 size={24}/> READY
                        </button>
                        <div className="text-[10px] text-slate-400 mt-2 text-center">
                            * {room.entry} {GAME_TOKEN} (Entry) + {Math.floor(room.entry * room.players * SERVICE_FEE_PERCENT)} {GAME_TOKEN} (Fee) will be deducted on start.
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-400 animate-pulse">
                        Waiting for other players...
                    </div>
                )
            )}

            {gameState === 'PLAYING' && bombHolder === 'me' && (
                 <button onClick={() => passBomb('me')} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white p-1 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-transform active:scale-95">
                    <div className="bg-slate-900/30 rounded-xl py-4 px-6 flex items-center justify-between backdrop-blur-sm">
                        <div className="flex flex-col items-start">
                            <span className="font-black text-xl uppercase italic">PASS NOW!</span>
                            <span className="text-xs opacity-80">Fee: 5% Balance</span>
                        </div>
                        <ArrowRightLeft size={32} className="animate-pulse"/>
                    </div>
                 </button>
            )}

            {gameState === 'ENDED' && (
                <div className="flex gap-4 w-full">
                    <button onClick={onExit} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl">
                        Leave Room
                    </button>
                    <button onClick={handleReplay} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <RotateCcw size={18}/> Play Again
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

const CryptoTycoon = ({ room, userBalance, onDeductBalance, onEndGame, onExit }) => {
  const [turn, setTurn] = useState(0); 
  const [dice, setDice] = useState([1, 1]);
  const [players, setPlayers] = useState([]);
  const [slots, setSlots] = useState(BOARD_SLOTS);
  const [rolling, setRolling] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const botNames = ['Shark', 'Whale', 'Degen'];
    const p = [
      { id: 0, name: 'YOU', color: 'bg-blue-500', pos: 0, cash: TYCOON_CONFIG.START_BALANCE, properties: [], jail: 0 },
      ...botNames.map((n, i) => ({ 
        id: i + 1, name: n, color: ['bg-red-500', 'bg-yellow-500', 'bg-purple-500'][i], 
        pos: 0, cash: TYCOON_CONFIG.START_BALANCE, properties: [], jail: 0 
      }))
    ];
    setPlayers(p);
    onDeductBalance(room.entry); 
    addLog("Welcome to Crypto Tycoon! Buy coins and collect fees.");
  }, []);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 4));

  useEffect(() => {
    if (turn !== 0) {
      const timer = setTimeout(handleRoll, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn]);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);

    setTimeout(() => {
      setRolling(false);
      movePlayer(turn, d1 + d2);
    }, 800);
  };

  const movePlayer = (playerId, steps) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const p = newPlayers[playerId];

      if (p.jail > 0) {
         addLog(`${p.name} is in jail (${p.jail} turns left).`);
         p.jail -= 1;
         setTurn((turn + 1) % 4);
         return newPlayers;
      }

      let newPos = p.pos + steps;
      if (newPos >= BOARD_SLOTS.length) {
        newPos -= BOARD_SLOTS.length;
        p.cash += TYCOON_CONFIG.PASS_GO_REWARD;
        addLog(`${p.name} passed START. Received +$${TYCOON_CONFIG.PASS_GO_REWARD}.`);
      }
      p.pos = newPos;
      
      handleSlotLogic(p, newPos, newPlayers);
      
      return newPlayers;
    });
  };

  const handleSlotLogic = (p, pos, allPlayers) => {
     const slot = slots[pos];
     
     if (slot.type === 'PROPERTY') {
        if (slot.owner === null) {
           if (p.cash >= slot.price) {
               if (p.id !== 0 || window.confirm(`Buy ${slot.name} for $${slot.price}?`)) {
                  p.cash -= slot.price;
                  slot.owner = p.id;
                  p.properties.push(slot.id);
                  addLog(`${p.name} bought ${slot.name}.`);
               }
           }
        } else if (slot.owner !== p.id) {
           const owner = allPlayers.find(pl => pl.id === slot.owner);
           if (owner) {
              p.cash -= slot.rent;
              owner.cash += slot.rent;
              addLog(`${p.name} paid $${slot.rent} gas fee to ${owner.name}.`);
           }
        }
     } else if (slot.type === 'TAX') {
        p.cash -= slot.amount;
        addLog(`${p.name} was taxed $${slot.amount}.`);
     } else if (slot.type === 'CHANCE') {
        const lucky = Math.random() > 0.5;
        const amt = 100;
        if (lucky) {
           p.cash += amt;
           addLog(`${p.name} won Airdrop +$${amt}!`);
        } else {
           p.cash -= amt;
           addLog(`${p.name} got Rug Pulled -$${amt}!`);
        }
     } else if (slot.type === 'GO_TO_JAIL') {
        p.pos = 6; // Jail pos
        p.jail = 2;
        p.cash -= TYCOON_CONFIG.JAIL_FINE;
        addLog(`${p.name} was sent to jail! Fine -$${TYCOON_CONFIG.JAIL_FINE}.`);
     }

     if (p.cash < 0) {
        addLog(`${p.name} went bankrupt!`);
        if (p.id === 0) {
           alert("YOU WENT BANKRUPT! GAME OVER");
           onExit();
        }
     }

     setTimeout(() => setTurn((turn + 1) % 4), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full animate-zoom-in text-white">
      <div className="flex justify-between w-full max-w-3xl mb-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
         <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-white"><LogOut size={16}/> Exit</button>
         <div className="font-bold text-xl text-yellow-400">CRYPTO TYCOON</div>
         <div className="text-slate-400 text-sm">Turn: {players[turn]?.name}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 bg-slate-800 rounded-3xl shadow-2xl border-4 border-slate-700 relative w-full max-w-2xl aspect-square">
         
         <div className="absolute inset-[25%] bg-slate-900 rounded-xl flex flex-col items-center justify-center p-4 border border-slate-600 z-10">
             <div className="flex gap-4 mb-4">
                 <div className={`w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg ${rolling ? 'animate-spin' : ''}`}>{dice[0]}</div>
                 <div className={`w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg ${rolling ? 'animate-spin' : ''}`}>{dice[1]}</div>
             </div>
             {turn === 0 && !rolling && <button onClick={handleRoll} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-full animate-bounce">ROLL DICE</button>}
             
             <div className="mt-4 w-full h-24 overflow-y-auto text-[10px] text-slate-400 bg-black/50 p-2 rounded border border-slate-700">
                {logs.map((l, i) => <div key={i} className="mb-1">{l}</div>)}
             </div>
         </div>

         {slots.map((slot, index) => {
             let gridClass = "";
             if (slot.id === 0) gridClass = "col-start-1 row-start-1";
             if (slot.id === 1) gridClass = "col-start-2 row-start-1";
             if (slot.id === 2) gridClass = "col-start-3 row-start-1";
             if (slot.id === 3) gridClass = "col-start-4 row-start-1";
             if (slot.id === 4) gridClass = "col-start-4 row-start-2";
             if (slot.id === 5) gridClass = "col-start-4 row-start-3";
             if (slot.id === 6) gridClass = "col-start-4 row-start-4";
             if (slot.id === 7) gridClass = "col-start-3 row-start-4";
             if (slot.id === 8) gridClass = "col-start-2 row-start-4";
             if (slot.id === 9) gridClass = "col-start-1 row-start-4";
             if (slot.id === 10) gridClass = "col-start-1 row-start-3";
             if (slot.id === 11) gridClass = "col-start-1 row-start-2";

             const owner = players.find(p => p.id === slot.owner);

             return (
                 <div key={slot.id} className={`${gridClass} ${slot.color} relative rounded-lg p-1 flex flex-col items-center justify-between shadow-inner min-h-[80px] border-2 ${owner ? 'border-white' : 'border-transparent'}`}>
                     <div className="text-[10px] font-bold text-white/80 uppercase text-center w-full bg-black/20 rounded mb-1">{slot.name}</div>
                     
                     <div className="flex-1 flex items-center justify-center w-full">
                         {slot.logo ? (
                             <img src={slot.logo} alt={slot.name} className="w-8 h-8 object-contain drop-shadow-md bg-white/10 rounded-full" />
                         ) : (
                             <div className="text-white drop-shadow-md">{slot.icon || <span className="text-xs font-bold">${slot.price}</span>}</div>
                         )}
                     </div>

                     {slot.type === 'PROPERTY' && (
                        <div className="text-[9px] font-bold bg-black/40 px-1 rounded mt-1">${slot.price}</div>
                     )}
                     
                     <div className="flex gap-1 absolute bottom-1 right-1">
                        {players.map(p => p.pos === slot.id && (
                            <div key={p.id} className={`w-3 h-3 rounded-full border border-white shadow ${p.color}`} title={p.name}></div>
                        ))}
                     </div>
                     
                     {owner && <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${owner.color} border-2 border-white flex items-center justify-center text-[8px] font-bold`}>✔</div>}
                 </div>
             )
         })}
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-3xl mt-4">
         {players.map(p => (
            <div key={p.id} className={`bg-slate-800 p-3 rounded-xl border ${turn === p.id ? 'border-yellow-400 shadow-lg scale-105' : 'border-slate-700'} transition-all`}>
               <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${p.color}`}></div>
                  <div className="font-bold text-sm truncate">{p.name}</div>
               </div>
               <div className="text-green-400 font-mono font-bold">${p.cash}</div>
               <div className="text-[10px] text-slate-500">{p.properties.length} Coin</div>
            </div>
         ))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN APP COMPONENT
// -----------------------------------------------------------------------------
export default function RiskProtocolApp() {
  const [view, setView] = useState('LANDING'); 
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [mockUsdBalance, setMockUsdBalance] = useState(MOCK_WALLET_BALANCE);
  const [showVault, setShowVault] = useState(false); 
  const [showCreate, setShowCreate] = useState(false);
  const [showTokenomics, setShowTokenomics] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);

  // --- STATE FOR SAVER VAULT ---
  const [vaultState, setVaultState] = useState({
      deposited: 0,
      debt: 0,
      claimable: 0
  });

  // --- SIMULATION LOOP: ALCHEMIC YIELD ---
  useEffect(() => {
      if (vaultState.deposited <= 0) return;

      const interval = setInterval(() => {
          setVaultState(prev => {
              const cycleRate = VAULT_CONFIG.APY / 100; 
              const yieldGenerated = prev.deposited * cycleRate;

              let newDebt = prev.debt;
              let newClaimable = prev.claimable;

              if (newDebt > 0) {
                  // Pay debt first
                  if (yieldGenerated >= newDebt) {
                      newClaimable += (yieldGenerated - newDebt);
                      newDebt = 0;
                  } else {
                      newDebt -= yieldGenerated;
                  }
              } else {
                  // Add to claimable if no debt
                  newClaimable += yieldGenerated;
              }

              return {
                  ...prev,
                  debt: newDebt,
                  claimable: newClaimable
              };
          });
      }, VAULT_CONFIG.YIELD_INTERVAL);

      return () => clearInterval(interval);
  }, [vaultState.deposited]); 

  const connectWallet = () => {
    setWalletAddress("0x71C...9A23");
    setView('DASHBOARD');
  };

  const handleDeposit = (coin, amount) => {
      setMockUsdBalance(prev => ({ ...prev, [coin]: prev[coin] - amount }));
      setVaultState(prev => ({ ...prev, deposited: prev.deposited + amount }));
  };

  const handleBorrow = (amount) => {
      setTokenBalance(prev => prev + amount);
      setVaultState(prev => ({ ...prev, debt: prev.debt + amount }));
      setShowVault(false);
  };

  const handleRepay = (amount) => {
      if (amount > tokenBalance) return alert("Insufficient Token Balance");
      setTokenBalance(prev => prev - amount);
      setVaultState(prev => ({ ...prev, debt: Math.max(0, prev.debt - amount) }));
  };

  const handleWithdraw = (amount) => {
      // Very basic withdrawal logic: returns to USDT for demo
      setMockUsdBalance(prev => ({ ...prev, USDT: prev.USDT + amount }));
      setVaultState(prev => ({ ...prev, deposited: Math.max(0, prev.deposited - amount) }));
  };

  const handleClaim = () => {
      if (vaultState.claimable <= 0) return;
      setTokenBalance(prev => prev + Math.floor(vaultState.claimable));
      setVaultState(prev => ({ ...prev, claimable: 0 }));
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setView('ROOMS');
  };

  const handleCreateRoom = (newRoomData) => {
    setTokenBalance(prev => prev - CREATE_POOL_FEE);
    const difficulty = newRoomData.entry < 500 ? 'EASY' : newRoomData.entry < 2000 ? 'MEDIUM' : 'HARD';
    const color = newRoomData.entry < 500 ? 'text-blue-400' : newRoomData.entry < 2000 ? 'text-orange-400' : 'text-purple-500';
    const border = newRoomData.entry < 500 ? 'border-blue-500/50' : newRoomData.entry < 2000 ? 'border-orange-500/50' : 'border-purple-500/50';

    const newRoom = {
        id: `pool-${Date.now()}`,
        name: newRoomData.name,
        entry: newRoomData.entry,
        players: newRoomData.players,
        isPrivate: newRoomData.isPrivate,
        color, border, difficulty
    };

    setRooms(prev => [newRoom, ...prev]);
    setSelectedRoom(newRoom);
    setView('GAME');
  };

  const handleEnterRoom = (room) => {
    if (tokenBalance < room.entry) {
        setShowVault(true); 
        return;
    }
    setSelectedRoom(room);
    setView('GAME');
  };

  const handleDeductBalance = (amount) => {
      setTokenBalance(prev => prev - amount);
  };

  const handleGameEnd = (winnings) => {
      if (winnings > 0) setTokenBalance(prev => prev + winnings);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => walletAddress && setView('DASHBOARD')}>
             <div className="bg-yellow-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                 <Hexagon className="text-black w-6 h-6 fill-black" />
             </div>
             <span className="font-black text-xl tracking-tight hidden md:block">SAVER <span className="text-yellow-500">PROTOCOL</span></span>
         </div>
         {walletAddress ? (
             <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-full px-1 py-1">
                     <div onClick={() => setShowVault(true)} className="flex items-center gap-2 px-3 py-1 hover:bg-slate-800 rounded-full cursor-pointer transition">
                         <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold">$</div>
                         <span className={`font-bold text-sm ${tokenBalance === 0 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>{tokenBalance} {GAME_TOKEN}</span>
                         <div className="bg-blue-600/20 text-blue-400 text-[10px] px-1.5 rounded uppercase font-bold">Vault</div>
                     </div>
                 </div>
                 <div className="flex items-center gap-2 bg-slate-800 pl-4 pr-2 py-2 rounded-xl border border-slate-700 shadow-lg">
                     <span className="text-xs font-mono text-slate-400">{walletAddress}</span>
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 </div>
             </div>
         ) : (
             view !== 'LANDING' && <button onClick={connectWallet} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition">Connect Wallet</button>
         )}
      </nav>
      <main className="pt-24 pb-12 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
          {view === 'LANDING' && <LandingPage onConnect={connectWallet} onShowTokenomics={() => setShowTokenomics(true)} />}
          {view === 'DASHBOARD' && <GameDashboard onSelectGame={handleSelectGame} />}
          {view === 'ROOMS' && selectedGame && (
            <RoomSelection 
                game={selectedGame}
                rooms={rooms}
                userBalance={tokenBalance}
                onEnterRoom={handleEnterRoom}
                onBack={() => setView('DASHBOARD')}
                onShowVault={() => setShowVault(true)}
                onOpenCreate={() => setShowCreate(true)}
            />
          )}
          {view === 'GAME' && selectedRoom && (
            selectedGame.id === 'crypto-tycoon' ? (
               <CryptoTycoon
                  room={selectedRoom} 
                  userBalance={tokenBalance}
                  onDeductBalance={handleDeductBalance}
                  onEndGame={handleGameEnd} 
                  onExit={() => setView('ROOMS')} 
               />
            ) : (
               <GameArena 
                  room={selectedRoom} 
                  userBalance={tokenBalance}
                  onDeductBalance={handleDeductBalance}
                  onEndGame={handleGameEnd} 
                  onExit={() => setView('ROOMS')} 
               />
            )
          )}
      </main>
      {showVault && (
          <SaverVaultModal 
            walletBalances={mockUsdBalance} 
            tokenBalance={tokenBalance}
            vaultState={vaultState}
            onDeposit={handleDeposit}
            onBorrow={handleBorrow}
            onRepay={handleRepay}
            onWithdraw={handleWithdraw}
            onClaim={handleClaim}
            onClose={() => setShowVault(false)} 
          />
      )}
      {showTokenomics && <TokenomicsModal onClose={() => setShowTokenomics(false)} />}
      {showCreate && <CreatePoolModal userBalance={tokenBalance} onClose={() => setShowCreate(false)} onCreate={handleCreateRoom} />}
    </div>
  );
}