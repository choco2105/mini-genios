'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import useSound from 'use-sound';

const allLetters = [
  // Vocales
  { id: 'A', value: 'A', name: 'VOCAL A', type: 'vocal' },
  { id: 'E', value: 'E', name: 'VOCAL E', type: 'vocal' },
  { id: 'I', value: 'I', name: 'VOCAL I', type: 'vocal' },
  { id: 'O', value: 'O', name: 'VOCAL O', type: 'vocal' },
  { id: 'U', value: 'U', name: 'VOCAL U', type: 'vocal' },
  // Consonantes comunes
  { id: 'M', value: 'M', name: 'CONSONANTE M', type: 'consonante' },
  { id: 'P', value: 'P', name: 'CONSONANTE P', type: 'consonante' },
  { id: 'S', value: 'S', name: 'CONSONANTE S', type: 'consonante' },
  { id: 'L', value: 'L', name: 'CONSONANTE L', type: 'consonante' },
  { id: 'T', value: 'T', name: 'CONSONANTE T', type: 'consonante' }
];

const DraggableLetter = ({ id, letter, isMatched }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: letter.id });

  if (isMatched) return null;

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 
                 rounded-xl shadow-lg cursor-grab touch-none
                 flex items-center justify-center
                 ${isDragging ? 'cursor-grabbing z-50' : ''}`}
    >
      <span className="text-4xl font-bold text-white">{letter.value}</span>
    </motion.div>
  );
};

const DropZone = ({ id, name, isOver, isCorrect, isMatched }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        borderColor: isOver 
          ? (isCorrect ? '#22c55e' : '#ef4444')
          : (isMatched ? '#22c55e' : '#e5e7eb'),
        backgroundColor: isOver
          ? (isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)')
          : (isMatched ? 'rgba(34, 197, 94, 0.1)' : 'transparent'),
        scale: isOver && !isCorrect ? 1.05 : 1
      }}
      className={`w-48 h-32 border-4 border-dashed rounded-xl 
                 flex items-center justify-center p-4 text-center
                 transition-all duration-300`}
    >
      <span className="text-lg font-bold text-gray-700">{name}</span>
    </motion.div>
  );
};

const WrongMatch = ({ position }) => (
  <motion.div
    initial={{ scale: 1, opacity: 1 }}
    animate={{ scale: 0, opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute bg-red-500/20 rounded-full w-16 h-16"
    style={{ 
      left: position?.x - 32 || 0, 
      top: position?.y - 32 || 0 
    }}
  />
);

const LettersGame = ({ level = 1, onLevelComplete, onGameComplete }) => {
  const [currentLetters, setCurrentLetters] = useState([]);
  const [matches, setMatches] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongMatchPosition, setWrongMatchPosition] = useState(null);

  // Sonidos
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [playError] = useSound('/sounds/error.mp3', { volume: 0.25 });
  const [playLevelComplete] = useSound('/sounds/level-complete.mp3', { volume: 0.5 });
  const [playGameComplete] = useSound('/sounds/game-complete.mp3', { volume: 0.5 });

  useEffect(() => {
    if (level > 5) {
      playGameComplete();
      setTimeout(() => {
        if (onGameComplete) {
          onGameComplete();
        }
      }, 3000);
      return;
    }

    // Seleccionar letras según el nivel
    let selectedLetters;
    const shuffledLetters = [...allLetters].sort(() => Math.random() - 0.5);
    
    if (level <= 2) {
      // Niveles 1-2: 2 vocales
      selectedLetters = shuffledLetters.filter(l => l.type === 'vocal').slice(0, 2);
    } else {
      // Niveles 3-5: mezcla de vocales y consonantes
      const vocales = shuffledLetters.filter(l => l.type === 'vocal').slice(0, 2);
      const consonantes = shuffledLetters.filter(l => l.type === 'consonante').slice(0, 1);
      selectedLetters = [...vocales, ...consonantes];
    }
    
    setCurrentLetters(selectedLetters);
    setMatches({});
    setShowSuccess(false);
    setWrongMatchPosition(null);
  }, [level]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const isCorrect = active.id === over.id;
    
    if (isCorrect) {
      playSuccess();
      const newMatches = { ...matches, [active.id]: true };
      setMatches(newMatches);

      if (Object.keys(newMatches).length === currentLetters.length) {
        if (level === 5) {
          setTimeout(() => {
            playGameComplete();
            setShowSuccess(true);
            setTimeout(() => {
              if (onGameComplete) {
                onGameComplete();
              }
            }, 3000);
          }, 500);
        } else {
          playLevelComplete();
          setShowSuccess(true);
          setTimeout(() => {
            if (onLevelComplete) {
              onLevelComplete();
            }
          }, 1500);
        }
      }
    } else {
      playError();
      setWrongMatchPosition({
        x: event.activatorEvent.clientX,
        y: event.activatorEvent.clientY
      });
      setTimeout(() => setWrongMatchPosition(null), 500);

      const container = document.getElementById(over.id);
      if (container) {
        container.animate([
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(0)' }
        ], {
          duration: 300,
          iterations: 1
        });
      }
    }
  };

  if (level > 5) {
    return (
      <div className="text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-4xl font-bold text-purple-800 mb-4">
            ¡Felicitaciones! 🎉
          </h2>
          <p className="text-2xl text-gray-700 mb-8">
            ¡Has completado todos los niveles!
          </p>
          <motion.div
            className="text-8xl mb-8"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            🏆
          </motion.div>
          <p className="text-lg text-gray-600">
            Volviendo al menú principal...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="max-w-4xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Nivel {level} de 5
          </h2>
          <p className="text-xl text-gray-600">
            {level <= 2 
              ? '¡Identifica las vocales!' 
              : '¡Identifica las letras!'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Letras para arrastrar */}
          <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
            {currentLetters.map((letter) => (
              <DraggableLetter
                key={letter.id}
                id={letter.id}
                letter={letter}
                isMatched={matches[letter.id]}
              />
            ))}
          </div>

          {/* Zonas para soltar */}
          <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
            {currentLetters.map((letter) => (
              <DropZone
                key={letter.id}
                id={letter.id}
                name={letter.name}
                isMatched={matches[letter.id]}
                isOver={activeId === letter.id}
                isCorrect={activeId === letter.id}
              />
            ))}
          </div>
        </div>

        {/* Efecto de match incorrecto */}
        <AnimatePresence>
          {wrongMatchPosition && <WrongMatch position={wrongMatchPosition} />}
        </AnimatePresence>

        {/* Mascota animada */}
        <motion.div
          className="fixed bottom-8 right-8 text-8xl"
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🦁
        </motion.div>

        {/* Mensaje de éxito */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white p-8 rounded-2xl text-center shadow-xl">
                <h3 className="text-4xl font-bold text-green-500 mb-4">
                  ¡Muy bien! 🎉
                </h3>
                <p className="text-2xl text-gray-700">
                  {level === 5 
                    ? '¡Has completado todos los niveles!' 
                    : '¡Has completado el nivel!'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DragOverlay>
        {activeId && (
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 
                         rounded-xl shadow-lg flex items-center justify-center cursor-grabbing">
            <span className="text-4xl font-bold text-white">
              {currentLetters.find(l => l.id === activeId)?.value}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default LettersGame;