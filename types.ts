
export enum ProjectStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PENDING = 'pending',
  BLOCKED = 'blocked'
}

export interface Phase {
  id: string;
  name: string;
  progress: number;
  status: ProjectStatus;
  icon?: string;
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  footer: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: ProjectStatus;
  dueDate: string;
  assignee: string;
}

export interface Activity {
  id: string;
  time: string;
  date: string;
  content: string;
  type: 'success' | 'update' | 'meeting' | 'resource';
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  attendee: string;
  link: string;
  type: 'meeting' | 'deadline' | 'training';
}
