// src/components/AnimatedCarIntro.tsx

import React, { useRef, useState, useEffect } from 'react';
import VolumeControl from './VolumeControl';

const AnimatedCarIntro: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // STAŁA GŁOŚNOŚĆ PO WŁĄCZENIU (0.2 = 20% głośności)
  const DEFAULT_VOLUME = 0.2; 

  // Bezpośredni link do Twojego pliku na Google Drive
  const videoSource = "https://res.cloudinary.com/dcn0fsdzj/video/upload/porsche_cmhlns.mp4";

  // Funkcja przełączająca wyciszenie w stanie i na elemencie DOM
  const handleToggleMute = () => {
    if (videoRef.current) {
      const newState = !isMuted;
      videoRef.current.muted = newState;
      setIsMuted(newState);
      
      if (newState === false) {
          // Jeśli włączamy dźwięk, ustawiamy go na domyślnie niską wartość
          videoRef.current.volume = DEFAULT_VOLUME;
          // Restartujemy wideo, jeśli się skończyło i nie ma loopa
          if (videoRef.current.ended) {
              videoRef.current.play();
          }
      }
    }
  };
  
  useEffect(() => {
    if (videoRef.current) {
      // Upewniamy się, że wideo startuje wyciszone, aby autoPlay zadziałało w przeglądarkach
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
      
      {/* 2. ELEMENT WIDEO - TŁO */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video 
          ref={videoRef}
          src={videoSource} 
          autoPlay 
          loop // Dodano loop, aby film grał w pętli
          muted={isMuted} 
          playsInline 
          className="w-full h-full object-cover" 
          style={{
            // Filtr dla lepszego klimatu "Race Dashboard" i czytelności formularzy
            filter: 'brightness(0.6) contrast(1.1) opacity(0.8)',
          }}
        >
          Twoja przeglądarka nie obsługuje tagu wideo.
        </video>
        
        {/* Delikatny gradient na górze wideo, żeby napisy były jeszcze bardziej czytelne */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>
    </>
  );
};

export default AnimatedCarIntro;