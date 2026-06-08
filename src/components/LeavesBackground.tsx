import React, { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export default function LeavesBackground() {
  const [leaves, setLeaves] = useState<{ id: number; left: string; duration: string; delay: string; size: number; rotation: string; opacity: number }[]>([]);

  useEffect(() => {
    // Generate subtle falling leaves
    const leafCount = 20;
    const newLeaves = Array.from({ length: leafCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 10 + 10}s`, // slow fall
      delay: `${Math.random() * 5}s`,
      size: Math.random() * 12 + 12, // 12px to 24px
      rotation: `${Math.random() * 360}deg`,
      opacity: Math.random() * 0.15 + 0.05,
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-50px] text-teal-600 dark:text-teal-400"
          style={{
            left: leaf.left,
            animation: `fallDown ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
            opacity: leaf.opacity,
            transform: `rotate(${leaf.rotation})`,
          }}
        >
          <Leaf size={leaf.size} />
        </div>
      ))}
    </div>
  );
}
