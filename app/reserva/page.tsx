"use client";

import React, { useState } from 'react';
import { User, ChevronLeft } from 'lucide-react';
import Step1EventSelection from '@/components/reserva/Step1EventSelection';
import Step2DateSelection from '@/components/reserva/Step2DateSelection';
import { eventsStore } from '@/database/mockDb';

export default function ReservaPage() {
  // Estado global del flujo de reserva
  const [currentStep, setCurrentStep] = useState(1);
  const [reservaData, setReservaData] = useState({
    eventId: '',
    date: '',
    time: '',
    guestName: '',
    guestEmail: ''
  });

  // Función para avanzar desde el Paso 1
  const handleStep1Next = (eventId: string) => {
    setReservaData({ ...reservaData, eventId });
    setCurrentStep(2); // Avanzamos al paso 2
  };

  const handleStep2Next = (date: string, time: string) => {
    setReservaData({ ...reservaData, date, time });
    setCurrentStep(3); // Avanzamos al paso 3 (Próximo a crear)
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calcula el ancho de la barra de progreso
  const progressWidth = `${(currentStep / 4) * 100}%`;

  return (
    <div className="min-h-screen bg-[#94a3b8] flex justify-center sm:py-8">
      {/* Contenedor del celular */}
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl relative flex flex-col min-h-screen sm:min-h-[800px] overflow-hidden">
        
        {/* Cabecera superior con botón de volver */}
        <div className="bg-[#e2e8f0] h-24 w-full relative">
          {currentStep > 1 && (
            <button 
              onClick={handleBack}
              className="absolute top-6 left-6 text-slate-500 hover:text-slate-700 cursor-pointer p-1"
            >
              <ChevronLeft size={32} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Avatar flotante */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#cbd5e1] text-gray-500 rounded-full w-16 h-16 flex items-center justify-center border-[6px] border-white z-10">
          <User size={32} />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 px-6 pt-12 pb-8 flex flex-col h-full">
          
          <h1 className="text-xl font-bold text-slate-800 text-center mb-6">
            Agenda de Mateo Aciar
          </h1>

          {/* Barra de progreso global */}
          <div className="mb-4">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-700 rounded-full transition-all duration-300" 
                style={{ width: progressWidth }}
              ></div>
            </div>
          </div>
          
          {/* Renderizado dinámico de los pasos */}
          <div className="flex-1 flex flex-col h-full">
            {currentStep === 1 && <Step1EventSelection onNext={handleStep1Next} />}
            {currentStep === 2 && (
              <Step2DateSelection 
                eventDuration={eventsStore.find(e => e.id === reservaData.eventId)?.duration || 30}
                onNext={handleStep2Next} 
              />
            )}
            {/* {currentStep === 3 && <Step3GuestData />} */}
            {/* {currentStep === 4 && <Step4Confirmation />} */}
          </div>

        </main>
      </div>
    </div>
  );
}