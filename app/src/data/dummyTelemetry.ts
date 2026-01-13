export interface TelemetryPoint {
  time: number;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
  steering: number;
  rpm: number;
  mapX: number;
  mapY: number;
}

// TWOJE AKTUALNE OKRĄŻENIE
export const lapData: TelemetryPoint[] = [
  { time: 0.0, speed: 240, throttle: 100, brake: 0, gear: 6, steering: 0, rpm: 11200, mapX: 18.5, mapY: 60.5 },
  { time: 1.0, speed: 200, throttle: 0, brake: 100, gear: 4, steering: 5, rpm: 10500, mapX: 11.5, mapY: 68.0 },
  { time: 2.0, speed: 70, throttle: 20, brake: 0, gear: 1, steering: 95, rpm: 7500, mapX: 8.0, mapY: 69.5 },
  { time: 3.5, speed: 180, throttle: 100, brake: 0, gear: 4, steering: 0, rpm: 10500, mapX: 18.0, mapY: 53.5 },
  { time: 5.5, speed: 270, throttle: 100, brake: 0, gear: 6, steering: 0, rpm: 11500, mapX: 28.5, mapY: 38.5 },
  { time: 6.5, speed: 300, throttle: 100, brake: 0, gear: 7, steering: -15, rpm: 11300, mapX: 32.5, mapY: 34.0 },
  { time: 10.0, speed: 330, throttle: 100, brake: 0, gear: 8, steering: 0, rpm: 11600, mapX: 55.0, mapY: 18.0 },
  { time: 12.0, speed: 160, throttle: 0, brake: 60, gear: 4, steering: 45, rpm: 9000, mapX: 74.0, mapY: 12.0 },
  { time: 14.0, speed: 140, throttle: 40, brake: 0, gear: 3, steering: 60, rpm: 8500, mapX: 81.0, mapY: 17.5 },
  { time: 20.0, speed: 210, throttle: 80, brake: 0, gear: 5, steering: -50, rpm: 10500, mapX: 66.0, mapY: 53.0 },
  { time: 30.0, speed: 305, throttle: 100, brake: 0, gear: 8, steering: 0, rpm: 11400, mapX: 45.0, mapY: 73.0 },
  { time: 35.0, speed: 160, throttle: 100, brake: 0, gear: 3, steering: 0, rpm: 9500, mapX: 18.5, mapY: 60.5 }
];

// OKRĄŻENIE REFERENCYJNE (Szybsze o ok. 1.5s w kluczowych sekcjach)
export const bestLapData: TelemetryPoint[] = lapData.map(p => ({
  ...p,
  time: p.time * 0.96, // Symulacja szybszego czasu
  speed: p.speed + 5,   // Wyższa prędkość o 5km/h
  throttle: p.throttle > 0 ? 100 : 0
}));