import { useState } from 'react';

export default function StarRating({ value = 0, onChange, readonly = false, size = 'lg' }) {
  const [hover, setHover] = useState(0);

  const sizeClass = size === 'sm' ? 'text-[0.7rem]' : 'text-[1.7rem]';
  const displayValue = hover || value;

  return (
    <div className="flex gap-[3px]" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`star-btn ${sizeClass} ${star <= displayValue ? 'lit' : ''} ${readonly ? 'cursor-default' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  );
}
