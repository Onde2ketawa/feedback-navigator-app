
import React from 'react';

export const CsvRequirements: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4" role="alert">
      <p className="font-bold">Persyaratan Upload CSV:</p>
      <ul className="list-disc list-inside text-sm text-yellow-700">
        <li><strong>Rating</strong> (wajib): Nilai numerik (misalnya 1-5)</li>
        <li><strong>Submit Date</strong> (wajib): Tanggal dalam format YYYY-MM-DD</li>
        <li><strong>Feedback</strong> (opsional): Teks feedback tambahan</li>
        <li><strong>Kolom lainnya</strong> (opsional): Semua kolom lain boleh kosong</li>
      </ul>
      <p className="text-sm text-yellow-700 mt-2">
        <strong>Catatan:</strong> Baris pertama adalah header dan tidak diperiksa. Validasi dimulai dari baris ke-2.
        Hanya kolom yang ditandai dengan (wajib) harus diisi di setiap baris. 
        Baris dengan nilai yang tidak valid pada kolom wajib akan ditandai dan tidak akan diproses.
      </p>
    </div>
  );
};
