import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function PrototypeDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs flex items-center justify-between font-medium ${className}`}
    >
      <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <p>
          <span className="font-semibold uppercase tracking-wider text-amber-800">
            Prototype Demo Content:
          </span>{' '}
          Not Official IMD Material. Developed strictly for capacity building and training demonstration (Capacity Connect).
        </p>
      </div>
    </div>
  );
}
