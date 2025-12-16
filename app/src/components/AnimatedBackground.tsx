// src/components/AnimatedBackground.tsx

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion'; 

const HYPER_LANE_DURATION = 15; // Czas trwania jednej pętli animacji w sekundach (szybkość "pędu")

// Definicja wariantów animacji dla pojedynczej linii (lanes)
const hyperlaneVariant: Variants = {
  initial: {
    scaleY: 0.1, // Start bardzo cienki
    y: 1000,     // Start z dołu ekranu (poza widokiem)
    opacity: 0,
  },
  // 'i' to niestandardowa wartość przekazana przez custom={i} w komponencie
  animate: (i) => ({ 
    scaleY: [0.1, 1], // Skalowanie w górę (symulacja perspektywy)
    y: [-500, 0],     // Wjeżdżanie w perspektywę
    opacity: [0, 0.4, 0], // Pojawianie się, mocne świecenie, zanikanie
    transition: {
      duration: HYPER_LANE_DURATION,
      repeat: Infinity,
      ease: 'linear', // Stała prędkość dla efektu pędu
      // Rozdzielamy animacje w czasie, aby pędziły jedna po drugiej
      delay: i * (HYPER_LANE_DURATION / 8), 
    },
  }),
};

const AnimatedBackground: React.FC = () => {
  // Tworzymy tablicę 8 elementów, z których każdy będzie osobnym 'pasem ruchu'
  const lanes = Array.from({ length: 8 }); 

  return (
    // Główny kontener: Czarny. 'perspective-1000' pomaga w uzyskaniu lepszego efektu 3D.
    <div className="fixed inset-0 -z-10 bg-neutral-950 overflow-hidden perspective-1000">
      
      {lanes.map((_, i) => (
        <motion.div
          key={i}
          className={`absolute top-0 w-full h-[150%] origin-top opacity-50 
            ${i % 3 === 0 ? 'bg-cyan-500' : // Kolor 1: Cyan
              i % 3 === 1 ? 'bg-fuchsia-500' : 'bg-white/10' // Kolor 2: Fuchsia, Kolor 3: Subtelna biel
            } 
            shadow-lg shadow-current filter blur-sm
            `}
          // Ustawienie pozycji i szerokości poszczególnych "torów"
          style={{ 
            left: `${i * 12.5}%`, // Rozmieść 8 pasów co 12.5%
            width: '12.5%', 
          }}
          variants={hyperlaneVariant}
          custom={i} // Przekazujemy indeks do funkcji animacji jako 'custom'
          initial="initial"
          animate="animate"
        />
      ))}
      
    </div>
  );
};

export default AnimatedBackground;