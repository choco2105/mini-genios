'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ShapesGame from './games/ShapesGame';
import NumbersGame from './games/NumbersGame';
import LettersGame from './games/LettersGame';

const GameMenu = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [level, setLevel] = useState(1);

  const handleGameComplete = () => {
    setSelectedGame(null);
    setLevel(1);
  };

  const games = [
    {
      id: 'shapes',
      title: '¡Formas con Fox!',
      icon: '🦊',
      description: '¡Aprende las formas jugando!',
      color: 'bg-gradient-to-br from-rose-400 to-red-500',
      component: ShapesGame
    },
    {
      id: 'numbers',
      title: '¡Números con Panda!',
      icon: '🐼',
      description: '¡Descubre los números!',
      color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      component: NumbersGame
    },
    {
      id: 'letters',
      title: '¡Letras con Leo!',
      icon: '🦁',
      description: '¡Explora el alfabeto!',
      color: 'bg-gradient-to-br from-green-400 to-emerald-500',
      component: LettersGame
    }
  ];

  if (selectedGame) {
    const GameComponent = games.find(g => g.id === selectedGame)?.component;
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto bg-white/90 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedGame(null);
                setLevel(1);
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl 
                       hover:bg-purple-600 font-bold text-lg flex items-center gap-2"
            >
              🏠 Volver al Menú
            </motion.button>
            <h2 className="text-3xl font-bold text-purple-800">
              Nivel {level}
            </h2>
          </div>
          <GameComponent 
            level={level} 
            onLevelComplete={() => setLevel(prev => prev + 1)}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-sky-400 via-purple-400 to-pink-400">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
          Mini Genios
        </h1>
        <p className="text-2xl md:text-3xl text-white font-bold">
          ¡Aprende jugando! ⭐
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <motion.button
              onClick={() => setSelectedGame(game.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full h-80 ${game.color} rounded-2xl p-6 
                       shadow-xl border-4 border-white/50 relative overflow-hidden`}
            >
              <div className="h-full flex flex-col items-center justify-between">
                <span className="text-7xl">{game.icon}</span>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {game.title}
                  </h2>
                  <p className="text-xl text-white/90">
                    {game.description}
                  </p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;