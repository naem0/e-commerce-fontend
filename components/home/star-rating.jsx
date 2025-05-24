import React from 'react';
import { Star, StarHalf } from 'lucide-react';

// Props: rating (number), className (string, optional), showValue (boolean, optional), size (number, optional)
const StarRating = ({ rating, className = '', showValue = false, size = 18 }) => {
  // Round to nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, i) => {
        if (i < Math.floor(roundedRating)) {
          // Full star
          return <Star key={i} fill="#FFB800" className="text-yellow-500" size={size} />;
        } else if (i < Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
          // Half star
          return <StarHalf key={i} fill="#FFB800" className="text-yellow-500" size={size} />;
        } else {
          // Empty star
          return <Star key={i} className="text-gray-300" size={size} />;
        }
      })}
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;