import React from 'react';

interface CapyIconProps {
  className?: string;
  size?: number;
  variant?: 'cozy' | 'happy' | 'water' | 'sleepy' | 'sparkle' | 'love';
}

export const CapyIcon: React.FC<CapyIconProps> = ({
  className = '',
  size = 48,
  variant = 'cozy',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Capybara Mascot"
    >
      {/* Soft circular background aura */}
      <circle cx="50" cy="50" r="46" fill="#FCEEEF" />

      {/* Capybara Body */}
      <rect x="24" y="38" width="52" height="42" rx="20" fill="#B38064" />
      <rect x="28" y="42" width="44" height="34" rx="16" fill="#C9987C" />

      {/* Ears */}
      <ellipse cx="32" cy="38" rx="6" ry="8" fill="#8C5C42" />
      <ellipse cx="32" cy="38" rx="3.5" ry="5" fill="#D98C9A" />
      <ellipse cx="68" cy="38" rx="6" ry="8" fill="#8C5C42" />
      <ellipse cx="68" cy="38" rx="3.5" ry="5" fill="#D98C9A" />

      {/* Capy Snout */}
      <rect x="36" y="52" width="28" height="20" rx="9" fill="#9E6E54" />

      {/* Nostrils */}
      <ellipse cx="44" cy="62" rx="2" ry="3" fill="#3F3540" />
      <ellipse cx="56" cy="62" rx="2" ry="3" fill="#3F3540" />

      {/* Eyes based on variant */}
      {variant === 'happy' ? (
        <>
          <path d="M38 48 C40 44, 44 44, 46 48" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 48 C56 44, 60 44, 62 48" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : variant === 'sleepy' ? (
        <>
          <path d="M38 48 L46 48" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 48 L62 48" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : variant === 'sparkle' ? (
        <>
          <path d="M37 47 C39 42, 44 42, 46 47" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 47 C56 42, 61 42, 63 47" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sparkles near eyes */}
          <path d="M22 34 L23 37 L26 38 L23 39 L22 42 L21 39 L18 38 L21 37 Z" fill="#F59E0B" />
          <path d="M78 34 L79 37 L82 38 L79 39 L78 42 L77 39 L74 38 L77 37 Z" fill="#F59E0B" />
        </>
      ) : variant === 'love' ? (
        <>
          <path d="M37 47 Q42 51 45 47" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M55 47 Q58 51 63 47" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          {/* Little heart above head */}
          <path
            d="M74 24 C72 20 68 20 67 23 C66 20 62 20 60 24 C60 28 67 33 67 33 C67 33 74 28 74 24 Z"
            fill="#D98C9A"
          />
        </>
      ) : (
        <>
          {/* Peaceful relaxed curved closed eyes */}
          <path d="M37 47 Q42 51 45 47" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M55 47 Q58 51 63 47" stroke="#3F3540" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Cute Blush */}
      <circle cx="33" cy="54" r="4.5" fill="#D98C9A" fillOpacity="0.5" />
      <circle cx="67" cy="54" r="4.5" fill="#D98C9A" fillOpacity="0.5" />

      {/* Cozy Orange/Yuzu on head */}
      <circle cx="50" cy="27" r="9" fill="#FFA940" />
      <ellipse cx="50" cy="25" rx="7.5" ry="5.5" fill="#FFC069" />
      {/* Little green leaf */}
      <path d="M50 18 Q55 14 53 19 Q51 18 50 18 Z" fill="#73D13D" />
      <circle cx="50" cy="20" r="1.2" fill="#52C41A" />
    </svg>
  );
};
