import { AspectRatio, Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import { DrumMachineParams, SoundBankOutput } from "../../output";
import { useState } from "react";
import { RotaryWithLabel } from "./RotaryWithLabel";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

interface DrumSamplerUIProps {
  currentStep: number;
  device: SoundBankOutput;
  drumStepState: boolean[][];
  toggleDrumStep: (channel: number, step: number) => void;
  onPadClick: (channel: number) => void;
  params: DrumMachineParams;
  onParamChange: (param: keyof DrumMachineParams, value: number) => void;
}

export const DrumSamplerUI = ({
  currentStep,
  drumStepState,
  toggleDrumStep,
  params,
  onParamChange,
  onPadClick,
}: DrumSamplerUIProps) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  return (
    <Box w="420px" background="silver" p="16px">
      <HStack justify="space-between" align="baseline" mb="16px">
        <Text fontSize="lg" color="grey">
          sampler
        </Text>
        <HStack justify="flex-end" h="32px" spacing="16px">
          <RotaryWithLabel
            label="vol"
            value={params.volume}
            onChange={(value) => onParamChange("volume", value)}
          />
        </HStack>
      </HStack>

      <Grid
        templateRows="repeat(2, auto)"
        templateColumns="repeat(4, auto)"
        gap="16px"
        mb="16px"
      >
        {mapN(8, (i) => (
          <AspectRatio ratio={1}>
            <Button
              key={`drum-pad-${i}`}
              bg="grey"
              border={selectedSampleIndex === i ? "3px #99c solid" : "none"}
              onClick={(e) => {
                if (!e.shiftKey) {
                  onPadClick(i);
                }
                setSelectedSampleIndex(i);
              }}
            ></Button>
          </AspectRatio>
        ))}
      </Grid>

      <Grid
        w="100%"
        templateColumns="repeat(8,1fr)"
        templateRows="1fr"
        gap="8px"
      >
        {mapN(16, (i) => (
          <Button
            key={`drum-selector-${i}`}
            w="12.5%"
            h="16px"
            background={
              drumStepState[i][selectedSampleIndex]
                ? "#99c"
                : currentStep === i
                ? "lightgrey"
                : "grey"
            }
            onClick={() => toggleDrumStep(selectedSampleIndex, i)}
          ></Button>
        ))}
      </Grid>
    </Box>
  );
};
