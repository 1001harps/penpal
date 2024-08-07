import { Box } from "@chakra-ui/react";
import { useRef, useEffect } from "react";

const roundHundredths = (n: number) => Math.round(n * 100) / 100;

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  height?: number;
  deactivated?: boolean;
}

export const Slider = ({
  value,
  onChange,
  height = 100,
  deactivated = false,
}: SliderProps) => {
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
      const nextValue = roundHundredths(value + e.movementY / 50);

      if (nextValue >= 0 && nextValue <= 1) {
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
      const change = touch.clientY - touchStartY.current;
      const nextValue = roundHundredths(value + change / 500);
      if (nextValue >= 0 && nextValue <= 1) {
        onChange(nextValue);
      }
    }
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
    <Box
      bg={deactivated ? "#aaa" : "#999"}
      w="16px"
      h={`${height}px`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onTouchMove={handleTouchMove}
      cursor="pointer"
    >
      <Box
        bg={deactivated ? "#999" : "grey"}
        h="4px"
        w="100%"
        transform="auto"
        translateY={`${value * height}px`}
      ></Box>
    </Box>
  );
};
