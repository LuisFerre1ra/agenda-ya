import React from 'react';
import { Home, Calendar, FileText, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r border-gray-300 bg-white pt-6">
      <nav className="flex flex-col gap-2 px-4">
        <Link href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
          <Home size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        
        <Link href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
          <Calendar size={18} />
          <span className="text-sm font-medium">Calendario</span>
        </Link>
        
        {/* Opción Activa */}
        <Link href="#" className="flex items-center gap-3 px-4 py-2 text-blue-500 bg-blue-50 rounded">
          <FileText size={18} />
          <span className="text-sm font-medium border-b border-blue-500">Tipos de eventos</span>
        </Link>
        
        <Link href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
          <CalendarDays size={18} />
          <span className="text-sm font-medium">Disponibilidad</span>
        </Link>
      </nav>
    </aside>
  );
}