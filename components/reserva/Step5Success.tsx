"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface Step5Props {
  onReset: () => void;
}

export default function Step5Success({ onReset }: Step5Props) {
  return (
    <div data-cy="booking-success-screen" className="flex flex-col items-center justify-center h-full flex-1 p-6 text-center animate-in zoom-in-95 duration-500 bg-white">
      
      {/* Círculo verde con el Check */}
      <div data-cy="booking-success-icon" className="bg-[#1eb69b] rounded-full w-56 h-56 flex items-center justify-center mb-10 shadow-sm">
        <Check size={110} className="text-white" strokeWidth={3} />
      </div>
      
      {/* Textos de confirmación */}
      <h2 data-cy="booking-success-title" className="text-3xl font-bold text-[#1eb69b] mb-3 tracking-tight">
        Reserva Confirmada
      </h2>
      <p data-cy="booking-success-message" className="text-slate-600 text-lg font-medium mb-12">
        Tu cita ha sido agendada con éxito
      </p>
      
      {/* Botón para reiniciar el flujo */}
      <button 
        type="button"
        data-cy="btn-booking-success-reset"
        onClick={onReset}
        className="px-10 py-3 border-2 border-[#93c5fd] text-[#2b88d8] rounded font-medium transition-colors hover:bg-blue-50 cursor-pointer"
      >
        Volver al Inicio
      </button>
      
    </div>
  );
}