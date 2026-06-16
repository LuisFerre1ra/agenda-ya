export interface EventType {
  id: string;
  name: string;
  duration: number; // en minutos
  modality: 'Virtual' | 'Presencial' | 'Híbrida';
  confirmation: 'Automática' | 'Manual';
  description?: string;
}