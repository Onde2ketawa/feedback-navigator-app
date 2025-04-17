
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ValidationWarningBannerProps {
  errorCount: number;
}

export const ValidationWarningBanner: React.FC<ValidationWarningBannerProps> = ({ 
  errorCount 
}) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
        <div>
          <p className="font-medium text-amber-700">Peringatan Validasi</p>
          <p className="text-sm text-amber-700">
            Ditemukan {errorCount} kesalahan di data CSV.
            Baris yang bermasalah ditandai di bawah ini. Perbaiki semua error sebelum melanjutkan.
          </p>
        </div>
      </div>
    </div>
  );
};
