import React, { useState, useEffect, useRef } from "react";
import { TOPICS, CURRENCY } from "../data/constants";
import useSoundEffects from "../hooks/useSoundEffects";
import { useGestCoins } from "../hooks/useGestCoins";
import LivesGameOver from "./LivesGameOver";
import ConfettiCelebration from "./ConfettiCelebration";
import CoinNotification from "./CoinNotification";
import CelebrationFX from "./CelebrationFX";
import { useEncouragementMessages } from "../data/encouragementMessages";

// 🔀 Shuffle básico tipo Fisher-Yates
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 🔀 Barajar las opciones manteniendo cuál es la correcta
function shuffleQuestionOptions(question) {
  const indexed = question.options.map((text, originalIndex) => ({
    text,
    originalIndex,
  }));

  const mixed = shuffleArray(indexed);

  const newCorrectIndex = mixed.findIndex(
    (opt) => opt.originalIndex === question.correct
  );

  return {
    ...question,
    options: mixed.map((o) => o.text),
    correct: newCorrectIndex,
  };
}

// Componente de puntos flotantes
const FloatingPoints = ({ points, isCorrect, x, y }) => {
  return (
    <div
      className="fixed pointer-events-none z-[10000] animate-float-up"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div
        className={`text-4xl font-black ${
          isCorrect ? "text-green-400" : "text-[#FF3B3B]"
        } drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]`}
        style={
          !isCorrect
            ? {
                textShadow:
                  "0 0 10px rgba(255, 59, 59, 0.8), 0 0 20px rgba(255, 59, 59, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.9)",
              }
            : {}
        }
      >
        {isCorrect ? "+" : ""}
        {points}
      </div>
    </div>
  );
};

// Componente de mensaje de racha
const StreakMessage = ({ streak }) => {
  if (streak < 2) return null;

  let message = "";
  let color = "";

  if (streak >= 5) {
    message = "¡IMPARABLE! 🔥";
    color = "from-orange-500 to-red-500";
  } else if (streak === 4) {
    message = "¡4 SEGUIDAS! 🔥";
    color = "from-yellow-500 to-orange-500";
  } else if (streak === 3) {
    message = "¡3 EN RACHA! 🔥";
    color = "from-yellow-400 to-yellow-500";
  } else if (streak === 2) {
    message = "¡2 SEGUIDAS!";
    color = "from-blue-400 to-blue-500";
  }

  return (
    <div
      className={`bg-gradient-to-r ${color} text-white px-6 py-2 rounded-full font-black text-lg shadow-lg animate-bounce`}
    >
      {message}
    </div>
  );
};
// 🎲 Frases y emojis aleatorios estilo Duolingo
const FEEDBACK = {
  correct: {
    emojis: ["💪", "🔥", "😎", "🤩", "👏", "✨", "🏆"],
    messages: [
      "¡Excelente!",
      "¡Perfecto!",
      "¡Muy bien!",
      "¡Así se hace!",
      "¡Genial!",
      "¡Sigue así!",
      "¡Brutal!",
    ],
  },
  wrong: {
    emojis: ["😢", "😖", "💀", "🥺", "😬", "☹️"],
    messages: [
      "Casi…",
      "Vamos a por la siguiente…",
      "No pasa nada, tú puedes.",
      "¡Ánimo!",
      "Inténtalo de nuevo.",
      "Respira… y seguimos.",
    ],
  },
};

// 🔥 Pantalla estilo Duolingo al responder
const AnswerFeedback = ({ isCorrect, emoji, message }) => {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[9999] pointer-events-none bg-opacity-90 ${
        isCorrect ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
      <div className="text-white text-4xl font-black">{message}</div>
    </div>
  );
};

