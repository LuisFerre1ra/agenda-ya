import React from 'react';
import { CalendarCheck, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-gray-300 bg-white">
      {/* Izquierda: Logo */}
      <div className="flex items-center gap-2 text-blue-500">
        <CalendarCheck size={28} strokeWidth={2} />
        <span className="text-xl font-bold tracking-tight">AgendaYA</span>
      </div>

      {/* Derecha: Usuario */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Hola, Mateo Aciar</span>
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-500">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}