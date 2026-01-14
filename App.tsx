
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BarChart3, Calendar as CalendarIcon, FileText, 
  MessageSquare, Rocket, Clock, DollarSign, CheckCircle, Bell, 
  Search, ChevronRight, User, Sparkles, X, Send, Target, Zap, 
  Lock, Mail, Map as MapIcon, Layers, TrendingUp, Command, ArrowRight,
  TrendingDown, ArrowUpRight, Award, ShieldCheck, Settings, CreditCard, 
  ChevronUp, ExternalLink, Briefcase
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

import { 
  KPIS_DATA, PHASES_DATA, ACTIVITIES_DATA, TEAM_DATA, CHART_DATA, EVENTS_DATA 
} from './mockData';
import { ProjectStatus, KPI } from './types';
import { chatWithAI, analyzeProjectStatus } from './services/geminiService';

// --- Reveal Helper ---
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay); });
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, [delay]);

  return <div ref={domRef} className={`reveal ${isVisible ? 'active' : ''} ${className}`}>{children}</div>;
};

// --- Logo Component ---
const KrismLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const scales = { sm: "scale-[0.5]", md: "scale-[0.7]", lg: "scale-100" };
  return (
    <div className={`flex gap-3 items-center ${scales[size]} origin-left`}>
      <div className="w-10 h-20 rounded-[2rem] bg-gradient-to-b from-[#1E3A8A] to-[#2563EB] shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
      <div className="flex flex-col gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.5)]"></div>
        <div className="w-10 h-10 rounded-br-[2.5rem] bg-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
      </div>
    </div>
  );
};

