import React, { useEffect, useState } from 'react';

interface BackgroundPortraitProps {
  photoUrl?: string;
}

export const BackgroundPortrait: React.FC<BackgroundPortraitProps> = ({ photoUrl = '/nitesh-photo.png' }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle parallax translation without jarring jumps or sudden changes
  const translateY = Math.min(scrollY * 0.04, 60);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Cinematic Shadow Portrait Layer - Single Source Asset */}
      <div
        className="absolute right-0 lg:right-[-2%] top-[2%] w-[90vw] sm:w-[70vw] lg:w-[52vw] h-[95vh] max-w-[950px] transition-transform duration-300 ease-out will-change-transform opacity-50 lg:opacity-60"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          maskImage: 'radial-gradient(ellipse 80% 80% at 65% 40%, black 45%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 65% 40%, black 45%, transparent 85%)',
        }}
      >
        {/* Subtle Cyan Rim Lighting Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-transparent to-indigo-500/20 mix-blend-screen pointer-events-none" />

        <img
          src={photoUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top filter contrast-110 brightness-90 drop-shadow-[0_0_80px_rgba(6,182,212,0.4)]"
          loading="eager"
        />

        {/* Cinematic dark shadow depth vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080d] via-transparent to-[#06080d]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-[#06080d]/40 to-transparent" />
      </div>

      {/* Subtle edge atmospheric cyan accent line */}
      <div className="absolute right-[42vw] top-1/4 h-72 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden lg:block" />
    </div>
  );
};
