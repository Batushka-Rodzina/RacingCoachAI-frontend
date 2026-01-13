// src/components/AnimatedCarIntro.tsx

import React, { useRef, useState, useEffect } from 'react';
import VolumeControl from './VolumeControl';

const AnimatedCarIntro: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // STAŁA GŁOŚNOŚĆ PO WŁĄCZENIU (0.2 = 20% głośności)
  const DEFAULT_VOLUME = 0.2; 

  // Bezpośredni link do Twojego pliku
  const videoSource = "https://res.cloudinary.com/dcn0fsdzj/video/upload/porsche_cmhlns.mp4";

  // Funkcja przełączająca wyciszenie w stanie i na elemencie DOM
  const handleToggleMute = () => {
    if (videoRef.current) {
      const newState = !isMuted;
      videoRef.current.muted = newState;
      setIsMuted(newState);
      
      if (newState === false) {
          videoRef.current.volume = DEFAULT_VOLUME;
          if (videoRef.current.ended) {
              videoRef.current.play();
          }
      }
    }
  };

  // Próba odblokowania dźwięku przy pierwszej interakcji użytkownika
  const attemptUnmute = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = DEFAULT_VOLUME;
      setIsMuted(false);
      
      // Usuń listener po pierwszym użyciu
      document.removeEventListener('click', attemptUnmute);
      document.removeEventListener('touchstart', attemptUnmute);
      document.removeEventListener('keydown', attemptUnmute);
    }
  };
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = DEFAULT_VOLUME;
      videoRef.current.muted = false;
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video started playing with sound');
          })
          .catch((error) => {
            console.log('Autoplay with sound blocked by browser:', error);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play();
              
              // Dodaj listenery na pierwszą interakcję użytkownika
              document.addEventListener('click', attemptUnmute, { once: true });
              document.addEventListener('touchstart', attemptUnmute, { once: true });
              document.addEventListener('keydown', attemptUnmute, { once: true });
            }
          });
      }
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', attemptUnmute);
      document.removeEventListener('touchstart', attemptUnmute);
      document.removeEventListener('keydown', attemptUnmute);
    };
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
          loop
          playsInline 
          className="w-full h-full object-cover" 
          style={{
            filter: 'brightness(0.6) contrast(1.1) opacity(0.8)',
          }}
        >
          Twoja przeglądarka nie obsługuje tagu wideo.
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>
    </>
  );
};

export default AnimatedCarIntro;