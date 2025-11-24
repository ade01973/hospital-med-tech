import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

/**
 * Componente de celebración con confeti animado
 * Propósito: Mostrar confeti colorido en momentos de celebración
 */
const ConfettiCelebration = ({
  trigger = false,
  duration = 3500,
  numberOfPieces = 300,
  celebrationType = 'victory', // 'victory', 'streak', 'mission', 'rank'
  onComplete = null,
}) => {
  const [isActive, setIsActive] = useState(trigger);

  // Auto-desactivar después de la duración especificada
  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete]);

  if (!isActive) return null;

  // Colores según tipo de celebración
  const getColors = () => {
    switch (celebrationType) {
      case 'victory':
        // Tema médico: azul, verde, blanco
        return ['#00bcd4', '#4caf50', '#ffffff', '#0097a7', '#2e7d32'];
      case 'streak':
        // Más vibrante para racha
        return ['#ff6b6b', '#ffd700', '#00bcd4', '#ffffff', '#ff9800'];
      case 'mission':
        // Colores para misión
        return ['#9c27b0', '#3f51b5', '#00bcd4', '#ffffff'];
      case 'rank':
        // Colores dorados para rango
        return ['#ffd700', '#ffb300', '#ff9800', '#ffffff'];
      default:
        return ['#0EA5E9', '#10B981', '#FFFFFF'];
    }
  };

  // Configuración según tipo
  const getConfig = () => {
    const baseConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      recycle: false,
      colors: getColors(),
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      },
    };

    switch (celebrationType) {
      case 'victory':
        return {
          ...baseConfig,
          numberOfPieces: numberOfPieces,
          gravity: 0.8,
          spread: 360,
        };
      case 'streak':
        return {
          ...baseConfig,
          numberOfPieces: numberOfPieces * 0.6,
          gravity: 0.6,
          spread: 180,
        };
      case 'mission':
        return {
          ...baseConfig,
          numberOfPieces: numberOfPieces * 0.5,
          gravity: 0.7,
          spread: 270,
        };
      case 'rank':
        return {
          ...baseConfig,
          numberOfPieces: numberOfPieces * 0.8,
          gravity: 0.9,
          spread: 360,
        };
      default:
        return baseConfig;
    }
  };

  return <ReactConfetti {...getConfig()} />;
};

export default ConfettiCelebration;
