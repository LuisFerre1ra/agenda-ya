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
        <div data-cy="modal-delete-event-type" className="bg-white rounded-lg shadow-xl w-[720px] p-8 text-center relative">
          
          <h2 data-cy="delete-modal-title" className="text-2xl font-bold text-gray-800 mb-4">
            Eliminar Tipo de Evento
          </h2>
          
          <p className="text-gray-600 text-lg mb-4 w-full text-center">
            ¿Seguro que quieres eliminar el Tipo de Evento <strong data-cy="delete-event-name">&quot;{eventName}&quot;</strong>? <br />
            Todas las reservas de este tipo también serán eliminadas.
          </p>
          
          <div className="flex justify-center gap-18">
            <button 
              type="button"
              data-cy="btn-confirm-delete"
              onClick={onConfirm}
              className="px-6 py-2 bg-[#df4759] hover:bg-red-600 text-white font-medium rounded transition-colors cursor-pointer"
            >
              Sí, eliminar
            </button>
            <button 
              type="button"
              data-cy="btn-cancel-delete"
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