import React from "react";

export default function ColorCircle({ color, className }: { color: string; className?: string }) {
  return (
    <span className="inline-flex items-center mx-2 ml-2">
      <span
        className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-inner"
        style={{
          backgroundColor: color,
        }}
      ></span>
    </span>
  );
}
