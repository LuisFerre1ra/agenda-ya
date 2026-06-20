"use client";

import React from 'react';

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
}

export default function DeleteEventTypeModal({ isOpen, onClose, onConfirm, eventName }: DeleteEventModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Fondo oscuro transparente */}
      <div className="fixed inset-0 bg-slate-800/60 z-50 flex items-center justify-center">
        {/* Contenedor del Pop-up */}
        <div className="bg-white rounded-lg shadow-xl w-[720px] p-8 text-center relative">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Eliminar Tipo de Evento
          </h2>
          
          <p className="text-gray-600 text-lg mb-4 w-full text-center">
            ¿Seguro que quieres eliminar el Tipo de Evento <strong>&quot;{eventName}&quot;</strong>? <br />
            Todas las reservas de este tipo también serán eliminadas.
          </p>
          
          <div className="flex justify-center gap-18">
            <button 
              onClick={onConfirm}
              className="px-6 py-2 bg-[#df4759] hover:bg-red-600 text-white font-medium rounded transition-colors cursor-pointer"
            >
              Sí, eliminar
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#2b88d8] hover:bg-blue-600 text-white font-medium rounded transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </>
  );
}