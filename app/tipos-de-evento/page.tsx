"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Search, Filter, ArrowDownAZ, Pencil, Trash2, Check } from 'lucide-react';

// Importamos la base de datos simulada y el modal
import { eventsStore } from '@/database/mockDb';
import CreateEventTypeModal from '@/components/CreateEventTypeModal';

export default function TiposDeEventoPage() {
  // Estado local para los tipos de evento de la tabla
  const [eventos, setEventos] = useState(eventsStore);
  
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Función que el modal llamará cuando se guarde el tipo de evento con éxito
  const handleSaveEvent = (newEvent: any) => {
    setEventos([...eventos, newEvent]);
    setIsModalOpen(false);
    setShowToast(true);
  };

  useEffect(() => {
    if (!showToast) return;
    const timeout = window.setTimeout(() => setShowToast(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showToast]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Tipos de Evento</h1>
          
          {/* Barra de herramientas */}
          <div className="flex items-center justify-between mb-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>+</span> Nuevo Tipo de Evento
            </button>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  className="border border-gray-300 rounded pl-9 pr-3 py-2 text-sm w-64 focus:outline-none focus:border-blue-500 placeholder-gray-300 text-gray-500 cursor-text"
                />
              </div>
              <button type="button" className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer">
                <Filter size={18} />
              </button>
              <button type="button" className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer">
                <ArrowDownAZ size={18} />
              </button>
            </div>
          </div>

          {/* Tabla de Tipos de Eventos */}
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border py-3 px-4 font-semibold text-left border-gray-300">Tipo de Evento</th>
                <th className="border py-3 px-4 font-semibold text-left border-gray-300">Duración</th>
                <th className="border py-3 px-4 font-semibold text-left border-gray-300">Modalidad</th>
                <th className="border py-3 px-4 font-semibold text-left border-gray-300">Descripción</th>
                <th className="border py-3 px-4 font-semibold text-left border-gray-300">Confirmación</th>
                <th className="border py-3 px-4 border-gray-300 w-24"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {/* Renderizado condicional por si el mockDb está vacío */}
              {eventos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border py-8 text-center text-gray-400">
                    No hay tipos de eventos registrados.
                  </td>
                </tr>
              ) : (
                eventos.map((evento: any) => (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="border py-3 px-4 border-gray-300">{evento.name}</td>
                    <td className="border py-3 px-4 border-gray-300">{evento.duration}</td>
                    <td className="border py-3 px-4 border-gray-300">{evento.modality}</td>
                    <td className="border py-3 px-4 border-gray-300">{evento.description}</td>
                    <td className="border py-3 px-4 border-gray-300">{evento.confirmation}</td>
                    <td className="border py-2 px-2 border-gray-300">
                      <div className="flex justify-center gap-2">
                        <button type="button" className="p-1.5 border border-blue-200 text-blue-500 rounded hover:bg-blue-50 cursor-pointer">
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="p-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <CreateEventTypeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEvent}
      />

      {showToast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 bg-[#b5e58b] text-[#1c4d1c] px-6 py-3 rounded-md shadow-lg">
          <Check size={20} className="stroke-[3]" />
          <span className="font-semibold text-lg">Tipo de evento creado con éxito</span>
        </div>
      )}
    </div>
  );
}