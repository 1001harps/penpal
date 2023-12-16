import React, { useEffect, useRef } from "react";

const roundHundredths = (n: number) => Math.round(n * 100) / 100;

const outerStyle: React.CSSProperties = {
  // border: "2px solid grey",
  background: "#999",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  cursor: "pointer",
};

const innerStyle: React.CSSProperties = {
  background: "linear-gradient(to right, grey, 50%, rgba(0,0,0,0) 50%)",
  height: "4px",
  width: "100%",
  margin: "auto 0",
};

export interface RotaryProps {
  value: number;
  onChange: (value: number) => void;
  startOffset?: number;
  speed?: number;
  limit?: number;
}

export const Rotary: React.FC<RotaryProps> = ({
  value,
  onChange,
  startOffset = 0,
  speed = 1,
  limit = 1,
}) => {
  const dragging = useRef(false);
  const touchStartY = useRef(0);

  const onMouseUp = (e: MouseEvent | React.MouseEvent) => {
    dragging.current = false;
  };

  const handleMouseDown = (e: MouseEvent | React.MouseEvent) => {
    dragging.current = true;
  };

  const handleMouseUp = (e: MouseEvent | React.MouseEvent) => {
    dragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (dragging.current && e.movementY !== 0) {
      const change = e.movementY * speed * -1;

      const nextValue = roundHundredths(value + change);

      if (nextValue >= 0 && nextValue <= limit) {
        onChange(nextValue);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    dragging.current = true;
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    dragging.current = false;
  };

  const handleTouchCancel = (e: React.TouchEvent<HTMLDivElement>) => {
    dragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragging.current) {
      const touch = e.touches[0];

      const change = (touch.clientY - touchStartY.current) * speed * -1;
      const nextValue = roundHundredths(value + change) / 2;

      if (nextValue >= 0 && nextValue <= limit) {
        onChange(nextValue);
      }
    }
  };

  const getRotation = (value: number) => {
    const rotation = (startOffset + value) * 270 * limit;
    return rotation;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div
      className="rotary"
      style={outerStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onTouchMove={handleTouchMove}
    >
      <div
        style={{
          ...innerStyle,
          transform: `rotate(${getRotation(value)}deg)`,
        }}
      />
    </div>
  );
};

Rotary.defaultProps = {
  startOffset: -0.15,
  speed: 0.01,
  limit: 1,
};
