import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Briefcase, Loader2, Play, CheckCircle, Star, Award, ChevronRight, Clock, Users, AlertTriangle } from 'lucide-react';

const AVAILABLE_CASES = [
  {
    id: 'liderazgo-turno-nocturno',
    title: 'El Desafío del Turno Nocturno en el Hospital General',
    category: 'Liderazgo en Enfermería',
    difficulty: 'Intermedio',
    duration: '20-30 min',
    icon: '🏥',
    color: 'from-blue-500 to-cyan-500',
    description: 'Un caso complejo sobre liderazgo, gestión de conflictos y comunicación en un turno nocturno desafiante.',
    context: `El Hospital General es un centro sanitario de referencia en la región, conocido por su atención de alta calidad y su capacidad para manejar una variedad de casos médicos complejos. Sin embargo, enfrenta desafíos significativos durante los turnos de noche:

1. **Escasez de Personal**: El turno nocturno siempre ha tenido menos personal que los turnos diurnos. Esta escasez se ha agravado por recientes recortes presupuestarios y la alta demanda de servicios de salud.

2. **Aumento de Pacientes Críticos**: El hospital ha visto un incremento en el número de pacientes críticos que requieren atención constante y especializada.

3. **Implementación de un Nuevo Sistema de Gestión**: El hospital ha implementado un nuevo sistema de gestión de pacientes. El personal ha encontrado dificultades para adaptarse a la nueva interfaz y protocolos.`,
    characters: [
      { name: 'Ana García', role: 'Supervisora de Enfermería', description: 'Responsable de garantizar que el turno nocturno funcione sin problemas. Lidera al equipo a través de la transición al nuevo sistema.' },
      { name: 'Carlos Ruiz', role: 'Enfermero Nuevo', description: 'Relativamente nuevo, se siente abrumado por aprender el nuevo sistema y manejar pacientes críticos.' },
      { name: 'Sofía Pérez', role: 'Enfermera Veterana', description: 'Ha trabajado en el hospital muchos años. Resistente al cambio y vocal en su crítica al nuevo sistema.' },
      { name: 'Luis Fernández', role: 'Recién Graduado', description: 'Ansioso por aprender, pero su falta de experiencia en situaciones de alta presión es un obstáculo.' }
    ],
    situation: `En una noche particularmente ocupada, con un número inusualmente alto de pacientes críticos y varios incidentes inesperados, el equipo de enfermería se enfrenta a una tormenta perfecta de desafíos. Ana debe guiar a su equipo a través de esta crisis, asegurando que todos los pacientes reciban la atención que necesitan mientras se adapta al nuevo sistema y maneja las dinámicas complejas de su equipo.`
  }
];

