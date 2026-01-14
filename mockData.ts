
import { ProjectStatus, KPI, Phase, Activity, TeamMember, Event } from './types';

export const KPIS_DATA: KPI[] = [
  {
    label: "PROGRESO DEL PROYECTO",
    value: "78%",
    change: "+12% vs semana",
    isPositive: true,
    icon: "Rocket",
    footer: "8 hilos IA completados"
  },
  {
    label: "TIEMPO TRANSCURRIDO",
    value: "45/60 días",
    change: "15 días restantes",
    isPositive: false,
    icon: "Clock",
    footer: "Estado: En cronograma"
  },
  {
    label: "ROI ESTIMADO",
    value: "320%",
    change: "+220% vs prev",
    isPositive: true,
    icon: "DollarSign",
    footer: "$45K ahorrados proyectados"
  },
  {
    label: "TAREAS COMPLETADAS",
    value: "24/32",
    change: "75% completado",
    isPositive: true,
    icon: "CheckCircle",
    footer: "8 tareas pendientes"
  }
];

export const PHASES_DATA: Phase[] = [
  { id: '1', name: 'Fase 1: Estabilización', progress: 100, status: ProjectStatus.COMPLETED },
  { id: '2', name: 'Fase 2: Expansión', progress: 80, status: ProjectStatus.IN_PROGRESS },
  { id: '3', name: 'Fase 3: Optimización', progress: 0, status: ProjectStatus.PENDING },
  { id: '4', name: 'Fase 4: Innovación', progress: 0, status: ProjectStatus.PENDING },
];

export const ACTIVITIES_DATA: Activity[] = [
  { id: '1', time: '14:30', date: 'Hoy', content: 'Agente Luna (Recepción) procesó 340 consultas', type: 'success' },
  { id: '2', time: '11:15', date: 'Hoy', content: 'Agente Insight detectó 4 posibles cancelaciones', type: 'update' },
  { id: '3', time: '09:00', date: 'Hoy', content: 'Reunión ejecutiva sobre Monetización de Datos finalizada', type: 'meeting' },
  { id: '4', time: '16:45', date: 'Ayer', content: 'Reporte de ROI Profit-Lens generado', type: 'resource' },
  { id: '5', time: '13:20', date: 'Ayer', content: 'Módulo CuidaPlus: NPS mejorado a 8.9', type: 'success' },
];

export const TEAM_DATA: TeamMember[] = [
  { name: 'Dr. Carlos Méndez', role: 'CEO Sonría+', email: 'dr.mendez@sonria.com', avatar: 'https://i.pravatar.cc/150?u=dr_mendez', status: 'online' },
  { name: 'Dra. Patricia Solís', role: 'Dir. Operaciones', email: 'patricia@sonria.com', avatar: 'https://i.pravatar.cc/150?u=dra_solis', status: 'online' },
  { name: 'Elena Torres', role: 'Senior Automation Dev', email: 'elena@krism.ai', avatar: 'https://i.pravatar.cc/150?u=elena_krism', status: 'online' },
];

export const EVENTS_DATA: Event[] = [
  {
    id: 'e1',
    title: 'Revisión Resultados Monetización',
    date: 'Viernes 17 Enero, 2026',
    time: '10:00 AM',
    attendee: 'Dra. Patricia Solís',
    link: 'meet.google.com/sonria-ia',
    type: 'meeting'
  },
  {
    id: 'e2',
    title: 'Go-live WhatsApp API',
    date: 'Lunes 20 Enero, 2026',
    time: '09:00 AM',
    attendee: 'Equipo Técnico',
    link: '#',
    type: 'deadline'
  }
];

export const CHART_DATA = [
  { name: 'Sem 1', ahorro: 45 },
  { name: 'Sem 2', ahorro: 58 },
  { name: 'Sem 3', ahorro: 72 },
  { name: 'Sem 4', ahorro: 89 },
  { name: 'Sem 5', ahorro: 105 },
  { name: 'Sem 6', ahorro: 122 },
  { name: 'Sem 7', ahorro: 138 },
  { name: 'Sem 8', ahorro: 155 },
];
