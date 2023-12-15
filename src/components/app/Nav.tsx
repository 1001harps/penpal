import { Button, HStack, Text } from "@chakra-ui/react";

interface NavProps {
  playing: boolean;
  togglePlay: () => void;
  bpm: number;
  setBPM: (bpm: number) => void;
}

export const Nav: React.FC<NavProps> = ({
  playing,
  togglePlay,
  bpm,
  setBPM,
}) => {
  return (
    <HStack justify="space-between" bg="blue" p="10px">
      <Button onClick={togglePlay} variant="outline" colorScheme="pink">
        {playing ? "pause" : "play"}
      </Button>

      <HStack>
        <Button onClick={() => setBPM(bpm - 1)}>-</Button>
        <Text>{bpm}</Text>
        <Button onClick={() => setBPM(bpm + 1)}>+</Button>
      </HStack>
    </HStack>
  );
};
