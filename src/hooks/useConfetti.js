
import { useState, useCallback } from 'react';

const useConfetti = () => {
  const [isActive, setIsActive] = useState(false);

  const triggerConfetti = useCallback(() => {
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
    }, 4000); // 4 segundos de duración
  }, []);

  return {
    isActive,
    triggerConfetti,
  };
};

export default useConfetti;
