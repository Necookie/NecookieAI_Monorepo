import React, { useEffect, useState } from "react";

export default function RainBackground() {
  const [drops, setDrops] = useState<{ id: number; left: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate subtle rain drops
    const dropCount = 30;
    const newDrops = Array.from({ length: dropCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 0.8 + 0.6}s`,
      delay: `${Math.random() * 2}s`,
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-20">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-[-100px] w-[1px] h-[80px] bg-gradient-to-b from-transparent to-blue-300 dark:to-blue-400"
          style={{
            left: drop.left,
            animation: `rainDrop ${drop.duration} linear infinite`,
            animationDelay: drop.delay,
          }}
        />
      ))}
    </div>
  );
}
