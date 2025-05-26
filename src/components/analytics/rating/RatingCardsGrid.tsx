
import React from 'react';
import { PlayStoreRatingCard } from '@/components/dashboard/PlayStoreRatingCard';
import { MyHanaPlayStoreRatingCard } from '@/components/analytics/rating/MyHanaPlayStoreRatingCard';

interface RatingCardsGridProps {
  averageRating: number;
}

export const RatingCardsGrid: React.FC<RatingCardsGridProps> = ({
  averageRating
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <PlayStoreRatingCard />
      <MyHanaPlayStoreRatingCard />
    </div>
  );
};
