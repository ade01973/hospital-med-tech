
import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Heart, Clock, Eye, TrendingUp, Shield, Target, BookOpen } from 'lucide-react';

const CONSUMABLES = [
  {
    id: 'extra_life',
    name: 'Vida Extra',
    description: 'Agrega 1 corazón adicional',
    price: 100,
    icon: '❤️',
    iconComponent: Heart
  },
  {
    id: 'extra_time',
    name: '+15 Segundos',
    description: 'Añade 15 segundos al tiempo',
    price: 80,
    icon: '⏱️',
    iconComponent: Clock
  },
  {
    id: 'eliminate_options',
    name: 'Eliminar 2 Opciones',
    description: 'Elimina 2 opciones incorrectas',
    price: 120,
    icon: '🎯',
    iconComponent: Target
  },
  {
    id: 'visual_hint',
    name: 'Pista Visual',
    description: 'Resalta la respuesta correcta',
    price: 60,
    icon: '👁️',
    iconComponent: Eye
  },
  {
    id: 'double_points',
    name: '2x Puntos',
    description: 'Duplica puntos de la pregunta',
    price: 150,
    icon: '⚡',
    iconComponent: Zap
  }
];

const UPGRADES = [
  {
    id: 'precision_1',
    name: 'Precisión I',
    description: '+5% de precisión en respuestas',
    price: 500,
    icon: '🎯',
    iconComponent: Target,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'resistance_1',
    name: 'Resistencia I',
    description: 'Empezar con 6 vidas en lugar de 5',
    price: 800,
    icon: '🛡️',
    iconComponent: Shield,
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'speed_1',
    name: 'Velocidad I',
    description: '+10 segundos por pregunta',
    price: 600,
    icon: '⚡',
    iconComponent: Zap,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'wisdom_1',
    name: 'Sabiduría I',
    description: '+20% de puntos por respuesta',
    price: 1000,
    icon: '📚',
    iconComponent: BookOpen,
    color: 'from-purple-500 to-pink-500'
  }
];

const ShopModal = ({ isOpen, onClose, balance, onBuyConsumable, onBuyUpgrade, inventory, upgrades }) => {
  const [activeTab, setActiveTab] = useState('consumables');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-cyan-500/50 w-full max-w-4xl rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 border-b border-cyan-500/20 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
              🛍️
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Tienda MediCoins</h2>
              <p className="text-cyan-300 font-mono text-sm">Balance: 💸 {balance} MediCoins</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('consumables')}
            className={`flex-1 py-4 font-black text-sm uppercase tracking-wider transition-all ${
              activeTab === 'consumables'
                ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Consumibles
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`flex-1 py-4 font-black text-sm uppercase tracking-wider transition-all ${
              activeTab === 'upgrades'
                ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Upgrades
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'consumables' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONSUMABLES.map((item) => {
                const count = inventory[item.id] || 0;
                const canBuy = balance >= item.price;
                const IconComponent = item.iconComponent;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      {count > 0 && (
                        <div className="bg-cyan-500 text-slate-900 font-black text-xs px-2 py-1 rounded-full">
                          x{count}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-black mb-1">{item.name}</h3>
                    <p className="text-slate-400 text-xs mb-4">{item.description}</p>
                    <button
                      onClick={() => onBuyConsumable(item.id, item.name, item.price)}
                      disabled={!canBuy}
                      className={`w-full py-2 rounded-lg font-black text-sm transition-all ${
                        canBuy
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      💸 {item.price} Comprar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UPGRADES.map((upgrade) => {
                const owned = upgrades[upgrade.id];
                const canBuy = balance >= upgrade.price && !owned;

                return (
                  <div
                    key={upgrade.id}
                    className={`bg-slate-800/50 border rounded-xl p-6 transition-all ${
                      owned
                        ? 'border-emerald-500/50 bg-emerald-900/20'
                        : 'border-slate-700 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${upgrade.color} rounded-xl flex items-center justify-center text-3xl`}>
                        {upgrade.icon}
                      </div>
                      {owned && (
                        <div className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full">
                          ✓ ACTIVO
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-black text-lg mb-2">{upgrade.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{upgrade.description}</p>
                    <button
                      onClick={() => onBuyUpgrade(upgrade.id, upgrade.name, upgrade.price)}
                      disabled={!canBuy}
                      className={`w-full py-3 rounded-lg font-black transition-all ${
                        owned
                          ? 'bg-emerald-900/50 text-emerald-300 cursor-default'
                          : canBuy
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {owned ? '✓ Adquirido' : `💸 ${upgrade.price} Comprar`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
