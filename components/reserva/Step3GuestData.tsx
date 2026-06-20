"use client";

import React, { useState } from 'react';

interface Step3Props {
  onNext: (guestData: { guestName: string; guestEmail: string; guestPhone: string; guestNotes: string }) => void;
}

export default function Step3GuestData({ onNext }: Step3Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isTouched, setIsTouched] = useState(false);

  // Validaciones básicas
  const isNameValid = name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isNameValid && isEmailValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);
    
    if (isFormValid) {
      onNext({
        guestName: name.trim(),
        guestEmail: email.trim(),
        guestPhone: phone.trim(),
        guestNotes: notes.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-center text-slate-700 mb-6 font-medium">
        Paso 3 de 4: Ingresar Datos Personales
      </h2>

      {/* Contenedor del formulario con scroll si la pantalla es muy chica */}
      <div className="space-y-4 flex-1 overflow-y-auto mb-6 px-1">
        
        {/* Nombre Completo */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="Ingrese su nombre"
            className={`w-full border rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 ${
              isTouched && !isNameValid
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-[#2b88d8] focus:border-[#2b88d8]'
            }`}
          />
          {isTouched && !isNameValid && (
            <p className="text-red-500 text-xs mt-1">El nombre es obligatorio.</p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setIsTouched(true)}
            placeholder="ejemplo@correo.com"
            className={`w-full border rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 ${
              isTouched && !isEmailValid
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-[#2b88d8] focus:border-[#2b88d8]'
            }`}
          />
          {isTouched && !isEmailValid && (
            <p className="text-red-500 text-xs mt-1">Ingrese un correo válido.</p>
          )}
        </div>

        {/* Teléfono (Opcional) */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Teléfono (Opcional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="261-4123456"
            className="w-full border border-gray-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2b88d8] focus:border-[#2b88d8]"
          />
        </div>

        {/* Nota (Opcional) */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Nota (Opcional)</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-slate-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#2b88d8] focus:border-[#2b88d8]"
          />
        </div>
      </div>

      {/* Botón Continuar */}
      <button
        type="submit"
        className={`w-full py-3.5 rounded text-white font-medium text-lg transition-colors mt-auto ${
          !isFormValid && isTouched
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#2b88d8] hover:bg-blue-600 cursor-pointer'
        }`}
      >
        Continuar
      </button>
    </form>
  );
}