const CaseManagementModule = ({ onBack }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const inputRef = useRef(null);
  const contentRef = useRef(null);

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const generateNextQuestion = async (previousAnswers, questionNumber) => {
    setIsGeneratingQuestion(true);
    try {
      const caseInfo = selectedCase;
      const answersContext = previousAnswers.map((a, i) => 
        `Pregunta ${i + 1}: ${a.question}\nRespuesta del estudiante: ${a.answer}`
      ).join('\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera la pregunta número ${questionNumber} de 10 para este caso de estudio.`,
          history: [],
          systemPrompt: `Eres un experto evaluador en gestión enfermera y liderazgo sanitario. 

CASO DE ESTUDIO: "${caseInfo.title}"

CONTEXTO:
${caseInfo.context}

PERSONAJES:
${caseInfo.characters.map(c => `- ${c.name} (${c.role}): ${c.description}`).join('\n')}

SITUACIÓN CRÍTICA:
${caseInfo.situation}

RESPUESTAS ANTERIORES DEL ESTUDIANTE:
${answersContext || 'Ninguna aún (esta es la primera pregunta)'}

INSTRUCCIONES:
1. Genera UNA pregunta reflexiva y desafiante sobre el caso
2. La pregunta debe evaluar competencias de liderazgo, toma de decisiones, gestión de conflictos o comunicación
3. Adapta la dificultad según las respuestas anteriores del estudiante
4. Si las respuestas anteriores fueron superficiales, haz preguntas que profundicen más
5. Si fueron buenas, aumenta la complejidad
6. La pregunta ${questionNumber} debe cubrir un aspecto diferente a las anteriores

TEMAS A CUBRIR EN LAS 10 PREGUNTAS:
1. Identificación del problema principal
2. Análisis de las dinámicas del equipo
3. Estrategias de liderazgo de Ana
4. Manejo del cambio y resistencia (Sofía)
5. Apoyo a personal nuevo (Carlos y Luis)
6. Priorización en crisis
7. Comunicación efectiva
8. Delegación de tareas
9. Gestión emocional del equipo
10. Plan de acción integral

Responde SOLO con la pregunta, sin numeración ni explicaciones adicionales. La pregunta debe ser directa y clara.`
        })
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating question:', error);
      return 'Error al generar la pregunta. Por favor, intenta de nuevo.';
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const startCase = async (caseData) => {
    setSelectedCase(caseData);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuestions([]);
    setShowResults(false);
    setEvaluation(null);
    
    const firstQuestion = await generateNextQuestion([], 1);
    setQuestions([firstQuestion]);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isLoading) return;

    const newAnswer = {
      question: questions[currentQuestion],
      answer: currentAnswer.trim()
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentQuestion < 9) {
      const nextQ = await generateNextQuestion(updatedAnswers, currentQuestion + 2);
      setQuestions(prev => [...prev, nextQ]);
      setCurrentQuestion(prev => prev + 1);
      
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const caseInfo = selectedCase;
      const allAnswers = answers.map((a, i) => 
        `**Pregunta ${i + 1}:** ${a.question}\n**Respuesta:** ${a.answer}`
      ).join('\n\n---\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Evalúa las respuestas del estudiante y proporciona calificación y feedback.',
          history: [],
          systemPrompt: `Eres un experto evaluador en gestión enfermera y liderazgo sanitario.

CASO EVALUADO: "${caseInfo.title}"

CONTEXTO DEL CASO:
${caseInfo.context}

SITUACIÓN CRÍTICA:
${caseInfo.situation}

RESPUESTAS DEL ESTUDIANTE A LAS 10 PREGUNTAS:
${allAnswers}

INSTRUCCIONES DE EVALUACIÓN:
Evalúa las respuestas del estudiante y proporciona:

1. **CALIFICACIÓN GLOBAL** (0-100 puntos):
   - Comprensión del caso: /25 puntos
   - Aplicación de liderazgo: /25 puntos
   - Resolución de conflictos: /25 puntos
   - Comunicación y trabajo en equipo: /25 puntos

2. **FORTALEZAS DEMOSTRADAS** (3-5 puntos fuertes)

3. **ÁREAS DE MEJORA** (3-5 aspectos a desarrollar)

4. **FEEDBACK DETALLADO**:
   - Análisis de las mejores respuestas
   - Sugerencias específicas para mejorar
   - Recursos recomendados para profundizar

5. **COMPETENCIAS EVALUADAS**:
   - Liderazgo: [Nivel: Básico/Intermedio/Avanzado]
   - Toma de decisiones: [Nivel]
   - Gestión de conflictos: [Nivel]
   - Comunicación: [Nivel]
   - Trabajo en equipo: [Nivel]

6. **CONCLUSIÓN Y RECOMENDACIONES**

Sé constructivo, específico y motivador en tu feedback. Usa terminología de gestión enfermera.`
        })
      });

      const data = await response.json();
      setEvaluation(data.response);
      setShowResults(true);
    } catch (error) {
      console.error('Error evaluating:', error);
      setEvaluation('Error al evaluar las respuestas. Por favor, intenta de nuevo.');
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedCase) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 z-50 overflow-auto">
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={onBack} 
                className="p-3 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Gestión de Casos</h1>
                  <p className="text-red-300 text-sm">Selecciona un caso para comenzar</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {AVAILABLE_CASES.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all overflow-hidden group cursor-pointer"
                  onClick={() => startCase(caseItem)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${caseItem.color} rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                        {caseItem.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full">
                            {caseItem.category}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">
                            {caseItem.difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {caseItem.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3">
                          {caseItem.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {caseItem.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {caseItem.characters.length} personajes
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            10 preguntas
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-slate-800/40 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                ¿Cómo funciona?
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">1.</span>
                  Selecciona un caso de estudio para comenzar
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">2.</span>
                  Lee el contexto, los personajes y la situación crítica
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">3.</span>
                  Responde las 10 preguntas generadas por IA
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">4.</span>
                  Al finalizar, recibirás calificación y feedback detallado
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && evaluation) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 z-50 overflow-auto">
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => {
                  setSelectedCase(null);
                  setShowResults(false);
                  setEvaluation(null);
                }} 
                className="p-3 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Evaluación Completada</h1>
                  <p className="text-emerald-300 text-sm">{selectedCase.title}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-6">
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-slate-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(evaluation) }}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setShowResults(false);
                  setEvaluation(null);
                }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30"
              >
                Volver a Casos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedCase(null)} 
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{selectedCase.category}</h1>
            <p className="text-xs text-cyan-300">Pregunta {currentQuestion + 1} de 10</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < answers.length
                  ? 'bg-emerald-500'
                  : i === currentQuestion
                  ? 'bg-cyan-500 animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentQuestion === 0 && (
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🏥 {selectedCase.title}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-cyan-400 font-bold mb-2">📋 Contexto</h3>
                <div 
                  className="text-slate-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(selectedCase.context) }}
                />
              </div>

              <div>
                <h3 className="text-cyan-400 font-bold mb-2">👥 Personajes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCase.characters.map((char, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-xl p-3">
                      <p className="text-white font-bold text-sm">{char.name}</p>
                      <p className="text-cyan-300 text-xs">{char.role}</p>
                      <p className="text-slate-400 text-xs mt-1">{char.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-amber-400 font-bold mb-2">⚠️ Situación Crítica</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedCase.situation}</p>
              </div>
            </div>
          </div>
        )}

        {answers.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
                <p className="text-xs text-cyan-400 font-bold mb-1">Pregunta {idx + 1}</p>
                <p className="text-slate-100 text-sm">{item.question}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="max-w-[80%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl px-4 py-3">
                <p className="text-white text-sm">{item.answer}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        ))}

        {questions[currentQuestion] && answers.length === currentQuestion && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-slate-800/80 border border-cyan-500/30 rounded-2xl px-4 py-3">
              <p className="text-xs text-cyan-400 font-bold mb-1">Pregunta {currentQuestion + 1}</p>
              <p className="text-slate-100 text-sm">{questions[currentQuestion]}</p>
            </div>
          </div>
        )}

        {isGeneratingQuestion && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generando siguiente pregunta...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-cyan-500/30 p-4">
        {answers.length < 10 ? (
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              placeholder="Escribe tu respuesta..."
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              disabled={isGeneratingQuestion}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim() || isGeneratingQuestion}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleFinalSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Evaluando respuestas...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar y Obtener Calificación
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CaseManagementModule;
