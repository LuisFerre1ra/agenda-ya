"use client";

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface CreateEventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEvent: any) => void;
}

export default function CreateEventTypeModal({ isOpen, onClose, onSave }: CreateEventTypeModalProps) {
  // Estados del formulario
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [durationUnit, setDurationUnit] = useState('minutos');
  const [modality, setModality] = useState('Virtual');
  const [confirmation, setConfirmation] = useState('Automática');
  const [description, setDescription] = useState('');

  // Estados de UI
  const [isTouched, setIsTouched] = useState(false);

  // Validación: El nombre no puede estar vacío
  const isNameEmpty = name.trim() === '';
  const isFormValid = !isNameEmpty;

  // Resetea el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDuration('30');
      setDurationUnit('minutos');
      setModality('Virtual');
      setConfirmation('Automática');
      setDescription('');
      setIsTouched(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);

    if (isFormValid) {
      // Formatear duración según la unidad
      const formattedDuration = durationUnit === 'horas' 
        ? `${duration} ${Number(duration) === 1 ? 'hora' : 'horas'}` 
        : `${duration} min`;

      // Simular guardado
      const newEvent = {
        id: Date.now().toString(),
        name,
        duration: formattedDuration,
        modality,
        confirmation,
        description,
      };

      // Esperar 2 segundos, guardar en la tabla padre y cerrar
      setTimeout(() => {
        onSave(newEvent);
        onClose();
      }, 2000);
    }
  };

  return (
    <>
      {/* Fondo oscuro transparente */}
      <div className="fixed inset-0 bg-slate-800/60 z-40 flex items-center justify-center">
        {/* Contenedor del Pop-up */}
        <div className="bg-white rounded-lg shadow-xl w-[600px] relative p-6">
          
          {/* Botón Cerrar (X) */}
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer p-1"
          >
            <X size={24} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            
            {/* Nombre del Evento */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">Nombre del evento</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsTouched(true);
                }}
                placeholder="Ej: Consulta Inicial"
                className={`w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 ${
                  isTouched && isNameEmpty 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {/* Mensaje de error condicional */}
              {isTouched && isNameEmpty && (
                <p className="text-red-500 text-sm mt-1">El campo no puede estar vacío.</p>
              )}
            </div>

            {/* Fila de 3 columnas */}
            <div className="grid grid-cols-3 gap-4">
              
              {/* Duración */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">Duración</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-gray-800 focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                  <select 
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="minutos">minutos</option>
                    <option value="horas">horas</option>
                  </select>
                </div>
              </div>

              {/* Modalidad */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">Modalidad</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input 
                      type="radio" 
                      name="modality" 
                      value="Presencial"
                      checked={modality === 'Presencial'}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    Presencial
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input 
                      type="radio" 
                      name="modality" 
                      value="Virtual"
                      checked={modality === 'Virtual'}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    Virtual
                  </label>
                </div>
              </div>

              {/* Confirmación */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">Confirmación</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input 
                      type="radio" 
                      name="confirmation" 
                      value="Automática"
                      checked={confirmation === 'Automática'}
                      onChange={(e) => setConfirmation(e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    Automática
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input 
                      type="radio" 
                      name="confirmation" 
                      value="Manual"
                      checked={confirmation === 'Manual'}
                      onChange={(e) => setConfirmation(e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    Manual
                  </label>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">Descripción (Opcional)</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve reunión para conocer necesidades."
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 resize-none focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Botón de Submit */}
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isTouched && !isFormValid}
                className={`px-6 py-2 rounded text-white font-medium transition-colors ${
                  isTouched && !isFormValid 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                }`}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
}