// --- Login Screen ---
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => onLogin(), 1500);
  };

  return (
    <div className="bg-brand-page min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40">
        <iframe src="https://my.spline.design/glowingplanetparticles-HmCVKutonlFn3Oqqe6DI9nWi/" frameBorder="0" width="100%" height="100%"></iframe>
      </div>
      
      <div className="w-full max-w-[420px] p-10 bg-brand-page/40 backdrop-blur-xl border-gradient before:rounded-[2.5rem] rounded-[2.5rem] shadow-2xl relative z-10 transition-all duration-500">
        <div className="flex flex-col items-center mb-10">
          <KrismLogo size="lg" />
          <h1 className="text-4xl font-black mt-8 bg-text-gradient text-transparent bg-clip-text">Krism.AI</h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Portal Corporativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-brand-teal transition-colors" size={18} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-teal transition-all placeholder-zinc-600" 
                placeholder="usuario@sonria.com" 
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-brand-teal transition-colors" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-teal transition-all placeholder-zinc-600" 
                placeholder="Contraseña" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-white text-black text-sm font-black rounded-2xl hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 group shadow-xl">
            {loading ? <div className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div> : (
              <><span className="relative z-10">Iniciar Sesión</span> <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[10px] text-zinc-600 font-black uppercase tracking-widest">
          Soporte: support@krism.ai
        </p>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
  >
    <div className={`${active ? 'text-brand-teal' : 'text-zinc-600'}`}>{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AIChat = ({ context, isOpen, setIsOpen }: { context: any; isOpen: boolean; setIsOpen: (o: boolean) => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user' as const, parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await chatWithAI(input, messages, context);
      setMessages(prev => [...prev, { role: 'model' as const, parts: [{ text: response }] }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model' as const, parts: [{ text: "Error de conexión Sonría+. Reintentando..." }] }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-10 right-10 w-[400px] h-[600px] bg-brand-page/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal"><Sparkles size={20}/></div>
          <div>
            <h3 className="text-white font-bold text-sm">Krism-Bot</h3>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Online</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-zinc-500"><X size={20}/></button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600"><MessageSquare size={24}/></div>
            <p className="text-zinc-500 text-xs font-medium px-6">¿En qué puedo ayudarte con los agentes Luna e Insight?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-brand-indigo text-white shadow-lg' : 'bg-white/5 border border-white/10 text-zinc-300'}`}>
              {m.parts[0].text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start"><div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-1"><div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div></div></div>
        )}
      </div>
      <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-white/[0.02]">
        <div className="relative">
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Consultar ROI o Roadmap..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-brand-teal transition-all" />
          <button type="submit" className="absolute right-2 top-1.5 p-1.5 bg-white text-black rounded-lg hover:bg-brand-teal hover:text-white transition-all"><Send size={14}/></button>
        </div>
      </form>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<{loggedIn: boolean}>({loggedIn: false});
  const [currentView, setCurrentView] = useState<any>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('krism_user_sonria_v2');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = () => {
    const userData = {loggedIn: true};
    setUser(userData);
    localStorage.setItem('krism_user_sonria_v2', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('krism_user_sonria_v2');
    setUser({loggedIn: false});
  };

  if (!user.loggedIn) return <LoginScreen onLogin={handleLogin} />;

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <div className="space-y-12 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KPIS_DATA.map((kpi, idx) => (
                <Reveal key={idx} delay={idx * 100}>
                  <div className="border-gradient before:rounded-2xl rounded-2xl bg-white/5 backdrop-blur-md p-6 hover-card cursor-default">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-brand-indigo/10 text-brand-indigo"><Layers size={20}/></div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{kpi.change}</span>
                    </div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">{kpi.value}</h3>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Reveal delay={400} className="lg:col-span-2">
                <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-white/5 backdrop-blur-md p-8 hover-card">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><TrendingUp size={20} className="text-brand-teal"/> Eficiencia Operacional Semanal</h3>
                    <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest bg-white/5 px-3 py-1 rounded-full">Sincronizado</div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CHART_DATA}>
                        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/><stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                        <Tooltip contentStyle={{backgroundColor: '#05050A', borderRadius: '12px', border: '1px solid #ffffff11', fontSize: '12px'}} />
                        <Area type="monotone" dataKey="ahorro" stroke="#2DD4BF" strokeWidth={3} fill="url(#g)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Reveal>

              <div className="space-y-8">
                <Reveal delay={600}>
                  <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-white/5 backdrop-blur-md p-8 hover-card">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Staff Asignado</h3>
                    <div className="space-y-4">
                      {TEAM_DATA.map((member, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                          <img src={member.avatar} className="w-10 h-10 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-white">{member.name}</p>
                            <p className="text-[9px] text-zinc-500 uppercase">{member.role}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={700}>
                  <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-brand-indigo/5 p-8 border border-brand-indigo/10">
                    <h3 className="text-xs font-black uppercase text-brand-teal mb-3 tracking-widest">Próxima Reunión</h3>
                    <p className="text-sm font-bold text-white mb-1">{EVENTS_DATA[0].title}</p>
                    <p className="text-[10px] text-zinc-400 mb-4">{EVENTS_DATA[0].date} • {EVENTS_DATA[0].time}</p>
                    <button className="w-full py-2 bg-brand-indigo text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-indigo/80 transition-all shadow-lg">Unirse a Sesión</button>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        );
      case 'metrics':
        return (
          <div className="space-y-12 pb-20">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-serif-brand italic text-white mb-2 tracking-tight">Auditoría de Impacto ROI</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Resultados de Negocio Proyectados</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Reveal delay={100} className="lg:col-span-1">
                <div className="border-gradient before:rounded-[2.5rem] rounded-[2.5rem] bg-white/5 p-10 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center text-brand-teal mb-8 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                    <Award size={40} />
                  </div>
                  <h3 className="text-5xl font-black text-white tracking-tighter mb-2">320%</h3>
                  <p className="text-xs font-black uppercase text-brand-teal tracking-[0.2em] mb-6">Retorno de Inversión</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">Cada dólar invertido en la Clínica Dental Sonría+ está generando $3.20 en ahorros operativos y optimización de agenda.</p>
                </div>
              </Reveal>

              <Reveal delay={200} className="lg:col-span-2">
                <div className="border-gradient before:rounded-[2.5rem] rounded-[2.5rem] bg-white/5 p-10 overflow-hidden">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Baseline vs Actual</h3>
                    <span className="text-[10px] font-black uppercase text-emerald-400 px-3 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">78% de avance total</span>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Tasa Cancelaciones", base: "18%", current: "12.4%", target: "10%", progress: 78 },
                      { label: "Tiempo de Respuesta", base: "45 min", current: "2 min", target: "5 min", progress: 100 },
                      { label: "Citas/Día por Consultorio", base: "12", current: "14.2", target: "15", progress: 73 },
                      { label: "NPS del Paciente", base: "7.2", current: "8.9", target: "8.5", progress: 100 },
                    ].map((metric, i) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{metric.label}</p>
                            <p className="text-lg font-bold text-white">{metric.current} <span className="text-[10px] text-zinc-600 font-normal">vs {metric.base}</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-brand-teal mb-1">Objetivo: {metric.target}</p>
                            <p className="text-xs font-bold text-white">{metric.progress}%</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-teal shadow-[0_0_10px_#2DD4BF] transition-all duration-1000" 
                            style={{ width: `${metric.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-12 pb-20 max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-serif-brand italic text-white mb-2 tracking-tight">Estrategias de Consultoría</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Plan de Acción para Altos Mandos</p>
              </div>
            </Reveal>

            <div className="space-y-8">
              {[
                {
                  id: 1,
                  title: "REUNIÓN EJECUTIVA #1: Monetización de Datos",
                  obj: "Convertir data de pacientes en insights de negocio",
                  strategies: [
                    "Programa Premium Predictivo: Membresías anuales para pacientes de alto LTV (>$3,500).",
                    "Paquetes Inteligentes: Diseño de combos automáticos basados en historial (ej: Blanqueamiento + Ortodoncia).",
                    "Marketing Hipersegmentado: Recuperación automática de pacientes inactivos (>6 meses)."
                  ],
                  inv: "$8,500",
                  roi: "280% en 9 meses",
                  icon: <Target className="text-brand-teal" />
                },
                {
                  id: 2,
                  title: "REUNIÓN EJECUTIVA #2: Expansión de Servicios",
                  obj: "Diversificar ingresos con servicios de alto margen",
                  strategies: [
                    "Teledentistry Básica: Consultas de valoración pre-filtradas por IA a $25.",
                    "Laboratorio Interno Optimizado: Producción de coronas programada por demanda prevista.",
                    "Alianzas Corporativas: Cotización automática de planes B2B para empresas."
                  ],
                  inv: "$12,000",
                  roi: "340% en 12 meses",
                  icon: <ArrowUpRight className="text-brand-indigo" />
                },
                {
                  id: 3,
                  title: "REUNIÓN EJECUTIVA #3: Reducción de Fricción",
                  obj: "Eliminar cuellos de botella humanos operativos",
                  strategies: [
                    "Facturación Inteligente: Envío automático post-tratamiento sin intervención.",
                    "Inventario Predictivo: Alertas automáticas cuando stock <20% basado en agenda.",
                    "Onboarding Digital: Historial médico y consentimientos 100% digitales con validación IA."
                  ],
                  inv: "$6,200",
                  roi: "$4,800/mes de ahorro (1.3 meses payback)",
                  icon: <Zap className="text-brand-teal" />
                }
              ].map((meeting, idx) => (
                <Reveal key={meeting.id} delay={idx * 150}>
                  <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-white/5 p-10 hover-card relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">{meeting.icon}</div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-xl font-black text-white">{meeting.title}</h3>
                        <p className="text-xs font-black uppercase text-brand-teal tracking-widest">Objetivo: {meeting.obj}</p>
                        <ul className="space-y-3">
                          {meeting.strategies.map((s, i) => (
                            <li key={i} className="text-xs text-zinc-400 flex gap-3">
                              <span className="text-brand-teal font-bold">•</span> {s}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-6 flex flex-wrap gap-4">
                          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-[10px] text-zinc-500 font-bold">INVERSIÓN</p>
                            <p className="text-sm font-black text-white">{meeting.inv}</p>
                          </div>
                          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-[10px] text-zinc-500 font-bold">ROI PROYECTADO</p>
                            <p className="text-sm font-black text-brand-teal">{meeting.roi}</p>
                          </div>
                          <button className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase text-white hover:text-brand-teal transition-colors">
                            Ver PDF de Estrategia <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-12 pb-20 max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-serif-brand italic text-white mb-2 tracking-tight">Perfil Corporativo</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Gestión de Cuenta y Suscripción</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Reveal className="md:col-span-1">
                <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-white/5 p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center text-3xl font-black text-white mb-6 shadow-2xl">CS</div>
                  <h3 className="text-xl font-bold text-white mb-1">Clínica Sonría+</h3>
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-6">Corp Account ID: 9942</p>
                  <div className="w-full space-y-2">
                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">Editar Información</button>
                    <button onClick={handleLogout} className="w-full py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all">Cerrar Sesión</button>
                  </div>
                </div>
              </Reveal>

              <Reveal className="md:col-span-2 space-y-8">
                <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-white/5 p-10">
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="text-lg font-bold text-white">Plan Actual</h3>
                     <span className="px-3 py-1 bg-brand-indigo text-white text-[9px] font-black uppercase tracking-widest rounded-full">Premium Automation</span>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-brand-teal"><Briefcase size={20} /></div>
                        <div>
                          <p className="text-xs font-bold text-white">Soporte Prioritario 24/7</p>
                          <p className="text-[10px] text-zinc-500 uppercase">Activo para 3 sucursales</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-brand-indigo"><CreditCard size={20} /></div>
                        <div>
                          <p className="text-xs font-bold text-white">Facturación Mensual</p>
                          <p className="text-[10px] text-zinc-500 uppercase">Próximo cargo: 01 Feb, 2026</p>
                        </div>
                      </div>
                   </div>
                   <div className="mt-10 p-6 rounded-3xl bg-brand-indigo/10 border border-brand-indigo/20 flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-2">¿Quieres escalar tu éxito?</h4>
                        <p className="text-[11px] text-zinc-400">Desbloquea el Agente de Cobro Automatizado y el Diagnóstico por Imágenes IA con nuestro Plan Enterprise.</p>
                      </div>
                      <button className="px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-teal hover:text-white transition-all">Mejorar Plan</button>
                   </div>
                </div>

                <div className="border-gradient before:rounded-[2rem] rounded-[2rem] bg-white/5 p-10">
                  <h3 className="text-lg font-bold text-white mb-8">Información de la Clínica</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">RAZÓN SOCIAL</p>
                      <p className="text-sm font-bold text-zinc-300">Dental Sonría+ Guayaquil S.A.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">RUC / TAX ID</p>
                      <p className="text-sm font-bold text-zinc-300">0992345678001</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">EMAIL CONTACTO</p>
                      <p className="text-sm font-bold text-zinc-300">gerencia@sonria.com</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">TELÉFONO</p>
                      <p className="text-sm font-bold text-zinc-300">+593 4 234 5678</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-serif-brand italic text-white mb-2 tracking-tight">Ecosistema de Agentes Sonría+</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Estado de Despliegue Operativo</p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              <Reveal delay={100} className="md:col-span-2">
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover-card">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl flex items-center justify-center rotate-45"><TrendingUp className="text-brand-teal -rotate-45" size={24}/></div>
                    <div><h3 className="text-2xl font-bold text-white tracking-tight">Agente Luna & Insight</h3><p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Optimización de Citas y Cancelaciones</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Resolución Luna</p>
                      <p className="text-3xl font-black text-white">89%</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Precisión Insight</p>
                      <p className="text-3xl font-black text-brand-teal">78%</p>
                    </div>
                  </div>
                  <p className="mt-8 text-zinc-400 text-sm leading-relaxed">Luna gestiona el 89% de citas sin intervención humana. Insight ha identificado 78% de cancelaciones potenciales permitiendo una reducción neta del 31% en ausencias.</p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover-card flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-brand-indigo/10 border border-brand-indigo/20 rounded-2xl flex items-center justify-center rotate-45 mb-8"><Sparkles className="text-brand-indigo -rotate-45" size={24}/></div>
                    <h3 className="text-xl font-bold text-white mb-4">Módulo CuidaPlus</h3>
                    <p className="text-zinc-400 text-sm">Seguimiento post-tratamiento automatizado. NPS mejorado de 7.2 a 8.9.</p>
                  </div>
                  <div className="mt-10 flex flex-wrap gap-2">
                    {["WhatsApp", "SMS", "NPS"].map(t => <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-zinc-400 uppercase">{t}</span>)}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400} className="md:col-span-3">
                <div className="bg-brand-indigo p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform"><Command size={120} className="text-white"/></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="max-w-xl">
                      <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Agente Tetris: Optimización de Agenda</h3>
                      <p className="text-white/80 leading-relaxed mb-6">Aumento del 15% en capacidad operativa sin contratar personal. Reducción del 40% en tiempos muertos entre citas.</p>
                      <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white text-[10px] font-black uppercase">+$8,200/mes</div>
                        <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white text-[10px] font-black uppercase">40% Eficiencia</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-center">
                      <div className="text-6xl font-black text-white tracking-tighter">15%</div>
                      <p className="text-[10px] font-black uppercase text-white/60 tracking-widest mt-2">Capacidad Extra</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        );
      case 'roadmap':
        return (
          <div className="max-w-4xl mx-auto py-12 pb-20">
            <Reveal className="text-center mb-16">
              <h2 className="text-sm font-medium text-brand-teal uppercase tracking-widest mb-3 tracking-[0.3em]">Timeline Clínica Sonría+</h2>
              <h3 className="text-5xl font-serif-brand italic text-white tracking-tight">Hacia la Clínica Dental 100% Autónoma</h3>
            </Reveal>
            <div className="relative space-y-16 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/5">
              {PHASES_DATA.map((phase, i) => (
                <Reveal key={phase.id} delay={i * 150} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-black transition-all ${phase.status === 'completed' ? 'bg-brand-teal border-brand-teal text-black shadow-[0_0_20px_rgba(45,212,191,0.5)]' : 'bg-neutral-900 border-white/10 text-zinc-500'}`}>{i + 1}</div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-xl hover-card ${phase.status === 'in_progress' ? 'border-brand-teal/30 bg-brand-teal/[0.02]' : ''}`}>
                    <div className="flex justify-between items-center mb-4"><h4 className="text-xl font-bold text-white">{phase.name}</h4>{phase.status === 'in_progress' && <span className="text-[9px] font-black bg-brand-teal text-black px-2 py-1 rounded">PROCESO</span>}</div>
                    <p className="text-zinc-400 text-xs mb-6">Optimización de hilos operativos Sonría+. Fase actual de expansión de agentes neuronales.</p>
                    <div className="w-full bg-white/5 h-1 rounded-full"><div className="bg-brand-teal h-1 rounded-full shadow-[0_0_10px_#2DD4BF]" style={{width: `${phase.progress}%`}}></div></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="py-20 text-center text-zinc-600 font-black uppercase tracking-widest">Vista en construcción</div>;
    }
  };

  return (
    <div className="bg-brand-page min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 opacity-30">
        <iframe src="https://my.spline.design/glowingplanetparticles-HmCVKutonlFn3Oqqe6DI9nWi/" frameBorder="0" width="100%" height="100%"></iframe>
      </div>

      <div className="w-full max-w-7xl h-[880px] border-gradient before:rounded-[3rem] rounded-[3rem] bg-brand-page/60 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-1000">
        <div className="flex items-center h-14 bg-white/[0.02] border-b border-white/5 px-8 shrink-0 relative z-50">
          <div className="flex items-center gap-2 w-24"><div className="w-3 h-3 rounded-full bg-rose-500/50"></div><div className="w-3 h-3 rounded-full bg-amber-500/50"></div><div className="w-3 h-3 rounded-full bg-emerald-500/50"></div></div>
          <div className="flex-1 flex justify-center"><div className="bg-white/5 px-6 py-1.5 rounded-full border border-white/10 flex items-center gap-3 w-96"><Lock size={12} className="text-brand-teal"/><span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest truncate">portal.krism.ai/sonria-dental/corp</span></div></div>
          <div className="w-24 text-right text-[10px] font-black text-zinc-600">ID: SONRIA_9942</div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden relative z-10">
          <aside className="w-72 flex-shrink-0 bg-black/20 border-r border-white/5 flex flex-col h-full">
            <div className="p-10">
              <div className="flex items-center gap-3"><div className="w-3 h-3 bg-brand-indigo rounded-sm rotate-45 shadow-[0_0_10px_#6366F1]"></div><h1 className="text-xl font-black tracking-tighter text-white">KRISM.AI</h1></div>
              <div className="mt-10"><KrismLogo size="md" /></div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
              <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
              <NavItem icon={<MapIcon size={18}/>} label="Roadmap Sonría+" active={currentView === 'roadmap'} onClick={() => setCurrentView('roadmap')} />
              <NavItem icon={<Layers size={18}/>} label="Implementación IA" active={currentView === 'progress'} onClick={() => setCurrentView('progress')} />
              <NavItem icon={<BarChart3 size={18}/>} label="Métricas & ROI" active={currentView === 'metrics'} onClick={() => setCurrentView('metrics')} />
              <NavItem icon={<FileText size={18}/>} label="Estrategias" active={currentView === 'documents'} onClick={() => setCurrentView('documents')} />
            </nav>
            <div className="p-8 mt-auto border-t border-white/5 bg-white/[0.01] space-y-4">
              <button 
                onClick={() => setCurrentView('profile')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${currentView === 'profile' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-white shadow-xl">CS</div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-bold text-white truncate">Equipo Sonría+</p>
                  <p className="text-[9px] text-zinc-500 uppercase font-black">Configuración</p>
                </div>
                <Settings size={14} className={currentView === 'profile' ? 'text-brand-teal' : 'text-zinc-600'} />
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col min-h-0 h-full bg-white/[0.01]">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 shrink-0 relative z-20">
              <div className="flex flex-col">
                <h2 className="text-2xl font-serif-brand italic text-white leading-tight">Clínica Dental Sonría+</h2>
                <p className="text-[9px] font-black text-brand-teal uppercase tracking-widest">Dashboard Operativo • Dr. Carlos Méndez Vera</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center bg-white/5 rounded-2xl px-5 py-2.5 w-72 border border-white/10 group focus-within:border-brand-teal transition-all">
                  <Search size={16} className="text-zinc-600 group-focus-within:text-brand-teal" />
                  <input type="text" placeholder="Consultar sistema..." className="bg-transparent border-none text-xs px-3 font-medium text-white focus:outline-none w-full" />
                </div>
                <button onClick={() => setIsChatOpen(true)} className="group relative px-6 py-2.5 rounded-full overflow-hidden bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Consultar Krism-Bot</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-brand-indigo"></div>
                </button>
              </div>
            </header>
            <div className="flex-1 p-12 overflow-y-auto scroll-smooth scrollbar-hide relative">
               <div className="max-w-7xl mx-auto h-full">{renderContent()}</div>
            </div>
          </main>
        </div>
      </div>
      <AIChat context={{ userName: "Equipo Sonría+", kpis: KPIS_DATA, phases: PHASES_DATA, team: TEAM_DATA, events: EVENTS_DATA, activities: ACTIVITIES_DATA }} isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}
