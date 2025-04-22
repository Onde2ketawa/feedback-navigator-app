
import React from 'react';

interface SentimentBadgeProps {
  sentiment: string | undefined;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  let badgeClass = "px-1 sm:px-2 py-1 rounded text-xs font-medium";
  
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      badgeClass += " bg-green-100 text-green-800";
      break;
    case 'negative':
      badgeClass += " bg-red-100 text-red-800";
      break;
    case 'neutral':
      badgeClass += " bg-blue-100 text-blue-800";
      break;
    default:
      badgeClass += " bg-gray-100 text-gray-800";
  }
  
  return <span className={badgeClass}>{sentiment || 'N/A'}</span>;
};
