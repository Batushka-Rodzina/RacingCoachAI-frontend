// src/components/AnimatedCarIntro.tsx

import React, { useRef, useState, useEffect } from 'react';
import VolumeControl from './VolumeControl';

const AnimatedCarIntro: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // STAŁA GŁOŚNOŚĆ PO WŁĄCZENIU (0.2 = 20% głośności)
  const DEFAULT_VOLUME = 0.2; 

  // Funkcja przełączająca wyciszenie w stanie i na elemencie DOM
  const handleToggleMute = () => {
    if (videoRef.current) {
      const newState = !isMuted;
      videoRef.current.muted = newState;
      setIsMuted(newState);
      
      if (newState === false) {
          // Jeśli włączamy dźwięk, ustawiamy go na domyślnie niską wartość
          videoRef.current.volume = DEFAULT_VOLUME;
          // Restartujemy wideo, jeśli się skończyło
          if (videoRef.current.ended) {
              videoRef.current.play();
          }
      } else {
          // Jeśli wyciszamy, nie musimy zmieniać volume, tylko ustawić muted=true
      }
    }
  };
  
  useEffect(() => {
    if (videoRef.current) {
      // Upewniamy się, że wideo startuje wyciszone, aby autoPlay zadziałało
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <>
      {/* 1. KONTROLKA GŁOŚNOŚCI */}
      <VolumeControl 
        isMuted={isMuted} 
        onToggle={handleToggleMute} 
      />
      
      {/* 2. ELEMENT WIDEO */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        <video 
          ref={videoRef}
          src="../../public/videos/porsche2.mp4" 
          autoPlay 
          muted={isMuted} // Kontrolowane przez stan (domyślnie true)
          playsInline 
          
          className="w-full h-full object-cover" 
          style={{
            filter: 'brightness(0.8) contrast(1.1) opacity(0.8)',
          }}
        >
          Twoja przeglądarka nie obsługuje tagu wideo.
        </video>
      </div>
    </>
  );
};

export default AnimatedCarIntro;