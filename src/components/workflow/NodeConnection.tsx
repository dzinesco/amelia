import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface NodeConnectionProps {
  start: Position;
  end: Position;
  active?: boolean;
}

export const NodeConnection: React.FC<NodeConnectionProps> = ({
  start,
  end,
  active = false,
}) => {
  const pathD = `M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y}, ${end.x} ${end.y}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke={active ? "url(#flowGradient)" : "#4B5563"}
        strokeWidth="2"
        fill="none"
        className={active ? "animate-pulse" : ""}
      />
      {active && (
        <circle
          r="4"
          fill="#60A5FA"
          className="animate-flow">
          <animateMotion
            dur="1.5s"
            repeatCount="indefinite"
            path={pathD}
          />
        </circle>
      )}
    </svg>
  );
};