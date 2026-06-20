"use client";

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { EventType } from '@/types/EventType';
import { getEventTypes } from '@/services/eventTypeService';

interface Step1Props {
  onNext: (eventId: string) => void;
}

export default function Step1EventSelection({ onNext }: Step1Props) {
  const [eventos] = useState<EventType[]>(() => getEventTypes());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const formatDuration = (duration: number | string) => {
    if (typeof duration === 'number') {
      if (duration % 60 === 0) return `${duration / 60} h`;
      return `${duration} min`;
    }
    return duration;
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-center text-slate-700 mb-6 font-medium">
        Paso 1 de 4: Seleccionar Evento
      </h2>

      {/* Lista de Tarjetas de Eventos (Ocupa el espacio disponible) */}
      <div className="space-y-4 overflow-y-auto flex-1 mb-6">
        {eventos.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Cargando eventos...</p>
        ) : (
          eventos.map((evento) => {
            const isSelected = selectedEventId === evento.id;
            
            return (
              <div 
                key={evento.id}
                onClick={() => setSelectedEventId(evento.id)}
                className={`border rounded-sm p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                  <h3 className="font-bold text-slate-800 text-lg">
                    {evento.name}
                  </h3>
                  <div className="flex items-center text-slate-600 text-sm font-medium gap-1.5">
                    <Clock size={16} className="text-slate-700" />
                    {formatDuration(evento.duration)}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-800 mb-1">
                    Modalidad: {evento.modality}
                  </p>
                  <p className="text-slate-600 line-clamp-2">
                    {evento.description || "Sin descripción disponible."}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botón de continuar al final del paso */}
      <button 
        onClick={() => selectedEventId && onNext(selectedEventId)}
        disabled={!selectedEventId}
        className={`w-full py-3.5 rounded text-white font-medium text-lg transition-colors mt-auto ${
          selectedEventId 
            ? 'bg-[#2b88d8] hover:bg-blue-600 cursor-pointer' 
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continuar
      </button>
    </div>
  );
}