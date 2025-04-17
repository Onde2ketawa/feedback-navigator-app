
import React from 'react';

export const CsvRequirements: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4" role="alert">
      <p className="font-bold">CSV Upload Requirements:</p>
      <ul className="list-disc list-inside text-sm text-yellow-700">
        <li><strong>Rating</strong> (required): Numeric rating value</li>
        <li><strong>Submit Date</strong> (required): Date of feedback submission</li>
        <li><strong>Feedback</strong> (optional): Additional feedback text</li>
      </ul>
    </div>
  );
};
