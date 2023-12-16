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
    <HStack justify="space-between" bg="#999" p="10px" color="gray">
      <Button
        onClick={togglePlay}
        variant="outline"
        color="gray"
        borderColor="gray"
      >
        {playing ? "pause" : "play"}
      </Button>

      <HStack>
        <Button color="gray" borderColor="gray" onClick={() => setBPM(bpm - 1)}>
          -
        </Button>
        <Text>{bpm}</Text>
        <Button color="gray" borderColor="gray" onClick={() => setBPM(bpm + 1)}>
          +
        </Button>
      </HStack>
    </HStack>
  );
};
