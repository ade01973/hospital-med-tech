import React from 'react';
import { ChevronRight, Star, Shield, Users, Trophy, BrainCircuit, Activity } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="font-black text-xl tracking-tight uppercase">Hospital Gest-Tech</span>
          </div>
          <button 
            onClick={onStart}
            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-sm uppercase tracking-wider"
          >
            Acceso Estudiantes
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (Above the fold) --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Fondo con imagen y overlay */}
        <div className="absolute inset-0 z-0">
          <img src={hospitalBg} alt="Hospital Futuro" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Simulación Clínica Avanzada v2.0
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
            Domina el Liderazgo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Enfermero del Futuro</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            La primera plataforma de simulación gamificada que une gestión sanitaria, toma de decisiones clínicas e Inteligencia Artificial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              EMPEZAR AHORA <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-lg transition-all border border-slate-700">
              Ver Demo (Video)
            </button>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col items-center gap-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Confianza académica</p>
            <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
              {/* Aquí irían logos de universidades, pongo placeholders */}
              <div className="h-8 font-bold text-slate-400 flex items-center gap-2"><Shield className="w-5 h-5" /> UNIVERSIDAD</div>
              <div className="h-8 font-bold text-slate-400 flex items-center gap-2"><Activity className="w-5 h-5" /> HOSPITAL DOCENTE</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CARACTERÍSTICAS (Estilo Bento Grid - Inspiración Padlet/Apple) --- */}
      <section className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Entrena sin Riesgos</h2>
            <p className="text-slate-400">Desarrolla competencias críticas en un entorno seguro y controlado.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Gamificación */}
            <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/30 transition-all group">
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Gamificación Real</h3>
              <p className="text-slate-400">Sube de nivel, gana medallas y compite en el ranking. Aprender gestión nunca fue tan adictivo.</p>
            </div>

            {/* Card 2: IA */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 rounded-3xl flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-900/20 transition-all">
              <div>
                <BrainCircuit className="w-10 h-10 text-cyan-400 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">IA Mentor</h3>
                <p className="text-slate-400 text-sm">Feedback inmediato personalizado por Inteligencia Artificial.</p>
              </div>
            </div>

            {/* Card 3: Avatares */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
               <Users className="w-10 h-10 text-blue-400 mb-4" />
               <h3 className="text-xl font-bold mb-2">Identidad Digital</h3>
               <p className="text-slate-400 text-sm">Crea tu avatar sanitario y construye tu carrera profesional virtual.</p>
            </div>

            {/* Card 4: Seguridad */}
            <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex items-center gap-6 hover:bg-slate-900 transition-colors">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Seguridad del Paciente</h3>
                <p className="text-slate-400">Entrena la toma de decisiones críticas. Comete errores aquí para no cometerlos con pacientes reales.</p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-full">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CÓMO FUNCIONA / INSTRUCCIONES --- */}
      <section className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-3xl lg:text-4xl font-black mb-8">Tu camino al éxito profesional</h2>
               <div className="space-y-8">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center flex-shrink-0">1</div>
                   <div>
                     <h4 className="text-xl font-bold mb-1">Crea tu Cuenta</h4>
                     <p className="text-slate-400">Regístrate en segundos y personaliza tu avatar de gestor.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center flex-shrink-0">2</div>
                   <div>
                     <h4 className="text-xl font-bold mb-1">Elige un Módulo</h4>
                     <p className="text-slate-400">Desde "Liderazgo" hasta "Gestión de Conflictos". Contenidos validados por expertos.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center flex-shrink-0">3</div>
                   <div>
                     <h4 className="text-xl font-bold mb-1">Resuelve y Aprende</h4>
                     <p className="text-slate-400">Toma decisiones, recibe feedback y mejora tu ranking global.</p>
                   </div>
                 </div>
               </div>
             </div>
             <div className="relative">
               {/* Aquí podrías poner una captura de tu dashboard flotando */}
               <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
               <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                  <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                    (Aquí irá una captura de tu Dashboard)
                  </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* --- CTA FINAL Y ENCUESTA --- */}
      <section className="py-20 bg-gradient-to-t from-cyan-900/20 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-6">¿Listo para el reto?</h2>
          <p className="text-xl text-slate-300 mb-10">Únete a cientos de estudiantes de enfermería que ya están entrenando sus habilidades de gestión.</p>
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-white text-slate-900 font-black rounded-xl text-xl hover:bg-cyan-50 transition-all shadow-xl transform hover:-translate-y-1"
          >
            CREAR MI CUENTA GRATIS
          </button>
          
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-sm text-slate-500 mb-4">¿Ya has probado la app? Ayúdanos a mejorar</p>
            <button className="text-cyan-400 hover:text-white text-sm font-bold underline decoration-dotted underline-offset-4">
              Rellenar Encuesta de Satisfacción (Próximamente)
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-slate-600 text-xs border-t border-slate-900">
        <p>© 2025 Hospital Gest-Tech. Todos los derechos reservados.</p>
        <p className="mt-2">Proyecto de Innovación Docente Universitario</p>
      </footer>
    </div>
  );
};

export default LandingPage;
