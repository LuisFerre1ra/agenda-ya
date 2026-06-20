"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvailabilityForMonth, getTimeSlotsForDate } from '@/database/mockDb';

interface Step2Props {
  eventDuration: number;
  onNext: (date: string, time: string) => void;
}

export default function Step2DateSelection({ eventDuration, onNext }: Step2Props) {
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1 a 12

  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, []);

  const isPrevMonthDisabled = currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1;

  // Estados de selección del usuario
  const [selectedDay, setSelectedDay] = useState<number | null>(null); 
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // Flag para desactivar transiciones/animaciones breves al cambiar de mes
  const [disableAnimations, setDisableAnimations] = useState(false);
  
  // Estados de datos (Cargados desde la mockDB) — calculados memoizadamente
  const availability = useMemo(() => getAvailabilityForMonth(currentYear, currentMonth, eventDuration), [currentYear, currentMonth, eventDuration]);
  const timeSlots = useMemo((): { id: string, time: string, available: boolean }[] => {
    if (!selectedDay) return [];

    const dateString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    const baseSlots = getTimeSlotsForDate(dateString, eventDuration);

    const selectedDate = new Date(currentYear, currentMonth - 1, selectedDay);
    const isTodaySelected = selectedDate.toDateString() === today.toDateString();
    const now = new Date();

    return baseSlots.map((slot) => {
      if (!slot.available) return slot;
      if (!isTodaySelected) return slot;

      const [, endTime] = slot.time.split(' - ').map((t) => t.trim());
      const [endHour, endMinute] = endTime.split(':').map(Number);
      const slotEnd = new Date(currentYear, currentMonth - 1, selectedDay, endHour, endMinute);

      return {
        ...slot,
        available: slotEnd > now,
      };
    });
  }, [selectedDay, currentMonth, currentYear, eventDuration, today]);

  // Limpiar selección al cambiar de mes/año
  const resetSelection = () => {
    setSelectedDay(null);
    setSelectedTime(null);
  };

  // Los horarios se calculan de forma memoizada en `timeSlots`.

  // Lógica matemática del calendario
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0=Domingo, 1=Lunes
  
  // Ajuste para que la semana empiece el Lunes (Lu=0, Ma=1, Mi=2, etc.)
  const firstDayOffset = (firstDayOfWeek + 6) % 7; 
  const blanks = Array.from({ length: firstDayOffset });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const trailingBlanks = Array.from({ length: (7 - ((firstDayOffset + daysInMonth) % 7)) % 7 });

  // Formateador del título (Ej: "abril de 2026" -> "Abril 2026")
  const dateObj = new Date(currentYear, currentMonth - 1, 1);
  const monthName = dateObj.toLocaleString('es-ES', { month: 'long' });
  const displayTitle = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${currentYear}`;

  const cellTransitionClass = disableAnimations ? '' : 'transition-colors';

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    // Evitar el parpadeo con transiciones individuales
    setDisableAnimations(true);
    resetSelection();

    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    // Evitar el parpadeo con transiciones individuales
    setDisableAnimations(true);
    resetSelection();

    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Cuando cambian mes/año, reactivar animaciones en el siguiente frame
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setDisableAnimations(false));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [currentMonth, currentYear]);

  const handleDayClick = (day: number, status: string) => {
    if (status !== 'available') return;
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const isPastDay = (day: number) => {
    const date = new Date(currentYear, currentMonth - 1, day);
    return date < yesterday;
  };

  const getDayStatus = (day: number) => {
    if (isPastDay(day)) return 'unavailable';
    if (availability.fullDays.includes(day)) return 'full';
    if (availability.unavailableDays.includes(day)) return 'unavailable';
    return 'available';
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-center text-slate-700 mb-6 font-medium">
        Paso 2 de 4: Seleccionar Fecha y Hora
      </h2>

      {/* Control del Mes Dinámico */}
      <div className="flex justify-between items-center mb-4 px-2 text-slate-700">
        <button
          onClick={handlePrevMonth}
          disabled={isPrevMonthDisabled}
          className={`p-1 rounded transition-colors ${isPrevMonthDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70' : 'text-slate-700 hover:bg-slate-100 cursor-pointer'}`}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-lg">{displayTitle}</span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors text-slate-700">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendario */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-medium text-slate-600">
          <div>LU</div><div>MA</div><div>MI</div><div>JU</div><div>VI</div><div>SA</div><div>DO</div>
        </div>
        
        <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="border-b border-r border-gray-200 h-10"></div>
          ))}
          
            {days.map((day) => {
            const status = getDayStatus(day);
            const isSelected = selectedDay === day;
            
            let bgClass = '';
            if (isSelected) {
              bgClass = 'bg-[#2b88d8] text-white'; // Azul
            } else if (status === 'full') {
              bgClass = 'bg-[#f8d7da] text-slate-800 cursor-not-allowed'; // Rojo
            } else if (status === 'unavailable') {
              bgClass = 'bg-[#e2e8f0] text-slate-600 cursor-not-allowed'; // Gris
            } else {
              bgClass = 'bg-[#d1fae5] text-slate-800 hover:opacity-80 cursor-pointer'; // Verde
            }

            return (
              <div 
                key={day}
                onClick={() => handleDayClick(day, status)}
                className={`h-10 border-b border-r border-gray-200 flex items-center justify-center text-sm ${cellTransitionClass} ${bgClass}`}
              >
                {day}
              </div>
            );
          })}

          {trailingBlanks.map((_, i) => (
            <div key={`trailing-${i}`} className="border-b border-r border-gray-200 h-10"></div>
          ))}
        </div>
      </div>

      {/* Horarios Disponibles */}
      {selectedDay && (
        <div className="mb-6 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              
              return (
                <button
                  key={slot.id}
                  onClick={() => { if(slot.available) setSelectedTime(slot.time) }}
                  disabled={!slot.available}
                  className={`py-2 px-2 rounded border text-sm font-medium ${cellTransitionClass} ${
                    !slot.available 
                      ? 'border-gray-200 text-gray-300 bg-white cursor-not-allowed'
                      : isSelected 
                        ? 'bg-[#2b88d8] border-[#2b88d8] text-white' 
                        : 'border-[#2b88d8] text-[#2b88d8] hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón Continuar */}
      <button 
        onClick={() => {
          if (selectedDay && selectedTime) {
            const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
            onNext(formattedDate, selectedTime);
          }
        }}
        disabled={!selectedDay || !selectedTime}
        className={`w-full py-3.5 rounded text-white font-medium text-lg transition-colors mt-auto ${
          selectedDay && selectedTime
            ? 'bg-[#2b88d8] hover:bg-blue-600 cursor-pointer' 
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continuar
      </button>
    </div>
  );
}