// 💬 Componente para mensajes de ánimo flotantes
const EncouragementBubble = ({ message, isTimeWarning = false }) => {
  return (
    <div
      className={`fixed animate-fade-in-out text-center z-[5000] pointer-events-none ${
        isTimeWarning ? "top-1/3" : "bottom-20"
      } left-1/2 transform -translate-x-1/2`}
    >
      <div
        className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg ${
          isTimeWarning
            ? "bg-red-600 text-white animate-pulse"
            : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

// 🖼️ Componente para mostrar avatar durante el quiz - MEJORADO
const QuizAvatar = ({ playerAvatar }) => {
  if (!playerAvatar?.name) return null;

  return (
    <div className="mb-6 group">
      {/* Container con gradiente animado y glow */}
      <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-emerald-500 p-1 rounded-3xl shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] inline-block animate-lift-effect">
        <div className="flex items-center gap-4 bg-gradient-to-r from-slate-900/95 to-slate-800/95 rounded-3xl p-5 backdrop-blur-xl">
          
          {/* Avatar Image - Más grande con border luminoso */}
          <div className="relative">
            {/* Border circular luminoso */}
            <div className="absolute inset-0 rounded-full border-3 border-cyan-400/60 shadow-lg animate-pulse-glow"></div>
            
            {/* Avatar Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800/50 border-2 border-cyan-500/40 relative z-10 group-hover:scale-105 transition-transform duration-300">
              {playerAvatar.characterPreset ? (
                <img 
                  src={`/src/assets/${playerAvatar.gender === 'male' ? 'male' : 'female'}-characters/${playerAvatar.gender === 'male' ? 'male' : 'female'}-character-${playerAvatar.characterPreset}.png`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              ) : (
                <img
                  src={playerAvatar.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              )}
            </div>
          </div>

          {/* Nombre - Grande, bold, cyan con brillo */}
          <div>
            <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 leading-tight drop-shadow-lg">
              {playerAvatar.name}
            </p>
            <p className="text-xs text-emerald-300 font-bold mt-1">Gestor/a Enfermero/a</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GameLevel({
  topic,
  user,
  userData,
  studentId,
  onExit,
  onComplete,
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReviewChoice, setShowReviewChoice] = useState(false);
  const [showReviewVideo, setShowReviewVideo] = useState(false);
  const [videoFromCompletion, setVideoFromCompletion] = useState(false);

  // 🎮 GAMIFICACIÓN
  const [lives, setLives] = useState(5);
  const [streak, setStreak] = useState(0);
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const [shakeLife, setShakeLife] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  // 🟩 Feedback tipo Duolingo
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [answerFeedbackCorrect, setAnswerFeedbackCorrect] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const feedbackTimeoutRef = useRef(null);

  // 💬 Mensajes de ánimo
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const encouragementTimeoutRef = useRef(null);
  const { getGeneralEncouragement, getTimeWarning10, getTimeWarning5, getTimeUp } =
    useEncouragementMessages();

  // 💰 Notificaciones de monedas
  const [coinNotifications, setCoinNotifications] = useState([]);
  const coinNotificationIdRef = useRef(0);
  const { earnCoins } = useGestCoins();

  // 🎉 Celebración de quiz perfecto
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationBonus, setCelebrationBonus] = useState(0);

  // 🖼️ Fondo aleatorio del módulo
  const [randomBg, setRandomBg] = useState("");

  // Videos de repaso por módulo
  const videoLinks = {
    1: "bL0e705JuZQ",
    2: "eb1nlMUK3-c",
    3: "ThHodVUzC9c",
    4: "oB4ol3EYEIs",
    5: "yUOPtM_yEHc",
    6: "NMY7SwEgC50",
    7: "TU9VF7sWh-w",
    8: "7yo2d-MtgBw",
    9: "rTJXMJqkUSw",
    10: "pem8VkjbNA4",
    11: "iJNKzYCRoEw",
    12: "VvHqG2ec744",
    13: "scs2OI7IB2c",
    14: "HBnbjZKqyjA",
    15: "5KbUJ6fDVRA",
    16: "DVlSigTdaoQ",
    17: "e0AbDC1DlLI",
    18: "pvOTsv6alS8",
    19: "p2qaUIymS9M",
    20: "w_YbsjGtn1s",
    21: "hvI5afYV9kM",
  };

  const { playSuccess, playError, playVictory } = useSoundEffects();
  const completedRef = useRef(false);
  const floatingPointsIdRef = useRef(0);

  // 🖼️ Seleccionar fondo aleatorio al cargar el módulo
  useEffect(() => {
    const backgrounds = [
      "/images/hospital-1.png",
      "/images/hospital-2.png",
      "/images/hospital-3.png"
    ];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setRandomBg(backgrounds[randomIndex]);
  }, [topic?.id]);

  // Preparar 10 preguntas aleatorias SOLO del módulo actual
  useEffect(() => {
    if (!topic) return;

    const currentModule = TOPICS.find((t) => t.id === topic.id);
    if (!currentModule || !currentModule.questions) return;

    // 1. Barajar todas las preguntas
    const shuffledQuestions = shuffleArray(currentModule.questions);

    // 2. Seleccionar solo 10
    let selectedQuestions = shuffledQuestions.slice(0, 10);

    // 3. Barajar las opciones dentro de cada pregunta
    selectedQuestions = selectedQuestions.map((q) =>
      shuffleQuestionOptions(q)
    );

    // 4. Guardar en estado
    setQuestions(selectedQuestions);

    // 5. Resetear el estado del juego
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setIsCompleted(false);
    setLives(5);
    setStreak(0);
    completedRef.current = false;
  }, [topic]);

    
  const currentQuestion = questions[currentIndex];

  // Función para mostrar puntos flotantes
  const showFloatingPoints = (points, isCorrect, event) => {
    const id = floatingPointsIdRef.current++;
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setFloatingPoints((prev) => [...prev, { id, points, isCorrect, x, y }]);

    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== id));
    }, 1500);
  };

  // Función para mostrar notificación de monedas
  const showCoinNotification = (amount, event) => {
    const id = coinNotificationIdRef.current++;
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setCoinNotifications((prev) => [...prev, { id, amount, x, y }]);
  };

  // Función para incrementar streak
  const incrementStreak = () => {
    const now = new Date();
    const today = now.toDateString();

    let streakData = localStorage.getItem('streakData');
    if (!streakData) {
      streakData = {
        count: 1,
        lastPlayDate: now,
        frozenUntil: null,
        frozeThisMonth: false,
        milestonesBadges: []
      };
    } else {
      streakData = JSON.parse(streakData);
      const lastPlay = new Date(streakData.lastPlayDate);
      const lastPlayDate = lastPlay.toDateString();

      if (lastPlayDate !== today) {
        streakData.count += 1;
      }
      streakData.lastPlayDate = now;
    }

    localStorage.setItem('streakData', JSON.stringify(streakData));
  };

  // Función para avanzar a la siguiente pregunta
  const advanceQuestion = () => {
    const nextIndex = currentIndex + 1;

    // Si es la última pregunta, completar el módulo
    if (nextIndex >= questions.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        setIsCompleted(true);
        playVictory();
        setShowConfetti(true);
        
        // 🔥 Incrementar racha
        incrementStreak();
        
        // 💰 Bonus de monedas si el quiz fue perfecto (todas correctas)
        const totalCorrect = questions.filter((q, idx) => idx < currentIndex + 1).length;
        if (score > 0 && currentIndex + 1 === totalCorrect) {
          const perfectBonus = CURRENCY.EARN_QUIZ_PERFECT;
          const streakBonus = streak * 5; // Bonus adicional por racha
          const totalBonus = perfectBonus + streakBonus;
          earnCoins(totalBonus, `¡Quiz perfecto en ${topic.title}!`);
          setCelebrationBonus(totalBonus);
          setShowCelebration(true);
        }

        // Mostrar modal de opciones después de completar
        setTimeout(() => {
          setShowReviewChoice(true);
        }, 1000);
      }
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResult(false);
    setTimeLeft(15);
    setShowStreakMessage(false);
    setShowAnswerFeedback(false);
  };

  // Cronómetro - solo cuando NO ha respondido y el quiz no está completado
  useEffect(() => {
    if (answered || isCompleted || questions.length === 0 || !currentQuestion)
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Tiempo agotado: contar como respuesta incorrecta
          handleTimeOut();
          return 15;
        }

        // Mostrar avisos de tiempo
        if (prev === 6) {
          // 5 segundos - aviso crítico
          const msg = getTimeWarning5();
          setEncouragementMessage(msg);
          setIsTimeWarning(true);
          setShowEncouragement(true);

          if (encouragementTimeoutRef.current)
            clearTimeout(encouragementTimeoutRef.current);
          encouragementTimeoutRef.current = setTimeout(() => {
            setShowEncouragement(false);
          }, 1500);
        } else if (prev === 11) {
          // 10 segundos - aviso moderado
          const msg = getTimeWarning10();
          setEncouragementMessage(msg);
          setIsTimeWarning(false);
          setShowEncouragement(true);

          if (encouragementTimeoutRef.current)
            clearTimeout(encouragementTimeoutRef.current);
          encouragementTimeoutRef.current = setTimeout(() => {
            setShowEncouragement(false);
          }, 1200);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, isCompleted, currentQuestion, questions.length, currentIndex]);

  // Manejar timeout (tiempo agotado)
  const handleTimeOut = () => {
    if (answered) return;

    // Generar emoji y mensaje para feedback de error
    const type = "wrong";
    const emoji = FEEDBACK[type].emojis[Math.floor(Math.random() * FEEDBACK[type].emojis.length)];
    const message = FEEDBACK[type].messages[Math.floor(Math.random() * FEEDBACK[type].messages.length)];

    // Mostrar aviso de tiempo agotado
    const timeUpMsg = getTimeUp();
    setEncouragementMessage(timeUpMsg);
    setIsTimeWarning(true);
    setShowEncouragement(true);

    if (encouragementTimeoutRef.current)
      clearTimeout(encouragementTimeoutRef.current);
    encouragementTimeoutRef.current = setTimeout(() => {
      setShowEncouragement(false);
    }, 1500);

    setAnswered(true);
    setShowResult(true);
    setSelectedAnswer(null);
    // Mostrar feedback de error
    setAnswerFeedbackCorrect(false);
    setFeedbackEmoji(emoji);
    setFeedbackMessage(message);
    setShowAnswerFeedback(true);

    // Perder vida y resetear racha
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    setShakeLife(true);
    setTimeout(() => setShakeLife(false), 500);

    playError();

    // Auto-avance después de 2 segundos
    setTimeout(() => {
      if (newLives <= 0) {
        // Game Over se maneja en el render
        return;
      }
      advanceQuestion();
    }, 2000);
  };

  // Auto-cerrar feedback después de 1.2 segundos
  useEffect(() => {
    if (!showAnswerFeedback) return;

    // Limpiar timeout anterior si existe
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);

    feedbackTimeoutRef.current = setTimeout(() => {
      setShowAnswerFeedback(false);
    }, 1200);

    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, [showAnswerFeedback]);

  // Auto-avance después de que se cierra el feedback
  useEffect(() => {
    if (answered && !showAnswerFeedback && !isCompleted && lives > 0) {
      const timer = setTimeout(() => {
        advanceQuestion();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [answered, showAnswerFeedback]);

  const handleAnswer = (optionIndex, event) => {
    if (answered || isCompleted) return;

    const isCorrect = optionIndex === currentQuestion.correct;

    // Generar emoji y mensaje para feedback
    const type = isCorrect ? "correct" : "wrong";
    const emoji = FEEDBACK[type].emojis[Math.floor(Math.random() * FEEDBACK[type].emojis.length)];
    const message = FEEDBACK[type].messages[Math.floor(Math.random() * FEEDBACK[type].messages.length)];

    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setAnswered(true);
    // 🔥 Mostrar pantalla Duolingo
    setAnswerFeedbackCorrect(isCorrect);
    setFeedbackEmoji(emoji);
    setFeedbackMessage(message);
    setShowAnswerFeedback(true);

    if (isCorrect) {
      // 🎯 RESPUESTA CORRECTA

      // Incrementar racha
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Mostrar mensaje de racha
      if (newStreak >= 2) {
        setShowStreakMessage(true);
        setTimeout(() => setShowStreakMessage(false), 2000);
      }

      // Calcular puntos según tiempo restante
      let basePoints = 100;
      if (timeLeft > 10) {
        basePoints = 200;
      } else if (timeLeft > 5) {
        basePoints = 150;
      }

      // Bonificación por racha
      let bonusPoints = 0;
      if (newStreak >= 3) {
        bonusPoints = 50;
      }

      const totalPoints = basePoints + bonusPoints;
      setScore((prev) => prev + totalPoints);

      // Mostrar puntos flotantes
      showFloatingPoints(totalPoints, true, event);

      // 💰 Ganar monedas por respuesta correcta
      const coinsEarned = CURRENCY.EARN_QUIZ_CORRECT;
      earnCoins(coinsEarned, "Respuesta correcta");
      showCoinNotification(coinsEarned, event);

      setTimeout(() => playSuccess(), 100);
    } else {
      // ❌ RESPUESTA INCORRECTA

      // Perder vida
      const newLives = lives - 1;
      setLives(newLives);

      // Resetear racha
      setStreak(0);

      // Animación de shake
      setShakeLife(true);
      setTimeout(() => setShakeLife(false), 500);

      // Mostrar puntos negativos
      showFloatingPoints(-50, false, event);

      setTimeout(() => playError(), 100);
    }
  };

  // 💔 GAME OVER - Mostrar modal de vidas
  if (lives <= 0 && !isCompleted) {
    return (
      <LivesGameOver
        topic={topic}
        onContinue={(recoveredLives) => {
          setLives(recoveredLives);
          setAnswered(false);
          setShowResult(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }}
        onWatchVideo={() => {
          console.log("🎬 Usuario eligió ver video desde GameOver");
          setShowReviewVideo(true);
          setVideoFromCompletion(false);
          setLives(2);
        }}
        onUsePowerUp={() => {
          console.log("⚡ Usuario usó power-up");
          setLives(5);
          setAnswered(false);
          setShowResult(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }}
        hasPowerUp={false} // Aquí se puede conectar con el sistema de power-ups real
      />
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center text-white">
          <p className="text-xl">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / 10) * 100;
  let timerColor = "text-blue-400";
  if (timeLeft <= 5) timerColor = "text-red-500";
  else if (timeLeft <= 10) timerColor = "text-yellow-400";
  
  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');

  const handleGoToDashboard = () => {
    // Solo completar el módulo si realmente está completado
    if (isCompleted) {
      onComplete(topic.id, score, studentId);
    }
    onExit();
  };

  const handleViewReview = () => {
    setShowReviewChoice(false);
    setShowReviewVideo(true);
    setVideoFromCompletion(true);
  };

  const handleCloseReviewVideo = () => {
    setShowReviewVideo(false);

    // Si el video viene de la pantalla de completación, volver a mostrar el resumen
    if (videoFromCompletion) {
      setShowReviewChoice(true);
      setVideoFromCompletion(false);
    } else {
      // Si viene de sin energía, limpiar estados para continuar jugando
      setAnswered(false);
      setShowResult(false);
      setSelectedAnswer(null);
      setTimeLeft(15);
    }
  };

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url(${randomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div className="relative z-10">
      {/* Pantalla tipo Duolingo */}
      {showAnswerFeedback && (
        <AnswerFeedback
          isCorrect={answerFeedbackCorrect}
          emoji={feedbackEmoji}
          message={feedbackMessage}
        />
      )}
      {/* Puntos flotantes */}
      {floatingPoints.map((fp) => (
        <FloatingPoints
          key={fp.id}
          points={fp.points}
          isCorrect={fp.isCorrect}
          x={fp.x}
          y={fp.y}
        />
      ))}

      {/* Notificaciones de monedas */}
      {coinNotifications.map((cn) => (
        <CoinNotification
          key={cn.id}
          amount={cn.amount}
          x={cn.x}
          y={cn.y}
          onComplete={() => {
            setCoinNotifications((prev) => prev.filter((c) => c.id !== cn.id));
          }}
        />
      ))}

      <div className="max-w-2xl mx-auto">
        {/* Avatar del jugador */}
        <QuizAvatar playerAvatar={playerAvatar} />

        {/* Mensaje de ánimo */}
        {showEncouragement && (
          <EncouragementBubble
            message={encouragementMessage}
            isTimeWarning={isTimeWarning}
          />
        )}

        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleGoToDashboard}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              disabled={isCompleted}
            >
              ← Salir
            </button>

            {/* Vidas - Más grandes con animación pulse */}
            <div className={`flex gap-2 ${shakeLife ? "animate-shake" : ""}`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span 
                  key={i} 
                  className={`text-4xl drop-shadow-lg transition-all duration-200 ${i < lives ? "animate-heart-pulse" : "opacity-50"}`}
                  style={{
                    animationDelay: i < lives ? `${i * 0.1}s` : '0s'
                  }}
                >
                  {i < lives ? "❤️" : "🤍"}
                </span>
              ))}
            </div>

            {/* Timer con color dinámico y glow */}
            <div
              className={`text-4xl font-black w-20 text-center drop-shadow-lg transition-all duration-200 ${
                timeLeft <= 5 
                  ? 'text-red-500 animate-pulse-glow' 
                  : timeLeft <= 10 
                    ? 'text-yellow-400' 
                    : 'text-emerald-400'
              }`}
            >
              ⏱️ {timeLeft}s
            </div>
          </div>

          {/* Badge de racha */}
          {streak > 0 && (
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full font-bold text-sm">
                🔥 {streak} en racha
              </div>
            </div>
          )}

          {/* Mensaje de racha */}
          {showStreakMessage && (
            <div className="flex justify-center mb-3">
              <StreakMessage streak={streak} />
            </div>
          )}

          {/* Progreso Mejorado */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-white mb-4">
              <span className="text-base font-bold">Pregunta {currentIndex + 1}/10</span>
              {/* Badge de puntuación dorado con bounce */}
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-500 px-5 py-2 rounded-full shadow-lg border-2 border-yellow-200/60 animate-bounce-gold">
                <span className="font-black text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">⭐ {score} pts</span>
              </div>
            </div>
            {/* Barra de progreso - Más visible con gradiente animado */}
            <div className="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden border-2 border-slate-600/40 shadow-inner">
              <div
                className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 h-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl md:text-2xl text-white font-bold mb-6 leading-relaxed">
            {currentQuestion.q}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => handleAnswer(index, e)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg font-semibold transition-all ${
                  !answered
                    ? "bg-slate-700 hover:bg-slate-600 text-white cursor-pointer transform hover:scale-[1.02]"
                    : index === currentQuestion.correct
                      ? "bg-green-600 text-white scale-[1.02]"
                      : index === selectedAnswer
                        ? "bg-red-600 text-white"
                        : "bg-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    !answered
                      ? "bg-opacity-20 bg-white text-slate-300"
                      : index === currentQuestion.correct
                        ? "bg-green-400 text-white font-black"
                        : index === selectedAnswer
                          ? "bg-red-400 text-white font-black"
                          : "bg-slate-600 text-slate-400"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Result feedback - Solo mostrar si no está el AnswerFeedback */}
        {showResult && !showAnswerFeedback && (
          <div
            className={`p-4 rounded-lg mb-6 font-semibold text-lg ${
              selectedAnswer === currentQuestion.correct
                ? "bg-green-900 text-green-200"
                : selectedAnswer === null
                  ? "bg-orange-900 text-orange-200"
                  : "bg-red-900 text-red-200"
            }`}
          >
            {selectedAnswer === currentQuestion.correct
              ? "✓ ¡Correcto!"
              : selectedAnswer === null
                ? "⏱️ ¡Tiempo agotado!"
                : "✗ Respuesta incorrecta"}
          </div>
        )}
      </div>

      {/* MODAL: Opciones después de completar el módulo */}
      {showReviewChoice && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl">
            {/* Título */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                ¡Módulo Completado! 🎉
              </h2>
              <p className="text-gray-300">{topic.title}</p>
            </div>

            {/* Datos de lo conseguido */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center text-white">
                <span className="font-semibold">Puntos Totales:</span>
                <span className="text-2xl font-black text-yellow-400">
                  {score * 100}
                </span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="font-semibold">GestCoins Ganados:</span>
                <span className="text-2xl font-black text-green-400">
                  +{Math.floor(score / 10)}
                </span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="font-semibold">Racha Máxima:</span>
                <span className="text-2xl font-black text-orange-400">
                  {streak} 🔥
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={handleViewReview}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                📹 Ver Video de Repaso
              </button>
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                📚 Volver a Módulos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Video de Repaso */}
      {showReviewVideo && videoLinks[topic.id] && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl max-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-black text-xl">
                Video de Repaso: {topic.title}
              </h3>
              <button
                onClick={handleCloseReviewVideo}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-2 px-4 rounded-lg transition text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${videoLinks[topic.id]}?autoplay=1`}
                title="Video de Repaso"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handleCloseReviewVideo}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-2 px-8 rounded-lg transition"
              >
                Finalizar Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confeti de celebración */}
      {showConfetti && (
        <ConfettiCelebration
          trigger={true}
          onComplete={() => setShowConfetti(false)}
        />
      )}

      {/* Celebración FX para quiz perfecto */}
      <CelebrationFX
        show={showCelebration}
        bonusCoins={celebrationBonus}
        streak={streak}
        onComplete={() => setShowCelebration(false)}
      />
      </div>
    </div>
  );
}
