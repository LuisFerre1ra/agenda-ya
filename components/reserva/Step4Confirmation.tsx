"use client";

import React, { useEffect, useState } from 'react';
import { getEventTypes } from '@/services/eventTypeService';
import { EventType } from '@/types/EventType';
import { Loader2 } from 'lucide-react';

interface Step4Props {
  reservaData: {
    eventId: string;
    date: string;
    time: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestNotes: string;
  };
  onConfirm: () => void;
}

export default function Step4Confirmation({ reservaData, onConfirm }: Step4Props) {
  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscamos los detalles del evento seleccionado para mostrar su nombre y modalidad
  useEffect(() => {
    const fetchEventDetails = () => {
      const eventos = getEventTypes();
      const selected = eventos.find(e => e.id === reservaData.eventId);
      if (selected) {
        setEventDetails(selected);
      }
    };
    fetchEventDetails();
  }, [reservaData.eventId]);

  // Formateador de fecha: de "2026-04-23" a "Jueves 23 de Abril, 2026"
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
    
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    return `${capitalizedDay} ${Number(day)} de ${capitalizedMonth}, ${year}`;
  };

  const handleConfirmClick = () => {
    setIsSubmitting(true);
    // Simulamos un breve tiempo de carga antes de confirmar
    setTimeout(() => {
      onConfirm();
      setIsSubmitting(false); // Reseteamos el estado por si la pantalla no cambia de inmediato
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-center text-slate-700 mb-6 font-medium">
        Paso 4 de 4: Confirmar Reserva
      </h2>

      <div className="flex-1 overflow-y-auto mb-6 px-1">
        
        {/* Detalles de la Cita */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Detalles de la Cita</h3>
          <ul className="space-y-1 text-slate-700 text-[15px]">
            <li>
              <span className="font-medium text-slate-800">Evento:</span> {eventDetails?.name || 'Cargando...'}
            </li>
            <li>
              <span className="font-medium text-slate-800">Fecha:</span> {formatDate(reservaData.date)}
            </li>
            <li>
              <span className="font-medium text-slate-800">Hora:</span> {reservaData.time}
            </li>
            <li>
              <span className="font-medium text-slate-800">Modalidad:</span> {eventDetails?.modality || 'Cargando...'}
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-300 mb-6" />

        {/* Tus Datos */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Tus Datos</h3>
          <ul className="space-y-1 text-slate-700 text-[15px]">
            <li>
              <span className="font-medium text-slate-800">Nombre:</span> {reservaData.guestName}
            </li>
            <li>
              <span className="font-medium text-slate-800">Correo:</span> {reservaData.guestEmail}
            </li>
            <li>
              <span className="font-medium text-slate-800">Teléfono:</span> {reservaData.guestPhone || '-'}
            </li>
            <li>
              <span className="font-medium text-slate-800">Nota:</span> {reservaData.guestNotes || '-'}
            </li>
          </ul>
        </section>
      </div>

      {/* Botón y texto de confirmación */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleConfirmClick}
          disabled={isSubmitting || !eventDetails}
          className={`w-full py-3.5 rounded text-white font-medium text-lg transition-colors flex justify-center items-center gap-2 ${
            isSubmitting || !eventDetails
              ? 'bg-[#2b88d8]/70 cursor-not-allowed'
              : 'bg-[#2b88d8] hover:bg-blue-600 cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Procesando...
            </>
          ) : (
            'Confirmar Reserva'
          )}
        </button>
        <p className="text-center text-xs text-slate-500 mt-2">
          Al confirmar, recibirás un email con los detalles de tu turno
        </p>
      </div>
    </div>
  );
}